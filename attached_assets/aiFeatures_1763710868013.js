// functions/aiFeatures.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: functions.config().openai.key });

// Analyze learning style based on study patterns
exports.analyzeLearningStyle = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { studySessions, performanceData, preferences } = data;

  try {
    const prompt = `
      Aşağıdaki öğrenci verilerine dayanarak öğrenme stilini analiz et:

      Çalışma Alışkanlıkları:
      ${JSON.stringify(studySessions.slice(0, 10))}

      Performans Verileri:
      ${JSON.stringify(performanceData)}

      Tercihler:
      ${JSON.stringify(preferences)}

      Öğrenme stilleri:
      - Görsel: Görsel materyallerle daha iyi öğrenir
      - İşitsel: Dinleyerek ve konuşarak öğrenir  
      - Kinestetik: Hareket ve dokunma yoluyla öğrenir
      - Oku/Yaz: Okuma ve yazma aktiviteleriyle öğrenir

      Yanıtı JSON formatında ver:
      {
        "primaryStyle": "Ana öğrenme stili",
        "secondaryStyles": ["İkincil stiller"],
        "styleDistribution": {
          "Görsel": 30,
          "İşitsel": 25,
          "Kinestetik": 25,
          "Oku/Yaz": 20
        },
        "description": "Öğrenme stili açıklaması",
        "recommendedTechniques": ["Önerilen teknik 1", "Önerilen teknik 2"],
        "confidence": 85
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    
    // Save analysis to user profile
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      learningStyle: analysis,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return analysis;
  } catch (error) {
    console.error('Learning style analysis error:', error);
    throw new functions.https.HttpsError('internal', 'Analysis failed');
  }
});

// Generate adaptive study plan
exports.generateAdaptiveStudyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { learningStyle, goals, availableTime, weakAreas, strengths } = data;

  try {
    const prompt = `
      Aşağıdaki bilgilere dayanarak kişiselleştirilmiş bir çalışma planı oluştur:

      Öğrenme Stili: ${learningStyle.primaryStyle}
      Öğrenme Teknikleri: ${learningStyle.recommendedTechniques.join(', ')}

      Hedefler: ${JSON.stringify(goals)}
      Günlük Çalışma Süresi: ${availableTime} saat
      Zayıf Alanlar: ${JSON.stringify(weakAreas)}
      Güçlü Alanlar: ${JSON.stringify(strengths)}

      7 günlük detaylı bir çalışma planı oluştur. Her gün için:
      - Farklı öğrenme teknikleri kullan
      - Zayıf alanlara odaklan
      - Güçlü alanları pekiştir
      - Öğrenme stiline uygun aktiviteler ekle

      Yanıtı JSON formatında ver:
      {
        "summary": "Planın genel özeti",
        "totalStudyTime": 1260,
        "recommendedSchedule": "Sabah 8-12, Akşam 18-22",
        "focusAreas": [
          {
            "subject": "Matematik",
            "topic": "Integral",
            "reason": "Son sınavlarda düşük performans",
            "priority": "high",
            "estimatedTime": 120
          }
        ],
        "dailyPlan": [
          {
            "day": 1,
            "sessions": [
              {
                "time": "08:00-09:30",
                "subject": "Matematik",
                "activity": "Integral konu tekrarı ve video izleme",
                "duration": "90 dakika",
                "technique": "Görsel öğrenme"
              }
            ]
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const plan = JSON.parse(response.choices[0].message.content);
    
    // Save plan to database
    await admin.firestore().collection('adaptivePlans').add({
      userId: context.auth.uid,
      plan: plan,
      learningStyle: learningStyle,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    });

    return plan;
  } catch (error) {
    console.error('Adaptive plan generation error:', error);
    throw new functions.https.HttpsError('internal', 'Plan generation failed');
  }
});

// Real-time performance prediction
exports.predictPerformance = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { currentScores, studyHours, targetScore, daysUntilExam } = data;

  try {
    const prompt = `
      Mevcut duruma göre sınav performansını tahmin et:

      Mevcut Puan: ${currentScores}
      Günlük Çalışma Saati: ${studyHours}
      Hedef Puan: ${targetScore}
      Sınava Kalan Gün: ${daysUntilExam}

      Tahmini sonuçları JSON formatında ver:
      {
        "predictedScore": 420,
        "confidence": 85,
        "requiredDailyStudy": 6,
        "keyFactors": ["Matematik netleri", "Türkçe paragraf"],
        "recommendations": ["Günde 2 saat matematik çalış", "Deneme sınavı çöz"],
        "successProbability": 75
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 800
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Performance prediction error:', error);
    throw new functions.https.HttpsError('internal', 'Prediction failed');
  }
});