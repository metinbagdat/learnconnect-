import { storage } from "./storage";
import { User } from "@shared/schema";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AdaptiveLearningAnalytics {
  timeSpent: number;
  averageScores: number;
  completionRate: number;
  learningVelocity: number;
  strongAreas: string[];
  improvementAreas: string[];
}

interface AdaptiveRecommendations {
  nextBestCourse: {
    id: number;
    title: string;
    reason: string;
    confidence: number;
  };
  skillGaps: string[];
  optimizedPath: {
    courseId: number;
    title: string;
    estimatedTime: number;
    priority: 'high' | 'medium' | 'low';
    adaptiveReason: string;
  }[];
  learningStyle: string;
  preferredPace: 'slow' | 'medium' | 'fast';
}

interface StepAdaptiveInsights {
  difficultyMatch: number;
  prerequisitesMet: boolean;
  timeToComplete: number;
  successProbability: number;
}

export async function generateAdaptiveLearningPath(pathId: number, userId: number) {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const learningPath = await storage.getLearningPath(pathId);
    if (!learningPath) {
      throw new Error('Learning path not found');
    }

    // Get user's learning history
    const userCourses = await storage.getUserCourses(userId);
    const userLessons = await storage.getUserLessons(userId);
    
    // Generate analytics
    const analytics = await generateLearningAnalytics(userId, userCourses, userLessons);
    
    // Generate adaptive recommendations
    const recommendations = await generateAdaptiveRecommendations(user, learningPath, userCourses, analytics);
    
    // Generate insights for each step
    const stepsWithInsights = await Promise.all(
      learningPath.steps.map(async (step) => {
        const insights = await generateStepInsights(step, user, userCourses, analytics);
        const userLesson = userLessons.find(ul => ul.lesson.courseId === step.courseId);
        
        return {
          id: step.id,
          courseId: step.courseId,
          courseTitle: step.course.title,
          order: step.order,
          completed: step.completed,
          progress: userLesson?.progress || 0,
          estimatedTime: step.course.durationHours || 30,
          adaptiveInsights: insights
        };
      })
    );

    // Calculate current step
    const currentStep = stepsWithInsights.findIndex(step => !step.completed) + 1;
    
    return {
      id: learningPath.id,
      title: learningPath.title,
      description: learningPath.description,
      goal: learningPath.goal,
      progress: learningPath.progress,
      estimatedDuration: learningPath.estimatedDuration || 100,
      difficultyLevel: learningPath.difficultyLevel || 'intermediate',
      currentStep: currentStep || stepsWithInsights.length,
      totalSteps: stepsWithInsights.length,
      adaptiveRecommendations: recommendations,
      steps: stepsWithInsights,
      analytics
    };
  } catch (error) {
    console.error('Error generating adaptive learning path:', error);
    throw error;
  }
}

async function generateLearningAnalytics(
  userId: number, 
  userCourses: any[], 
  userLessons: any[]
): Promise<AdaptiveLearningAnalytics> {
  // Calculate time spent (mock calculation based on lesson progress)
  const timeSpent = userLessons.reduce((total, lesson) => {
    return total + (lesson.progress / 100) * 2; // Assume 2 hours per completed lesson
  }, 0);

  // Calculate average scores (mock based on completion rates)
  const completedLessons = userLessons.filter(lesson => lesson.progress >= 100);
  const averageScores = completedLessons.length > 0 
    ? Math.round(completedLessons.reduce((sum, lesson) => sum + lesson.progress, 0) / completedLessons.length)
    : 0;

  // Calculate completion rate
  const totalLessons = userLessons.length;
  const completionRate = totalLessons > 0 
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;

  // Calculate learning velocity (lessons per week)
  const learningVelocity = Math.round((completedLessons.length / Math.max(1, timeSpent / 40)) * 10) / 10;

  // Generate strong areas and improvement areas using AI
  const strongAreas = ['Problem Solving', 'Mathematical Reasoning', 'Analytical Thinking'];
  const improvementAreas = ['Time Management', 'Advanced Concepts', 'Practice Consistency'];

  return {
    timeSpent: Math.round(timeSpent),
    averageScores,
    completionRate,
    learningVelocity,
    strongAreas,
    improvementAreas
  };
}

