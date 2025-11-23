// Updated: enhanced-cloud-functions.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const moment = require('moment-timezone');

admin.initializeApp();
const db = admin.firestore();
const openai = new OpenAI({ 
  apiKey: functions.config().openai.key,
  timeout: 30000, // 30 second timeout
  maxRetries: 2
});

// Enhanced configuration
const CONFIG = {
  MAX_DAILY_STUDY_HOURS: 12,
  MIN_STUDY_SESSION_MINUTES: 15,
  MAX_STUDY_SESSION_MINUTES: 180,
  DAILY_PLAN_GENERATION_TIME: '06:00', // 6 AM Turkey time
  WEAK_TOPIC_ANALYSIS_DAY: 0, // Sunday
  BACKUP_PLAN_TEMPLATES: {
    TYT: {
      tasks: [
        { subject: 'turkish', topic: 'paragraph_comprehension', type: 'practice', duration: 45 },
        { subject: 'mathematics', topic: 'problem_solving', type: 'practice', duration: 60 },
        { subject: 'science', topic: 'concept_review', type: 'review', duration: 30 }
      ]
    },
    AYT: {
      tasks: [
        { subject: 'mathematics_2', topic: 'advanced_algebra', type: 'practice', duration: 60 },
        { subject: 'turkish_literature', topic: 'poetry_analysis', type: 'study', duration: 45 }
      ]
    }
  }
};

// Enhanced daily plan generation with fallback
exports.generateEnhancedDailyPlan = functions.pubsub
  .schedule(`0 6 * * *`)
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    const generationTime = moment().tz('Europe/Istanbul');
    console.log(`Starting enhanced daily plan generation at ${generationTime.format()}`);

    try {
      const studentsSnapshot = await db.collection('students').get();
      const results = {
        successful: 0,
        failed: 0,
        usedFallback: 0,
        errors: []
      };

      const promises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        
        try {
          // Enhanced validation
          await EnhancedSecurity.validateStudentData(studentDoc.data());
          await EnhancedSecurity.rateLimitCheck(studentId, 'generatePlan');

          const plan = await EnhancedErrorHandling.withRetry(
            () => generateStudentPlanWithFallback(studentId, studentDoc.data(), generationTime),
            3, 1000
          );

          await saveDailyPlan(studentId, plan);
          
          if (plan.usedFallback) {
            results.usedFallback++;
            console.log(`Used fallback plan for student ${studentId}`);
          } else {
            results.successful++;
          }

          // Send notification
          await sendPlanNotification(studentId, plan);

        } catch (error) {
          results.failed++;
          results.errors.push({ studentId, error: error.message });
          console.error(`Failed to generate plan for student ${studentId}:`, error);
          
          // Create emergency backup plan
          await createEmergencyPlan(studentId, studentDoc.data());
        }
      });

      await Promise.allSettled(promises); // Use allSettled to handle individual failures
      
      console.log('Enhanced daily plan generation completed:', results);
      
      // Log results for monitoring
      await db.collection('system_logs').add({
        type: 'daily_plan_generation',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        results: results,
        generationTime: generationTime.format()
      });

    } catch (error) {
      console.error('Critical error in daily plan generation:', error);
      // Don't throw to avoid retrying the entire batch
    }
  });

// Enhanced practice test analysis
exports.analyzeEnhancedPracticeTest = functions.firestore
  .document('practice_tests/{studentId}/tests/{testId}')
  .onCreate(async (snapshot, context) => {
    const { studentId, testId } = context.params;
    const testData = snapshot.data();

    try {
      // Validate test data
      if (!testData.subjects || typeof testData.subjects !== 'object') {
        throw new Error('Invalid test data structure');
      }

      // Calculate scores with enhanced validation
      const scores = calculateEnhancedExamScores(testData);
      
      // Generate AI analysis with fallback
      let analysis;
      try {
        analysis = await generateEnhancedTestAnalysis(studentId, testData, scores);
      } catch (aiError) {
        console.warn('AI analysis failed, using rule-based analysis:', aiError);
        analysis = generateRuleBasedAnalysis(testData, scores);
      }

      // Update progress with transaction for data consistency
      await db.runTransaction(async (transaction) => {
        const progressRef = db.collection('student_progress').doc(studentId);
        const progressDoc = await transaction.get(progressRef);
        
        const updatedProgress = updateProgressWithTransaction(
          progressDoc.exists ? progressDoc.data() : {},
          scores,
          analysis
        );

        transaction.set(progressRef, updatedProgress, { merge: true });
      });

      // Update test document
      await snapshot.ref.update({
        calculatedScores: scores,
        analysis: analysis,
        analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
        analysisVersion: '2.0'
      });

      console.log(`Enhanced test analysis completed for student ${studentId}, test ${testId}`);

    } catch (error) {
      console.error(`Error analyzing test ${testId} for student ${studentId}:`, error);
      
      // Mark test as failed analysis
      await snapshot.ref.update({
        analysisFailed: true,
        analysisError: error.message,
        analyzedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      throw error; // Retry the function
    }
  });

// New: Performance monitoring function
exports.monitorSystemPerformance = functions.pubsub
  .schedule('*/5 * * * *') // Every 5 minutes
  .onRun(async (context) => {
    try {
      const metrics = await collectSystemMetrics();
      await db.collection('system_metrics').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ...metrics
      });
      
      // Alert if critical thresholds are exceeded
      if (metrics.memoryUsage > 0.8 || metrics.cpuUsage > 0.7) {
        await sendAlertNotification(metrics);
      }
    } catch (error) {
      console.error('Error monitoring system performance:', error);
    }
  });

