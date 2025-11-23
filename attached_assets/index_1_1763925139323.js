// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

admin.initializeApp();
const openai = new OpenAI({ apiKey: functions.config().openai.key });

exports.generateDailyPlans = functions.pubsub
  .schedule('0 6 * * *') // 6 AM daily
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const studentsSnapshot = await admin.firestore().collection('students').get();
      
      const promises = studentsSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id;
        const studentData = studentDoc.data();
        
        // Get recent progress
        const progressSnapshot = await admin.firestore()
          .collection('progress')
          .doc(studentId)
          .collection('daily')
          .orderBy('date', 'desc')
          .limit(7)
          .get();
          
        const dailyPlan = await generatePersonalizedPlan(studentData, progressSnapshot);
        
        // Save to plans collection
        await admin.firestore()
          .collection('plans')
          .doc(studentId)
          .collection('daily')
          .doc(dailyPlan.date)
          .set(dailyPlan);
          
        return dailyPlan;
      });
      
      await Promise.all(promises);
      console.log('Daily plans generated successfully');
    } catch (error) {
      console.error('Error generating daily plans:', error);
    }
  });

async function generatePersonalizedPlan(student, progressHistory) {
  const prompt = `
    Student: ${student.name}
    Subjects: ${student.subjects.join(', ')}
    Goals: ${student.goals.join(', ')}
    Study Time Available: ${student.dailyStudyTime} minutes
    
    Generate a personalized daily study plan with:
    1. 3-5 specific tasks prioritizing weak areas
    2. Motivational feedback based on recent progress
    3. 2-3 personalized study tips
    
    Format as JSON with: tasks[], motivationalFeedback, studyTips[]
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an expert educational coach specialized in creating effective study plans." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });
  
  return {
    date: new Date().toISOString().split('T')[0],
    ...JSON.parse(completion.choices[0].message.content),
    generatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
}