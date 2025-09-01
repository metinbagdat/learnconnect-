import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatHistory {
  userId: number;
  messages: ChatMessage[];
  lastUpdated: Date;
}

// In-memory chat history storage (could be moved to database later)
const chatHistories = new Map<number, ChatHistory>();

const STUDY_COMPANION_SYSTEM_PROMPT = `You are an advanced AI Study Companion for the EduLearn platform, designed to help students excel in their courses. Your role is to provide personalized, context-aware assistance that enhances learning outcomes.

## Your Capabilities:
1. **Course Content Expert**: Provide detailed explanations on course topics, especially Turkish YKS preparation (TYT/AYT) subjects like Mathematics, Physics, Chemistry, Biology, Turkish Literature, etc.

2. **Study Strategy Advisor**: Suggest effective study methods, create study schedules, and provide motivation

3. **Problem Solver**: Help students work through practice problems and exercises step-by-step

4. **Progress Tracker**: Acknowledge achievements and guide students through challenging areas

5. **Personalized Tutor**: Adapt explanations to the student's learning level and style

6. **Multilingual Support**: Communicate in Turkish or English based on the student's preference

## Guidelines:
- Always be encouraging, patient, and supportive
- Break down complex concepts into digestible parts
- Use analogies and examples relevant to Turkish culture and education system when appropriate
- Provide step-by-step solutions for problems
- Ask clarifying questions to understand the student's specific needs
- Reference specific course content when available
- Suggest additional practice and resources
- Motivate students and celebrate their progress

## Response Format:
- Keep responses conversational but informative
- Use proper formatting with headers, lists, and code blocks when helpful
- Include emojis sparingly to maintain professionalism
- Always end with a question or suggestion to continue the learning conversation

Remember: You're not just answering questions - you're actively helping students learn, grow, and succeed in their educational journey.`;

/**
 * Process a chat message with context awareness
 */
