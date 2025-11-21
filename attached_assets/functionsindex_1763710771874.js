// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

admin.initializeApp();
const openai = new OpenAI({ apiKey: functions.config().openai.key });
const db = admin.firestore();

// Günlük plan oluşturma fonksiyonu
exports.generateDailyStudyPlan = functions.pubsub
  .schedule('0 6 * * *') // Her gün sabah 6'da
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      console.log('Günlük çalışma planları oluşturuluyor...');

      // Tüm aktif kullanıcıları getir
      const usersSnapshot = await db.collection('users').get();
      
      const promises = usersSnapshot.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        const userData = userDoc.data();
        
        try {
          // Kullanıcının son ilerlemesini getir
          const progressSnapshot = await db.collection('studentProgress')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

          let previousProgress = null;
          if (!progressSnapshot.empty) {
            previousProgress = progressSnapshot.docs[0].data();
          }

          // OpenAI ile kişiselleştirilmiş plan oluştur
          const dailyPlan = await generatePersonalizedPlan(userData, previousProgress);
          
          // Planı Firestore'a kaydet
          const planData = {
            userId: userId,
            date: new Date().toISOString().split('T')[0],
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
            plan: dailyPlan.plan,
            totalStudyTime: dailyPlan.totalStudyTime,
            motivationalMessage: dailyPlan.motivationalMessage,
            studyTips: dailyPlan.studyTips,
            completed: false,
            completionRate: 0
          };

          await db.collection('studyPlans').add(planData);
          
          console.log(`Kullanıcı ${userId} için plan oluşturuldu`);
        } catch (error) {
          console.error(`Kullanıcı ${userId} için plan oluşturma hatası:`, error);
        }
      });

      await Promise.all(promises);
      console.log('Tüm planlar başarıyla oluşturuldu');
      return null;
    } catch (error) {
      console.error('Plan oluşturma hatası:', error);
      return null;
    }
  });

