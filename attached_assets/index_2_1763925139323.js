// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const moment = require('moment-timezone');
const cron = require('node-cron');

admin.initializeApp();
const openai = new OpenAI({ apiKey: functions.config().openai.key });
const db = admin.firestore();

// ========== DAILY PLAN GENERATION ==========
exports.generateDailyStudyPlan = functions.pubsub
  .schedule('0 6 * * *')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    console.log('Starting daily study plan generation...');
    
    try {
      const students = await db.collection('students').get();
      const generationTime = moment().tz('Europe/Istanbul').format();
      
      const promises = students.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        const student = studentDoc.data();
        
        try {
          const plan = await generateStudentPlan(studentId, student, generationTime);
          await saveDailyPlan(studentId, plan);
          await sendDailyNotification(studentId, student, plan);
        } catch (error) {
          console.error(`Error generating plan for student ${studentId}:`, error);
        }
      });
      
      await Promise.all(promises);
      console.log('Daily study plans generated successfully');
      return null;
    } catch (error) {
      console.error('Error in daily plan generation:', error);
      throw error;
    }
  });

// ========== PRACTICE TEST ANALYZER ==========
exports.analyzePracticeTest = functions.firestore
  .document('practice_tests/{studentId}/tests/{testId}')
  .onCreate(async (snapshot, context) => {
    const testData = snapshot.data();
    const { studentId, testId } = context.params;
    
    try {
      // Calculate scores
      const scores = calculateExamScores(testData);
      
      // Generate AI analysis
      const analysis = await generateTestAnalysis(studentId, testData, scores);
      
      // Update weak topics
      await updateWeakTopics(studentId, analysis.weakTopics);
      
      // Update test document
      await snapshot.ref.update({
        calculatedScores: scores,
        analysis: analysis,
        analyzedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update student progress
      await updateStudentProgress(studentId, scores, analysis);
      
      console.log(`Test ${testId} analyzed successfully for student ${studentId}`);
    } catch (error) {
      console.error('Error analyzing practice test:', error);
    }
  });

// ========== WEAK TOPIC IDENTIFICATION ==========
exports.identifyWeakTopics = functions.pubsub
  .schedule('0 2 * * 0') // Every Sunday at 2 AM
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      const students = await db.collection('students').get();
      
      const promises = students.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        
        // Get recent tests (last 30 days)
        const testsSnapshot = await db.collection('practice_tests')
          .doc(studentId)
          .collection('tests')
          .where('testDate', '>=', moment().subtract(30, 'days').toDate())
          .get();
        
        const weakTopics = await analyzeWeakTopics(studentId, testsSnapshot.docs);
        
        // Save weak topics analysis
        await db.collection('student_analytics')
          .doc(studentId)
          .collection('weak_topic_analysis')
          .add({
            analysisDate: admin.firestore.FieldValue.serverTimestamp(),
            weakTopics: weakTopics,
            recommendation: await generateTopicRecommendation(weakTopics),
            priority: calculateTopicPriority(weakTopics)
          });
      });
      
      await Promise.all(promises);
      console.log('Weak topic analysis completed');
    } catch (error) {
      console.error('Error in weak topic analysis:', error);
    }
  });

// ========== PROGRESS PREDICTION ==========
exports.predictExamScore = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const studentId = context.auth.uid;
  
  try {
    const prediction = await generateScorePrediction(studentId);
    return { success: true, prediction };
  } catch (error) {
    console.error('Error predicting exam score:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate prediction');
  }
});

