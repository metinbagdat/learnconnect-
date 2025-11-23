// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const moment = require('moment-timezone');

admin.initializeApp();
const db = admin.firestore();

// Initialize OpenAI with environment config
const openai = new OpenAI({
  apiKey: functions.config().openai.key,
  timeout: 30000,
  maxRetries: 2
});

// ========== AI ENGINE CORE FUNCTIONS ==========

/**
 * 1. generateDailyPlan - Creates personalized daily study plan
 * Trigger: Scheduled (07:00 daily) + Manual
 */
exports.generateDailyPlan = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const studentId = context.auth.uid;
  const targetDate = data.date || moment().tz('Europe/Istanbul').format('YYYY-MM-DD');

  try {
    console.log(`Generating daily plan for student: ${studentId}, date: ${targetDate}`);

    // Fetch student data
    const [studentDoc, progressSnapshot, recentPlansSnapshot] = await Promise.all([
      db.collection('Students').doc(studentId).get(),
      db.collection('AIEngine/PerformanceLogs')
        .where('studentId', '==', studentId)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get(),
      db.collection('AIEngine/DailyPlans')
        .where('studentId', '==', studentId)
        .orderBy('date', 'desc')
        .limit(5)
        .get()
    ]);

    if (!studentDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Student profile not found');
    }

    const studentData = studentDoc.data();
    const performanceLogs = progressSnapshot.docs.map(doc => doc.data());
    const recentPlans = recentPlansSnapshot.docs.map(doc => doc.data());

    // Generate AI-powered plan
    const aiPlan = await generateAIPlan(studentData, performanceLogs, recentPlans, targetDate);

    // Save to Firestore
    const planId = `${studentId}_${targetDate}`;
    await db.collection('AIEngine/DailyPlans').doc(planId).set({
      studentId: studentId,
      date: targetDate,
      plan: aiPlan,
      metadata: {
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        aiModel: 'gpt-4',
        version: '2.0',
        reasoning: aiPlan.reasoning
      },
      completion: {
        completedTasks: 0,
        totalTasks: aiPlan.tasks.length,
        actualDuration: 0,
        completionRate: 0
      }
    });

    // Send notification
    await sendPlanNotification(studentId, aiPlan);

    return {
      success: true,
      planId: planId,
      plan: aiPlan,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating daily plan:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * 2. updatePerformance - Logs task results and updates student profile
 * Trigger: Task completion, test submission
 */
exports.updatePerformance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const studentId = context.auth.uid;
  const { taskId, performance, taskType, subject, topic } = data;

  try {
    // Validate input
    if (!taskId || !performance) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const logId = `${studentId}_${Date.now()}`;

    // Create performance log
    const performanceLog = {
      studentId: studentId,
      timestamp: timestamp,
      taskId: taskId,
      taskType: taskType,
      subject: subject,
      topic: topic,
      performance: performance,
      feedback: await generatePerformanceFeedback(studentId, performance, subject, topic)
    };

    // Save performance log
    await db.collection('AIEngine/PerformanceLogs').doc(logId).set(performanceLog);

    // Update student progress
    await updateStudentProgress(studentId, performance, subject, topic);

    // Trigger adaptive planning if needed
    if (shouldAdjustPlan(performance)) {
      await adjustNextPlan(studentId);
    }

    // Check for achievements
    await checkAchievements(studentId, performance, subject);

    return {
      success: true,
      logId: logId,
      feedback: performanceLog.feedback
    };

  } catch (error) {
    console.error('Error updating performance:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * 3. adjustNextPlan - Dynamically adjusts next plan based on performance
 * Trigger: Performance updates, manual adjustment
 */
exports.adjustNextPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const studentId = context.auth.uid;

  try {
    // Get recent performance and current plan
    const [performanceSnapshot, currentPlanSnapshot, studentDoc] = await Promise.all([
      db.collection('AIEngine/PerformanceLogs')
        .where('studentId', '==', studentId)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get(),
      db.collection('AIEngine/DailyPlans')
        .where('studentId', '==', studentId)
        .orderBy('date', 'desc')
        .limit(1)
        .get(),
      db.collection('Students').doc(studentId).get()
    ]);

    const performances = performanceSnapshot.docs.map(doc => doc.data());
    const currentPlan = currentPlanSnapshot.docs[0]?.data();
    const studentData = studentDoc.data();

    if (!currentPlan) {
      throw new functions.https.HttpsError('not-found', 'No current plan found');
    }

    // Generate adjustments
    const adjustments = await generatePlanAdjustments(studentData, currentPlan, performances);
    
    // Apply adjustments to next plan
    const nextDate = moment().tz('Europe/Istanbul').add(1, 'day').format('YYYY-MM-DD');
    const nextPlanId = `${studentId}_${nextDate}`;

    await db.collection('AIEngine/DailyPlans').doc(nextPlanId).update({
      'plan.adjustments': adjustments,
      'metadata.lastAdjusted': admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      adjustments: adjustments,
      nextPlanDate: nextDate
    };

  } catch (error) {
    console.error('Error adjusting next plan:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ========== SCHEDULED FUNCTIONS ==========

/**
 * Scheduled daily plan generation at 07:00 Turkey time
 */
exports.scheduledDailyPlanGeneration = functions.pubsub
  .schedule('0 7 * * *')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      console.log('Starting scheduled daily plan generation...');

      // Get all active students
      const studentsSnapshot = await db.collection('Students').get();
      const today = moment().tz('Europe/Istanbul').format('YYYY-MM-DD');

      const promises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        
        try {
          // Call generateDailyPlan for each student
          const generateDailyPlan = functions.https.callable('generateDailyPlan');
          await generateDailyPlan({ date: today });
          
          console.log(`Generated plan for student: ${studentId}`);
        } catch (error) {
          console.error(`Failed to generate plan for student ${studentId}:`, error);
        }
      });

      await Promise.allSettled(promises);
      console.log('Scheduled daily plan generation completed');
      
      return null;
    } catch (error) {
      console.error('Error in scheduled plan generation:', error);
      return null;
    }
  });

/**
 * Weekly analytics report generation
 */
exports.generateWeeklyAnalytics = functions.pubsub
  .schedule('0 2 * * 1') // Every Monday at 2 AM
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      const analytics = await generateWeeklyReports();
      await db.collection('Analytics').add({
        type: 'weekly_report',
        data: analytics,
        period: 'weekly',
        generatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('Weekly analytics generated successfully');
      return null;
    } catch (error) {
      console.error('Error generating weekly analytics:', error);
      return null;
    }
  });

// ========== AI HELPER FUNCTIONS ==========

async function generateAIPlan(studentData, performanceLogs, recentPlans, targetDate) {
  const prompt = `
    TYT STUDY PLAN GENERATION PROMPT:
    
    STUDENT PROFILE:
    - Name: ${studentData.personalInfo.name}
    - Target: ${studentData.examPreferences.targetPrograms.join(', ')}
    - Daily Study Time: ${studentData.studySettings.dailyStudyHours} hours
    - Learning Style: ${studentData.aiPreferences.learningStyle}
    - Difficulty Level: ${studentData.aiPreferences.difficultyLevel}
    
    RECENT PERFORMANCE:
    ${JSON.stringify(performanceLogs.slice(0, 5), null, 2)}
    
    GENERATE A PERSONALIZED DAILY STUDY PLAN WITH:
    1. 3-5 specific tasks based on weak areas
    2. Balanced mix of subjects
    3. Appropriate difficulty level
    4. Motivational message
    5. Study tips
    
    Consider:
    - Topic weights and importance for TYT
    - Student's learning preferences
    - Recent performance trends
    - Available study time
    
    Return JSON format:
    {
      "tasks": [
        {
          "subject": "string",
          "topic": "string", 
          "type": "theory|practice|review|test",
          "duration": number,
          "priority": "high|medium|low",
          "resources": ["string"],
          "learningObjectives": ["string"]
        }
      ],
      "focusAreas": ["string"],
      "estimatedDuration": number,
      "difficulty": "beginner|intermediate|advanced",
      "motivationalMessage": "string",
      "studyTips": ["string"],
      "reasoning": {
        "weakAreasTargeted": ["string"],
        "strategy": "string",
        "expectedOutcomes": ["string"]
      }
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert TYT exam coach. Create personalized, effective daily study plans that help students achieve their university goals."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to rule-based plan generation
    return generateRuleBasedPlan(studentData, performanceLogs);
  }
}

async function generatePerformanceFeedback(studentId, performance, subject, topic) {
  const prompt = `
    PERFORMANCE FEEDBACK GENERATION:
    
    Student completed task in ${subject} - ${topic}
    Performance: ${JSON.stringify(performance)}
    
    Provide constructive feedback with:
    1. Strength analysis
    2. Improvement areas
    3. Specific recommendations
    4. Encouragement message
    
    Return JSON:
    {
      "aiAnalysis": "string",
      "strengths": ["string"],
      "improvementAreas": ["string"],
      "recommendations": ["string"],
      "nextSteps": ["string"]
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a supportive educational coach. Provide constructive feedback that motivates students to improve."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.5,
    max_tokens: 1000,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function generatePlanAdjustments(studentData, currentPlan, performances) {
  const prompt = `
    PLAN ADJUSTMENT ANALYSIS:
    
    Current Plan: ${JSON.stringify(currentPlan.plan, null, 2)}
    Recent Performances: ${JSON.stringify(performances, null, 2)}
    
    Analyze and suggest adjustments:
    1. Difficulty level changes
    2. Topic prioritization
    3. Time allocation
    4. Learning strategy updates
    
    Return JSON:
    {
      "difficultyAdjustment": "increase|decrease|maintain",
      "topicPriorities": ["string"],
      "timeReallocation": {"subject": minutes},
      "strategyChanges": ["string"],
      "reasoning": "string"
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an adaptive learning specialist. Adjust study plans based on student performance data."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.6,
    max_tokens: 1500,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

// ========== HELPER FUNCTIONS ==========

async function updateStudentProgress(studentId, performance, subject, topic) {
  const progressRef = db.collection('Students').doc(studentId);
  
  await progressRef.update({
    [`progress.${subject}.${topic}.lastScore`]: performance.score,
    [`progress.${subject}.${topic}.lastAttempt`]: admin.firestore.FieldValue.serverTimestamp(),
    [`progress.${subject}.totalTasksCompleted`]: admin.firestore.FieldValue.increment(1),
    'progress.lastUpdated': admin.firestore.FieldValue.serverTimestamp()
  });
}

function shouldAdjustPlan(performance) {
  return performance.score < 60 || performance.confidence < 0.5;
}

async function sendPlanNotification(studentId, plan) {
  const notification = {
    studentId: studentId,
    type: 'daily_plan',
    title: 'Günlük Çalışma Planın Hazır! 📚',
    message: `Bugün ${plan.tasks.length} görevin var. ${plan.motivationalMessage}`,
    data: { planId: `${studentId}_${moment().format('YYYY-MM-DD')}` },
    read: false,
    scheduledFor: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Notifications').add(notification);
}

function generateRuleBasedPlan(studentData, performanceLogs) {
  // Fallback plan generation logic
  return {
    tasks: [
      {
        subject: "Turkish",
        topic: "Paragraph Comprehension",
        type: "practice",
        duration: 45,
        priority: "high",
        resources: ["TYT Turkish Practice Book"],
        learningObjectives: ["Improve reading comprehension", "Increase reading speed"]
      }
    ],
    focusAreas: ["Turkish", "Mathematics"],
    estimatedDuration: studentData.studySettings.dailyStudyHours * 60,
    difficulty: studentData.aiPreferences.difficultyLevel,
    motivationalMessage: "Her gün düzenli çalışmak başarının anahtarıdır!",
    studyTips: ["Düzenli molalar ver", "Zor konulara öncelik ver"],
    reasoning: {
      weakAreasTargeted: ["Paragraph Comprehension"],
      strategy: "Focus on high-weight topics",
      expectedOutcomes: ["Improved comprehension skills"]
    }
  };
}

async function checkAchievements(studentId, performance, subject) {
  // Achievement logic here
  if (performance.score >= 90) {
    await db.collection('Achievements').add({
      studentId: studentId,
      type: 'high_score',
      title: 'Üstün Başarı!',
      description: `${subject} dersinde 90+ puan aldın`,
      earnedAt: admin.firestore.FieldValue.serverTimestamp(),
      progress: 100,
      target: 100
    });
  }
}

async function generateWeeklyReports() {
  // Generate weekly analytics data
  const studentsSnapshot = await db.collection('Students').get();
  
  return {
    totalStudents: studentsSnapshot.size,
    activeThisWeek: studentsSnapshot.size, // Simplified
    averageStudyTime: 2.5, // Would calculate from logs
    commonWeakAreas: ["Mathematics", "Turkish"],
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  generateDailyPlan: exports.generateDailyPlan,
  updatePerformance: exports.updatePerformance,
  adjustNextPlan: exports.adjustNextPlan
};