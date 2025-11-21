// functions/enhanced-study-planner.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: functions.config().openai.key
});

exports.generateEnhancedStudyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const userId = context.auth.uid;
  const { date, includeCourses = true } = data;

  try {
    // Fetch user data, enrolled courses, and progress
    const [userDoc, enrollmentsSnapshot, performanceSnapshot] = await Promise.all([
      admin.firestore().collection('Users').doc(userId).get(),
      admin.firestore().collection('Enrollments')
        .where('user_id', '==', userId)
        .where('status', '==', 'active')
        .get(),
      admin.firestore().collection('AIEngine/PerformanceLogs')
        .where('student_id', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get()
    ]);

    const userData = userDoc.data();
    const enrollments = enrollmentsSnapshot.docs.map(doc => doc.data());
    const performanceLogs = performanceSnapshot.docs.map(doc => doc.data());

    // Fetch course details for enrolled courses
    const courseIds = enrollments.map(e => e.course_id);
    const coursesSnapshot = await admin.firestore().collection('Courses')
      .where(admin.firestore.FieldPath.documentId(), 'in', courseIds)
      .get();

    const courses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Generate AI-powered study plan
    const aiPlan = await generateAIPlanWithCourses(
      userData,
      enrollments,
      courses,
      performanceLogs,
      date
    );

    // Save plan
    const planId = `${userId}_${date}`;
    await admin.firestore().collection('StudyPlans').doc(planId).set({
      user_id: userId,
      date: date,
      generated_at: admin.firestore.FieldValue.serverTimestamp(),
      plan: aiPlan,
      ai_metadata: {
        model: 'gpt-4',
        version: '2.0',
        include_courses: includeCourses
      }
    });

    return { success: true, plan: aiPlan };

  } catch (error) {
    console.error('Error generating enhanced study plan:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

async function generateAIPlanWithCourses(userData, enrollments, courses, performanceLogs, targetDate) {
  const prompt = `
    ENHANCED STUDY PLAN GENERATION WITH COURSES:

    STUDENT PROFILE:
    - Name: ${userData.personal_info?.name}
    - Daily Study Time: ${userData.study_settings?.daily_study_hours} hours
    - Learning Style: ${userData.ai_profile?.learning_style}

    ENROLLED COURSES & PROGRESS:
    ${enrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.course_id);
      return `
        Course: ${course?.title}
        Progress: ${enrollment.progress.overall_progress}%
        Completed Lessons: ${enrollment.progress.completed_lessons.length}
        Current Module: ${enrollment.progress.current_module}
      `;
    }).join('\n')}

    RECENT PERFORMANCE:
    ${JSON.stringify(performanceLogs.slice(0, 5), null, 2)}

    Generate a comprehensive daily study plan that:
    1. Prioritizes courses based on progress and deadlines
    2. Includes both course lessons and general study tasks
    3. Balances new learning with review
    4. Considers upcoming exams and assignments
    5. Respects available study time

    Return JSON format with course-integrated tasks.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert educational planner that creates integrated study plans combining course learning with general study goals."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}