export async function processStudyCompanionChat(
  userId: number,
  message: string,
  courseId?: number,
  lessonId?: number
): Promise<string> {
  try {
    // Get or create chat history for this user
    let chatHistory = chatHistories.get(userId);
    if (!chatHistory) {
      chatHistory = {
        userId,
        messages: [{ role: 'system', content: STUDY_COMPANION_SYSTEM_PROMPT }],
        lastUpdated: new Date()
      };
      chatHistories.set(userId, chatHistory);
    }

    // Get user context for personalized responses
    const user = await storage.getUser(userId);
    const userCourses = await storage.getUserCourses(userId);
    const userLevel = await storage.getUserLevel(userId);

    // Build context about the user
    let contextInfo = '';
    
    if (user) {
      contextInfo += `Student: ${user.displayName}\n`;
      if (userLevel) {
        contextInfo += `Level: ${userLevel.level} (${userLevel.currentXp} XP)\n`;
      }
      
      if (userCourses.length > 0) {
        contextInfo += `Enrolled Courses:\n`;
        userCourses.forEach(uc => {
          contextInfo += `- ${uc.course.title} (${Math.round(uc.progress)}% complete)\n`;
        });
      }
    }

    // Add specific course context if provided
    let courseContext = '';
    if (courseId) {
      try {
        const course = await storage.getCourse(courseId);
        if (course) {
          courseContext += `\nCurrent Course Context: ${course.title}\n`;
          courseContext += `Category: ${course.category}\n`;
          courseContext += `Description: ${course.description}\n`;
        }
        
        if (lessonId) {
          // Get lesson context if available (would need to implement this in storage)
          courseContext += `Currently working on Lesson ID: ${lessonId}\n`;
        }
      } catch (error) {
        console.error('Error fetching course context:', error);
      }
    }

    // Prepare the conversation context
    const contextMessage = contextInfo + courseContext;
    
    // Add user message to history
    chatHistory.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Keep last 10 messages for context (to avoid token limits)
    const recentMessages = chatHistory.messages.slice(-10);
    
    // Prepare messages for OpenAI
    const aiMessages: ChatMessage[] = [
      { role: 'system' as const, content: STUDY_COMPANION_SYSTEM_PROMPT },
      ...(contextMessage ? [{ role: 'system' as const, content: `Student Context:\n${contextMessage}` }] : []),
      ...recentMessages.filter(msg => msg.role !== 'system')
    ];

    // Get AI response  
    const completion = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: aiMessages.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("Empty response from AI");
    }

    // Add AI response to history
    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Update last activity
    chatHistory.lastUpdated = new Date();

    return aiResponse;

  } catch (error) {
    console.error('Error in AI chat processing:', error);
    
    // Fallback response
    const fallbackResponses = [
      "I'm having trouble processing your question right now. Could you please try rephrasing it?",
      "I'm experiencing some technical difficulties. In the meantime, try reviewing your course materials or checking the lesson content.",
      "Sorry, I can't respond properly at the moment. Please try asking your question again in a few minutes.",
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

/**
 * Get chat history for a user
 */
export function getChatHistory(userId: number): ChatMessage[] {
  const history = chatHistories.get(userId);
  return history ? history.messages.filter(msg => msg.role !== 'system') : [];
}

/**
 * Clear chat history for a user
 */
export function clearChatHistory(userId: number): boolean {
  return chatHistories.delete(userId);
}

/**
 * Generate study tips based on user's current courses and progress
 */
export async function generateStudyTips(userId: number): Promise<string[]> {
  try {
    const userCourses = await storage.getUserCourses(userId);
    const userLevel = await storage.getUserLevel(userId);
    
    if (userCourses.length === 0) {
      return [
        "Start by enrolling in a course that matches your interests",
        "Set a regular study schedule and stick to it",
        "Take notes while learning new concepts",
        "Practice regularly with exercises and quizzes"
      ];
    }

    // Analyze courses for personalized tips
    const courseTitles = userCourses.map(uc => uc.course.title).join(', ');
    const avgProgress = userCourses.reduce((sum, uc) => sum + uc.progress, 0) / userCourses.length;

    const prompt = `Generate 3-4 personalized study tips for a student who is:
    - Level ${userLevel?.level || 1} with ${userLevel?.currentXp || 0} XP
    - Enrolled in: ${courseTitles}
    - Average progress across courses: ${Math.round(avgProgress)}%
    
    Focus on practical, actionable advice that will help them succeed in these specific subjects.
    Return as a JSON array of strings.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an expert study advisor. Provide practical, personalized study tips." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      const parsed = JSON.parse(response);
      return parsed.tips || parsed.study_tips || [];
    }

    return [];
  } catch (error) {
    console.error('Error generating study tips:', error);
    return [
      "Review your notes regularly to reinforce learning",
      "Practice active recall by testing yourself",
      "Break study sessions into focused 25-minute intervals",
      "Connect new concepts to things you already know"
    ];
  }
}

/**
 * Generate encouraging messages based on user progress
 */
export async function generateMotivationalMessage(userId: number): Promise<string> {
  try {
    const userCourses = await storage.getUserCourses(userId);
    const userLevel = await storage.getUserLevel(userId);
    
    if (userCourses.length === 0) {
      return "Welcome to your learning journey! Every expert was once a beginner. Take the first step by enrolling in a course that interests you.";
    }

    const completedCourses = userCourses.filter(uc => uc.completed).length;
    const totalProgress = userCourses.reduce((sum, uc) => sum + uc.progress, 0);
    const avgProgress = totalProgress / userCourses.length;

    let message = "";
    
    if (completedCourses > 0) {
      message = `🎉 Congratulations on completing ${completedCourses} course${completedCourses > 1 ? 's' : ''}! `;
    }
    
    if (avgProgress > 75) {
      message += "You're doing amazing! Your dedication to learning is truly impressive. Keep up the excellent work!";
    } else if (avgProgress > 50) {
      message += "You're making great progress! You're more than halfway through your courses. The finish line is in sight!";
    } else if (avgProgress > 25) {
      message += "You're building momentum! Every step forward is progress. Keep going - you've got this!";
    } else {
      message += "Every journey begins with a single step, and you've taken yours! Consistency is key to success.";
    }

    if (userLevel && userLevel.currentXp > 0) {
      message += ` You've earned ${userLevel.currentXp} XP and reached Level ${userLevel.level}!`;
    }

    return message;
    
  } catch (error) {
    console.error('Error generating motivational message:', error);
    return "Keep learning and growing! Every moment you spend studying is an investment in your future success.";
  }
}