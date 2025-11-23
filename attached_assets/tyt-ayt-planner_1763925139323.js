// functions/tyt-ayt-planner.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

admin.initializeApp();
const openai = new OpenAI({ apiKey: functions.config().openai.key });

exports.generateTYT_AYT_DailyPlan = functions.pubsub
  .schedule('0 6 * * *') // 6 AM daily
  .timeZone('Europe/Istanbul') // Turkey timezone
  .onRun(async (context) => {
    try {
      const studentsSnapshot = await admin.firestore().collection('students').get();
      
      const promises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        const studentData = studentDoc.data();
        
        // Get student progress and recent test results
        const [progressSnapshot, testsSnapshot] = await Promise.all([
          admin.firestore().collection('student_progress').doc(studentId).get(),
          admin.firestore().collection('practice_tests').doc(studentId)
            .collection('tests').orderBy('testDate', 'desc').limit(3).get()
        ]);
        
        const dailyPlan = await generateTYT_AYT_Plan(studentData, progressSnapshot.data(), testsSnapshot.docs);
        
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
      console.log('TYT/AYT daily plans generated successfully');
    } catch (error) {
      console.error('Error generating TYT/AYT plans:', error);
    }
  });

async function generateTYT_AYT_Plan(student, progress, recentTests) {
  // Analyze weak areas from recent tests
  const weakAreas = analyzeWeakAreas(recentTests);
  const studyFocus = determineStudyFocus(student.examPreferences, progress, weakAreas);
  
  const prompt = `
    ÖĞRENCİ: ${student.personalInfo.name}
    HEDEF: ${student.examPreferences.targetPrograms.join(', ')}
    SINAV TÜRÜ: ${student.examPreferences.examTypes.join(' + ')}
    
    ZAYIF KONULAR: ${weakAreas.join(', ')}
    GÜNLÜK ÇALIŞMA SÜRESİ: ${student.studySettings.dailyStudyHours} saat
    
    TYT HEDEF NETLER:
    - Türkçe: ${progress.tyt_progress.subject_scores.turkish.targetNet}
    - Matematik: ${progress.tyt_progress.subject_scores.mathematics.targetNet}
    - Fen Bilimleri: ${progress.tyt_progress.subject_scores.science.targetNet}
    - Sosyal Bilimler: ${progress.tyt_progress.subject_scores.social_sciences.targetNet}
    
    AYT HEDEF NETLER:
    - Matematik-2: ${progress.ayt_progress?.subject_scores?.mathematics_2?.targetNet || 'Belirlenmedi'}
    - Türk Dili ve Edebiyatı: ${progress.ayt_progress?.subject_scores?.turkish_literature?.targetNet || 'Belirlenmedi'}
    
    Bu öğrenci için kişiselleştirilmiş bir günlük çalışma planı oluştur:
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

function analyzeWeakAreas(recentTests) {
  const weakTopics = new Map();
  
  recentTests.forEach(test => {
    const analysis = test.data().analysis;
    if (analysis && analysis.weakTopics) {
      analysis.weakTopics.forEach(topic => {
        weakTopics.set(topic, (weakTopics.get(topic) || 0) + 1);
      });
    }
  });
  
  return Array.from(weakTopics.keys()).slice(0, 5); // Top 5 weak topics
}

function determineStudyFocus(examPreferences, progress, weakAreas) {
  const hasTYT = examPreferences.examTypes.includes('TYT');
  const hasAYT = examPreferences.examTypes.includes('AYT');
  
  if (!hasAYT) return 'TYT';
  if (!hasTYT) return 'AYT';
  
  // Balance between TYT and AYT based on progress and weak areas
  const tytScore = progress.tyt_progress.overall_tyt_score || 0;
  const targetTytScore = progress.tyt_progress.target_tyt_score || 400;
  
  if (tytScore < targetTytScore * 0.7) {
    return 'TYT';
  } else {
    return weakAreas.some(area => area.includes('AYT')) ? 'AYT' : 'Mixed';
  }
}