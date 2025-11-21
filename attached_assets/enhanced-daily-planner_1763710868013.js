// functions/enhanced-daily-planner.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

admin.initializeApp();
const openai = new OpenAI({ apiKey: functions.config().openai.key });

exports.generateEnhancedDailyPlan = functions.pubsub
  .schedule('0 6 * * *') // 6 AM daily
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      const studentsSnapshot = await admin.firestore().collection('students').get();
      
      const promises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        const studentData = studentDoc.data();
        
        // Get student progress, recent tests, time tracking data, and weekly goals
        const [progressSnapshot, testsSnapshot, timeEntriesSnapshot, weeklyGoalsSnapshot] = await Promise.all([
          admin.firestore().collection('student_progress').doc(studentId).get(),
          admin.firestore().collection('practice_tests').doc(studentId)
            .collection('tests').orderBy('testDate', 'desc').limit(3).get(),
          admin.firestore().collection('time_entries').doc(studentId)
            .collection('entries').where('startTime', '>=', getLastWeek()).get(),
          admin.firestore().collection('weekly_goals').doc(studentId)
            .collection('goals').where('weekStart', '==', getCurrentWeekStart()).get()
        ]);
        
        const dailyPlan = await generateEnhancedPlan(
          studentData, 
          progressSnapshot.data(), 
          testsSnapshot.docs,
          timeEntriesSnapshot.docs,
          weeklyGoalsSnapshot.docs
        );
        
        // Save daily plan
        await admin.firestore()
          .collection('daily_plans')
          .doc(studentId)
          .collection('plans')
          .doc(dailyPlan.date)
          .set(dailyPlan);
          
        return dailyPlan;
      });
      
      await Promise.all(promises);
      console.log('Enhanced daily plans generated successfully');
    } catch (error) {
      console.error('Error generating enhanced daily plans:', error);
    }
  });

function getLastWeek() {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  return now;
}

function getCurrentWeekStart() {
  const now = new Date();
  const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
  return firstDayOfWeek.toISOString().split('T')[0];
}

async function generateEnhancedPlan(student, progress, recentTests, timeEntries, weeklyGoals) {
  // Analyze weak areas from recent tests and time entries
  const weakAreas = analyzeWeakAreas(recentTests, timeEntries);
  const studyFocus = determineStudyFocus(student.examPreferences, progress, weakAreas);
  const weeklyGoalProgress = calculateWeeklyGoalProgress(weeklyGoals, timeEntries);
  
  const prompt = `
    ÖĞRENCİ: ${student.personalInfo.name}
    HEDEF: ${student.examPreferences.targetPrograms.join(', ')}
    SINAV TÜRÜ: ${student.examPreferences.examTypes.join(' + ')}
    
    ZAYIF KONULAR: ${weakAreas.join(', ')}
    GÜNLÜK ÇALIŞMA SÜRESİ: ${student.studySettings.dailyStudyHours} saat
    
    HAFTALIK HEDEF DURUMU: ${JSON.stringify(weeklyGoalProgress, null, 2)}
    
    TYT HEDEF NETLER:
    - Türkçe: ${progress.tyt_progress.subject_scores.turkish.targetNet}
    - Matematik: ${progress.tyt_progress.subject_scores.mathematics.targetNet}
    - Fen Bilimleri: ${progress.tyt_progress.subject_scores.science.targetNet}
    - Sosyal Bilimler: ${progress.tyt_progress.subject_scores.social_sciences.targetNet}
    
    AYT HEDEF NETLER:
    - Matematik-2: ${progress.ayt_progress?.subject_scores?.mathematics_2?.targetNet || 'Belirlenmedi'}
    - Türk Dili ve Edebiyatı: ${progress.ayt_progress?.subject_scores?.turkish_literature?.targetNet || 'Belirlenmedi'}
    
    Bu öğrenci için kişiselleştirilmiş bir günlük çalışma planı oluştur. Haftalık hedeflerini de dikkate al.
    1. 4-6 özel görev (zayıf konulara öncelik ver)
    2. Motivasyonel geri bildirim
    3. 2-3 kişiselleştirilmiş çalışma ipucu
    4. Günlük hedefler
    
    JSON formatında döndür: {tasks: [], motivationalFeedback: string, studyTips: [], dailyGoals: []}
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: "Sen Türkiye'deki üniversite sınavlarına (TYT-AYT) hazırlanan öğrenciler için uzman bir eğitim koşusun. Etkili çalışma planları oluştur ve motive edici geri bildirimler ver." 
      },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });
  
  const planData = JSON.parse(completion.choices[0].message.content);
  
  return {
    date: new Date().toISOString().split('T')[0],
    examFocus: studyFocus,
    ...planData,
    weakAreas: weakAreas,
    generatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
}

function analyzeWeakAreas(recentTests, timeEntries) {
  // Combine weak topics from tests and time entries (if any)
  const weakTopics = new Map();
  
  recentTests.forEach(test => {
    const analysis = test.data().analysis;
    if (analysis && analysis.weakTopics) {
      analysis.weakTopics.forEach(topic => {
        weakTopics.set(topic, (weakTopics.get(topic) || 0) + 1);
      });
    }
  });
  
  // Also, if there are topics that the student spent a lot of time on but still weak, we can consider them as weak.
  // For now, we just use the test analysis.
  
  return Array.from(weakTopics.keys()).slice(0, 5); // Top 5 weak topics
}

function calculateWeeklyGoalProgress(weeklyGoals, timeEntries) {
  // Calculate the progress towards weekly goals
  // This is a simplified version. We would need to map time entries to the goals.
  const goalProgress = {};
  
  weeklyGoals.forEach(goalDoc => {
    const goal = goalDoc.data();
    goal.goals.forEach(g => {
      const key = `${g.subject}-${g.topic}`;
      goalProgress[key] = {
        target: g.targetHours,
        achieved: 0
      };
    });
  });
  
  timeEntries.forEach(entry => {
    const data = entry.data();
    const key = `${data.subject}-${data.topic}`;
    if (goalProgress[key]) {
      goalProgress[key].achieved += data.duration / 60; // convert minutes to hours
    }
  });
  
  return goalProgress;
}