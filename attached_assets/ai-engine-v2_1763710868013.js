// functions/ai-engine-v2.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const moment = require('moment-timezone');

admin.initializeApp();
const db = admin.firestore();
const openai = new OpenAI({
  apiKey: functions.config().openai.key,
  timeout: 30000,
  maxRetries: 2
});

// ========== UPDATED AI ENGINE FUNCTIONS ==========

/**
 * Generate Daily Plan with new structure
 */
exports.generateDailyPlanV2 = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const studentId = context.auth.uid;
  const targetDate = data.date || moment().tz('Europe/Istanbul').format('YYYY-MM-DD');

  try {
    // Fetch data from new structure
    const [studentDoc, performanceSnapshot, curriculumSnapshot, rulesDoc] = await Promise.all([
      db.collection('Students').doc(studentId).get(),
      db.collection('AIEngine/PerformanceLogs')
        .where('student_id', '==', studentId)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get(),
      db.collection('YKS/TYT/Subjects').get(),
      db.collection('AIEngine/DecisionRules').doc('tyt_planning_v1').get()
    ]);

    if (!studentDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Student profile not found');
    }

    const studentData = studentDoc.data();
    const performanceLogs = performanceSnapshot.docs.map(doc => doc.data());
    const curriculumData = curriculumSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {});
    const decisionRules = rulesDoc.exists ? rulesDoc.data() : {};

    // Generate AI plan
    const aiPlan = await generateAIPlanV2(
      studentData, 
      performanceLogs, 
      curriculumData, 
      decisionRules, 
      targetDate
    );

    // Save to new structure
    const planId = `${studentId}_${targetDate}`;
    await db.collection('AIEngine/DailyPlans').doc(planId).set({
      student_id: studentId,
      date: targetDate,
      plan_version: '2.0',
      ...aiPlan,
      metadata: {
        generated_at: admin.firestore.FieldValue.serverTimestamp(),
        ai_model: 'gpt-4',
        version: '2.0'
      },
      completion: {
        completed_tasks: 0,
        total_tasks: aiPlan.tasks.length,
        actual_duration: 0,
        completion_rate: 0,
        overall_satisfaction: 0
      }
    });

    // Create notification
    await createNotification(studentId, 'daily_plan', {
      title: 'Günlük Planınız Hazır! 📚',
      message: aiPlan.motivational_message,
      data: { plan_id: planId }
    });

    return {
      success: true,
      plan_id: planId,
      plan: aiPlan,
      generated_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating daily plan:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Update Performance with new structure
 */
exports.updatePerformanceV2 = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const studentId = context.auth.uid;
  const { task_id, performance, subject, topic_id, task_type } = data;

  try {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const logId = `${studentId}_${Date.now()}`;

    // Generate AI feedback
    const feedback = await generatePerformanceFeedbackV2(studentId, performance, subject, topic_id);

    // Create performance log
    const performanceLog = {
      student_id: studentId,
      timestamp: timestamp,
      task_id: task_id,
      plan_date: moment().tz('Europe/Istanbul').format('YYYY-MM-DD'),
      subject: subject,
      topic_id: topic_id,
      task_type: task_type,
      performance: performance,
      feedback: feedback,
      analytics: calculateLearningAnalytics(performance)
    };

    // Save to new structure
    await db.collection('AIEngine/PerformanceLogs').doc(logId).set(performanceLog);

    // Update student progress
    await updateStudentProgressV2(studentId, performance, subject, topic_id);

    // Check for achievements
    await checkAchievementsV2(studentId, performance, subject);

    return {
      success: true,
      log_id: logId,
      feedback: feedback
    };

  } catch (error) {
    console.error('Error updating performance:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ========== UPDATED HELPER FUNCTIONS ==========

async function generateAIPlanV2(studentData, performanceLogs, curriculumData, decisionRules, targetDate) {
  const prompt = `
    TYT DAILY STUDY PLAN GENERATION (V2):
    
    STUDENT PROFILE:
    - Name: ${studentData.personal_info.name}
    - Target: ${studentData.exam_preferences.target_programs.join(', ')}
    - Daily Study Time: ${studentData.study_settings.daily_study_hours} hours
    - Learning Style: ${studentData.ai_profile.learning_style}
    - Difficulty Level: ${studentData.ai_profile.difficulty_level}
    
    RECENT PERFORMANCE (last 5 sessions):
    ${JSON.stringify(performanceLogs.slice(0, 5), null, 2)}
    
    CURRICULUM DATA:
    ${JSON.stringify(Object.values(curriculumData).slice(0, 10), null, 2)}
    
    DECISION RULES:
    ${JSON.stringify(decisionRules.rules, null, 2)}
    
    Generate a personalized daily TYT study plan that:
    1. Addresses weak areas from performance data
    2. Follows curriculum prerequisites and weights
    3. Respects student's available time and preferences
    4. Uses appropriate task types and durations
    5. Includes motivational elements
    
    Return JSON format:
    {
      "tasks": [
        {
          "task_id": "string",
          "subject": "string",
          "topic_id": "string",
          "topic_name_tr": "string",
          "topic_name_en": "string",
          "task_type": "theory|practice|review|test",
          "duration": number,
          "priority": "high|medium|low",
          "resources": ["string"],
          "learning_objectives": ["string"],
          "success_criteria": ["string"]
        }
      ],
      "focus_areas": ["string"],
      "estimated_duration": number,
      "difficulty_level": "beginner|intermediate|advanced",
      "motivational_message": "string",
      "study_tips": ["string"],
      "reasoning": {
        "weak_areas_targeted": ["string"],
        "strategy": "string",
        "expected_outcomes": ["string"],
        "ai_model": "string",
        "reasoning_steps": ["string"]
      }
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert TYT exam coach specializing in personalized study planning. Create effective, adaptive daily plans that help students achieve their university goals."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateRuleBasedPlanV2(studentData, curriculumData);
  }
}

async function generatePerformanceFeedbackV2(studentId, performance, subject, topicId) {
  // Get topic information from curriculum
  const topicDoc = await db.collection('YKS/TYT/Subjects').doc(subject)
    .collection('topics').doc(topicId).get();
  const topicData = topicDoc.exists ? topicDoc.data() : {};

  const prompt = `
    PERFORMANCE FEEDBACK GENERATION (V2):
    
    Student completed task in ${subject} - ${topicData.name_tr || topicId}
    Topic Weight: ${topicData.weight || 'N/A'}
    Topic Difficulty: ${topicData.difficulty || 'N/A'}
    
    Performance Data:
    ${JSON.stringify(performance, null, 2)}
    
    Provide constructive, motivational feedback that:
    1. Acknowledges strengths and progress
    2. Identifies specific improvement areas
    3. Suggests actionable next steps
    4. Maintains positive learning mindset
    
    Return JSON format:
    {
      "ai_analysis": "string",
      "strengths": ["string"],
      "improvement_areas": ["string"],
      "recommendations": ["string"],
      "next_steps": ["string"],
      "emotional_tone": "encouraging|challenging|supportive"
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a supportive educational coach. Provide constructive, motivational feedback that helps students learn from their performance and stay motivated."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.6,
    max_tokens: 1200,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function updateStudentProgressV2(studentId, performance, subject, topicId) {
  const studentRef = db.collection('Students').doc(studentId);
  
  // Update overall progress
  await studentRef.update({
    'progress.overall.total_study_hours': admin.firestore.FieldValue.increment(performance.time_spent / 60),
    'progress.overall.tasks_completed': admin.firestore.FieldValue.increment(1),
    'progress.overall.last_study_date': admin.firestore.FieldValue.serverTimestamp(),
    [`progress.subjects.${subject}.${topicId}.last_score`]: performance.score,
    [`progress.subjects.${subject}.${topicId}.last_attempt`]: admin.firestore.FieldValue.serverTimestamp(),
    [`progress.subjects.${subject}.total_tasks_completed`]: admin.firestore.FieldValue.increment(1),
    'progress.overall.last_updated': admin.firestore.FieldValue.serverTimestamp()
  });

  // Update streak
  await updateStudyStreak(studentId);
}

async function updateStudyStreak(studentId) {
  const studentRef = db.collection('Students').doc(studentId);
  const studentDoc = await studentRef.get();
  const studentData = studentDoc.data();
  
  const today = moment().tz('Europe/Istanbul').format('YYYY-MM-DD');
  const lastStudyDate = studentData.progress.overall.last_study_date?.toDate();
  const lastStudyFormatted = lastStudyDate ? moment(lastStudyDate).format('YYYY-MM-DD') : null;
  
  const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  
  let newStreak = studentData.progress.overall.streak_days || 0;
  
  if (lastStudyFormatted === today) {
    // Already updated today
    return;
  } else if (lastStudyFormatted === yesterday) {
    // Consecutive day
    newStreak += 1;
  } else {
    // Broken streak
    newStreak = 1;
  }
  
  await studentRef.update({
    'progress.overall.streak_days': newStreak
  });
}

async function checkAchievementsV2(studentId, performance, subject) {
  const studentRef = db.collection('Students').doc(studentId);
  const studentDoc = await studentRef.get();
  const studentData = studentDoc.data();
  
  const achievements = [];
  
  // High Score Achievement
  if (performance.score >= 90) {
    achievements.push({
      achievement_type: 'score',
      title: 'Üstün Başarı!',
      description: `${subject} dersinde 90+ puan aldın`,
      icon: '⭐',
      progress: { current: 1, target: 1, percentage: 100 },
      metadata: { subject: subject, score: performance.score }
    });
  }
  
  // Streak Achievement
  const streak = studentData.progress.overall.streak_days || 0;
  if (streak === 7) {
    achievements.push({
      achievement_type: 'streak',
      title: '1 Hafta Seri!',
      description: '7 gün boyunca düzenli çalıştın',
      icon: '🔥',
      progress: { current: 7, target: 7, percentage: 100 }
    });
  }
  
  // Save achievements
  for (const achievement of achievements) {
    const achievementId = `${studentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.collection('Achievements').doc(achievementId).set({
      student_id: studentId,
      ...achievement,
      earned_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Send notification
    await createNotification(studentId, 'achievement', {
      title: achievement.title,
      message: achievement.description,
      data: { achievement_id: achievementId }
    });
  }
}

async function createNotification(studentId, type, data) {
  const notificationId = `${studentId}_${Date.now()}`;
  
  await db.collection('Notifications').doc(notificationId).set({
    student_id: studentId,
    type: type,
    ...data,
    read: false,
    scheduled_for: admin.firestore.FieldValue.serverTimestamp(),
    sent_at: admin.firestore.FieldValue.serverTimestamp()
  });
}

function calculateLearningAnalytics(performance) {
  return {
    knowledge_gain: Math.min(1, performance.score / 100 * 0.8 + performance.confidence * 0.2),
    skill_improvement: Math.min(1, performance.accuracy * 0.6 + (1 - performance.time_spent / 180) * 0.4),
    retention_score: performance.confidence,
    efficiency_score: Math.min(1, performance.accuracy / (performance.time_spent / 60))
  };
}

function generateRuleBasedPlanV2(studentData, curriculumData) {
  // Fallback rule-based plan generation
  const availableTime = studentData.study_settings.daily_study_hours * 60;
  
  return {
    tasks: [
      {
        task_id: `task_${Date.now()}_1`,
        subject: 'Turkish',
        topic_id: 'turkish-grammar-1',
        topic_name_tr: 'Sözcükte Anlam',
        topic_name_en: 'Word Meaning',
        task_type: 'practice',
        duration: Math.min(60, availableTime * 0.4),
        priority: 'high',
        resources: ['textbook_chapter_1', 'practice_questions_1'],
        learning_objectives: ['Understand word meanings in context', 'Identify synonyms and antonyms'],
        success_criteria: ['Complete 20 practice questions', 'Achieve 80% accuracy']
      }
    ],
    focus_areas: ['Turkish', 'Mathematics'],
    estimated_duration: availableTime,
    difficulty_level: studentData.ai_profile.difficulty_level,
    motivational_message: "Her gün düzenli çalışmak başarının anahtarıdır!",
    study_tips: ["Düzenli molalar ver", "Zor konulara öncelik ver", "Öğrendiklerini tekrar et"],
    reasoning: {
      weak_areas_targeted: ["Grammar"],
      strategy: "Focus on high-weight foundational topics",
      expected_outcomes: ["Improved foundational knowledge"],
      ai_model: "rule_based_fallback",
      reasoning_steps: ["Selected high-weight topic", "Adjusted for available time"]
    }
  };
}

// ========== SCHEDULED FUNCTIONS ==========

exports.scheduledDailyPlanGenerationV2 = functions.pubsub
  .schedule('0 7 * * *')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      console.log('Starting V2 scheduled daily plan generation...');

      const studentsSnapshot = await db.collection('Students').get();
      const today = moment().tz('Europe/Istanbul').format('YYYY-MM-DD');

      const promises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        
        try {
          const generateDailyPlan = functions.https.callable('generateDailyPlanV2');
          await generateDailyPlan({ date: today });
          console.log(`Generated V2 plan for student: ${studentId}`);
        } catch (error) {
          console.error(`Failed to generate V2 plan for student ${studentId}:`, error);
        }
      });

      await Promise.allSettled(promises);
      console.log('V2 scheduled daily plan generation completed');
      
      return null;
    } catch (error) {
      console.error('Error in V2 scheduled plan generation:', error);
      return null;
    }
  });

module.exports = {
  generateDailyPlanV2: exports.generateDailyPlanV2,
  updatePerformanceV2: exports.updatePerformanceV2,
  scheduledDailyPlanGenerationV2: exports.scheduledDailyPlanGenerationV2
};