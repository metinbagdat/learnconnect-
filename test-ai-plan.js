import { generateAndSaveDailyPlan } from './server/ai-daily-plan-service.js';

async function testAIPlan() {
  try {
    console.log('🤖 Testing AI Daily Plan Generation...\n');
    
    const plan = await generateAndSaveDailyPlan({
      userId: 5, // Admin user
      date: '2025-11-21',
      language: 'tr',
      targetStudyTime: 240, // 4 hours
      focusSubjects: ['Matematik', 'Türkçe']
    });
    
    console.log('✅ AI Plan Generated Successfully!\n');
    console.log('📅 Date:', plan.planDate);
    console.log('⏱️  Total Study Time:', plan.totalStudyTime, 'minutes');
    console.log('🌍 Language:', plan.language);
    console.log('\n📝 Morning Session:');
    console.log(JSON.stringify(plan.morningSession, null, 2));
    console.log('\n💬 Motivational Message:');
    console.log(plan.motivationalMessage);
    
    console.log('\n✨ Success! AI-powered daily plans are working!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testAIPlan();