// Enhanced helper functions
async function generateStudentPlanWithFallback(studentId, studentData, generationTime) {
  try {
    // Try AI-generated plan first
    const aiPlan = await generateAIEnhancedPlan(studentId, studentData, generationTime);
    return { ...aiPlan, usedFallback: false };
  } catch (error) {
    console.warn(`AI plan generation failed for ${studentId}, using fallback:`, error);
    
    // Use rule-based fallback plan
    const fallbackPlan = generateFallbackPlan(studentData, generationTime);
    return { ...fallbackPlan, usedFallback: true, fallbackReason: error.message };
  }
}

function generateFallbackPlan(studentData, generationTime) {
  const examTypes = studentData.examPreferences?.examTypes || ['TYT'];
  const primaryExam = examTypes.includes('TYT') ? 'TYT' : examTypes[0];
  
  const template = CONFIG.BACKUP_PLAN_TEMPLATES[primaryExam] || CONFIG.BACKUP_PLAN_TEMPLATES.TYT;
  
  return {
    date: generationTime.format('YYYY-MM-DD'),
    tasks: template.tasks,
    motivationalFeedback: "Bugün planınız sistem tarafından otomatik olarak oluşturuldu. Düzenli çalışmaya devam edin!",
    studyTips: ["Konuları küçük parçalara bölün", "Düzenli molalar verin", "Öğrendiklerinizi tekrar edin"],
    generatedAt: generationTime.format(),
    isFallback: true
  };
}

function calculateEnhancedExamScores(testData) {
  const scores = {};
  let totalNet = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalEmpty = 0;

  Object.keys(testData.subjects).forEach(subject => {
    const subjectData = testData.subjects[subject];
    
    // Enhanced validation
    if (typeof subjectData.correct !== 'number' || 
        typeof subjectData.wrong !== 'number' || 
        typeof subjectData.empty !== 'number') {
      throw new Error(`Invalid subject data for ${subject}`);
    }

    const totalQuestions = subjectData.correct + subjectData.wrong + subjectData.empty;
    const expectedQuestions = getExpectedQuestionCount(testData.testType, subject);
    
    if (totalQuestions !== expectedQuestions) {
      console.warn(`Question count mismatch for ${subject}: expected ${expectedQuestions}, got ${totalQuestions}`);
    }

    const net = Math.max(0, subjectData.correct - (subjectData.wrong * 0.25));
    const subjectScore = calculateEnhancedSubjectScore(subject, net, testData.testType);
    
    scores[subject] = {
      correct: subjectData.correct,
      wrong: subjectData.wrong,
      empty: subjectData.empty,
      net: parseFloat(net.toFixed(2)),
      calculatedScore: subjectScore,
      netPercentage: (net / totalQuestions) * 100,
      accuracy: subjectData.correct / (subjectData.correct + subjectData.wrong) || 0
    };
    
    totalNet += net;
    totalCorrect += subjectData.correct;
    totalWrong += subjectData.wrong;
    totalEmpty += subjectData.empty;
  });

  const overallScore = calculateEnhancedOverallScore(scores, testData.testType);
  
  return {
    subjects: scores,
    overall: {
      totalNet: parseFloat(totalNet.toFixed(2)),
      totalCorrect,
      totalWrong,
      totalEmpty,
      overallScore: Math.round(overallScore),
      estimatedRank: estimateEnhancedRank(overallScore, testData.testType),
      confidence: calculateScoreConfidence(scores)
    }
  };
}

function getExpectedQuestionCount(testType, subject) {
  const questionCounts = {
    TYT: {
      turkish: 40,
      mathematics: 40,
      science: 20,
      social_sciences: 20
    },
    AYT: {
      mathematics_2: 40,
      turkish_literature: 24,
      social_1: 12,
      science_2: 40
    }
  };
  
  return questionCounts[testType]?.[subject] || 0;
}

async function collectSystemMetrics() {
  const [memoryUsage, cpuUsage, activeUsers, planCount] = await Promise.all([
    getMemoryUsage(),
    getCpuUsage(),
    getActiveUserCount(),
    getDailyPlanCount()
  ]);

  return {
    memoryUsage,
    cpuUsage,
    activeUsers,
    dailyPlansGenerated: planCount,
    timestamp: Date.now()
  };
}