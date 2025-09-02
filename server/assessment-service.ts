import OpenAI from "openai";
import { storage } from "./storage";
import type { InsertLevelAssessment, InsertAssessmentQuestion, InsertUserSkillLevel } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Available AI models in priority order
const AI_MODELS = ["gpt-5", "gpt-4", "gpt-3.5-turbo", "gpt-4-turbo-preview", "gpt-3.5-turbo-0125"];

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
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 3000,
      });

      const responseContent = completion.choices[0]?.message?.content;
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
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            { 
              role: "system", 
              content: isTurkish 
                ? "Sen bir uzman eğitim danışmanısın. Değerlendirme sonuçlarını analiz edip öneriler verirsin."
                : "You are an expert educational advisor. You analyze assessment results and provide recommendations."
            },
            { role: "user", content: analysisPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        });

        const responseContent = completion.choices[0]?.message?.content;
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
  const baseQuestions = isTurkish ? [
    {
      questionText: `${subject} alanında temel kavramları anlıyor musunuz?`,
      questionType: 'multiple_choice' as const,
      options: ['Evet, çok iyi', 'Kısmen', 'Hayır, yeni başlıyorum', 'Emin değilim'],
      correctAnswer: 'Evet, çok iyi',
      difficulty: 'beginner' as const,
      skillArea: 'Temel Kavramlar',
      explanation: 'Temel kavramları anlamak öğrenmenin ilk adımıdır'
    }
  ] : [
    {
      questionText: `Do you understand the basic concepts in ${subject}?`,
      questionType: 'multiple_choice' as const,
      options: ['Yes, very well', 'Somewhat', 'No, I\'m just starting', 'Not sure'],
      correctAnswer: 'Yes, very well',
      difficulty: 'beginner' as const,
      skillArea: 'Basic Concepts',
      explanation: 'Understanding basic concepts is the first step in learning'
    }
  ];

  // Repeat the pattern to reach the desired count
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      ...baseQuestions[0],
      questionText: baseQuestions[0].questionText + ` (${i + 1})`
    });
  }
  
  return questions;
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