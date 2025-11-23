// functions/courseManagement.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.generateCourseBasedStudyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Kullanıcı girişi gerekli');
  }

  const userId = context.auth.uid;
  const { courseId, studyHours } = data;

  try {
    const db = admin.firestore();
    
    // Get user's enrollment and course data
    const [enrollmentSnap, courseSnap, lessonsSnap] = await Promise.all([
      db.collection('enrollments')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .limit(1)
        .get(),
      db.collection('courses').doc(courseId).get(),
      db.collection('lessons')
        .where('courseId', '==', courseId)
        .orderBy('order')
        .get()
    ]);

    if (enrollmentSnap.empty || !courseSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Kurs veya kayıt bulunamadı');
    }

    const enrollment = enrollmentSnap.docs[0].data();
    const course = courseSnap.data();
    const lessons = lessonsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Find next uncompleted lessons
    const completedLessons = enrollment.progress.completedLessons || [];
    const remainingLessons = lessons.filter(lesson => !completedLessons.includes(lesson.id));

    // Generate study plan based on available time and remaining lessons
    const dailyPlan = generateDailyStudyPlan(remainingLessons, studyHours);

    return {
      success: true,
      plan: dailyPlan,
      course: course.title,
      remainingLessons: remainingLessons.length,
      estimatedCompletion: `${Math.ceil(remainingLessons.length / (studyHours / 2))} gün`
    };

  } catch (error) {
    console.error('Study plan generation error:', error);
    throw new functions.https.HttpsError('internal', 'Plan oluşturulamadı');
  }
});

function generateDailyStudyPlan(lessons, availableHours) {
  const dailyMinutes = availableHours * 60;
  let remainingMinutes = dailyMinutes;
  const dailyLessons = [];

  for (const lesson of lessons) {
    if (remainingMinutes >= lesson.duration) {
      dailyLessons.push({
        lessonId: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        type: 'lesson'
      });
      remainingMinutes -= lesson.duration;
    } else {
      break;
    }
  }

  // Add practice sessions if time remains
  if (remainingMinutes > 0 && dailyLessons.length > 0) {
    dailyLessons.push({
      type: 'practice',
      title: 'Tekrar ve Uygulama',
      duration: remainingMinutes,
      description: 'Öğrendiklerinizi pekiştirin'
    });
  }

  return {
    totalDuration: dailyMinutes - remainingMinutes,
    lessons: dailyLessons,
    breaks: calculateBreaks(dailyLessons.length)
  };
}

function calculateBreaks(lessonCount) {
  const breaks = [];
  for (let i = 1; i < lessonCount; i++) {
    breaks.push({
      duration: 10, // 10 minute breaks
      description: 'Mola'
    });
  }
  return breaks;
}