// ========== HELPER FUNCTIONS ==========
async function generateStudentPlan(studentId, student, generationTime) {
  // Get student progress and recent activity
  const [progress, recentTests, timeData] = await Promise.all([
    db.collection('student_progress').doc(studentId).get(),
    db.collection('practice_tests').doc(studentId)
      .collection('tests')
      .orderBy('testDate', 'desc')
      .limit(5)
      .get(),
    db.collection('study_sessions').doc(studentId)
      .collection('sessions')
      .where('startTime', '>=', moment().subtract(7, 'days').toDate())
      .get()
  ]);
  
  const weakTopics = await identifyCurrentWeakTopics(studentId, recentTests.docs);
  const studyFocus = determineOptimalStudyFocus(student, progress.data(), weakTopics);
  
  const prompt = createPlanGenerationPrompt(student, progress.data(), weakTopics, studyFocus);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Sen Türkiye'deki üniversite sınavlarına (TYT-AYT) hazırlanan öğrenciler için uzman bir eğitim koçusun. 
        Öğrencinin hedeflerine ulaşması için en optimize çalışma planını oluştur. 
        Gerçekçi, uygulanabilir ve motive edici bir plan hazırla.`
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });
  
  const planData = JSON.parse(completion.choices[0].message.content);
  
  return {
    date: moment().tz('Europe/Istanbul').format('YYYY-MM-DD'),
    generationTime: generationTime,
    examFocus: studyFocus,
    ...planData,
    weakTopics: weakTopics,
    estimatedStudyTime: calculateEstimatedTime(planData.tasks),
    priorityOrder: planData.tasks.map(task => task.priority)
  };
}

function calculateExamScores(testData) {
  const scores = {};
  let totalNet = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalEmpty = 0;
  
  Object.keys(testData.subjects).forEach(subject => {
    const subjectData = testData.subjects[subject];
    const net = subjectData.correct - (subjectData.wrong * 0.25);
    const subjectScore = calculateSubjectScore(subject, net);
    
    scores[subject] = {
      ...subjectData,
      net: Math.max(0, net),
      calculatedScore: subjectScore,
      netPercentage: (net / getTotalQuestions(subject)) * 100
    };
    
    totalNet += net;
    totalCorrect += subjectData.correct;
    totalWrong += subjectData.wrong;
    totalEmpty += subjectData.empty;
  });
  
  // Calculate overall TYT score (approximate)
  const overallScore = calculateTYTOverallScore(scores, testData.testType);
  
  return {
    subjects: scores,
    overall: {
      totalNet: totalNet,
      totalCorrect: totalCorrect,
      totalWrong: totalWrong,
      totalEmpty: totalEmpty,
      overallScore: overallScore,
      estimatedRank: estimateRank(overallScore, testData.testType)
    }
  };
}

async function generateTestAnalysis(studentId, testData, scores) {
  const student = await db.collection('students').doc(studentId).get();
  const studentData = student.data();
  
  const prompt = `
    ÖĞRENCİ: ${studentData.personalInfo.name}
    SINAV TİPİ: ${testData.testType}
    HEDEF: ${studentData.examPreferences.targetPrograms.join(', ')}
    
    SINAV SONUÇLARI:
    ${JSON.stringify(scores, null, 2)}
    
    Bu sınav sonuçlarını detaylı analiz et:
    
    1. GENEL DEĞERLENDİRME:
    - Sınav performansını 100 üzerinden puanla
    - Güçlü ve zayıf yönleri belirle
    - Önceki sınavlarla karşılaştır (eğer varsa)
    
    2. ZAYIF KONULAR (en az 5 tane belirle):
    - Hangi konularda eksiği var?
    - Bu konuların önem derecesi nedir?
    
    3. ZAMAN YÖNETİMİ:
    - Hangi bölümlerde zaman sıkıntısı yaşamış?
    - Süre kullanımı nasıl geliştirilebilir?
    
    4. ÖNERİLER:
    - Acil çalışılması gereken 3 konu
    - Çalışma stratejisi önerileri
    - Bir sonraki sınav için hedefler
    
    JSON formatında döndür:
    {
      "generalAssessment": {
        "score": number,
        "strengths": [string],
        "weaknesses": [string],
        "comparison": string
      },
      "weakTopics": [string],
      "timeManagement": {
        "assessment": string,
        "recommendations": [string]
      },
      "recommendations": {
        "urgentTopics": [string],
        "studyStrategies": [string],
        "nextTestGoals": [string]
      },
      "motivationalMessage": string
    }
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Sen bir sınav analiz uzmanı ve eğitim koçusun. Öğrencinin sınav performansını detaylı analiz edip gelişim için somut öneriler sun."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

function calculateTYTOverallScore(scores, testType) {
  // TYT scoring formula approximation
  let baseScore = 100;
  
  Object.values(scores).forEach(subject => {
    baseScore += subject.net * 3.5; // Approximate point value per net question
  });
  
  // Add bonus for high performance
  const totalNet = Object.values(scores).reduce((sum, subject) => sum + subject.net, 0);
  if (totalNet > 80) baseScore += 50;
  else if (totalNet > 60) baseScore += 25;
  
  return Math.round(baseScore);
}

async function updateWeakTopics(studentId, weakTopics) {
  const weakTopicsRef = db.collection('student_progress').doc(studentId);
  
  await weakTopicsRef.update({
    'analytics.weakTopics': admin.firestore.FieldValue.arrayUnion(...weakTopics),
    'analytics.lastAnalysis': admin.firestore.FieldValue.serverTimestamp(),
    'analytics.weakTopicCount': admin.firestore.FieldValue.increment(weakTopics.length)
  });
  
  // Also update priority for daily plans
  await updateStudyPriority(studentId, weakTopics);
}

async function generateScorePrediction(studentId) {
  const [progress, recentTests, studyData] = await Promise.all([
    db.collection('student_progress').doc(studentId).get(),
    db.collection('practice_tests').doc(studentId)
      .collection('tests')
      .orderBy('testDate', 'desc')
      .limit(10)
      .get(),
    db.collection('study_analytics').doc(studentId).get()
  ]);
  
  const trend = analyzeProgressTrend(recentTests.docs);
  const studyConsistency = calculateStudyConsistency(studyData.data());
  const predictedScore = predictFinalScore(trend, studyConsistency);
  
  return {
    predictedScore: predictedScore,
    confidence: calculatePredictionConfidence(trend, recentTests.docs.length),
    improvementAreas: identifyImprovementAreas(progress.data()),
    studyRecommendations: generateStudyRecommendations(trend, studyConsistency)
  };
}