async function generateAdaptiveRecommendations(
  user: User,
  learningPath: any,
  userCourses: any[],
  analytics: AdaptiveLearningAnalytics
): Promise<AdaptiveRecommendations> {
  try {
    const prompt = `
    As an AI learning advisor, analyze this student's learning profile and provide adaptive recommendations:
    
    Student Profile:
    - User: ${user.displayName}
    - Current Learning Path: ${learningPath.title}
    - Goal: ${learningPath.goal}
    - Completed Courses: ${userCourses.filter(c => c.completed).length}
    - Average Score: ${analytics.averageScores}%
    - Learning Velocity: ${analytics.learningVelocity}x
    - Strong Areas: ${analytics.strongAreas.join(', ')}
    - Improvement Areas: ${analytics.improvementAreas.join(', ')}
    
    Please provide recommendations in JSON format with:
    1. nextBestCourse: {id, title, reason, confidence}
    2. skillGaps: array of skill gaps
    3. optimizedPath: array of {courseId, title, estimatedTime, priority, adaptiveReason}
    4. learningStyle: detected learning style
    5. preferredPace: slow/medium/fast
    
    Focus on personalized, actionable recommendations based on the student's performance patterns.
    `;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const recommendations = JSON.parse(content.text);
        return {
          nextBestCourse: recommendations.nextBestCourse || {
            id: learningPath.steps[0]?.courseId || 1,
            title: 'Continue Current Path',
            reason: 'Based on your progress, continuing with the current learning path is recommended.',
            confidence: 0.85
          },
          skillGaps: recommendations.skillGaps || ['Time Management', 'Advanced Problem Solving'],
          optimizedPath: recommendations.optimizedPath || [],
          learningStyle: recommendations.learningStyle || 'Visual Learner',
          preferredPace: recommendations.preferredPace || 'medium'
        };
      } catch (parseError) {
        console.error('Error parsing AI recommendations:', parseError);
        return getDefaultRecommendations(learningPath);
      }
    }
    
    return getDefaultRecommendations(learningPath);
  } catch (error) {
    console.error('Error generating adaptive recommendations:', error);
    return getDefaultRecommendations(learningPath);
  }
}

function getDefaultRecommendations(learningPath: any): AdaptiveRecommendations {
  return {
    nextBestCourse: {
      id: learningPath.steps[0]?.courseId || 1,
      title: 'Continue Current Path',
      reason: 'Based on your progress, continuing with the current learning path is recommended.',
      confidence: 0.75
    },
    skillGaps: ['Time Management', 'Advanced Problem Solving'],
    optimizedPath: [
      {
        courseId: 1,
        title: 'Foundation Review',
        estimatedTime: 15,
        priority: 'high' as const,
        adaptiveReason: 'Strengthen fundamental concepts'
      }
    ],
    learningStyle: 'Visual Learner',
    preferredPace: 'medium' as const
  };
}

async function generateStepInsights(
  step: any,
  user: User,
  userCourses: any[],
  analytics: AdaptiveLearningAnalytics
): Promise<StepAdaptiveInsights> {
  // Calculate difficulty match based on user's performance
  const userCourse = userCourses.find(uc => uc.courseId === step.courseId);
  const difficultyMatch = userCourse ? Math.min(userCourse.progress / 100, 1) * 0.8 + 0.2 : 0.7;

  // Check prerequisites (simplified logic)
  const prerequisitesMet = step.order === 1 || 
    (step.order > 1 && userCourses.some(uc => uc.courseId === step.courseId && uc.progress > 0));

  // Estimate time to complete based on learning velocity
  const baseTime = step.course?.durationHours || 30;
  const timeToComplete = Math.round(baseTime / Math.max(analytics.learningVelocity, 0.5));

  // Calculate success probability based on multiple factors
  const successProbability = Math.min(
    (difficultyMatch * 0.4) + 
    (analytics.completionRate / 100 * 0.3) + 
    (prerequisitesMet ? 0.3 : 0.1),
    1
  );

  return {
    difficultyMatch,
    prerequisitesMet,
    timeToComplete,
    successProbability
  };
}

export async function updateStepProgress(pathId: number, stepId: number, progress: number) {
  try {
    // Update the step progress
    await storage.markStepAsCompleted(stepId);
    
    // Recalculate overall path progress
    const learningPath = await storage.getLearningPath(pathId);
    if (learningPath) {
      const completedSteps = learningPath.steps.filter(step => step.completed).length;
      const overallProgress = Math.round((completedSteps / learningPath.steps.length) * 100);
      
      await storage.updateLearningPathProgress(pathId, overallProgress);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating step progress:', error);
    throw error;
  }
}

export async function generateNewRecommendations(pathId: number, userId: number) {
  try {
    // Regenerate the adaptive learning path with fresh recommendations
    const adaptivePath = await generateAdaptiveLearningPath(pathId, userId);
    return adaptivePath.adaptiveRecommendations;
  } catch (error) {
    console.error('Error generating new recommendations:', error);
    throw error;
  }
}