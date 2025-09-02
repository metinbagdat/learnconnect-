import Anthropic from '@anthropic-ai/sdk';
import { storage } from "./storage";
import type { InsertLevelAssessment, InsertAssessmentQuestion, InsertUserSkillLevel } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Available AI models in priority order
const AI_MODELS = ["claude-3-5-sonnet-20241022", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"];

interface AssessmentQuestionData {
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'open_ended';
  options?: string[];
  correctAnswer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skillArea: string;
  explanation: string;
}

interface AssessmentResult {
  finalLevel: 'beginner' | 'intermediate' | 'advanced';
  confidenceScore: number;
  recommendedNextSteps: string[];
  strongAreas: string[];
  weakAreas: string[];
}

/**
 * Generate AI-powered assessment questions for a specific subject and level
 */
export async function generateAssessmentQuestions(
  subject: string,
  subCategory: string | null = null,
  questionCount: number = 10,
  language: string = 'en'
): Promise<AssessmentQuestionData[]> {
  
  const isTurkish = language === 'tr';
  const subjectContext = subCategory ? `${subject} - ${subCategory}` : subject;
  
  const systemPrompt = isTurkish 
    ? `Sen bir uzman eğitim değerlendirme uzmanısın. ${subjectContext} konusunda seviye belirleme soruları oluşturacaksın.`
    : `You are an expert educational assessment specialist. You will create level assessment questions for ${subjectContext}.`;

  const userPrompt = isTurkish
    ? `${subjectContext} konusunda ${questionCount} adet çoktan seçmeli soru oluştur. Sorular başlangıç, orta ve ileri seviyede olmalı.

Aşağıdaki JSON formatında yanıt ver:
{
  "questions": [
    {
      "questionText": "Soru metni",
      "questionType": "multiple_choice",
      "options": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
      "correctAnswer": "Doğru seçenek",
      "difficulty": "beginner|intermediate|advanced",
      "skillArea": "Spesifik beceri alanı",
      "explanation": "Doğru cevabın açıklaması"
    }
  ]
}

Kurallar:
- Her seviyede en az 2 soru olmalı
- Sorular pratik ve uygulamalı olmalı
- Açıklamalar net ve öğretici olmalı
- Türkçe dilbilgisine dikkat et`
    : `Create ${questionCount} multiple choice questions for ${subjectContext}. Questions should cover beginner, intermediate, and advanced levels.

Respond in this JSON format:
{
  "questions": [
    {
      "questionText": "Question text",
      "questionType": "multiple_choice", 
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct option",
      "difficulty": "beginner|intermediate|advanced",
      "skillArea": "Specific skill area",
      "explanation": "Explanation of correct answer"
    }
  ]
}

Requirements:
- At least 2 questions per difficulty level
- Questions should be practical and applicable
- Explanations should be clear and educational
- Test real understanding, not just memorization`;

  let lastError = null;
  
  for (const model of AI_MODELS) {
    try {
      console.log(`Generating assessment questions with model ${model}...`);
      
      const completion = await anthropic.messages.create({
        model: model,
        max_tokens: 3000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ],
      });

      const responseContent = completion.content[0]?.type === 'text' ? completion.content[0].text : undefined;
      if (!responseContent) {
        throw new Error("Empty response from AI service");
      }

      const data = JSON.parse(responseContent);
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid response format");
      }

      console.log(`Successfully generated ${data.questions.length} questions with ${model}`);
      return data.questions;

    } catch (error: any) {
      console.error(`Assessment generation model ${model} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  // Fallback questions if AI fails
  console.warn("All AI models failed, using fallback questions");
  return getFallbackQuestions(subject, questionCount, isTurkish);
}

/**
 * Analyze assessment results and determine user skill level
 */
export async function analyzeAssessmentResults(
  assessmentId: number,
  questions: any[],
  language: string = 'en'
): Promise<AssessmentResult> {
  
  const correctAnswers = questions.filter(q => q.isCorrect).length;
  const totalQuestions = questions.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;
  
  // Analyze performance by difficulty
  const beginnerQuestions = questions.filter(q => q.difficulty === 'beginner');
  const intermediateQuestions = questions.filter(q => q.difficulty === 'intermediate');
  const advancedQuestions = questions.filter(q => q.difficulty === 'advanced');
  
  const beginnerScore = beginnerQuestions.length ? 
    (beginnerQuestions.filter(q => q.isCorrect).length / beginnerQuestions.length) * 100 : 0;
  const intermediateScore = intermediateQuestions.length ? 
    (intermediateQuestions.filter(q => q.isCorrect).length / intermediateQuestions.length) * 100 : 0;
  const advancedScore = advancedQuestions.length ? 
    (advancedQuestions.filter(q => q.isCorrect).length / advancedQuestions.length) * 100 : 0;

  // Determine level
  let finalLevel: 'beginner' | 'intermediate' | 'advanced';
  let confidenceScore: number;

  if (beginnerScore >= 80 && intermediateScore >= 70 && advancedScore >= 60) {
    finalLevel = 'advanced';
    confidenceScore = Math.min(95, 70 + (advancedScore - 60));
  } else if (beginnerScore >= 80 && intermediateScore >= 60) {
    finalLevel = 'intermediate';
    confidenceScore = Math.min(90, 60 + (intermediateScore - 60));
  } else {
    finalLevel = 'beginner';
    confidenceScore = Math.min(85, 50 + (beginnerScore / 2));
  }

  // AI-enhanced analysis
  const isTurkish = language === 'tr';
  const analysisPrompt = isTurkish
    ? `Değerlendirme sonuçları: ${correctAnswers}/${totalQuestions} doğru
Başlangıç seviyesi: ${beginnerScore.toFixed(1)}%
Orta seviye: ${intermediateScore.toFixed(1)}%
İleri seviye: ${advancedScore.toFixed(1)}%

Belirlenen seviye: ${finalLevel}

Bu sonuçlara göre:
1. Güçlü alanları belirle
2. Geliştirilmesi gereken alanları belirle
3. Önerilen sonraki adımları listele

JSON formatında yanıt ver:
{
  "strongAreas": ["Güçlü alan 1", "Güçlü alan 2"],
  "weakAreas": ["Gelişim alanı 1", "Gelişim alanı 2"],
  "recommendedNextSteps": ["Öneri 1", "Öneri 2", "Öneri 3"]
}`
    : `Assessment results: ${correctAnswers}/${totalQuestions} correct
Beginner level: ${beginnerScore.toFixed(1)}%
Intermediate level: ${intermediateScore.toFixed(1)}%
Advanced level: ${advancedScore.toFixed(1)}%

Determined level: ${finalLevel}

Based on these results, provide:
1. Strong areas
2. Areas for improvement
3. Recommended next steps

Respond in JSON format:
{
  "strongAreas": ["Strong area 1", "Strong area 2"],
  "weakAreas": ["Weak area 1", "Weak area 2"],
  "recommendedNextSteps": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;

  try {
    // Try AI analysis first
    for (const model of AI_MODELS) {
      try {
        const completion = await anthropic.messages.create({
          model: model,
          max_tokens: 1500,
          temperature: 0.3,
          system: isTurkish 
            ? "Sen bir uzman eğitim danışmanısın. Değerlendirme sonuçlarını analiz edip öneriler verirsin."
            : "You are an expert educational advisor. You analyze assessment results and provide recommendations.",
          messages: [
            { role: "user", content: analysisPrompt }
          ],
        });

        const responseContent = completion.content[0]?.type === 'text' ? completion.content[0].text : undefined;
        if (responseContent) {
          const aiAnalysis = JSON.parse(responseContent);
          return {
            finalLevel,
            confidenceScore,
            recommendedNextSteps: aiAnalysis.recommendedNextSteps || [],
            strongAreas: aiAnalysis.strongAreas || [],
            weakAreas: aiAnalysis.weakAreas || []
          };
        }
      } catch (error) {
        console.error(`Analysis model ${model} failed:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error('AI analysis failed, using fallback analysis');
  }

  // Fallback analysis
  return getFallbackAnalysis(finalLevel, scorePercentage, isTurkish);
}

/**
 * Create a new level assessment for a user
 */
export async function createLevelAssessment(
  userId: number,
  subject: string,
  subCategory: string | null = null,
  language: string = 'en'
): Promise<number> {
  
  const assessmentData: InsertLevelAssessment = {
    userId,
    subject,
    subCategory,
    assessmentType: 'skill_level',
    difficulty: 'mixed', // Will contain beginner, intermediate, advanced questions
    totalQuestions: 10,
    correctAnswers: 0,
    timeSpentMinutes: 0,
    status: 'in_progress',
    language
  };

  const assessmentId = await storage.createLevelAssessment(assessmentData);
  
  // Generate questions
  const questions = await generateAssessmentQuestions(subject, subCategory, 10, language);
  
  // Save questions to database
  for (let i = 0; i < questions.length; i++) {
    const questionData: InsertAssessmentQuestion = {
      assessmentId,
      questionNumber: i + 1,
      questionText: questions[i].questionText,
      questionType: questions[i].questionType,
      options: questions[i].options || [],
      correctAnswer: questions[i].correctAnswer,
      difficulty: questions[i].difficulty,
      skillArea: questions[i].skillArea,
      aiGenerated: true,
      explanation: questions[i].explanation
    };
    
    await storage.createAssessmentQuestion(questionData);
  }

  return assessmentId;
}

/**
 * Complete assessment and update user skill level
 */
export async function completeAssessment(
  assessmentId: number,
  answers: { questionId: number; answer: string; timeSpent: number }[],
  language: string = 'en'
): Promise<AssessmentResult> {
  
  // Get assessment and questions
  const assessment = await storage.getLevelAssessment(assessmentId);
  if (!assessment) {
    throw new Error('Assessment not found');
  }

  const questions = await storage.getAssessmentQuestions(assessmentId);
  let correctAnswers = 0;
  let totalTimeSpent = 0;

  // Update questions with user answers
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const isCorrect = question.correctAnswer.toLowerCase().trim() === answer.answer.toLowerCase().trim();
      if (isCorrect) correctAnswers++;
      
      await storage.updateAssessmentQuestion(answer.questionId, {
        userAnswer: answer.answer,
        isCorrect,
        timeSpentSeconds: answer.timeSpent
      });
      
      totalTimeSpent += answer.timeSpent;
    }
  }

  // Analyze results
  const enrichedQuestions = questions.map(q => {
    const answer = answers.find(a => a.questionId === q.id);
    return {
      ...q,
      isCorrect: answer ? q.correctAnswer.toLowerCase().trim() === answer.answer.toLowerCase().trim() : false
    };
  });

  // Try AI analysis first, fall back to simple analysis if it fails
  let analysisResult: AssessmentResult;
  try {
    analysisResult = await analyzeAssessmentResults(assessmentId, enrichedQuestions, language);
  } catch (error: any) {
    console.log('AI analysis failed, using fallback analysis:', error.message);
    // Simple fallback analysis based on score
    const percentage = (correctAnswers / assessment.totalQuestions) * 100;
    let level = 'beginner';
    if (percentage >= 80) level = 'advanced';
    else if (percentage >= 60) level = 'intermediate';
    
    analysisResult = getFallbackAnalysis(level, percentage, language === 'tr');
  }

  // Update assessment
  await storage.updateLevelAssessment(assessmentId, {
    correctAnswers,
    timeSpentMinutes: Math.round(totalTimeSpent / 60),
    finalLevel: analysisResult.finalLevel,
    confidenceScore: analysisResult.confidenceScore,
    recommendedNextSteps: analysisResult.recommendedNextSteps, // Array will be properly converted to JSONB
    status: 'completed',
    completedAt: new Date()
  });

  // Update or create user skill level
  await storage.updateUserSkillLevel(assessment.userId, {
    userId: assessment.userId,
    subject: assessment.subject,
    subCategory: assessment.subCategory,
    currentLevel: analysisResult.finalLevel,
    proficiencyScore: Math.round((correctAnswers / assessment.totalQuestions) * 100),
    lastAssessmentId: assessmentId,
    strongAreas: analysisResult.strongAreas,
    weakAreas: analysisResult.weakAreas,
    nextRecommendedLevel: getNextLevel(analysisResult.finalLevel)
  });

  return analysisResult;
}

function getNextLevel(currentLevel: string): string {
  switch (currentLevel) {
    case 'beginner': return 'intermediate';
    case 'intermediate': return 'advanced';
    case 'advanced': return 'expert';
    default: return 'intermediate';
  }
}

function getFallbackQuestions(subject: string, count: number, isTurkish: boolean): AssessmentQuestionData[] {
  const questionBanks = getSubjectQuestionBank(subject.toLowerCase(), isTurkish);
  
  if (questionBanks.length === 0) {
    // Generic fallback if subject not found
    return getGenericQuestions(subject, count, isTurkish);
  }

  const questions = [];
  const questionsPerLevel = Math.ceil(count / 3);
  
  // Get questions from each difficulty level
  ['beginner', 'intermediate', 'advanced'].forEach((difficulty, levelIndex) => {
    const levelQuestions = questionBanks.filter(q => q.difficulty === difficulty);
    const questionsNeeded = Math.min(questionsPerLevel, levelQuestions.length);
    
    for (let i = 0; i < questionsNeeded && questions.length < count; i++) {
      questions.push(levelQuestions[i % levelQuestions.length]);
    }
  });

  // Fill remaining slots if needed
  while (questions.length < count) {
    const randomQuestion: AssessmentQuestionData = questionBanks[questions.length % questionBanks.length];
    questions.push(randomQuestion);
  }
  
  return questions.slice(0, count);
}

function getSubjectQuestionBank(subject: string, isTurkish: boolean): AssessmentQuestionData[] {
  const questionBanks: { [key: string]: AssessmentQuestionData[] } = {};

  if (isTurkish) {
    questionBanks['mathematics'] = [
      {
        questionText: '2x + 5 = 15 denkleminde x değeri nedir?',
        questionType: 'multiple_choice',
        options: ['x = 5', 'x = 10', 'x = 7', 'x = 2'],
        correctAnswer: 'x = 5',
        difficulty: 'beginner',
        skillArea: 'Doğrusal Denklemler',
        explanation: '2x + 5 = 15 → 2x = 10 → x = 5'
      },
      {
        questionText: 'f(x) = 2x² - 3x + 1 fonksiyonunda f(2) değeri nedir?',
        questionType: 'multiple_choice',
        options: ['3', '5', '7', '9'],
        correctAnswer: '3',
        difficulty: 'intermediate',
        skillArea: 'Fonksiyonlar',
        explanation: 'f(2) = 2(2)² - 3(2) + 1 = 8 - 6 + 1 = 3'
      },
      {
        questionText: '∫(2x + 3)dx integrali nedir?',
        questionType: 'multiple_choice',
        options: ['x² + 3x + C', '2x² + 3x + C', 'x² + 3x', '2x + 3'],
        correctAnswer: 'x² + 3x + C',
        difficulty: 'advanced',
        skillArea: 'İntegral',
        explanation: '∫(2x + 3)dx = x² + 3x + C (sabit eklenir)'
      }
    ];

    questionBanks['programming'] = [
      {
        questionText: 'JavaScript\'te değişken tanımlamak için hangi anahtar kelime kullanılır?',
        questionType: 'multiple_choice',
        options: ['var', 'let', 'const', 'Hepsi'],
        correctAnswer: 'Hepsi',
        difficulty: 'beginner',
        skillArea: 'Değişkenler',
        explanation: 'JavaScript\'te var, let ve const ile değişken tanımlanır'
      },
      {
        questionText: 'Array.map() metodunun amacı nedir?',
        questionType: 'multiple_choice',
        options: ['Dizi elemanlarını filtreler', 'Yeni dizi oluşturur', 'Diziyi sıralar', 'Dizi uzunluğu verir'],
        correctAnswer: 'Yeni dizi oluşturur',
        difficulty: 'intermediate',
        skillArea: 'Array Metodları',
        explanation: 'map() her element için fonksiyon çalıştırıp yeni dizi döndürür'
      },
      {
        questionText: 'Async/await\'in temel amacı nedir?',
        questionType: 'multiple_choice',
        options: ['Senkron kod yazma', 'Asenkron kod yazma', 'Performans artırma', 'Hata yakalama'],
        correctAnswer: 'Asenkron kod yazma',
        difficulty: 'advanced',
        skillArea: 'Asenkron Programlama',
        explanation: 'Async/await asenkron işlemleri senkron gibi yazmayı sağlar'
      }
    ];

    questionBanks['english'] = [
      {
        questionText: '"I ___ to school every day." cümlesindeki boşluğa ne gelmelidir?',
        questionType: 'multiple_choice',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'go',
        difficulty: 'beginner',
        skillArea: 'Basit Şimdiki Zaman',
        explanation: '"I" zamiri ile "go" fiili kullanılır'
      },
      {
        questionText: 'Hangisi doğru passive voice kullanımıdır?',
        questionType: 'multiple_choice',
        options: ['The book reads by me', 'The book is read by me', 'The book read by me', 'The book reading by me'],
        correctAnswer: 'The book is read by me',
        difficulty: 'intermediate',
        skillArea: 'Passive Voice',
        explanation: 'Passive voice: be + past participle formunda yapılır'
      },
      {
        questionText: 'Subjunctive mood\'un kullanım amacı nedir?',
        questionType: 'multiple_choice',
        options: ['Kesin durumlar', 'Varsayımsal durumlar', 'Geçmiş olaylar', 'Gelecek planları'],
        correctAnswer: 'Varsayımsal durumlar',
        difficulty: 'advanced',
        skillArea: 'Advanced Grammar',
        explanation: 'Subjunctive mood varsayımsal, dilek ve öneri ifadelerinde kullanılır'
      }
    ];
  } else {
    questionBanks['mathematics'] = [
      {
        questionText: 'What is the value of x in the equation 2x + 5 = 15?',
        questionType: 'multiple_choice',
        options: ['x = 5', 'x = 10', 'x = 7', 'x = 2'],
        correctAnswer: 'x = 5',
        difficulty: 'beginner',
        skillArea: 'Linear Equations',
        explanation: '2x + 5 = 15 → 2x = 10 → x = 5'
      },
      {
        questionText: 'What is f(2) for the function f(x) = 2x² - 3x + 1?',
        questionType: 'multiple_choice',
        options: ['3', '5', '7', '9'],
        correctAnswer: '3',
        difficulty: 'intermediate',
        skillArea: 'Functions',
        explanation: 'f(2) = 2(2)² - 3(2) + 1 = 8 - 6 + 1 = 3'
      },
      {
        questionText: 'What is the integral of ∫(2x + 3)dx?',
        questionType: 'multiple_choice',
        options: ['x² + 3x + C', '2x² + 3x + C', 'x² + 3x', '2x + 3'],
        correctAnswer: 'x² + 3x + C',
        difficulty: 'advanced',
        skillArea: 'Calculus',
        explanation: '∫(2x + 3)dx = x² + 3x + C (constant of integration)'
      }
    ];

    questionBanks['programming'] = [
      {
        questionText: 'Which keyword is used to declare variables in JavaScript?',
        questionType: 'multiple_choice',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 'All of the above',
        difficulty: 'beginner',
        skillArea: 'Variables',
        explanation: 'JavaScript uses var, let, and const to declare variables'
      },
      {
        questionText: 'What does the Array.map() method do?',
        questionType: 'multiple_choice',
        options: ['Filters array elements', 'Creates a new array', 'Sorts the array', 'Returns array length'],
        correctAnswer: 'Creates a new array',
        difficulty: 'intermediate',
        skillArea: 'Array Methods',
        explanation: 'map() creates a new array by calling a function on each element'
      },
      {
        questionText: 'What is the primary purpose of async/await?',
        questionType: 'multiple_choice',
        options: ['Write synchronous code', 'Handle asynchronous operations', 'Improve performance', 'Error handling'],
        correctAnswer: 'Handle asynchronous operations',
        difficulty: 'advanced',
        skillArea: 'Asynchronous Programming',
        explanation: 'Async/await makes asynchronous code look and behave like synchronous code'
      }
    ];

    questionBanks['english'] = [
      {
        questionText: 'Fill in the blank: "I ___ to school every day."',
        questionType: 'multiple_choice',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'go',
        difficulty: 'beginner',
        skillArea: 'Present Simple',
        explanation: 'First person singular "I" uses the base form "go"'
      },
      {
        questionText: 'Which is the correct passive voice form?',
        questionType: 'multiple_choice',
        options: ['The book reads by me', 'The book is read by me', 'The book read by me', 'The book reading by me'],
        correctAnswer: 'The book is read by me',
        difficulty: 'intermediate',
        skillArea: 'Passive Voice',
        explanation: 'Passive voice follows the pattern: be + past participle'
      },
      {
        questionText: 'What is the subjunctive mood used for?',
        questionType: 'multiple_choice',
        options: ['Definite situations', 'Hypothetical situations', 'Past events', 'Future plans'],
        correctAnswer: 'Hypothetical situations',
        difficulty: 'advanced',
        skillArea: 'Advanced Grammar',
        explanation: 'Subjunctive mood expresses wishes, hypotheticals, and suggestions'
      }
    ];
  }

  // Add algebra-specific questions
  if (subject.includes('algebra')) {
    return questionBanks['mathematics'] || [];
  }
  
  // Add javascript-specific questions  
  if (subject.includes('javascript')) {
    return questionBanks['programming'] || [];
  }

  return questionBanks[subject] || [];
}

function getGenericQuestions(subject: string, count: number, isTurkish: boolean): AssessmentQuestionData[] {
  const baseQuestion = isTurkish ? {
    questionText: `${subject} alanında hangi seviyede olduğunuzu düşünüyorsunuz?`,
    questionType: 'multiple_choice' as const,
    options: ['Başlangıç seviyesi', 'Orta seviye', 'İleri seviye', 'Uzman seviye'],
    correctAnswer: 'Orta seviye',
    difficulty: 'beginner' as const,
    skillArea: 'Genel Değerlendirme',
    explanation: 'Bu kendi değerlendirmenize dayalı bir sorudur'
  } : {
    questionText: `What level do you consider yourself in ${subject}?`,
    questionType: 'multiple_choice' as const,
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    correctAnswer: 'Intermediate',
    difficulty: 'beginner' as const,
    skillArea: 'General Assessment',
    explanation: 'This is based on your self-assessment'
  };

  return Array(count).fill(0).map((_, i) => ({
    ...baseQuestion,
    questionText: baseQuestion.questionText + ` (${i + 1})`
  }));
}

function getFallbackAnalysis(level: string, score: number, isTurkish: boolean): AssessmentResult {
  if (isTurkish) {
    return {
      finalLevel: level as any,
      confidenceScore: Math.round(score),
      recommendedNextSteps: [
        'Güçlü olduğunuz alanları geliştirmeye devam edin',
        'Zayıf alanlarınız için ek çalışma yapın',
        'Düzenli pratik yaparak bilginizi pekiştirin'
      ],
      strongAreas: ['Temel kavramlar'],
      weakAreas: ['İleri konular']
    };
  }
  
  return {
    finalLevel: level as any,
    confidenceScore: Math.round(score),
    recommendedNextSteps: [
      'Continue building on your strong areas',
      'Focus additional study on weak areas',
      'Practice regularly to reinforce knowledge'
    ],
    strongAreas: ['Basic concepts'],
    weakAreas: ['Advanced topics']
  };
}

export { AssessmentQuestionData, AssessmentResult };