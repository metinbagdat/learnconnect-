// functions/enhanced-ai-engine.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

const palm = new GoogleGenerativeAI(functions.config().palm.key);

exports.generateEnhancedStudyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const userId = context.auth.uid;
  const { date, useAI = 'auto' } = data;

  try {
    // Get user preferences for AI model
    const userDoc = await admin.firestore().collection('Users').doc(userId).get();
    const userPrefs = userDoc.data()?.ai_preferences || {};
    
    const aiModel = useAI === 'auto' ? 
      (userPrefs.preferred_ai_model || 'openai') : useAI;

    // Fetch comprehensive context
    const context = await buildPlanningContext(userId, date);
    
    // Generate plan with selected AI
    let plan;
    if (aiModel === 'palm') {
      plan = await generateWithPaLM(context);
    } else {
      plan = await generateWithOpenAI(context);
    }

    // Apply smart scheduling algorithms
    const optimizedPlan = await applySmartScheduling(plan, context);
    
    // Save plan
    await saveStudyPlan(userId, date, optimizedPlan, aiModel);

    return { success: true, plan: optimizedPlan, ai_model: aiModel };

  } catch (error) {
    console.error('Error in enhanced AI engine:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

async function buildPlanningContext(userId, date) {
  const [
    userData,
    enrollments,
    performanceData,
    energyPatterns,
    upcomingDeadlines
  ] = await Promise.all([
    admin.firestore().collection('Users').doc(userId).get(),
    admin.firestore().collection('Enrollments')
      .where('user_id', '==', userId)
      .where('status', '==', 'active').get(),
    admin.firestore().collection('PerformanceLogs')
      .where('user_id', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(50).get(),
    admin.firestore().collection('EnergyPatterns')
      .where('user_id', '==', userId).get(),
    admin.firestore().collection('Deadlines')
      .where('user_id', '==', userId)
      .where('due_date', '>=', new Date(date)).get()
  ]);

  return {
    user: userData.data(),
    enrollments: enrollments.docs.map(doc => doc.data()),
    performance: performanceData.docs.map(doc => doc.data()),
    energy: energyPatterns.docs.map(doc => doc.data()),
    deadlines: upcomingDeadlines.docs.map(doc => doc.data())
  };
}

async function applySmartScheduling(plan, context) {
  const scheduler = new SmartScheduler();
  
  // Detect conflicts
  const conflicts = scheduler.detectConflicts(plan.tasks, context.existingCommitments);
  
  // Optimize routine
  const optimized = scheduler.optimizeRoutine(context.user.preferences, {
    availableTime: context.user.available_time,
    energyLevels: context.energy,
    deadlines: context.deadlines
  });

  return {
    ...plan,
    tasks: optimized.timeBlocks,
    conflicts: conflicts,
    optimization_metrics: optimized.metrics
  };
}