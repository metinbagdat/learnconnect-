import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

admin.initializeApp();
const openai = new OpenAI({ apiKey: functions.config().openai.key });

export const generateDailyPlans = functions.pubsub
  .schedule('0 6 * * *') // Every day at 6 AM
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch all students
    const studentsSnapshot = await admin.firestore().collection('students').get();
    
    for (const studentDoc of studentsSnapshot.docs) {
      const student = studentDoc.data();
      const studentId = studentDoc.id;

      // Fetch the latest progress for the student (e.g., from yesterday)
      const progressSnapshot = await admin.firestore()
        .collection('progress')
        .where('studentId', '==', studentId)
        .orderBy('date', 'desc')
        .limit(1)
        .get();

      let progress = null;
      if (!progressSnapshot.empty) {
        progress = progressSnapshot.docs[0].data();
      }

      // Generate the daily plan (simplified example)
      const plan = await generatePlan(student, progress);

      // Use OpenAI to generate motivational feedback and study tips
      const openAIPrompt = `
        Student: ${student.name}
        Subjects: ${student.subjects.join(', ')}
        Goals: ${JSON.stringify(student.goals)}
        Recent Progress: ${progress ? JSON.stringify(progress) : 'No recent progress'}
        
        Please generate:
        1. Motivational feedback based on the student's progress and goals.
        2. Personalized study tips for today's plan.
        
        Return a JSON object with two fields: "motivationalFeedback" and "studyTips".
      `;

      const openAIResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: openAIPrompt }],
        response_format: { type: "json_object" }
      });

      const openAIContent = JSON.parse(openAIResponse.choices[0].message.content);

      // Add the OpenAI generated content to the plan
      plan.motivationalFeedback = openAIContent.motivationalFeedback;
      plan.studyTips = openAIContent.studyTips;

      // Save the plan to Firestore
      await admin.firestore().collection('plans').add({
        studentId,
        date: dateString,
        ...plan,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return null;
  });

// Example plan generation function (simplified)
async function generatePlan(student: any, progress: any) {
  // This is a simplified example. In reality, you would have more complex logic.
  const plan: any = {
    subjects: {}
  };

  for (const subject of student.subjects) {
    // Allocate time based on student preferences and progress
    // For example, if the student has a goal in a subject, allocate more time.
    let timeAllocated = student.preferences.studyHours / student.subjects.length; // in hours

    // Convert to minutes
    timeAllocated = timeAllocated * 60;

    // Determine topics to cover (this could be based on a curriculum or previous progress)
    const topics = await getTopicsForSubject(subject, progress);

    plan.subjects[subject] = {
      topics,
      timeAllocated,
      resources: [] // You could generate resources based on topics
    };
  }

  return plan;
}

// Mock function to get topics for a subject
async function getTopicsForSubject(subject: string, progress: any) {
  // This would typically query a curriculum or use the progress to determine the next topics.
  return [`${subject} Topic 1`, `${subject} Topic 2`];
}