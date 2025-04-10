import OpenAI from "openai";
import { Course, insertCourseSchema } from "@shared/schema";
import { z } from "zod";
import { storage } from "./storage";

// Define InsertCourse type from the schema
type InsertCourse = z.infer<typeof insertCourseSchema>;

// Initialize the OpenAI client
// Use gpt-3.5-turbo model which is widely available with most API keys
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Course generation prompts
const COURSE_GENERATION_SYSTEM_PROMPT = `
You are an expert educational content creator specialized in developing comprehensive course outlines. 
Your task is to create a structured course with detailed modules based on the topic provided.
The output should be in JSON format and should include:
- title: A concise and engaging course title
- description: A detailed overview of what the course covers (150-200 words)
- category: The main category the course belongs to (Programming, Design, Business, etc.)
- moduleCount: The number of modules (between 5-12)
- durationHours: Estimated time to complete the course (between 10-50 hours)
- modules: An array of module objects, each containing:
  - title: The module title
  - description: A brief description of the module content
  - lessons: An array of lesson titles for this module (3-8 lessons per module)
`;

export type GeneratedModule = {
  title: string;
  description: string;
  lessons: string[];
};

export type GeneratedCourse = {
  title: string;
  description: string;
  category: string;
  moduleCount: number;
  durationHours: number;
  modules: GeneratedModule[];
};

/**
 * Generates a full course structure based on a topic and optional parameters
 */
export async function generateCourse(
  topic: string,
  options: {
    level?: "Beginner" | "Intermediate" | "Advanced";
    targetAudience?: string;
    specificFocus?: string;
  } = {}
): Promise<GeneratedCourse> {
  // Create the prompt with all parameters
  let prompt = `Generate a detailed course about "${topic}".`;
  
  if (options.level) {
    prompt += ` The course should be aimed at ${options.level} level students.`;
  }
  
  if (options.targetAudience) {
    prompt += ` The target audience is ${options.targetAudience}.`;
  }
  
  if (options.specificFocus) {
    prompt += ` The course should focus specifically on ${options.specificFocus}.`;
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: COURSE_GENERATION_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from AI service");
    }
    
    return JSON.parse(responseContent) as GeneratedCourse;
  } catch (error: any) {
    console.error("Error generating course:", error);
    throw new Error(`Failed to generate course: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Saves a generated course to the database
 */
export async function saveGeneratedCourse(
  generatedCourse: GeneratedCourse,
  instructorId: number
): Promise<Course> {
  // Convert the generated course to the database schema format
  const courseData: InsertCourse = {
    title: generatedCourse.title,
    description: generatedCourse.description,
    category: generatedCourse.category,
    moduleCount: generatedCourse.moduleCount,
    durationHours: generatedCourse.durationHours,
    instructorId: instructorId,
    // Add a generic course image based on category
    imageUrl: `https://placehold.co/600x400/${getCategoryColor(generatedCourse.category)}/FFFFFF/png?text=${encodeURIComponent(generatedCourse.category)}+Course`,
  };
  
  // Save to database
  const createdCourse = await storage.createCourse(courseData);
  return createdCourse;
}

/**
 * Generates course recommendations based on user interests and past courses
 */
export async function generateCourseRecommendations(
  userId: number,
  interests: string[] = [],
  limit: number = 3
): Promise<string[]> {
  // Get user's enrolled courses
  const userCourses = await storage.getUserCourses(userId);
  
  // Extract course titles and categories for context
  const enrolledCourses = userCourses.map(uc => ({
    title: uc.course.title,
    category: uc.course.category,
    completed: uc.completed
  }));
  
  const prompt = `
    The user has taken these courses:
    ${enrolledCourses.map(c => `- "${c.title}" (${c.category})${c.completed ? ' [Completed]' : ''}`).join('\n')}
    
    ${interests.length > 0 ? `The user has expressed interest in: ${interests.join(', ')}` : ''}
    
    Based on this information, suggest ${limit} course topics (just the topics, not full courses) that would be valuable for this user to learn next. Return as a JSON array of strings.
  `;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an expert educational advisor. Provide personalized course recommendations based on a user's learning history and interests." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from AI service");
    }
    
    const recommendations = JSON.parse(responseContent);
    return recommendations.recommendations || [];
  } catch (error: any) {
    console.error("Error generating recommendations:", error);
    throw new Error(`Failed to generate recommendations: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Helper function to generate a color based on course category
 */
function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    'Programming': '3b82f6',
    'Web Development': '14b8a6',
    'Data Science': 'a855f7',
    'Business': 'f59e0b',
    'Design': 'ec4899',
    'Marketing': '06b6d4',
    'Finance': '84cc16',
    'Languages': 'ef4444',
    'Personal Development': '8b5cf6',
  };
  
  // Default color if category not found
  return categoryColors[category] || '64748b';
}