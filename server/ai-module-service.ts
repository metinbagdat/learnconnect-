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
export async function generateAIEnhancedModules(courseId: number, userId: number): Promise<AIEnhancedModule[]> {
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

    const enhancedModules: AIEnhancedModule[] = [];

    for (const module of modules) {
      const lessons = await storage.getLessons(module.id);
      const userLessons = await storage.getUserLessons(userId);
      
      // Generate AI context for the module
      const moduleAIContext = await generateModuleAIContext(module, course, user, userLevel);
      
      const enhancedLessons: AIEnhancedLesson[] = [];
      
      for (const lesson of lessons) {
        // Find user progress for this lesson
        const userLesson = userLessons.find(ul => ul.lesson.id === lesson.id);
        const progress = userLesson?.progress || 0;
        
        // Generate personalized AI content for each lesson
        const aiContext = await generateLessonAIContext(lesson, module, course, user, userLevel, progress);
        
        enhancedLessons.push({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
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
      
      enhancedModules.push({
        id: module.id,
        title: module.title,
        description: module.description,
        progress: moduleProgress,
        lessons: enhancedLessons,
        aiContext: moduleAIContext
      });
    }

    return enhancedModules;
    
  } catch (error) {
    console.error('Error generating AI-enhanced modules:', error);
    
    // Return fallback modules without AI enhancement
    return generateFallbackModules(courseId, userId);
  }
}

async function generateModuleAIContext(module: any, course: any, user: any, userLevel: any) {
  try {
    const prompt = `
You are an AI learning assistant. Generate personalized module context for:

Module: "${module.title}"
Description: "${module.description}"
Course: "${course.title}"
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
    return {
      moduleOverview: `This module covers ${module.title} concepts to build your understanding.`,
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

async function generateFallbackModules(courseId: number, userId: number): Promise<AIEnhancedModule[]> {
  try {
    const modules = await storage.getModules(courseId);
    const userLessons = await storage.getUserLessons(userId);
    
    const fallbackModules: AIEnhancedModule[] = [];
    
    for (const module of modules) {
      const lessons = await storage.getLessons(module.id);
      
      const enhancedLessons: AIEnhancedLesson[] = lessons.map((lesson, index) => {
        const userLesson = userLessons.find(ul => ul.lesson.id === lesson.id);
        const progress = userLesson?.progress || 0;
        
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          difficulty: 'intermediate',
          estimatedTime: lesson.estimatedTime || 30,
          progress,
          aiContext: {
            personalizedIntro: `Welcome to ${lesson.title}! This lesson will help you master key concepts.`,
            learningObjectives: [
              `Understand ${lesson.title} fundamentals`,
              "Apply concepts in practical scenarios",
              "Build confidence in the subject"
            ],
            adaptedContent: `This lesson provides comprehensive coverage of ${lesson.title}.`,
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
      
      fallbackModules.push({
        id: module.id,
        title: module.title,
        description: module.description,
        progress: moduleProgress,
        lessons: enhancedLessons,
        aiContext: {
          moduleOverview: `This module covers ${module.title} to advance your learning.`,
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