// OpenAI ile kişiselleştirilmiş plan oluşturma
async function generatePersonalizedPlan(userData, previousProgress) {
  const prompt = `
    Kullanıcı bilgileri:
    - İsim: ${userData.name || 'Kullanıcı'}
    - Tercih edilen çalışma saatleri: ${userData.preferences?.dailyStudyHours || 4} saat
    - Tercih edilen dersler: ${userData.preferences?.preferredSubjects?.join(', ') || 'Genel'}
    - Çalışma programı: ${JSON.stringify(userData.preferences?.studySchedule || {})}

    ${previousProgress ? `
    Önceki ilerleme:
    - Dersler: ${Object.keys(previousProgress.subjects || {}).join(', ')}
    - Verimlilik: ${previousProgress.dailyGoals?.achievementRate || 0}%
    - Ruh hali: ${previousProgress.mood || 'normal'}
    ` : 'Önceki ilerleme bilgisi yok'}

    Bu kullanıcı için günlük bir çalışma planı oluştur. Plan şu formatta olmalı:

    {
      "plan": {
        "morning": [
          {
            "subject": "Ders adı",
            "topic": "Konu başlığı",
            "duration": 45,
            "resources": ["Kaynak 1", "Kaynak 2"],
            "priority": "high/medium/low"
          }
        ],
        "afternoon": [...],
        "evening": [...]
      },
      "totalStudyTime": 180,
      "motivationalMessage": "Kişiselleştirilmiş motivasyon mesajı",
      "studyTips": ["İpucu 1", "İpucu 2"]
    }

    Önemli noktalar:
    - Toplam çalışma süresi ${userData.preferences?.dailyStudyHours || 4} saat civarında olsun
    - Kullanıcının tercih ettiği derslere öncelik ver
    - Önceki ilerlemeyi dikkate al
    - Dinlenme molalarını unutma
    - Türkçe içerik üret
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Sen bir eğitim koçusun. Kullanıcılar için kişiselleştirilmiş çalışma planları oluşturuyorsun. Sadece JSON formatında yanıt ver."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 1500
  });

  return JSON.parse(response.choices[0].message.content);
}

// İlerleme takibi fonksiyonu
exports.trackStudyProgress = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Kullanıcı girişi gerekli');
  }

  const userId = context.auth.uid;
  const { subject, timeStudied, topicsCompleted, efficiency, notes, mood } = data;

  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Günlük ilerleme dokümanını bul veya oluştur
    const progressRef = db.collection('studentProgress')
      .where('userId', '==', userId)
      .where('date', '==', today);

    const progressSnapshot = await progressRef.get();

    let progressData = {
      userId: userId,
      date: today,
      subjects: {},
      dailyGoals: {
        completed: false,
        achievementRate: 0
      },
      mood: mood || 'neutral',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (!progressSnapshot.empty) {
      // Mevcut ilerlemeyi güncelle
      const existingProgress = progressSnapshot.docs[0];
      progressData = { ...existingProgress.data(), ...progressData };
      
      if (!progressData.subjects[subject]) {
        progressData.subjects[subject] = {};
      }

      progressData.subjects[subject] = {
        timeStudied: (progressData.subjects[subject]?.timeStudied || 0) + timeStudied,
        topicsCompleted: [...new Set([
          ...(progressData.subjects[subject]?.topicsCompleted || []),
          ...topicsCompleted
        ])],
        efficiency: efficiency || progressData.subjects[subject]?.efficiency || 0,
        notes: notes || progressData.subjects[subject]?.notes || ''
      };

      await existingProgress.ref.update(progressData);
    } else {
      // Yeni ilerleme kaydı oluştur
      progressData.subjects[subject] = {
        timeStudied: timeStudied,
        topicsCompleted: topicsCompleted,
        efficiency: efficiency || 0,
        notes: notes || ''
      };
      progressData.createdAt = admin.firestore.FieldValue.serverTimestamp();

      await db.collection('studentProgress').add(progressData);
    }

    // Günlük hedef tamamlanma durumunu kontrol et
    await checkDailyGoals(userId, today);

    return { success: true, message: 'İlerleme kaydedildi' };
  } catch (error) {
    console.error('İlerleme kaydetme hatası:', error);
    throw new functions.https.HttpsError('internal', 'İlerleme kaydedilemedi');
  }
});

// Günlük hedefleri kontrol et
async function checkDailyGoals(userId, date) {
  try {
    // Bugünkü planı getir
    const planSnapshot = await db.collection('studyPlans')
      .where('userId', '==', userId)
      .where('date', '==', date)
      .limit(1)
      .get();

    if (planSnapshot.empty) return;

    const planDoc = planSnapshot.docs[0];
    const planData = planDoc.data();
    
    // İlerlemeyi getir
    const progressSnapshot = await db.collection('studentProgress')
      .where('userId', '==', userId)
      .where('date', '==', date)
      .limit(1)
      .get();

    if (progressSnapshot.empty) return;

    const progressData = progressSnapshot.docs[0].data();
    
    // Tamamlanma oranını hesapla
    let totalPlannedTime = planData.totalStudyTime;
    let totalStudiedTime = 0;

    Object.values(progressData.subjects || {}).forEach(subject => {
      totalStudiedTime += subject.timeStudied || 0;
    });

    const completionRate = Math.min(100, Math.round((totalStudiedTime / totalPlannedTime) * 100));
    const goalsCompleted = completionRate >= 80; // %80 ve üstü başarılı

    // Planı güncelle
    await planDoc.ref.update({
      completionRate: completionRate,
      completed: goalsCompleted
    });

    // İlerlemeyi güncelle
    await progressSnapshot.docs[0].ref.update({
      'dailyGoals.completed': goalsCompleted,
      'dailyGoals.achievementRate': completionRate
    });

    // Eğer hedefler tamamlandıysa motivasyon mesajı gönder
    if (goalsCompleted) {
      await sendCongratulatoryMessage(userId, completionRate);
    }

  } catch (error) {
    console.error('Hedef kontrol hatası:', error);
  }
}

// Tebrik mesajı gönder
async function sendCongratulatoryMessage(userId, completionRate) {
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();

  const prompt = `
    Kullanıcı ${userData.name || 'öğrenci'} günlük hedeflerinin %${completionRate}'ını tamamladı.
    Kendisini tebrik eden ve motive eden kısa bir mesaj yaz.
    Mesaj samimi ve cesaretlendirici olsun.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 150
  });

  const congratulatoryMessage = response.choices[0].message.content;

  // Bildirim olarak kaydet (frontend'de gösterilmek üzere)
  await db.collection('notifications').add({
    userId: userId,
    type: 'achievement',
    title: 'Tebrikler! 🎉',
    message: congratulatoryMessage,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
}