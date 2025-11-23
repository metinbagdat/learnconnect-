// functions/score-calculator.js
exports.calculateTYTScore = functions.firestore
  .document('practice_tests/{studentId}/tests/{testId}')
  .onCreate(async (snapshot, context) => {
    const testData = snapshot.data();
    const studentId = context.params.studentId;
    
    if (testData.testType === 'TYT') {
      const scores = calculateTYTScores(testData.subjects);
      const overallScore = calculateOverallTYTScore(scores);
      
      // Update test document with calculated scores
      await snapshot.ref.update({
        overallScore: overallScore,
        calculatedScores: scores
      });
      
      // Update student progress
      await updateStudentProgress(studentId, scores, overallScore, 'TYT');
    }
    
    if (testData.testType === 'AYT') {
      const scores = calculateAYTScores(testData.subjects);
      await updateStudentProgress(studentId, scores, null, 'AYT');
    }
    
    // Generate test analysis
    const analysis = await generateTestAnalysis(testData);
    await snapshot.ref.update({ analysis: analysis });
    
    return null;
  });

function calculateTYTScores(subjects) {
  const scores = {};
  
  Object.keys(subjects).forEach(subject => {
    const subjectData = subjects[subject];
    const net = calculateNetScore(subjectData.correct, subjectData.wrong);
    scores[subject] = {
      ...subjectData,
      net: net
    };
  });
  
  return scores;
}

function calculateNetScore(correct, wrong) {
  return correct - (wrong * 0.25); // TYT scoring formula
}

function calculateOverallTYTScore(scores) {
  // TYT overall score calculation (simplified)
  const baseScore = Object.values(scores).reduce((total, subject) => {
    return total + (subject.net * 100); // Simplified calculation
  }, 0);
  
  return Math.round(baseScore + 100); // Base + 100 points
}

async function generateTestAnalysis(testData) {
  const prompt = `
    Deneme Sınavı Analizi:
    ${JSON.stringify(testData.subjects, null, 2)}
    
    Bu sonuçlara göre:
    1. Zayıf olduğu 3-5 konuyu belirle
    2. Zaman yönetimi değerlendirmesi yap
    3. 2-3 öneri ver
    
    JSON formatında: {weakTopics: [], timeManagement: string, recommendations: string}
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: "Sen bir sınav analiz uzmanısın. Öğrencinin zayıf yönlerini tespit et ve gelişim için öneriler sun." 
      },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(completion.choices[0].message.content);
}