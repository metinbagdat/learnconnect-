// functions/adaptiveLearning.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { AIReasoningEngine, AdaptiveTaskEngine } = require('./engines');
const { BilingualTopics } = require('./data/bilingualTopics');

admin.initializeApp();
const db = admin.firestore();

// Initialize AI engines
const reasoningEngine = new AIReasoningEngine(openai);
const taskEngine = new AdaptiveTaskEngine(db, openai);

// 🎯 Main adaptive daily plan generation
exports.generateAdaptiveDailyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const studentId = context.auth.uid;
  
  try {
    // Fetch student data
    const [studentDoc, progressDoc, testsSnapshot] = await Promise.all([
      db.collection('students').doc(studentId).get(),
      db.collection('student_progress').doc(studentId).get(),
      db.collection('practice_tests').doc(studentId)
        .collection('tests')
        .orderBy('testDate', 'desc')
        .limit(5)
        .get()
    ]);

    const studentData = studentDoc.data();
    const progressData = progressDoc.data();
    const testResults = testsSnapshot.docs.map(doc => doc.data());

    // Generate adaptive plan using reasoning engine
    const adaptivePlan = await reasoningEngine.generateAdaptiveDailyPlan(
      studentId,
      studentData,
      progressData,
      testResults
    );

    // Generate specific adaptive tasks
    const dailyTasks = await taskEngine.generateAdaptiveTasks(adaptivePlan, studentId);

    // Save to database
    const planRef = db.collection('adaptive_plans').doc(studentId).collection('daily').doc(adaptivePlan.date);
    await planRef.set({
      ...dailyTasks,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      version: '1.0',
      adaptiveCycle: 'initial'
    });

    return { 
      success: true, 
      plan: dailyTasks,
      reasoning: adaptivePlan.metadata.reasoningSteps
    };

  } catch (error) {
    console.error('Error generating adaptive plan:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate adaptive plan');
  }
});

// 🔄 Real-time task evaluation
exports.evaluateTaskPerformance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { taskId, performanceData } = data;
  const studentId = context.auth.uid;

  try {
    const evaluation = await taskEngine.evaluateTaskPerformance(taskId, studentId, performanceData);
    
    return {
      success: true,
      evaluation: evaluation.evaluation,
      followUpTasks: evaluation.followUp,
      progressUpdate: evaluation.progressUpdate
    };

  } catch (error) {
    console.error('Error evaluating task performance:', error);
    throw new functions.https.HttpsError('internal', 'Failed to evaluate task performance');
  }
});

// 📊 Adaptive plan adjustment based on real-time performance
exports.adaptPlanInRealTime = functions.firestore
  .document('task_performance/{studentId}/evaluations/{evaluationId}')
  .onCreate(async (snapshot, context) => {
    const { studentId } = context.params;
    const evaluation = snapshot.data();

    try {
      // Get current daily plan
      const today = new Date().toISOString().split('T')[0];
      const planDoc = await db.collection('adaptive_plans')
        .doc(studentId)
        .collection('daily')
        .doc(today)
        .get();

      if (!planDoc.exists) {
        console.log('No daily plan found for adaptation');
        return;
      }

      const currentPlan = planDoc.data();

      // Get all recent evaluations for today
      const evaluationsSnapshot = await db.collection('task_performance')
        .doc(studentId)
        .collection('evaluations')
        .where('timestamp', '>=', new Date(today))
        .get();

      const allEvaluations = evaluationsSnapshot.docs.map(doc => doc.data());

      // Adapt the plan based on performance
      const adaptedPlan = await taskEngine.adaptDailyPlan(currentPlan, allEvaluations);

      // Update the plan with adaptation
      await planDoc.ref.update({
        ...adaptedPlan,
        lastAdapted: admin.firestore.FieldValue.serverTimestamp(),
        adaptiveCycle: 'real-time',
        performanceBased: true
      });

      console.log(`Successfully adapted daily plan for student ${studentId}`);

    } catch (error) {
      console.error('Error adapting plan in real-time:', error);
    }
  });

// 🧠 Weekly learning pattern analysis
exports.analyzeLearningPatterns = functions.pubsub
  .schedule('0 2 * * 0') // Every Sunday at 2 AM
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      const studentsSnapshot = await db.collection('students').get();
      
      const analysisPromises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        
        // Get weekly data
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const [sessionsSnapshot, testsSnapshot, plansSnapshot] = await Promise.all([
          db.collection('study_sessions').doc(studentId)
            .collection('sessions')
            .where('startTime', '>=', weekAgo)
            .get(),
          db.collection('practice_tests').doc(studentId)
            .collection('tests')
            .where('testDate', '>=', weekAgo)
            .get(),
          db.collection('adaptive_plans').doc(studentId)
            .collection('daily')
            .where('date', '>=', weekAgo.toISOString().split('T')[0])
            .get()
        ]);

        const weeklyData = {
          sessions: sessionsSnapshot.docs.map(doc => doc.data()),
          tests: testsSnapshot.docs.map(doc => doc.data()),
          plans: plansSnapshot.docs.map(doc => doc.data())
        };

        // Analyze learning patterns
        const patternAnalysis = await analyzeWeeklyPatterns(studentId, weeklyData);
        
        // Save analysis
        await db.collection('learning_analytics')
          .doc(studentId)
          .collection('weekly_patterns')
          .add({
            analysisDate: admin.firestore.FieldValue.serverTimestamp(),
            weekStart: weekAgo,
            patterns: patternAnalysis,
            recommendations: generateWeeklyRecommendations(patternAnalysis)
          });

        return patternAnalysis;
      });

      await Promise.all(analysisPromises);
      console.log('Weekly learning pattern analysis completed');
      
    } catch (error) {
      console.error('Error in weekly pattern analysis:', error);
    }
  });

// Helper functions
async function analyzeWeeklyPatterns(studentId, weeklyData) {
  const analysisPrompt = `
    WEEKLY LEARNING PATTERN ANALYSIS:
    
    STUDENT: ${studentId}
    WEEKLY DATA: ${JSON.stringify(weeklyData, null, 2)}
    
    Analyze and identify:
    1. Study consistency patterns
    2. Optimal learning times
    3. Effective task types
    4. Knowledge retention rates
    5. Fatigue and engagement trends
    6. Adaptation effectiveness
    
    Provide comprehensive analysis with metrics and insights.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a learning analytics expert. Analyze weekly learning patterns and provide deep insights."
      },
      { role: "user", content: analysisPrompt }
    ],
    temperature: 0.4,
    max_tokens: 2000
  });

  return JSON.parse(response.choices[0].message.content);
}

function generateWeeklyRecommendations(patternAnalysis) {
  // Generate specific recommendations based on patterns
  return {
    scheduleOptimization: optimizeSchedule(patternAnalysis.optimalTimes),
    strategyAdjustments: adjustLearningStrategies(patternAnalysis.effectiveMethods),
    contentFocus: refocusContentBasedOnPatterns(patternAnalysis.retentionRates),
    wellbeingSuggestions: suggestWellbeingImprovements(patternAnalysis.fatiguePatterns)
  };
}