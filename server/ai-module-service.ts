import Anthropic from '@anthropic-ai/sdk';
import { storage } from './storage';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIEnhancedLesson {
  id: number;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  progress: number;
  aiContext: {
    personalizedIntro: string;
    learningObjectives: string[];
    adaptedContent: string;
    practiceExercises: string[];
    nextSteps: string[];
    difficultyReason: string;
  };
  tags: string[];
}

export interface AIEnhancedModule {
  id: number;
  title: string;
  description: string;
  progress: number;
  lessons: AIEnhancedLesson[];
  aiContext: {
    moduleOverview: string;
    learningPath: string;
    personalizedTips: string[];
    prerequisiteCheck: string;
  };
}

/**
 * Generates AI-enhanced modules with personalized content for each lesson
 */
export async function generateAIEnhancedModules(courseId: number, userId: number, language: string = 'en'): Promise<AIEnhancedModule[]> {
  try {
    // Get user profile and learning preferences
    const user = await storage.getUser(userId);
    const userLevel = await storage.getUserLevel(userId);
    const userCourses = await storage.getUserCourses(userId);
    
    // Get modules and lessons for the course
    const modules = await storage.getModules(courseId);
    const course = await storage.getCourse(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    const courseTitle = language === 'tr' ? (course.titleTr || course.title) : (course.titleEn || course.title);
    console.log(`Course "${courseTitle}" has ${modules.length} modules`);

    // If no modules exist, generate fallback modules immediately
    if (modules.length === 0) {
      console.log('No modules found, generating fallback modules');
      return generateFallbackModules(courseId, userId, language);
    }

    const enhancedModules: AIEnhancedModule[] = [];

    for (const module of modules) {
      const lessons = await storage.getLessons(module.id);
      const userLessons = await storage.getUserLessons(userId);
      
      // Generate AI context for the module
      const moduleAIContext = await generateModuleAIContext(module, course, user, userLevel);
      
      const enhancedLessons: AIEnhancedLesson[] = [];
      
      for (const lesson of lessons) {
        // Find user progress for this lesson
        const userLesson = userLessons.find(ul => ul.lesson?.id === lesson.id);
        const progress = userLesson?.progress || 0;
        
        // Generate personalized AI content for each lesson
        const aiContext = await generateLessonAIContext(lesson, module, course, user, userLevel, progress);
        
        const lessonDescription = language === 'tr' ? (lesson.descriptionTr || lesson.description) : (lesson.descriptionEn || lesson.description);
        const lessonTitle = language === 'tr' ? (lesson.titleTr || lesson.title) : (lesson.titleEn || lesson.title);
        const lessonContent = language === 'tr' ? (lesson.contentTr || lesson.content) : (lesson.contentEn || lesson.content);
        
        enhancedLessons.push({
          id: lesson.id,
          title: lessonTitle,
          description: lessonDescription,
          content: lessonContent,
          difficulty: determineLessonDifficulty(lesson, userLevel),
          estimatedTime: lesson.estimatedTime || 30,
          progress,
          aiContext,
          tags: lesson.tags || []
        });
      }
      
      // Calculate module progress
      const moduleProgress = enhancedLessons.length > 0 
        ? Math.round(enhancedLessons.reduce((sum, l) => sum + l.progress, 0) / enhancedLessons.length)
        : 0;
      
      const moduleDescription = language === 'tr' ? (module.descriptionTr || module.description) : (module.descriptionEn || module.description);
      const moduleTitle = language === 'tr' ? (module.titleTr || module.title) : (module.titleEn || module.title);
      
      enhancedModules.push({
        id: module.id,
        title: moduleTitle,
        description: moduleDescription,
        progress: moduleProgress,
        lessons: enhancedLessons,
        aiContext: moduleAIContext
      });
    }

    return enhancedModules;
    
  } catch (error) {
    console.error('Error generating AI-enhanced modules:', error);
    
    // Return fallback modules without AI enhancement
    return generateFallbackModules(courseId, userId, language);
  }
}

async function generateModuleAIContext(module: any, course: any, user: any, userLevel: any) {
  try {
    const moduleTitle = module.titleEn || module.title;
    const moduleDesc = module.descriptionEn || module.description;
    const courseTitle = course.titleEn || course.title;
    
    const prompt = `
You are an AI learning assistant. Generate personalized module context for:

Module: "${moduleTitle}"
Description: "${moduleDesc}"
Course: "${courseTitle}"
Student Level: ${userLevel?.level || 1}
Student XP: ${userLevel?.totalXp || 0}

Generate a JSON response with:
{
  "moduleOverview": "Personalized overview explaining what the student will learn",
  "learningPath": "How this module fits into their learning journey", 
  "personalizedTips": ["3 specific tips for this student"],
  "prerequisiteCheck": "What the student should know before starting"
}

Make it encouraging and specific to their level.
`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiResponse = JSON.parse(response.content[0].text);
    return aiResponse;
    
  } catch (error) {
    console.error('Error generating module AI context:', error);
    const moduleTitle = module.titleEn || module.title;
    return {
      moduleOverview: `This module covers ${moduleTitle} concepts to build your understanding.`,
      learningPath: "This module is designed to advance your skills step by step.",
      personalizedTips: [
        "Take notes while learning",
        "Practice regularly",
        "Ask questions when confused"
      ],
      prerequisiteCheck: "Basic understanding of previous concepts recommended."
    };
  }
}

async function generateLessonAIContext(lesson: any, module: any, course: any, user: any, userLevel: any, progress: number) {
  try {
    const prompt = `
You are an AI learning assistant. Generate personalized lesson content for:

Lesson: "${lesson.title}"
Module: "${module.title}"
Course: "${course.title}"
Student Level: ${userLevel?.level || 1}
Student Progress: ${progress}%

Generate a JSON response with:
{
  "personalizedIntro": "Engaging intro personalized for this student",
  "learningObjectives": ["3-4 specific learning objectives"],
  "adaptedContent": "Content explanation adapted to their level",
  "practiceExercises": ["3-4 practice exercises"],
  "nextSteps": ["2-3 recommended next steps"],
  "difficultyReason": "Why this difficulty level was chosen"
}

Adapt the content based on their current level and progress.
`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiResponse = JSON.parse(response.content[0].text);
    return aiResponse;
    
  } catch (error) {
    console.error('Error generating lesson AI context:', error);
    return {
      personalizedIntro: `Welcome to ${lesson.title}! Let's explore this topic together.`,
      learningObjectives: [
        `Understand the core concepts of ${lesson.title}`,
        "Apply knowledge through practical examples",
        "Build confidence in the subject matter"
      ],
      adaptedContent: `This lesson covers ${lesson.title} with clear explanations and examples.`,
      practiceExercises: [
        "Review the key concepts",
        "Complete practice problems", 
        "Test your understanding"
      ],
      nextSteps: [
        "Move to the next lesson",
        "Practice more examples"
      ],
      difficultyReason: "Difficulty adjusted based on your current learning level."
    };
  }
}

function determineLessonDifficulty(lesson: any, userLevel: any): 'beginner' | 'intermediate' | 'advanced' {
  const level = userLevel?.level || 1;
  
  if (level <= 2) return 'beginner';
  if (level <= 5) return 'intermediate';
  return 'advanced';
}

async function generateFallbackModules(courseId: number, userId: number, language: string = 'en'): Promise<AIEnhancedModule[]> {
  try {
    const modules = await storage.getModules(courseId);
    const course = await storage.getCourse(courseId);
    
    // If no modules exist at all, create sample modules for the course
    if (modules.length === 0 && course) {
      const courseTitle = language === 'tr' ? (course.titleTr || course.title) : (course.titleEn || course.title);
      console.log(`Creating sample modules for course: ${courseTitle} in language: ${language}`);
      return generateSampleModules(course, userId, language);
    }
    
    // Skip user lessons query temporarily due to schema issues
    const userLessons: any[] = [];
    
    const fallbackModules: AIEnhancedModule[] = [];
    
    for (const module of modules) {
      const lessons = await storage.getLessons(module.id);
      
      const enhancedLessons: AIEnhancedLesson[] = lessons.map((lesson, index) => {
        const userLesson = userLessons.find(ul => ul.lesson?.id === lesson.id);
        const progress = userLesson?.progress || 0;
        
        const lessonTitle = language === 'tr' ? (lesson.titleTr || lesson.title) : (lesson.titleEn || lesson.title);
        const lessonDesc = language === 'tr' ? (lesson.descriptionTr || lesson.description) : (lesson.descriptionEn || lesson.description);
        const lessonContent = language === 'tr' ? (lesson.contentTr || lesson.content) : (lesson.contentEn || lesson.content);
        
        return {
          id: lesson.id,
          title: lessonTitle,
          description: lessonDesc,
          content: lessonContent,
          difficulty: 'intermediate',
          estimatedTime: lesson.estimatedTime || 30,
          progress,
          aiContext: {
            personalizedIntro: `Welcome to ${lessonTitle}! This lesson will help you master key concepts.`,
            learningObjectives: [
              `Understand ${lessonTitle} fundamentals`,
              "Apply concepts in practical scenarios",
              "Build confidence in the subject"
            ],
            adaptedContent: `This lesson provides comprehensive coverage of ${lessonTitle}.`,
            practiceExercises: [
              "Review core concepts",
              "Complete practice exercises",
              "Take the quiz"
            ],
            nextSteps: [
              "Proceed to next lesson",
              "Practice additional problems"
            ],
            difficultyReason: "Standard difficulty level for comprehensive learning."
          },
          tags: lesson.tags || []
        };
      });
      
      const moduleProgress = enhancedLessons.length > 0 
        ? Math.round(enhancedLessons.reduce((sum, l) => sum + l.progress, 0) / enhancedLessons.length)
        : 0;
      
      const moduleTitle = language === 'tr' ? (module.titleTr || module.title) : (module.titleEn || module.title);
      const moduleDesc = language === 'tr' ? (module.descriptionTr || module.description) : (module.descriptionEn || module.description);
      
      fallbackModules.push({
        id: module.id,
        title: moduleTitle,
        description: moduleDesc,
        progress: moduleProgress,
        lessons: enhancedLessons,
        aiContext: {
          moduleOverview: `This module covers ${moduleTitle} to advance your learning.`,
          learningPath: "Each lesson builds upon previous knowledge systematically.",
          personalizedTips: [
            "Take your time with each concept",
            "Practice regularly for best results",
            "Don't hesitate to review previous lessons"
          ],
          prerequisiteCheck: "Basic understanding of previous modules recommended."
        }
      });
    }
    
    return fallbackModules;
    
  } catch (error) {
    console.error('Error generating fallback modules:', error);
    return [];
  }
}

// Generate sample modules when none exist in the database
async function generateSampleModules(course: any, userId: number, language: string = 'en'): Promise<AIEnhancedModule[]> {
  const sampleModules: AIEnhancedModule[] = [];
  
  // Create sample modules based on course title/category
  const moduleTemplates = getModuleTemplatesForCourse(course, language);
  
  for (let i = 0; i < moduleTemplates.length; i++) {
    const template = moduleTemplates[i];
    
    const sampleLessons: AIEnhancedLesson[] = template.lessons.map((lessonTitle, lessonIndex) => {
      const isTurkish = language === 'tr';
      return {
        id: (i + 1) * 1000 + lessonIndex + 1, // Generate unique IDs
        title: lessonTitle,
        description: isTurkish 
          ? `${lessonTitle} konusunu bu kapsamlı derste öğrenin.`
          : `Learn about ${lessonTitle} in this comprehensive lesson.`,
        content: isTurkish 
          ? `Bu ders ${lessonTitle} konusunu detaylı açıklamalar ve örneklerle kapsar.`
          : `This lesson covers ${lessonTitle} with detailed explanations and examples.`,
        difficulty: 'intermediate' as const,
        estimatedTime: 45,
        progress: Math.floor(Math.random() * 30), // Random progress 0-30%
        aiContext: {
          personalizedIntro: isTurkish 
            ? `${lessonTitle} dersine hoş geldiniz! Bu ders bu kavramları etkili bir şekilde kavramanıza yardımcı olmak için özelleştirilmiştir.`
            : `Welcome to ${lessonTitle}! This lesson is tailored to help you master these concepts effectively.`,
          learningObjectives: isTurkish 
            ? [
                `${lessonTitle} temellerini anlayın`,
                `${lessonTitle} kavramlarını pratik senaryolarda uygulayın`,
                `${lessonTitle} ile problem çözmede güven kazanın`
              ]
            : [
                `Understand the fundamentals of ${lessonTitle}`,
                `Apply ${lessonTitle} concepts in practical scenarios`,
                `Build confidence in problem-solving with ${lessonTitle}`
              ],
          adaptedContent: isTurkish 
            ? `Bu ders ${lessonTitle} konusunu gerçek dünya örnekleri ve adım adım rehberlik ile kapsamlı olarak ele alır.`
            : `This lesson provides comprehensive coverage of ${lessonTitle} with real-world examples and step-by-step guidance.`,
          practiceExercises: isTurkish 
            ? [
                `${lessonTitle} pratik problemlerini çözün`,
                `Rehberli örnekler üzerinde çalışın`,
                `Kavram testini yapın`
              ]
            : [
                `Complete ${lessonTitle} practice problems`,
                `Work through guided examples`,
                `Take the concept quiz`
              ],
          nextSteps: isTurkish 
            ? [
                `${lessonTitle} anahtar kavramlarını gözden geçirin`,
                `Ek problemler üzerinde çalışın`,
                `Sonraki derse hazırlanın`
              ]
            : [
                `Review key concepts from ${lessonTitle}`,
                `Practice additional problems`,
                `Prepare for the next lesson`
              ],
          difficultyReason: isTurkish 
            ? `${lessonTitle} konusunun kapsamlı anlaşılması için içerik orta seviyeye ayarlanmıştır.`
            : `Content adjusted to intermediate level for comprehensive understanding of ${lessonTitle}.`
        },
        tags: isTurkish ? ['fizik', 'ayt', 'sınav-hazırlık'] : ['physics', 'ayt', 'exam-prep']
      };
    });
    
    const isTurkish = language === 'tr';
    sampleModules.push({
      id: i + 1,
      title: template.title,
      description: template.description,
      progress: Math.floor(Math.random() * 25), // Random progress 0-25%
      lessons: sampleLessons,
      aiContext: {
        moduleOverview: isTurkish 
          ? `Bu modül ${template.title} üzerine odaklanarak yapılandırılmış dersler ve pratik uygulamalar yoluyla kapsamlı anlayış sağlar.`
          : `This module focuses on ${template.title}, providing comprehensive understanding through structured lessons and practical applications.`,
        learningPath: isTurkish 
          ? `Bu modüldeki her ders sistematik olarak ilerler, temel kavramlardan başlayarak ${template.title} konusunda ileri uygulamalara doğru gelişir.`
          : `Each lesson in this module builds systematically, starting with basic concepts and progressing to advanced applications in ${template.title}.`,
        personalizedTips: isTurkish 
          ? [
              `${template.title} temel ilkelerini anlamaya odaklanın`,
              `Sağlanan alıştırmalarla düzenli pratik yapın`,
              `Kavramları gerçek dünya uygulamalarıyla ilişkilendirin`
            ]
          : [
              `Focus on understanding core principles of ${template.title}`,
              `Practice regularly with the provided exercises`,
              `Connect concepts to real-world applications`
            ],
        prerequisiteCheck: isTurkish 
          ? `${template.title} için temel matematik kavramları ve önceki fizik bilgisi önerilir.`
          : `Basic mathematical concepts and previous physics knowledge recommended for ${template.title}.`
      }
    });
  }
  
  return sampleModules;
}

function getModuleTemplatesForCourse(course: any, language: string = 'en') {
  // Generate appropriate modules based on course title and category
  if (course.title.toLowerCase().includes('physics') || course.title.toLowerCase().includes('fizik')) {
    if (language === 'tr') {
      return [
        {
          title: 'Mekanik ve Hareket',
          description: 'Hareket, kuvvet ve enerji temel kavramları',
          lessons: [
            'Kinematik ve Hareket Grafikleri',
            'Newton\'un Hareket Yasaları',
            'İş, Enerji ve Güç',
            'Momentum ve Çarpışmalar'
          ]
        },
        {
          title: 'Termodinamik',
          description: 'Isı, sıcaklık ve termal süreçler',
          lessons: [
            'Sıcaklık ve Isı Transferi',
            'Termodinamiğin Yasaları',
            'İdeal Gaz Davranışı',
            'Isı Makineleri ve Verimlilik'
          ]
        },
        {
          title: 'Dalgalar ve Optik',
          description: 'Dalga özellikleri, ses ve ışık olayları',
          lessons: [
            'Dalga Özellikleri ve Türleri',
            'Ses Dalgaları ve Akustik',
            'Işık ve Geometrik Optik',
            'Dalga Girişimi ve Kırınım'
          ]
        }
      ];
    } else {
      return [
        {
          title: 'Mechanics and Motion',
          description: 'Fundamental concepts of motion, forces, and energy',
          lessons: [
            'Kinematics and Motion Graphs',
            'Newton\'s Laws of Motion',
            'Work, Energy, and Power',
            'Momentum and Collisions'
          ]
        },
        {
          title: 'Thermodynamics',
          description: 'Heat, temperature, and thermal processes',
          lessons: [
            'Temperature and Heat Transfer',
            'Laws of Thermodynamics',
            'Ideal Gas Behavior',
            'Heat Engines and Efficiency'
          ]
        },
        {
          title: 'Waves and Optics',
          description: 'Wave properties, sound, and light phenomena',
          lessons: [
            'Wave Properties and Types',
            'Sound Waves and Acoustics',
            'Light and Geometric Optics',
            'Wave Interference and Diffraction'
          ]
        }
      ];
    }
  } else if (course.title.toLowerCase().includes('mathematics') || course.title.toLowerCase().includes('matematik')) {
    if (language === 'tr') {
      return [
        {
          title: 'Fonksiyonlar ve Grafikler',
          description: 'Matematiksel fonksiyonların anlaşılması ve gösterimleri',
          lessons: [
            'Doğrusal ve Kuadratik Fonksiyonlar',
            'Üstel ve Logaritmik Fonksiyonlar',
            'Trigonometrik Fonksiyonlar',
            'Fonksiyon Dönüşümleri'
          ]
        },
        {
          title: 'Kalkülüs Temelleri',
          description: 'Diferansiyel ve integral kalkülüse giriş',
          lessons: [
            'Limitler ve Süreklilik',
            'Türevler ve Uygulamaları',
            'İntegral Teknikleri',
            'Kalkülüs Uygulamaları'
          ]
        }
      ];
    } else {
      return [
        {
          title: 'Functions and Graphs',
          description: 'Understanding mathematical functions and their representations',
          lessons: [
            'Linear and Quadratic Functions',
            'Exponential and Logarithmic Functions',
            'Trigonometric Functions',
            'Function Transformations'
          ]
        },
        {
          title: 'Calculus Fundamentals',
          description: 'Introduction to differential and integral calculus',
          lessons: [
            'Limits and Continuity',
            'Derivatives and Applications',
            'Integration Techniques',
            'Applications of Calculus'
          ]
        }
      ];
    }
  } else {
    // Generic modules for other courses
    if (language === 'tr') {
      return [
        {
          title: 'Temel Kavramlar',
          description: 'Temel bilgi ve esaslar',
          lessons: [
            'Anahtar Kavramlara Giriş',
            'Temel İlkeler ve Teori',
            'Temel Uygulamalar',
            'Bilgi Tabanı Oluşturma'
          ]
        },
        {
          title: 'Pratik Uygulamalar',
          description: 'Kavramların gerçek dünya senaryolarında uygulanması',
          lessons: [
            'Gerçek Dünya Problem Çözme',
            'Vaka Çalışmaları ve Örnekler',
            'Uygulamalı Pratik',
            'İleri Uygulamalar'
          ]
        }
      ];
    } else {
      return [
        {
          title: 'Foundation Concepts',
          description: 'Essential background knowledge and fundamentals',
          lessons: [
            'Introduction to Key Concepts',
            'Basic Principles and Theory',
            'Fundamental Applications',
            'Building Your Knowledge Base'
          ]
        },
        {
          title: 'Practical Applications',
          description: 'Applying concepts to real-world scenarios',
          lessons: [
            'Real-World Problem Solving',
            'Case Studies and Examples',
            'Hands-On Practice',
            'Advanced Applications'
          ]
        }
      ];
    }
  }
}