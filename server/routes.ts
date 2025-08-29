import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { registerStripeRoutes } from "./stripe-routes";
import { 
  insertCourseSchema, 
  insertUserCourseSchema, 
  insertAssignmentSchema, 
  insertModuleSchema, 
  insertLessonSchema, 
  insertLearningPathSchema,
  insertMentorSchema,
  insertUserMentorSchema,
  insertStudyProgramSchema,
  insertProgramScheduleSchema,
  insertUserProgramProgressSchema,
  insertStudySessionSchema,
  insertStudyGoal,
  insertStudySchedule,
  insertLearningRecommendation,
  insertStudyProgress,
  studyGoals,
  studySchedules,
  learningRecommendations,
  studyProgress
} from "@shared/schema";
import { z } from "zod";
import { generateCourse, saveGeneratedCourse, generateCourseRecommendations, generateLearningPath, saveLearningPath } from "./ai-service";
import { 
  generateLessonTrail, 
  saveLessonTrail, 
  getUserTrailProgress, 
  updateTrailProgress, 
  generatePersonalizedRecommendations,
  recordLearningAnalytics 
} from "./lesson-trail-service";
import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { seedChallenges } from "./seed-challenges";
import { seedSkillChallenges } from "./seed-skill-challenges";
import { generateExamLearningPath, saveExamLearningPath, generatePredefinedExamPaths } from "./entrance-exam-service";
import { getSuggestions } from "./suggestion-service";
import { generateAdaptiveLearningPath, updateStepProgress, generateNewRecommendations } from "./adaptive-learning-service";
import { 
  detectLearningStyle,
  generateDifficultyAdjustment,
  generatePredictiveAnalytics,
  generateAdaptiveInsights
} from "./advanced-adaptive-service";
import { db } from "./db";
import { eq, and, gte, notInArray, count, sum, sql } from "drizzle-orm";
import { 
  skillChallenges, 
  userSkillChallengeAttempts,
  userLevels,
  userChallengeStreaks,
  challengeLearningPaths,
  challengePathSteps,
  userChallengeProgress
} from "@shared/schema";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Setup Stripe payment routes
  registerStripeRoutes(app);

  // Courses API
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });
  
  app.post("/api/courses", async (req, res) => {
    if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "instructor")) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  // User Courses API
  app.get("/api/user/courses", async (req, res) => {
    // First check if the user is authenticated via session
    if (req.isAuthenticated()) {
      try {
        const userCourses = await storage.getUserCourses(req.user.id);
        return res.json(userCourses);
      } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user courses" });
      }
    }
    
    // If not authenticated via session, try header auth
    const userId = req.headers['x-user-id'];
    if (userId) {
      console.log("Attempting header auth for user courses. User ID:", userId);
      try {
        const userCourses = await storage.getUserCourses(Number(userId));
        return res.json(userCourses);
      } catch (error) {
        console.error("Error fetching user courses with header auth:", error);
      }
    }
    
    // If no auth method succeeded
    return res.status(401).json({ message: "Unauthorized" });
  });
  
  app.post("/api/user/courses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertUserCourseSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const userCourse = await storage.enrollUserInCourse(validatedData);
      res.status(201).json(userCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });
  
  app.patch("/api/user/courses/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userCourseId = parseInt(req.params.id);
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Invalid progress value" });
      }
      
      const updatedUserCourse = await storage.updateUserCourseProgress(userCourseId, progress);
      
      if (!updatedUserCourse) {
        return res.status(404).json({ message: "User course not found" });
      }
      
      res.json(updatedUserCourse);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  
  // Assignments API
  app.get("/api/assignments", async (req, res) => {
    // First try session authentication
    if (req.isAuthenticated()) {
      try {
        const assignments = await storage.getUserAssignments(req.user.id);
        return res.json(assignments);
      } catch (error) {
        return res.status(500).json({ message: "Failed to fetch assignments" });
      }
    }
    
    // Try header authentication fallback
    const userId = req.headers['x-user-id'];
    if (userId) {
      console.log("Attempting header auth for assignments. User ID:", userId);
      try {
        const assignments = await storage.getUserAssignments(Number(userId));
        return res.json(assignments);
      } catch (error) {
        console.error("Error fetching assignments with header auth:", error);
      }
    }
    
    // If no auth method succeeded
    return res.status(401).json({ message: "Unauthorized" });
  });
  
  app.post("/api/assignments", async (req, res) => {
    if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "instructor")) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });
  
  // AI Study Companion Chat API
  app.post("/api/ai/chat", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { message, courseId, lessonId } = req.body;
      
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ message: "Valid message is required" });
      }

      // Import the AI chat service
      const { processStudyCompanionChat } = await import('./ai-chat-service');
      
      // Process the chat message with context
      const response = await processStudyCompanionChat(
        req.user.id,
        message.trim(),
        courseId ? Number(courseId) : undefined,
        lessonId ? Number(lessonId) : undefined
      );
      
      res.json({ message: response });
    } catch (error) {
      console.error('Error in AI chat endpoint:', error);
      res.status(500).json({ 
        message: "I'm having trouble processing your request right now. Please try again in a moment." 
      });
    }
  });

  // Get chat history for the current user
  app.get("/api/ai/chat/history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { getChatHistory } = await import('./ai-chat-service');
      const history = getChatHistory(req.user.id);
      res.json({ messages: history });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Clear chat history for the current user
  app.delete("/api/ai/chat/history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { clearChatHistory } = await import('./ai-chat-service');
      const cleared = clearChatHistory(req.user.id);
      res.json({ success: cleared });
    } catch (error) {
      console.error('Error clearing chat history:', error);
      res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  // Get personalized study tips
  app.get("/api/ai/study-tips", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { generateStudyTips } = await import('./ai-chat-service');
      const tips = await generateStudyTips(req.user.id);
      res.json({ tips });
    } catch (error) {
      console.error('Error generating study tips:', error);
      res.status(500).json({ message: "Failed to generate study tips" });
    }
  });

  // Get motivational message
  app.get("/api/ai/motivation", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { generateMotivationalMessage } = await import('./ai-chat-service');
      const message = await generateMotivationalMessage(req.user.id);
      res.json({ message });
    } catch (error) {
      console.error('Error generating motivational message:', error);
      res.status(500).json({ message: "Keep learning and growing! Your dedication will pay off." });
    }
  });
  
  // Generate lesson content on demand
  app.post("/api/ai/generate-lesson-content", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { lessonId, lessonTitle, moduleTitle, courseTitle } = req.body;
      
      if (!lessonId || !lessonTitle) {
        return res.status(400).json({ message: "Lesson ID and title are required" });
      }
      
      // Generate content based on the lesson and course info
      let content = "";
      
      try {
        // Try Anthropic Claude first (higher quality content)
        if (process.env.ANTHROPIC_API_KEY) {
          try {
            // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
            const message = await anthropic.messages.create({
              model: "claude-3-7-sonnet-20250219",
              max_tokens: 2000,
              system: "You are an expert educational content creator with deep knowledge across various subjects. Create detailed, accurate, and engaging lesson content that includes explanations, examples, and practice activities. Format the content in Markdown.",
              messages: [
                {
                  role: "user",
                  content: `Create detailed lesson content for "${lessonTitle}" which is part of the module "${moduleTitle || 'N/A'}" in the course "${courseTitle || 'N/A'}". 
                  
Format the content with these sections:
1. Introduction
2. Core Concepts
3. Examples
4. Practice Activities
5. Summary

Use markdown formatting. Be comprehensive and educational.`
                }
              ],
            });
            
            if (message.content && message.content.length > 0 && 'text' in message.content[0]) {
              content = message.content[0].text || "";
            }
            console.log("Generated content with Anthropic Claude");
          } catch (claudeError) {
            console.error("Error generating content with Anthropic Claude:", claudeError);
            throw claudeError; // Fall through to OpenAI
          }
        } 
        // Try using OpenAI API if Anthropic is not available or failed
        else if (process.env.OPENAI_API_KEY) {
          const generatedContent = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { 
                role: "system", 
                content: "You are an expert educational content creator. Create detailed, accurate, and engaging lesson content that includes explanations, examples, and practice activities." 
              },
              { 
                role: "user", 
                content: `Create detailed lesson content for "${lessonTitle}" which is part of the module "${moduleTitle || 'N/A'}" in the course "${courseTitle || 'N/A'}". 
                
Format the content with these sections:
1. Introduction
2. Core Concepts
3. Examples
4. Practice Activities
5. Summary

Use markdown formatting. Be comprehensive and educational.` 
              }
            ],
            temperature: 0.7,
          });
          
          content = generatedContent.choices[0].message.content || "";
          console.log("Generated content with OpenAI");
        } else {
          throw new Error("No AI provider API keys available");
        }
      } catch (error) {
        console.error("Error generating content with AI providers:", error);
        
        // Fallback content generation
        content = `
# ${lessonTitle}

## Introduction
This lesson covers the key concepts and applications of ${lessonTitle}. You will learn about the fundamental principles, practical applications, and how to apply this knowledge in real-world scenarios.

## Core Concepts
- Understanding the basics of ${lessonTitle}
- Key principles and methodologies
- Historical context and evolution
- Modern applications and techniques

## Examples
Here are some practical examples of how ${lessonTitle} is applied:

1. **Example 1**: A detailed walkthrough of a basic application
2. **Example 2**: A more complex scenario demonstrating advanced concepts
3. **Example 3**: Real-world case study showing practical implementation

## Practice Activities
Try these activities to reinforce your understanding:

1. **Activity 1**: Apply the basic concepts to solve a simple problem
2. **Activity 2**: Analyze a case study related to ${lessonTitle}
3. **Activity 3**: Create your own project implementing the key principles

## Summary
In this lesson, you've learned about ${lessonTitle}, including its core concepts, practical applications, and how to implement these ideas in various scenarios. Continue to the next lesson to build upon these fundamentals.
        `;
      }
      
      // Update the lesson in the database with the generated content
      const lessons = await storage.getLessons(0);
      const lesson = lessons.find(l => l.id === lessonId);
      
      if (lesson) {
        // Update the lesson content in the database
        // This is a placeholder - you would need to implement this method in your storage interface
        // await storage.updateLessonContent(lessonId, content);
      }
      
      res.json({ content });
    } catch (error: any) {
      console.error("Error generating lesson content:", error);
      res.status(500).json({ 
        message: "Failed to generate lesson content", 
        error: error.message || "Unknown error" 
      });
    }
  });
  
  // AI-powered course generation endpoint
  app.post("/api/ai/generate-course", async (req, res) => {
    if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "instructor")) {
      return res.status(403).json({ message: "Only instructors or admins can generate courses" });
    }

    try {
      const { topic, level, targetAudience, specificFocus } = req.body;
      
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ message: "Topic is required" });
      }

      // Fallback generated course for when OpenAI API is not available
      const generatedCourse = {
        title: `${topic} ${level || "Comprehensive"} Course`,
        description: `A detailed course covering all aspects of ${topic}. This course is designed for ${targetAudience || "all students"} and focuses on ${specificFocus || "practical applications and theory"}.`,
        category: topic.includes("Programming") ? "Programming" : 
                 topic.includes("Business") ? "Business" : 
                 topic.includes("Marketing") ? "Marketing" : 
                 topic.includes("Design") ? "Design" : "Education",
        moduleCount: 8,
        durationHours: 32,
        modules: [
          {
            title: `Introduction to ${topic}`,
            description: `An overview of ${topic} and its importance.`,
            lessons: [
              `What is ${topic}?`,
              `History and Evolution of ${topic}`,
              `Why ${topic} Matters Today`
            ]
          },
          {
            title: "Core Concepts",
            description: `The fundamental principles and concepts of ${topic}.`,
            lessons: [
              "Basic Terminology",
              "Theoretical Foundations",
              "Key Frameworks"
            ]
          },
          {
            title: "Practical Applications",
            description: `How to apply ${topic} knowledge in real-world scenarios.`,
            lessons: [
              "Case Studies",
              "Problem-Solving Techniques",
              "Hands-on Exercises"
            ]
          },
          {
            title: "Advanced Topics",
            description: `Deeper exploration of complex aspects of ${topic}.`,
            lessons: [
              "Specialized Techniques",
              "Current Research Trends",
              "Future Developments"
            ]
          }
        ]
      };

      // Save to database with AI flag set
      const courseData = {
        ...await saveGeneratedCourse(generatedCourse, req.user.id),
        isAiGenerated: true
      };
      
      // Now create modules and lessons for this course
      for (let moduleIndex = 0; moduleIndex < generatedCourse.modules.length; moduleIndex++) {
        const moduleData = generatedCourse.modules[moduleIndex];
        const moduleValidatedData = insertModuleSchema.parse({
          courseId: courseData.id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleIndex + 1
        });
        
        const module = await storage.createModule(moduleValidatedData);
        
        // Create lessons for this module
        for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
          const lessonTitle = moduleData.lessons[lessonIndex];
          const lessonValidatedData = insertLessonSchema.parse({
            moduleId: module.id,
            title: lessonTitle,
            content: null, // Content can be generated later or by the instructor
            order: lessonIndex + 1,
            duration: null // Duration can be set later
          });
          
          await storage.createLesson(lessonValidatedData);
        }
      }
      
      res.status(201).json({
        course: courseData,
        message: "Course generated successfully"
      });
    } catch (error) {
      console.error("Error generating course:", error);
      res.status(500).json({ message: "Failed to generate course" });
    }
  });
  
  // AI-powered course recommendations 
  app.get("/api/ai/course-recommendations", async (req, res) => {
    let userId: number;
    
    // Try session-based authentication first
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } 
    // If session auth fails, try header-based authentication
    else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        console.log("Attempting header auth for course recommendations. User ID:", headerUserId);
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      // Check if we have cached recommendations
      const existingRecommendations = await storage.getCourseRecommendations(userId);
      
      // If we have recent recommendations (less than 24 hours old), return them
      if (existingRecommendations && 
          existingRecommendations.createdAt && 
          (new Date().getTime() - existingRecommendations.createdAt.getTime() < 24 * 60 * 60 * 1000)) {
        return res.json(existingRecommendations.recommendations);
      }
      
      // Try to get the user to check interests
      const user = req.isAuthenticated() && req.user ? req.user : await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Fallback recommendations instead of using OpenAI
      const interests = user.interests || [];
      
      // Create fallback recommendations based on the user's interests
      let recommendations = [
        "Web Development Fundamentals",
        "Data Science for Beginners",
        "Introduction to Digital Marketing"
      ];
      
      // If the user has interests, customize the recommendations
      if (interests.length > 0) {
        recommendations = interests.map(interest => `Advanced ${interest}`);
      }
      
      // Save to database
      const savedRecommendations = await storage.saveCourseRecommendations(userId, recommendations);
      
      res.json(savedRecommendations.recommendations);
    } catch (error) {
      console.error("Error generating course recommendations:", error);
      res.status(500).json({ message: "Failed to generate course recommendations" });
    }
  });
  
  // Update user interests
  app.patch("/api/user/interests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { interests } = req.body;
      
      if (!Array.isArray(interests)) {
        return res.status(400).json({ message: "Interests must be an array" });
      }

      const updatedUser = await storage.updateUserInterests(req.user.id, interests);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user interests:", error);
      res.status(500).json({ message: "Failed to update user interests" });
    }
  });
  
  // Get AI-generated courses
  app.get("/api/ai/courses", async (req, res) => {
    try {
      const aiCourses = await storage.getAiGeneratedCourses();
      res.json(aiCourses);
    } catch (error) {
      console.error("Error fetching AI-generated courses:", error);
      res.status(500).json({ message: "Failed to fetch AI-generated courses" });
    }
  });
  
  // Get course modules
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      
      const modules = await storage.getModules(courseId);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching course modules:", error);
      res.status(500).json({ message: "Failed to fetch course modules" });
    }
  });
  
  // Get module lessons
  app.get("/api/modules/:moduleId/lessons", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      if (isNaN(moduleId)) {
        return res.status(400).json({ message: "Invalid module ID" });
      }
      
      const lessons = await storage.getLessons(moduleId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching module lessons:", error);
      res.status(500).json({ message: "Failed to fetch module lessons" });
    }
  });

  // Get individual lesson details
  app.get("/api/lessons/:lessonId", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const language = req.query.lang as string || 'en';
      
      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }

      // Import the AI module service to get lesson data
      const { generateAIEnhancedModules } = await import("./ai-module-service");
      
      // For now, we'll find the lesson by searching through all courses
      // This is a temporary solution until we have proper lesson storage
      const courses = await storage.getCourses();
      
      for (const course of courses) {
        const aiModules = await generateAIEnhancedModules(course.id, 4, language); // Using user ID 4 as default
        
        for (const module of aiModules) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            // Return lesson with additional context
            return res.json({
              ...lesson,
              moduleTitle: module.title,
              courseTitle: course.title,
              courseId: course.id
            });
          }
        }
      }
      
      res.status(404).json({ message: "Lesson not found" });
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Get AI-enhanced modules for a course
  app.get("/api/courses/:courseId/ai-modules/:userId", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = parseInt(req.params.userId);
      
      if (isNaN(courseId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid course ID or user ID" });
      }

      // Import the AI module service
      const { generateAIEnhancedModules } = await import("./ai-module-service");
      
      const language = req.query.lang as string || 'en';
      const aiModules = await generateAIEnhancedModules(courseId, userId, language);
      res.json(aiModules);
    } catch (error) {
      console.error("Error generating AI-enhanced modules:", error);
      res.status(500).json({ message: "Failed to generate AI-enhanced modules" });
    }
  });
  
  // Create admin account (special endpoint for initial setup)
  app.post("/api/create-admin", async (req, res) => {
    try {
      // Import the admin creation function
      const { default: createAdminAccount } = await import("./create-admin");
      
      // Create an admin with default credentials
      const result = await createAdminAccount("admin", "admin123", "Admin User");
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error creating admin account:", error);
      res.status(500).json({ message: "Failed to create admin account" });
    }
  });

  // Add Turkish university entrance exam courses
  app.post("/api/admin/add-turkish-courses", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin users can access this endpoint" });
    }
    
    try {
      // Import the addTurkishCourses function directly
      const { default: addTurkishCourses } = await import("./add-turkish-courses");
      
      // Call the function to add Turkish courses
      await addTurkishCourses();
      
      res.json({ message: "Turkish university entrance exam courses added successfully" });
    } catch (error) {
      console.error("Error adding Turkish courses:", error);
      res.status(500).json({ message: "Failed to add Turkish courses" });
    }
  });

  // Learning Paths API
  app.get("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const learningPaths = await storage.getLearningPaths(req.user.id);
      res.json(learningPaths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning paths" });
    }
  });
  
  app.get("/api/learning-paths/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const pathId = parseInt(req.params.id);
      const learningPath = await storage.getLearningPath(pathId);
      
      if (!learningPath) {
        return res.status(404).json({ message: "Learning path not found" });
      }
      
      res.json(learningPath);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning path" });
    }
  });
  
  app.post("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { goal, careerField, timeframe } = req.body;
      
      if (!goal || typeof goal !== "string") {
        return res.status(400).json({ message: "Goal is required" });
      }
      
      // Generate learning path with AI, now including career field and timeframe
      const generatedPath = await generateLearningPath(
        req.user.id, 
        goal, 
        { 
          careerField: careerField || '', 
          timeframe: timeframe || '6 months' 
        }
      );
      
      // Save to database
      const learningPath = await saveLearningPath(req.user.id, generatedPath);
      
      res.status(201).json(learningPath);
    } catch (error) {
      console.error("Error creating learning path:", error);
      res.status(500).json({ message: "Failed to create learning path" });
    }
  });
  
  app.patch("/api/learning-paths/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const pathId = parseInt(req.params.id);
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Invalid progress value" });
      }
      
      const updatedPath = await storage.updateLearningPathProgress(pathId, progress);
      
      if (!updatedPath) {
        return res.status(404).json({ message: "Learning path not found" });
      }
      
      res.json(updatedPath);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  
  app.patch("/api/learning-paths/steps/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const stepId = parseInt(req.params.id);
      const updatedStep = await storage.markStepAsCompleted(stepId);
      
      if (!updatedStep) {
        return res.status(404).json({ message: "Learning path step not found" });
      }
      
      res.json(updatedStep);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark step as completed" });
    }
  });

  // Entrance Exam Learning Paths API
  app.post("/api/exam-learning-paths/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { 
        examType, 
        targetExam, 
        currentLevel, 
        strengths, 
        weaknesses, 
        targetScore, 
        examDate, 
        weeklyStudyHours, 
        preferredLearningStyle, 
        specialRequirements 
      } = req.body;

      if (!examType || !targetExam) {
        return res.status(400).json({ message: "Exam type and target exam are required" });
      }

      const userProfile = {
        currentLevel: currentLevel || "intermediate",
        strengths: Array.isArray(strengths) ? strengths : [],
        weaknesses: Array.isArray(weaknesses) ? weaknesses : [],
        targetScore,
        examDate,
        weeklyStudyHours: weeklyStudyHours || 10,
        preferredLearningStyle: preferredLearningStyle || "mixed",
        specialRequirements
      };

      // Generate the AI-powered exam learning path
      const examPath = await generateExamLearningPath(
        examType,
        targetExam,
        userProfile,
        req.user.id
      );

      // Save the path to database
      const savedPath = await saveExamLearningPath(examPath, req.user.id);

      res.status(201).json({
        path: examPath,
        pathId: savedPath.pathId,
        stepIds: savedPath.stepIds,
        message: "Exam learning path generated successfully"
      });
    } catch (error) {
      console.error("Error generating exam learning path:", error);
      res.status(500).json({ message: "Failed to generate exam learning path" });
    }
  });

  app.get("/api/exam-learning-paths", async (req, res) => {
    let userId: number;
    
    // Try session-based authentication first
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } 
    // If session auth fails, try header-based authentication
    else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      const examPaths = await storage.getLearningPaths(userId);
      // Filter for exam-specific paths
      const examSpecificPaths = examPaths.filter(path => path.examType);
      res.json(examSpecificPaths);
    } catch (error) {
      console.error("Error fetching exam learning paths:", error);
      res.status(500).json({ message: "Failed to fetch exam learning paths" });
    }
  });

  app.get("/api/exam-learning-paths/types", async (req, res) => {
    try {
      const examTypes = [
        {
          id: "lycee",
          name: "Lycée (French High School)",
          description: "French Baccalauréat preparation for Scientific, Literary, and Economic tracks",
          exams: [
            "Baccalauréat Scientifique (Bac S)",
            "Baccalauréat Littéraire (Bac L)", 
            "Baccalauréat Économique et Social (Bac ES)",
            "Baccalauréat Technologique (Bac Tech)"
          ],
          subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Philosophy", "French Literature", "History", "Geography", "Foreign Languages"]
        },
        {
          id: "college",
          name: "College Preparation",
          description: "Standardized test preparation for US college admissions",
          exams: [
            "SAT (Scholastic Assessment Test)",
            "ACT (American College Testing)",
            "AP Courses (Advanced Placement)",
            "PSAT/NMSQT (Preliminary SAT)"
          ],
          subjects: ["Mathematics", "Evidence-Based Reading", "Writing", "Science Reasoning", "Essay Writing", "Test Strategy"]
        },
        {
          id: "university",
          name: "University Entrance",
          description: "Graduate and professional school entrance exam preparation",
          exams: [
            "GRE (Graduate Record Examination)",
            "GMAT (Graduate Management Admission Test)",
            "LSAT (Law School Admission Test)",
            "MCAT (Medical College Admission Test)",
            "MAT (Miller Analogies Test)"
          ],
          subjects: ["Quantitative Reasoning", "Verbal Reasoning", "Analytical Writing", "Critical Thinking", "Subject-Specific Knowledge"]
        },
        {
          id: "turkish_university",
          name: "Turkish University Entrance",
          description: "YKS (Yükseköğretim Kurumları Sınavı) preparation for Turkish universities",
          exams: [
            "YKS TYT (Temel Yeterlilik Testi)",
            "YKS AYT Matematik-Fen (Advanced Math-Science)",
            "YKS AYT Sözel (Advanced Verbal)",
            "YKS AYT Eşit Ağırlık (Equal Weight)",
            "YKS DİL (Foreign Language Test)"
          ],
          subjects: ["Turkish Language", "Mathematics", "Science", "Social Sciences", "Advanced Mathematics", "Physics", "Chemistry", "Biology", "Literature", "History", "Geography", "Foreign Languages"]
        }
      ];

      res.json(examTypes);
    } catch (error) {
      console.error("Error fetching exam types:", error);
      res.status(500).json({ message: "Failed to fetch exam types" });
    }
  });

  // AI-powered emoji reaction generation
  app.post("/api/ai/generate-milestone-emoji", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { milestone, userId, language = 'en' } = req.body;
      
      if (!milestone || !userId) {
        return res.status(400).json({ message: "Milestone and userId are required" });
      }

      const { aiEmojiService } = await import('./ai-emoji-service');
      const emojiReaction = await aiEmojiService.generateMilestoneEmoji(
        milestone,
        userId,
        language
      );

      res.json(emojiReaction);
    } catch (error) {
      console.error('Failed to generate emoji reaction:', error);
      res.status(500).json({ message: 'Failed to generate emoji reaction' });
    }
  });

  // Learning milestones API
  app.get("/api/milestones", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const milestones = await storage.getUserMilestones(req.user.id);
      res.json(milestones);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
      res.status(500).json({ message: 'Failed to fetch milestones' });
    }
  });

  // Create learning milestone
  app.post("/api/milestones", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const milestoneData = {
        ...req.body,
        userId: req.user.id,
        id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const milestone = await storage.createMilestone(milestoneData);
      res.status(201).json(milestone);
    } catch (error) {
      console.error('Failed to create milestone:', error);
      res.status(500).json({ message: 'Failed to create milestone' });
    }
  });

  // Save emoji reaction
  app.post("/api/milestones/reactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const reactionData = {
        ...req.body,
        userId: req.user.id,
        id: `reaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      const reaction = await storage.createEmojiReaction(reactionData);
      res.status(201).json(reaction);
    } catch (error) {
      console.error('Failed to save emoji reaction:', error);
      res.status(500).json({ message: 'Failed to save emoji reaction' });
    }
  });

  // Get reactions for a milestone
  app.get("/api/milestones/:milestoneId/reactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const reactions = await storage.getMilestoneReactions(req.params.milestoneId);
      res.json(reactions);
    } catch (error) {
      console.error('Failed to fetch reactions:', error);
      res.status(500).json({ message: 'Failed to fetch reactions' });
    }
  });

  // Initialize predefined exam paths (admin only)
  app.post("/api/admin/generate-predefined-exam-paths", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin users can access this endpoint" });
    }

    try {
      await generatePredefinedExamPaths();
      res.json({ message: "Predefined exam learning paths generated successfully" });
    } catch (error) {
      console.error("Error generating predefined exam paths:", error);
      res.status(500).json({ message: "Failed to generate predefined exam paths" });
    }
  });

  // Analytics routes
  
  // Log user activity
  app.post("/api/analytics/activity", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const activity = {
        userId: req.user.id,
        action: req.body.action,
        resourceType: req.body.resourceType,
        resourceId: req.body.resourceId,
        metadata: req.body.metadata || {},
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      };
      
      const result = await storage.logUserActivity(activity);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error logging user activity:", error);
      res.status(500).json({ message: "Failed to log user activity" });
    }
  });
  
  // Get user activities
  app.get("/api/analytics/user-activities", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const activities = await storage.getUserActivities(req.user.id, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error getting user activities:", error);
      res.status(500).json({ message: "Failed to get user activities" });
    }
  });
  
  // Get user activities by timeframe
  app.get("/api/analytics/user-activities/timeframe", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const activities = await storage.getUserActivityByTimeframe(req.user.id, startDate, endDate);
      res.json(activities);
    } catch (error) {
      console.error("Error getting user activities by timeframe:", error);
      res.status(500).json({ message: "Failed to get user activities by timeframe" });
    }
  });
  
  // Get course analytics
  app.get("/api/analytics/courses/:courseId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Only allow instructors and admins to access course analytics
    if (!["instructor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const courseId = parseInt(req.params.courseId);
      const analytics = await storage.getCourseAnalytics(courseId);
      
      if (!analytics) {
        return res.status(404).json({ message: "Course analytics not found" });
      }
      
      res.json(analytics);
    } catch (error) {
      console.error("Error getting course analytics:", error);
      res.status(500).json({ message: "Failed to get course analytics" });
    }
  });
  
  // Update course analytics
  app.patch("/api/analytics/courses/:courseId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Only allow instructors and admins to update course analytics
    if (!["instructor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const courseId = parseInt(req.params.courseId);
      const data = req.body;
      
      const updatedAnalytics = await storage.updateCourseAnalytics(courseId, data);
      res.json(updatedAnalytics);
    } catch (error) {
      console.error("Error updating course analytics:", error);
      res.status(500).json({ message: "Failed to update course analytics" });
    }
  });
  
  // Get popular courses
  app.get("/api/analytics/popular-courses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const popularCourses = await storage.getPopularCourses(limit);
      res.json(popularCourses);
    } catch (error) {
      console.error("Error getting popular courses:", error);
      res.status(500).json({ message: "Failed to get popular courses" });
    }
  });
  
  // Get user progress over time
  app.get("/api/analytics/user-progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Default to last 90 days
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const progress = await storage.getUserProgressOverTime(req.user.id, startDate, endDate);
      res.json(progress);
    } catch (error) {
      console.error("Error getting user progress over time:", error);
      res.status(500).json({ message: "Failed to get user progress over time" });
    }
  });
  
  // Create user progress snapshot
  app.post("/api/analytics/user-progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      // Only allow creating a snapshot for the authenticated user
      const snapshot = {
        userId: req.user.id,
        snapshotDate: req.body.snapshotDate || new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        coursesEnrolled: req.body.coursesEnrolled || 0,
        coursesCompleted: req.body.coursesCompleted || 0,
        lessonsCompleted: req.body.lessonsCompleted || 0,
        assignmentsCompleted: req.body.assignmentsCompleted || 0,
        totalPoints: req.body.totalPoints || 0,
        badgesEarned: req.body.badgesEarned || 0,
        averageGrade: req.body.averageGrade
      };
      
      const result = await storage.createUserProgressSnapshot(snapshot);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating user progress snapshot:", error);
      res.status(500).json({ message: "Failed to create user progress snapshot" });
    }
  });
  
  // Get platform stats (admin only)
  app.get("/api/analytics/platform-stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Only allow admins to access platform stats
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting platform stats:", error);
      res.status(500).json({ message: "Failed to get platform stats" });
    }
  });

  // Advanced analytics endpoints
  app.get("/api/analytics/engagement-metrics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      
      // Get user engagement data
      const activities = await storage.getUserActivityByTimeframe(
        userId,
        startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate ? new Date(endDate as string) : new Date()
      );

      // Calculate engagement metrics
      const dailyActivity = activities.reduce((acc: any, activity) => {
        const date = new Date(activity.createdAt).toDateString();
        if (!acc[date]) acc[date] = 0;
        acc[date]++;
        return acc;
      }, {});

      const totalActivities = activities.length;
      const uniqueDays = Object.keys(dailyActivity).length;
      const avgActivitiesPerDay = uniqueDays > 0 ? totalActivities / uniqueDays : 0;

      res.json({
        totalActivities,
        uniqueDaysActive: uniqueDays,
        avgActivitiesPerDay: Math.round(avgActivitiesPerDay * 100) / 100,
        dailyBreakdown: Object.entries(dailyActivity).map(([date, count]) => ({
          date,
          activities: count
        })),
        activityTypes: activities.reduce((acc: any, activity) => {
          acc[activity.action] = (acc[activity.action] || 0) + 1;
          return acc;
        }, {})
      });
    } catch (error) {
      console.error("Error getting engagement metrics:", error);
      res.status(500).json({ message: "Failed to get engagement metrics" });
    }
  });

  app.get("/api/analytics/learning-insights", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      
      // Get user's courses and progress
      const userCourses = await storage.getUserCourses(userId);
      const userLevel = await storage.getUserLevel(userId);
      const userAchievements = await storage.getUserAchievements(userId);
      
      // Calculate insights
      const totalCourses = userCourses.length;
      const completedCourses = userCourses.filter(uc => uc.completed).length;
      const inProgressCourses = totalCourses - completedCourses;
      const completionRate = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
      
      // Get learning streak and consistency
      const recentActivities = await storage.getUserActivities(userId, 30);
      const learningDays = new Set(
        recentActivities
          .filter(a => ['complete_lesson', 'start_course', 'submit_assignment'].includes(a.action))
          .map(a => new Date(a.createdAt).toDateString())
      );
      
      res.json({
        totalCourses,
        completedCourses,
        inProgressCourses,
        completionRate: Math.round(completionRate * 100) / 100,
        currentLevel: userLevel?.level || 1,
        totalXP: userLevel?.currentXp || 0,
        totalPoints: userLevel?.totalPoints || 0,
        currentStreak: userLevel?.currentStreak || 0,
        achievementsUnlocked: userAchievements.length,
        activeLearningDays: learningDays.size,
        strengthAreas: ["Programming", "Data Analysis"], // Simplified for now
        recommendedFocus: ["Complete JavaScript course", "Practice more challenges"]
      });
    } catch (error) {
      console.error("Error getting learning insights:", error);
      res.status(500).json({ message: "Failed to get learning insights" });
    }
  });

  app.get("/api/analytics/performance-trends", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const { days = 30 } = req.query;
      
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - Number(days) * 24 * 60 * 60 * 1000);
      
      const progressSnapshots = await storage.getUserProgressOverTime(userId, startDate, endDate);
      
      // Generate trend data
      const trends = progressSnapshots.map(snapshot => ({
        date: snapshot.snapshotDate,
        coursesCompleted: snapshot.coursesCompleted,
        lessonsCompleted: snapshot.lessonsCompleted,
        assignmentsCompleted: snapshot.assignmentsCompleted,
        totalPoints: snapshot.totalPoints,
        averageGrade: snapshot.averageGrade
      }));

      // Calculate simple velocity
      const velocity = trends.length > 1 ? {
        coursesPerWeek: Math.round(((trends[trends.length - 1].coursesCompleted - trends[0].coursesCompleted) / trends.length) * 7 * 100) / 100,
        lessonsPerWeek: Math.round(((trends[trends.length - 1].lessonsCompleted - trends[0].lessonsCompleted) / trends.length) * 7 * 100) / 100,
        pointsPerWeek: Math.round(((trends[trends.length - 1].totalPoints - trends[0].totalPoints) / trends.length) * 7 * 100) / 100
      } : { coursesPerWeek: 0, lessonsPerWeek: 0, pointsPerWeek: 0 };

      res.json({
        trends,
        velocity,
        summary: {
          totalGrowth: trends.length > 1 ? {
            courses: trends[trends.length - 1].coursesCompleted - trends[0].coursesCompleted,
            lessons: trends[trends.length - 1].lessonsCompleted - trends[0].lessonsCompleted,
            points: trends[trends.length - 1].totalPoints - trends[0].totalPoints
          } : { courses: 0, lessons: 0, points: 0 }
        }
      });
    } catch (error) {
      console.error("Error getting performance trends:", error);
      res.status(500).json({ message: "Failed to get performance trends" });
    }
  });

  // Adaptive Learning Reward System - Challenge API
  app.get("/api/challenges", async (req, res) => {
    try {
      const query = req.query as { type?: string; active?: string; category?: string };
      
      // Create filters object with correct types
      const filters: { type?: string; active?: boolean; category?: string } = {
        type: query.type,
        category: query.category
      };
      
      // Convert 'active' string to boolean if present
      if (query.active !== undefined) {
        filters.active = query.active === 'true';
      }
      
      const challenges = await storage.getChallenges(filters);
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const challenge = await storage.getChallenge(challengeId);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });
  
  app.post("/api/challenges", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only administrators can create challenges" });
    }
    
    try {
      const challenge = await storage.createChallenge(req.body);
      res.status(201).json(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });
  
  app.put("/api/challenges/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only administrators can update challenges" });
    }
    
    try {
      const challengeId = parseInt(req.params.id);
      const updatedChallenge = await storage.updateChallenge(challengeId, req.body);
      
      if (!updatedChallenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(updatedChallenge);
    } catch (error) {
      console.error("Error updating challenge:", error);
      res.status(500).json({ message: "Failed to update challenge" });
    }
  });
  
  app.delete("/api/challenges/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only administrators can deactivate challenges" });
    }
    
    try {
      const challengeId = parseInt(req.params.id);
      const deactivatedChallenge = await storage.deactivateChallenge(challengeId);
      
      if (!deactivatedChallenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json({ message: "Challenge deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating challenge:", error);
      res.status(500).json({ message: "Failed to deactivate challenge" });
    }
  });
  
  app.get("/api/courses/:id/challenges", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const challenges = await storage.getCourseRelatedChallenges(courseId);
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching course challenges:", error);
      res.status(500).json({ message: "Failed to fetch course challenges" });
    }
  });
  
  // User Challenge API
  app.get("/api/user/challenges", async (req, res) => {
    if (!req.isAuthenticated()) {
      // Try header auth
      const userId = req.headers['x-user-id'];
      if (userId) {
        try {
          const userChallenges = await storage.getUserChallenges(Number(userId));
          return res.json(userChallenges);
        } catch (error) {
          console.error("Error fetching user challenges with header auth:", error);
          return res.status(500).json({ message: "Failed to fetch user challenges" });
        }
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userChallenges = await storage.getUserChallenges(req.user.id);
      res.json(userChallenges);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      res.status(500).json({ message: "Failed to fetch user challenges" });
    }
  });
  
  app.get("/api/user/challenges/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      // Try header auth
      const userId = req.headers['x-user-id'];
      if (userId) {
        try {
          const challengeStatus = await storage.getUserActiveAndCompletedChallenges(Number(userId));
          return res.json(challengeStatus);
        } catch (error) {
          console.error("Error fetching challenge status with header auth:", error);
          return res.status(500).json({ message: "Failed to fetch challenge status" });
        }
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const challengeStatus = await storage.getUserActiveAndCompletedChallenges(req.user.id);
      res.json(challengeStatus);
    } catch (error) {
      console.error("Error fetching challenge status:", error);
      res.status(500).json({ message: "Failed to fetch challenge status" });
    }
  });
  
  app.post("/api/user/challenges/:challengeId/assign", async (req, res) => {
    let userId: number;
    
    // Check for session auth
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      // Try header auth
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
    
    try {
      const challengeId = parseInt(req.params.challengeId);
      const userChallenge = await storage.assignChallengeToUser(userId, challengeId);
      res.status(201).json(userChallenge);
    } catch (error) {
      console.error("Error assigning challenge:", error);
      res.status(500).json({ message: "Failed to assign challenge" });
    }
  });
  
  app.patch("/api/user/challenges/:challengeId/progress", async (req, res) => {
    let userId: number;
    
    // Check for session auth
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      // Try header auth
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
    
    try {
      const challengeId = parseInt(req.params.challengeId);
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Invalid progress value" });
      }
      
      const updatedUserChallenge = await storage.updateUserChallengeProgress(
        userId, 
        challengeId, 
        progress
      );
      
      if (!updatedUserChallenge) {
        return res.status(404).json({ message: "User challenge not found" });
      }
      
      res.json(updatedUserChallenge);
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      res.status(500).json({ message: "Failed to update challenge progress" });
    }
  });
  
  app.post("/api/user/challenges/:challengeId/complete", async (req, res) => {
    let userId: number;
    
    // Check for session auth
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      // Try header auth
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
    
    try {
      const challengeId = parseInt(req.params.challengeId);
      const completedChallenge = await storage.completeUserChallenge(userId, challengeId);
      
      if (!completedChallenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(completedChallenge);
    } catch (error) {
      console.error("Error completing challenge:", error);
      res.status(500).json({ message: "Failed to complete challenge" });
    }
  });
  
  // User Level API
  app.get("/api/user/level", async (req, res) => {
    if (!req.isAuthenticated()) {
      // Try header auth
      const userId = req.headers['x-user-id'];
      if (userId) {
        try {
          const userLevel = await storage.getUserLevel(Number(userId));
          if (!userLevel) {
            // Initialize level if it doesn't exist
            const newUserLevel = await storage.initializeUserLevel(Number(userId));
            return res.json(newUserLevel);
          }
          return res.json(userLevel);
        } catch (error) {
          console.error("Error fetching user level with header auth:", error);
          return res.status(500).json({ message: "Failed to fetch user level" });
        }
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userLevel = await storage.getUserLevel(req.user.id);
      
      if (!userLevel) {
        // Initialize level if it doesn't exist
        const newUserLevel = await storage.initializeUserLevel(req.user.id);
        return res.json(newUserLevel);
      }
      
      res.json(userLevel);
    } catch (error) {
      console.error("Error fetching user level:", error);
      res.status(500).json({ message: "Failed to fetch user level" });
    }
  });
  
  app.post("/api/user/level/streak/update", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const updatedLevel = await storage.updateUserStreak(req.user.id);
      res.json(updatedLevel);
    } catch (error) {
      console.error("Error updating user streak:", error);
      res.status(500).json({ message: "Failed to update user streak" });
    }
  });
  
  app.post("/api/user/level/xp", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only administrators can manually award XP" });
    }
    
    try {
      const { userId, xpAmount } = req.body;
      
      if (!userId || typeof xpAmount !== 'number' || xpAmount <= 0) {
        return res.status(400).json({ message: "Valid user ID and positive XP amount required" });
      }
      
      const updatedLevel = await storage.addUserXp(userId, xpAmount);
      
      if (!updatedLevel) {
        return res.status(404).json({ message: "User level not found" });
      }
      
      res.json(updatedLevel);
    } catch (error) {
      console.error("Error adding XP:", error);
      res.status(500).json({ message: "Failed to add XP" });
    }
  });
  
  // Check for new achievements after user actions
  app.post("/api/user/check-achievements", async (req, res) => {
    let userId: number;
    
    // Check for session auth
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      // Try header auth
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
    
    try {
      // Get user's current achievements
      const currentAchievements = await storage.getUserAchievements(userId);
      const currentAchievementIds = new Set(currentAchievements.map((ua: any) => ua.achievement.id));
      
      // Get all available achievements
      const allAchievements = await storage.getAchievements();
      
      // Check which achievements can be unlocked
      const newAchievements = [];
      
      for (const achievement of allAchievements) {
        if (currentAchievementIds.has(achievement.id)) {
          continue; // Already unlocked
        }
        
        // Check achievement conditions based on type
        let shouldUnlock = false;
        
        switch (achievement.type) {
          case 'challenge_completion':
            const completedChallenges = await storage.getUserCompletedChallengesCount(userId);
            if (achievement.condition && completedChallenges >= parseInt(achievement.condition)) {
              shouldUnlock = true;
            }
            break;
            
          case 'course_completion':
            const completedCourses = await storage.getUserCompletedCoursesCount(userId);
            if (achievement.condition && completedCourses >= parseInt(achievement.condition)) {
              shouldUnlock = true;
            }
            break;
            
          case 'streak':
            const userLevel = await storage.getUserLevel(userId);
            if (achievement.condition && userLevel?.streak >= parseInt(achievement.condition)) {
              shouldUnlock = true;
            }
            break;
            
          case 'xp_milestone':
            const userLevelForXp = await storage.getUserLevel(userId);
            if (achievement.condition && userLevelForXp?.totalXp >= parseInt(achievement.condition)) {
              shouldUnlock = true;
            }
            break;
            
          case 'level_milestone':
            const userLevelForLevel = await storage.getUserLevel(userId);
            if (achievement.condition && userLevelForLevel?.level >= parseInt(achievement.condition)) {
              shouldUnlock = true;
            }
            break;
        }
        
        if (shouldUnlock) {
          // Unlock the achievement
          await storage.unlockUserAchievement(userId, achievement.id);
          
          // Award points and XP
          await storage.addUserXp(userId, achievement.xpReward || 0);
          
          newAchievements.push(achievement);
        }
      }
      
      res.json({ newAchievements });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });
  
  // Admin routes
  app.post("/api/admin/seed-challenges", async (req, res) => {
    // First check session authentication
    if (req.isAuthenticated() && req.user.role === "admin") {
      try {
        await seedChallenges();
        res.json({ message: "Challenges seeded successfully" });
      } catch (error) {
        console.error("Failed to seed challenges:", error);
        res.status(500).json({ message: "Failed to seed challenges" });
      }
      return;
    }
    
    // Try header authentication as a fallback
    const userId = req.headers['x-user-id'];
    if (userId) {
      try {
        const user = await storage.getUser(Number(userId));
        if (user && user.role === "admin") {
          await seedChallenges();
          return res.json({ message: "Challenges seeded successfully" });
        }
      } catch (error) {
        console.error("Error with header auth for seeding challenges:", error);
      }
    }
    
    return res.status(403).json({ message: "Only administrators can seed challenges" });
  });
  
  // Suggestions API for goals, fields, lessons, etc.
  app.get("/api/suggestions", async (req, res) => {
    try {
      const type = req.query.type as string;
      const query = req.query.query as string || '';
      const language = req.query.language as string || 'en'; // Default to English
      
      if (!type) {
        return res.status(400).json({ message: "Type parameter is required" });
      }
      
      // Use the suggestion service with language support
      const suggestions = getSuggestions(type, language, query);
      
      if (suggestions.length === 0 && !query) {
        return res.status(400).json({ message: "Invalid suggestion type" });
      }
      
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  // Learning Paths API endpoints
  app.get("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const learningPaths = await storage.getUserLearningPaths(req.user.id);
      res.json(learningPaths);
    } catch (error) {
      console.error("Error getting learning paths:", error);
      res.status(500).json({ message: "Failed to get learning paths" });
    }
  });

  app.post("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const pathData = {
        ...req.body,
        createdBy: req.user.id,
        userId: req.user.id
      };
      
      const learningPath = await storage.createLearningPath(pathData);
      res.status(201).json(learningPath);
    } catch (error) {
      console.error("Error creating learning path:", error);
      res.status(500).json({ message: "Failed to create learning path" });
    }
  });

  app.get("/api/learning-paths/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const pathId = parseInt(req.params.id);
      const learningPath = await storage.getLearningPath(pathId);
      
      if (!learningPath) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      // Check if user owns this path or if it's public
      if (learningPath.userId !== req.user.id && !learningPath.isPublic) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(learningPath);
    } catch (error) {
      console.error("Error getting learning path:", error);
      res.status(500).json({ message: "Failed to get learning path" });
    }
  });

  app.put("/api/learning-paths/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const pathId = parseInt(req.params.id);
      const learningPath = await storage.getLearningPath(pathId);
      
      if (!learningPath || learningPath.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedPath = await storage.updateLearningPath(pathId, req.body);
      res.json(updatedPath);
    } catch (error) {
      console.error("Error updating learning path:", error);
      res.status(500).json({ message: "Failed to update learning path" });
    }
  });

  app.delete("/api/learning-paths/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const pathId = parseInt(req.params.id);
      const learningPath = await storage.getLearningPath(pathId);
      
      if (!learningPath || learningPath.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteLearningPath(pathId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting learning path:", error);
      res.status(500).json({ message: "Failed to delete learning path" });
    }
  });

  // Student Control Panel endpoints
  app.get("/api/student/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const stats = {
        totalHours: 0,
        coursesCompleted: 0,
        currentStreak: 0,
        averageGrade: 0,
        weeklyProgress: [2, 4, 1, 6, 3, 5, 7] // Mock data for now
      };
      res.json(stats);
    } catch (error) {
      console.error("Error getting student stats:", error);
      res.status(500).json({ message: "Failed to get student stats" });
    }
  });

  app.get("/api/assignments/upcoming", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Return mock data for now
      const assignments = [];
      res.json(assignments);
    } catch (error) {
      console.error("Error getting upcoming assignments:", error);
      res.status(500).json({ message: "Failed to get upcoming assignments" });
    }
  });

  // Mentor Control Panel endpoints
  app.get("/api/mentor/students", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user is mentor/instructor
    if (!["instructor", "mentor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      // Return mock student data for now
      const students = [
        {
          id: 1,
          displayName: "Alex Johnson",
          username: "alex.j",
          coursesEnrolled: 3,
          coursesCompleted: 2,
          averageGrade: 85,
          lastActivity: new Date().toISOString(),
          currentStreak: 5,
          totalStudyHours: 45
        },
        {
          id: 2,
          displayName: "Maria Garcia",
          username: "maria.g",
          coursesEnrolled: 2,
          coursesCompleted: 1,
          averageGrade: 92,
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          currentStreak: 12,
          totalStudyHours: 38
        }
      ];
      res.json(students);
    } catch (error) {
      console.error("Error getting mentor students:", error);
      res.status(500).json({ message: "Failed to get mentor students" });
    }
  });

  app.get("/api/mentor/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["instructor", "mentor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const stats = {
        totalStudents: 2,
        activeStudents: 2,
        averageGrade: 88,
        totalHoursThisWeek: 83,
        completionRate: 75
      };
      res.json(stats);
    } catch (error) {
      console.error("Error getting mentor stats:", error);
      res.status(500).json({ message: "Failed to get mentor stats" });
    }
  });

  app.get("/api/mentor/recent-activities", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["instructor", "mentor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      // Return mock activity data for now
      const activities = [
        {
          id: 1,
          studentName: "Alex Johnson",
          description: "Completed lesson: Introduction to React",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          studentName: "Maria Garcia",
          description: "Submitted assignment: JavaScript Fundamentals",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ];
      res.json(activities);
    } catch (error) {
      console.error("Error getting recent activities:", error);
      res.status(500).json({ message: "Failed to get recent activities" });
    }
  });

  app.post("/api/mentor/students/:studentId/message", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["instructor", "mentor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const studentId = parseInt(req.params.studentId);
      const { message } = req.body;
      
      // In a real implementation, this would send a message to the student
      // For now, just return success
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  // Comprehensive Gamification System API Endpoints
  
  // Get comprehensive leaderboards with real user data
  app.get("/api/leaderboards", async (req, res) => {
    try {
      // Fetch all users with their levels for XP leaderboard
      const usersWithLevels = await storage.getAllUsersWithLevels();
      
      // Create XP leaderboard entries
      const xpLeaderboardEntries = usersWithLevels
        .map((userLevel: any) => ({
          id: userLevel.userId,
          userId: userLevel.userId,
          score: userLevel.totalXp || 0,
          rank: 0, // Will be set after sorting
          streak: userLevel.streak || 0,
          user: {
            id: userLevel.userId,
            username: userLevel.user?.username || `user${userLevel.userId}`,
            displayName: userLevel.user?.displayName || userLevel.user?.username || `User ${userLevel.userId}`,
            avatarUrl: userLevel.user?.avatarUrl || null
          }
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      // Create points leaderboard entries  
      const pointsLeaderboardEntries = usersWithLevels
        .map((userLevel: any) => ({
          id: userLevel.userId + 1000,
          userId: userLevel.userId,
          score: userLevel.totalPoints || 0,
          rank: 0,
          streak: userLevel.streak || 0,
          user: {
            id: userLevel.userId,
            username: userLevel.user?.username || `user${userLevel.userId}`,
            displayName: userLevel.user?.displayName || userLevel.user?.username || `User ${userLevel.userId}`,
            avatarUrl: userLevel.user?.avatarUrl || null
          }
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      // Create weekly activity leaderboard (simulated for now)
      const weeklyEntries = xpLeaderboardEntries
        .map(entry => ({
          ...entry,
          id: entry.id + 2000,
          score: Math.max(0, Math.floor(entry.score * 0.3) + Math.floor(Math.random() * 500)),
          change: Math.floor(Math.random() * 10) - 5 // Random position change
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 15)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      // Create streak leaderboard
      const streakEntries = usersWithLevels
        .filter((userLevel: any) => (userLevel.streak || 0) > 0)
        .map((userLevel: any) => ({
          id: userLevel.userId + 3000,
          userId: userLevel.userId,
          score: userLevel.streak || 0,
          rank: 0,
          streak: userLevel.streak || 0,
          user: {
            id: userLevel.userId,
            username: userLevel.user?.username || `user${userLevel.userId}`,
            displayName: userLevel.user?.displayName || userLevel.user?.username || `User ${userLevel.userId}`,
            avatarUrl: userLevel.user?.avatarUrl || null
          }
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      // Create challenge completion leaderboard
      const challengeEntries = xpLeaderboardEntries
        .map(entry => ({
          ...entry,
          id: entry.id + 200,
          score: Math.floor(entry.score / 100) // Convert XP to challenge count estimate
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      const leaderboards = {
        xp: {
          id: 1,
          name: "XP Champions",
          description: "Top learners by experience points",
          type: "xp",
          timeframe: "all_time",
          entries: xpLeaderboardEntries.slice(0, 20)
        },
        points: {
          id: 2,
          name: "Point Masters",
          description: "Highest scoring achievers",
          type: "points", 
          timeframe: "all_time",
          entries: pointsLeaderboardEntries.slice(0, 20)
        },
        weekly: {
          id: 3,
          name: "Weekly Champions",
          description: "Most active learners this week",
          type: "weekly",
          timeframe: "weekly",
          entries: weeklyEntries
        },
        streaks: {
          id: 4,
          name: "Streak Legends",
          description: "Longest learning streaks",
          type: "streaks",
          timeframe: "all_time",
          entries: streakEntries.slice(0, 15)
        }
      };
      
      res.json(leaderboards);
    } catch (error) {
      console.error("Error fetching leaderboards:", error);
      res.status(500).json({ message: "Failed to fetch leaderboards" });
    }
  });

  // Get all available achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user's achievements
  app.get("/api/user/achievements", async (req, res) => {
    if (!req.isAuthenticated()) {
      // Try header auth for consistent behavior
      const userId = req.headers['x-user-id'];
      if (userId) {
        try {
          const userAchievements = await storage.getUserAchievements(Number(userId));
          return res.json(userAchievements);
        } catch (error) {
          console.error("Error fetching user achievements with header auth:", error);
          return res.status(500).json({ message: "Failed to fetch user achievements" });
        }
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userAchievements = await storage.getUserAchievements(req.user.id);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Get user rankings across all categories
  app.get("/api/user/rankings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const usersWithLevels = await storage.getAllUsersWithLevels();
      
      // Sort by total XP and find user's rank
      const sortedUsers = usersWithLevels
        .sort((a: any, b: any) => (b.totalXp || 0) - (a.totalXp || 0));
      
      const userRank = sortedUsers.findIndex((u: any) => u.userId === userId) + 1;
      
      res.json({
        overall: userRank,
        total: sortedUsers.length,
        percentile: Math.round((1 - (userRank - 1) / sortedUsers.length) * 100)
      });
    } catch (error) {
      console.error("Error fetching user rankings:", error);
      res.status(500).json({ error: "Failed to fetch user rankings" });
    }
  });

  // Get user recent activities
  app.get("/api/user/activities", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getUserActivityLogs(req.user.id, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      res.status(500).json({ error: "Failed to fetch user activities" });
    }
  });

  // Get all achievements for the achievements gallery
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching all achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Check and unlock achievements based on user progress
  app.post("/api/user/check-achievements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = req.user.id;
      const newlyUnlocked = await storage.checkAndUnlockAchievements(userId);
      
      res.json({
        newAchievements: newlyUnlocked,
        message: newlyUnlocked.length > 0 ? `Unlocked ${newlyUnlocked.length} new achievement(s)!` : 'No new achievements'
      });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ error: "Failed to check achievements" });
    }
  });

  // Social Media Integration API Endpoints
  
  // Get social feed with real user activities
  app.get("/api/social/feed", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const socialPosts = await storage.getSocialFeed(req.user.id, limit);
      res.json(socialPosts);
    } catch (error) {
      console.error("Error fetching social feed:", error);
      res.status(500).json({ error: "Failed to fetch social feed" });
    }
  });

  // Create social post (achievement share, progress update, etc.)
  app.post("/api/social/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { type, content, data } = req.body;
      const socialPost = await storage.createSocialPost({
        userId: req.user.id,
        type,
        content,
        data
      });
      
      res.status(201).json(socialPost);
    } catch (error) {
      console.error("Error creating social post:", error);
      res.status(500).json({ error: "Failed to create social post" });
    }
  });

  // Like/unlike a social post
  app.post("/api/social/posts/:postId/like", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const postId = parseInt(req.params.postId);
      const result = await storage.togglePostLike(postId, req.user.id);
      res.json(result);
    } catch (error) {
      console.error("Error toggling post like:", error);
      res.status(500).json({ error: "Failed to toggle like" });
    }
  });

  // Get user's social profile
  app.get("/api/users/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getUserSocialProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Follow/unfollow a user
  app.post("/api/users/:userId/follow", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const targetUserId = parseInt(req.params.userId);
      const { action } = req.body; // 'follow' or 'unfollow'
      
      const result = await storage.toggleUserFollow(req.user.id, targetUserId, action);
      res.json(result);
    } catch (error) {
      console.error("Error toggling follow:", error);
      res.status(500).json({ error: "Failed to toggle follow" });
    }
  });

  // Get trending hashtags and topics
  app.get("/api/social/trending", async (req, res) => {
    try {
      const trending = await storage.getTrendingTopics();
      res.json(trending);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      res.status(500).json({ error: "Failed to fetch trending topics" });
    }
  });

  // Social authentication endpoints (OAuth integration would go here)
  app.post("/api/auth/social/:provider", async (req, res) => {
    try {
      const { provider } = req.params;
      const { token, profile } = req.body;
      
      // In production, this would validate the OAuth token and create/login user
      res.json({
        message: `${provider} authentication would be processed here`,
        provider,
        success: false // Set to true when OAuth is implemented
      });
    } catch (error) {
      console.error("Error with social authentication:", error);
      res.status(500).json({ error: "Social authentication failed" });
    }
  });

  // AI-Enhanced Modules API - Personalized content for each lesson and sub-component
  app.get("/api/courses/:courseId/ai-modules/:userId", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = parseInt(req.params.userId);
      
      const authenticatedUserId = req.isAuthenticated() ? req.user.id : 
        req.headers['x-user-id'] ? parseInt(req.headers['x-user-id'] as string) : null;
      
      if (!authenticatedUserId || authenticatedUserId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { generateAIEnhancedModules } = await import('./ai-module-service');
      const enhancedModules = await generateAIEnhancedModules(courseId, userId);
      
      res.json(enhancedModules);
    } catch (error) {
      console.error("Error generating AI-enhanced modules:", error);
      res.status(500).json({ error: "Failed to generate AI-enhanced modules" });
    }
  });

  // Interactive Lesson Trails API Endpoints
  
  // Get user's learning trails
  app.get("/api/learning-trails", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const trails = await storage.getUserLearningTrails(req.user.id);
      res.json(trails);
    } catch (error) {
      console.error("Error fetching learning trails:", error);
      res.status(500).json({ error: "Failed to fetch learning trails" });
    }
  });

  // Generate new learning trail for a course
  app.post("/api/learning-trails/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { courseId } = req.body;
      
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }

      // Generate AI-powered lesson trail
      const trailData = await generateLessonTrail(courseId, req.user.id);
      
      // Save the trail to database
      const savedTrail = await saveLessonTrail(
        courseId,
        trailData,
        `Interactive Trail for Course ${courseId}`,
        "AI-generated personalized learning path with educational hover information"
      );

      res.status(201).json(savedTrail);
    } catch (error) {
      console.error("Error generating learning trail:", error);
      res.status(500).json({ error: "Failed to generate learning trail" });
    }
  });

  // Update trail progress
  app.post("/api/learning-trails/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { trailId, nodeId, timeSpent } = req.body;
      
      await updateTrailProgress(req.user.id, trailId, nodeId, timeSpent);
      
      // Record learning analytics
      await recordLearningAnalytics(req.user.id, `trail_${trailId}_${Date.now()}`, {
        courseId: trailId,
        activityType: 'complete_node',
        timeSpent,
        interactionData: { nodeId, trailId },
        performanceScore: 0.8 // Could be calculated based on actual performance
      });

      res.json({ message: "Progress updated successfully" });
    } catch (error) {
      console.error("Error updating trail progress:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Get personalized recommendations
  app.get("/api/personalized-recommendations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const recommendations = await generatePersonalizedRecommendations(req.user.id);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Accept a personalized recommendation
  app.post("/api/personalized-recommendations/:id/accept", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const recommendationId = parseInt(req.params.id);
      await storage.acceptPersonalizedRecommendation(recommendationId, req.user.id);
      
      res.json({ message: "Recommendation accepted" });
    } catch (error) {
      console.error("Error accepting recommendation:", error);
      res.status(500).json({ error: "Failed to accept recommendation" });
    }
  });

  // Get learning analytics and stats
  app.get("/api/learning-stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const stats = await storage.getUserLearningStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching learning stats:", error);
      res.status(500).json({ error: "Failed to fetch learning stats" });
    }
  });

  // Record detailed learning analytics
  app.post("/api/learning-analytics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { sessionId, lessonId, courseId, activityType, timeSpent, interactionData, performanceScore, difficultyRating } = req.body;
      
      await recordLearningAnalytics(req.user.id, sessionId, {
        lessonId,
        courseId,
        activityType,
        timeSpent,
        interactionData,
        performanceScore,
        difficultyRating
      });

      res.json({ message: "Analytics recorded successfully" });
    } catch (error) {
      console.error("Error recording learning analytics:", error);
      res.status(500).json({ error: "Failed to record analytics" });
    }
  });

  // Skill Challenge Routes
  app.get('/api/skill-challenges', async (req, res) => {
    try {
      const { courseId, moduleId, lessonId, difficulty, category } = req.query;
      
      let whereConditions = [eq(skillChallenges.isActive, true)];
      
      if (courseId) {
        whereConditions.push(eq(skillChallenges.courseId, parseInt(courseId as string)));
      }
      if (moduleId) {
        whereConditions.push(eq(skillChallenges.moduleId, parseInt(moduleId as string)));
      }
      if (lessonId) {
        whereConditions.push(eq(skillChallenges.lessonId, parseInt(lessonId as string)));
      }
      if (difficulty) {
        whereConditions.push(eq(skillChallenges.difficulty, difficulty as string));
      }
      if (category) {
        whereConditions.push(eq(skillChallenges.category, category as string));
      }
      
      const challenges = await db.select().from(skillChallenges).where(and(...whereConditions));
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching skill challenges:', error);
      res.status(500).json({ error: 'Failed to fetch skill challenges' });
    }
  });

  app.get('/api/skill-challenges/random', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { difficulty, category } = req.query;
      const userId = req.user.id;

      // Get challenges the user hasn't attempted recently
      const recentAttempts = await db.select({ challengeId: userSkillChallengeAttempts.challengeId })
        .from(userSkillChallengeAttempts)
        .where(and(
          eq(userSkillChallengeAttempts.userId, userId),
          gte(userSkillChallengeAttempts.attemptedAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24 hours
        ));

      const recentChallengeIds = recentAttempts.map(a => a.challengeId);

      let whereConditions = [eq(skillChallenges.isActive, true)];
      
      if (recentChallengeIds.length > 0) {
        whereConditions.push(notInArray(skillChallenges.id, recentChallengeIds));
      }
      if (difficulty) {
        whereConditions.push(eq(skillChallenges.difficulty, difficulty as string));
      }
      if (category) {
        whereConditions.push(eq(skillChallenges.category, category as string));
      }

      const availableChallenges = await db.select()
        .from(skillChallenges)
        .where(and(...whereConditions));
      
      if (availableChallenges.length === 0) {
        return res.status(404).json({ error: 'No available challenges' });
      }

      // Select random challenge
      const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
      res.json(randomChallenge);
    } catch (error) {
      console.error('Error fetching random skill challenge:', error);
      res.status(500).json({ error: 'Failed to fetch random challenge' });
    }
  });

  app.post('/api/skill-challenges/submit', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { challengeId, answer, timeSpent, isCorrect, timedOut, hintUsed } = req.body;
      const userId = req.user.id;

      // Get the challenge to determine rewards
      const [challenge] = await db.select()
        .from(skillChallenges)
        .where(eq(skillChallenges.id, challengeId));

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      let pointsEarned = isCorrect ? challenge.points : 0;
      let xpEarned = isCorrect ? challenge.xpReward : 0;
      let bonusPointsEarned = 0;
      let speedBonus = 0;
      let streakCount = 0;
      let perfectScore = false;

      if (isCorrect) {
        // Calculate speed bonus (if completed in less than 50% of time limit)
        const completionPercentage = timeSpent / challenge.timeLimit;
        if (completionPercentage < 0.5) {
          speedBonus = Math.floor(challenge.points * 0.5);
          bonusPointsEarned += speedBonus;
        }

        // Check if it's a perfect score (no hints used, fast completion)
        if (!hintUsed && completionPercentage < 0.7) {
          perfectScore = true;
          const bonusMultiplier = Number(challenge.bonusMultiplier) || 1.0;
          bonusPointsEarned += Math.floor(challenge.points * (bonusMultiplier - 1));
        }

        // Handle streak tracking
        const [existingStreak] = await db.select()
          .from(userChallengeStreaks)
          .where(and(
            eq(userChallengeStreaks.userId, userId),
            eq(userChallengeStreaks.category, challenge.category)
          ));

        if (existingStreak) {
          const newStreak = (existingStreak.currentStreak || 0) + 1;
          streakCount = newStreak;
          
          // Add streak bonus
          if (newStreak >= 3) {
            bonusPointsEarned += (challenge.streakBonus || 0) * Math.floor(newStreak / 3);
          }

          await db.update(userChallengeStreaks)
            .set({
              currentStreak: newStreak,
              maxStreak: Math.max(existingStreak.maxStreak || 0, newStreak),
              lastCorrectAt: new Date()
            })
            .where(eq(userChallengeStreaks.id, existingStreak.id));
        } else {
          streakCount = 1;
          await db.insert(userChallengeStreaks).values({
            userId,
            category: challenge.category,
            currentStreak: 1,
            maxStreak: 1,
            lastCorrectAt: new Date(),
            streakStartedAt: new Date()
          });
        }
      } else {
        // Reset streak on incorrect answer
        await db.update(userChallengeStreaks)
          .set({ currentStreak: 0 })
          .where(and(
            eq(userChallengeStreaks.userId, userId),
            eq(userChallengeStreaks.category, challenge.category)
          ));
      }

      // Total rewards
      const totalPointsEarned = pointsEarned + bonusPointsEarned;

      // Record the attempt
      await db.insert(userSkillChallengeAttempts).values({
        userId,
        challengeId,
        answer,
        timeSpent,
        isCorrect,
        pointsEarned: totalPointsEarned,
        xpEarned,
        bonusPointsEarned,
        streakCount,
        perfectScore,
        speedBonus,
        timedOut: timedOut || false,
        hintUsed: hintUsed || false
      });

      // Update user level if they earned points/XP
      if (isCorrect && (pointsEarned > 0 || xpEarned > 0)) {
        const [userLevel] = await db.select()
          .from(userLevels)
          .where(eq(userLevels.userId, userId));

        if (userLevel) {
          const newTotalXp = userLevel.totalXp + xpEarned;
          const newTotalPoints = userLevel.totalPoints + totalPointsEarned;
          const newCurrentXp = userLevel.currentXp + xpEarned;
          
          // Calculate level progression
          let newLevel = userLevel.level;
          let remainingXp = newCurrentXp;
          let nextLevelXp = userLevel.nextLevelXp;
          
          while (remainingXp >= nextLevelXp) {
            remainingXp -= nextLevelXp;
            newLevel++;
            nextLevelXp = newLevel * 100; // Simple level progression
          }
          
          await db.update(userLevels)
            .set({
              level: newLevel,
              currentXp: remainingXp,
              totalXp: newTotalXp,
              nextLevelXp: nextLevelXp,
              totalPoints: newTotalPoints
            })
            .where(eq(userLevels.userId, userId));
        }
      }

      res.json({ 
        success: true, 
        pointsEarned: totalPointsEarned,
        basePoints: pointsEarned,
        bonusPointsEarned,
        speedBonus,
        streakCount,
        perfectScore,
        xpEarned,
        isCorrect,
        rewards: {
          base: `${pointsEarned} points + ${xpEarned} XP`,
          bonus: bonusPointsEarned > 0 ? `+${bonusPointsEarned} bonus points` : null,
          streak: streakCount > 1 ? `${streakCount}x streak!` : null,
          perfect: perfectScore ? 'Perfect Score!' : null
        }
      });
    } catch (error) {
      console.error('Error submitting skill challenge:', error);
      res.status(500).json({ error: 'Failed to submit skill challenge' });
    }
  });

  // Challenge Learning Paths API
  app.get("/api/challenge-learning-paths", async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      
      let whereConditions = [eq(challengeLearningPaths.isActive, true)];
      
      if (category) {
        whereConditions.push(eq(challengeLearningPaths.category, category as string));
      }
      if (difficulty) {
        whereConditions.push(eq(challengeLearningPaths.difficulty, difficulty as string));
      }
      
      const paths = await db.select().from(challengeLearningPaths).where(and(...whereConditions));
      res.json(paths);
    } catch (error) {
      console.error("Error fetching challenge learning paths:", error);
      res.status(500).json({ error: "Failed to fetch challenge learning paths" });
    }
  });

  app.get("/api/challenge-learning-paths/:id", async (req, res) => {
    try {
      const pathId = parseInt(req.params.id);
      
      // Get the path details
      const [path] = await db.select()
        .from(challengeLearningPaths)
        .where(eq(challengeLearningPaths.id, pathId));
      
      if (!path) {
        return res.status(404).json({ error: "Learning path not found" });
      }
      
      // Get the path steps with challenge details
      const steps = await db.select({
        id: challengePathSteps.id,
        stepOrder: challengePathSteps.stepOrder,
        isRequired: challengePathSteps.isRequired,
        unlockConditions: challengePathSteps.unlockConditions,
        challenge: {
          id: skillChallenges.id,
          title: skillChallenges.title,
          description: skillChallenges.description,
          type: skillChallenges.type,
          difficulty: skillChallenges.difficulty,
          category: skillChallenges.category,
          timeLimit: skillChallenges.timeLimit,
          points: skillChallenges.points,
          xpReward: skillChallenges.xpReward,
          tags: skillChallenges.tags,
        }
      })
      .from(challengePathSteps)
      .innerJoin(skillChallenges, eq(challengePathSteps.challengeId, skillChallenges.id))
      .where(eq(challengePathSteps.pathId, pathId))
      .orderBy(challengePathSteps.stepOrder);
      
      res.json({ ...path, steps });
    } catch (error) {
      console.error("Error fetching challenge learning path:", error);
      res.status(500).json({ error: "Failed to fetch challenge learning path" });
    }
  });

  app.post("/api/challenge-learning-paths/:id/start", async (req, res) => {
    try {
      const pathId = parseInt(req.params.id);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Check if user already has progress for this path
      const [existingProgress] = await db.select()
        .from(userChallengeProgress)
        .where(and(
          eq(userChallengeProgress.userId, userId),
          eq(userChallengeProgress.pathId, pathId)
        ));
      
      if (existingProgress) {
        return res.json({ progress: existingProgress });
      }
      
      // Create new progress record
      const [newProgress] = await db.insert(userChallengeProgress)
        .values({
          userId,
          pathId,
          currentStep: 0,
          completedSteps: [],
          totalScore: 0,
          completionPercentage: 0,
        })
        .returning();
      
      res.json({ progress: newProgress });
    } catch (error) {
      console.error("Error starting challenge learning path:", error);
      res.status(500).json({ error: "Failed to start challenge learning path" });
    }
  });

  app.get("/api/challenge-learning-paths/:id/progress", async (req, res) => {
    try {
      const pathId = parseInt(req.params.id);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const [progress] = await db.select()
        .from(userChallengeProgress)
        .where(and(
          eq(userChallengeProgress.userId, userId),
          eq(userChallengeProgress.pathId, pathId)
        ));
      
      if (!progress) {
        return res.json({ progress: null });
      }
      
      // Get total steps for percentage calculation
      const totalSteps = await db.select({ count: sql<number>`count(*)` })
        .from(challengePathSteps)
        .where(eq(challengePathSteps.pathId, pathId));
      
      const completedCount = progress.completedSteps?.length || 0;
      const totalCount = totalSteps[0]?.count || 0;
      const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      // Update completion percentage if it's different
      if (completionPercentage !== progress.completionPercentage) {
        await db.update(userChallengeProgress)
          .set({ completionPercentage })
          .where(eq(userChallengeProgress.id, progress.id));
      }
      
      res.json({ 
        progress: { 
          ...progress, 
          completionPercentage,
          totalSteps: totalCount,
          completedSteps: completedCount
        }
      });
    } catch (error) {
      console.error("Error fetching challenge learning path progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Import advanced adaptive services - move to top level
  // Dynamic import handled in separate function

  // Advanced Adaptive Learning API routes
  app.post("/api/adaptive/learning-style/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = parseInt(req.params.userId);
      const { interactionData, language = 'en' } = req.body;
      
      // Ensure user can only access their own data or admin/instructor can access any
      if (userId !== req.user.id && !["admin", "instructor"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const learningStyle = await detectLearningStyle(userId, interactionData, language);
      res.json(learningStyle);
    } catch (error) {
      console.error("Error detecting learning style:", error);
      res.status(500).json({ message: "Failed to detect learning style" });
    }
  });

  app.post("/api/adaptive/difficulty-adjustment/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = parseInt(req.params.userId);
      const { performanceData, language = 'en' } = req.body;
      
      if (userId !== req.user.id && !["admin", "instructor"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const adjustment = await generateDifficultyAdjustment(userId, performanceData, language);
      res.json(adjustment);
    } catch (error) {
      console.error("Error generating difficulty adjustment:", error);
      res.status(500).json({ message: "Failed to generate difficulty adjustment" });
    }
  });

  app.post("/api/adaptive/predictive-analytics/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = parseInt(req.params.userId);
      const { learningHistory, language = 'en' } = req.body;
      
      if (userId !== req.user.id && !["admin", "instructor"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const analytics = await generatePredictiveAnalytics(userId, learningHistory, language);
      res.json(analytics);
    } catch (error) {
      console.error("Error generating predictive analytics:", error);
      res.status(500).json({ message: "Failed to generate predictive analytics" });
    }
  });

  app.post("/api/adaptive/insights/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = parseInt(req.params.userId);
      const { comprehensiveData, language = 'en' } = req.body;
      
      if (userId !== req.user.id && !["admin", "instructor"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const insights = await generateAdaptiveInsights(userId, comprehensiveData, language);
      res.json(insights);
    } catch (error) {
      console.error("Error generating adaptive insights:", error);
      res.status(500).json({ message: "Failed to generate adaptive insights" });
    }
  });

  // Adaptive Learning Path API routes
  app.get("/api/learning-paths/:pathId/adaptive", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const pathId = parseInt(req.params.pathId);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : req.user.id;
      
      // Ensure user can only access their own adaptive path or admin/instructor can access any
      if (userId !== req.user.id && !["admin", "instructor"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const adaptivePath = await generateAdaptiveLearningPath(pathId, userId);
      res.json(adaptivePath);
    } catch (error) {
      console.error("Error generating adaptive learning path:", error);
      res.status(500).json({ message: "Failed to generate adaptive learning path" });
    }
  });

  app.post("/api/learning-paths/:pathId/steps/:stepId/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const pathId = parseInt(req.params.pathId);
      const stepId = parseInt(req.params.stepId);
      const { progress } = req.body;
      
      const result = await updateStepProgress(pathId, stepId, progress);
      res.json(result);
    } catch (error) {
      console.error("Error updating step progress:", error);
      res.status(500).json({ message: "Failed to update step progress" });
    }
  });

  app.post("/api/learning-paths/:pathId/generate-recommendations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const pathId = parseInt(req.params.pathId);
      const { userId } = req.body;
      
      // Ensure user can only generate recommendations for themselves
      if (userId !== req.user.id && !["admin", "instructor"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const recommendations = await generateNewRecommendations(pathId, userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating new recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // Mentor Management API Endpoints
  
  // Get all mentors with optional filtering
  app.get("/api/mentors", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { isAiMentor, isActive, specialization } = req.query;
      const filters: any = {};
      
      if (isAiMentor !== undefined) filters.isAiMentor = isAiMentor === 'true';
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (specialization) filters.specialization = specialization as string;
      
      const mentors = await storage.getMentors(filters);
      res.json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });
  
  // Get user's assigned mentor
  app.get("/api/user/mentor", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userMentor = await storage.getUserMentor(req.user.id);
      if (!userMentor) {
        // Auto-assign a mentor if none exists
        const autoAssigned = await storage.autoAssignMentor(req.user.id);
        const newUserMentor = await storage.getUserMentor(req.user.id);
        return res.json(newUserMentor);
      }
      res.json(userMentor);
    } catch (error) {
      console.error("Error fetching user mentor:", error);
      res.status(500).json({ message: "Failed to fetch mentor" });
    }
  });
  
  // Assign mentor to user
  app.post("/api/user/mentor/assign", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { mentorId, preferredCommunication, communicationLanguage, notes } = req.body;
      
      if (!mentorId) {
        return res.status(400).json({ message: "Mentor ID is required" });
      }
      
      const assignment = await storage.assignMentorToUser(req.user.id, mentorId, {
        preferredCommunication,
        communicationLanguage,
        notes
      });
      
      const userMentor = await storage.getUserMentor(req.user.id);
      res.json(userMentor);
    } catch (error) {
      console.error("Error assigning mentor:", error);
      res.status(500).json({ message: "Failed to assign mentor" });
    }
  });
  
  // Create new mentor (admin/instructor only)
  app.post("/api/mentors", async (req, res) => {
    if (!req.isAuthenticated() || !["admin", "instructor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const mentorData = insertMentorSchema.parse(req.body);
      const newMentor = await storage.createMentor(mentorData);
      res.status(201).json(newMentor);
    } catch (error) {
      console.error("Error creating mentor:", error);
      res.status(500).json({ message: "Failed to create mentor" });
    }
  });
  
  // Study Program Management API Endpoints
  
  // Get all study programs
  app.get("/api/study-programs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { targetGroup, isActive } = req.query;
      const filters: any = {};
      
      if (targetGroup) filters.targetGroup = targetGroup as string;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      
      const programs = await storage.getStudyPrograms(filters);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching study programs:", error);
      res.status(500).json({ message: "Failed to fetch study programs" });
    }
  });
  
  // Get user's enrolled programs
  app.get("/api/user/study-programs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const programs = await storage.getUserStudyPrograms(req.user.id);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching user study programs:", error);
      res.status(500).json({ message: "Failed to fetch user study programs" });
    }
  });
  
  // Get specific study program with schedule
  app.get("/api/study-programs/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const programId = parseInt(req.params.id);
      const program = await storage.getStudyProgram(programId);
      
      if (!program) {
        return res.status(404).json({ message: "Study program not found" });
      }
      
      res.json(program);
    } catch (error) {
      console.error("Error fetching study program:", error);
      res.status(500).json({ message: "Failed to fetch study program" });
    }
  });
  
  // Enroll user in study program
  app.post("/api/study-programs/:id/enroll", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const programId = parseInt(req.params.id);
      const enrollment = await storage.enrollUserInProgram(req.user.id, programId);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error enrolling in study program:", error);
      res.status(500).json({ message: "Failed to enroll in study program" });
    }
  });
  
  // Update user's program progress
  app.put("/api/user/study-programs/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const programId = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedProgress = await storage.updateUserProgramProgress(
        req.user.id, 
        programId, 
        updateData
      );
      
      if (!updatedProgress) {
        return res.status(404).json({ message: "Program enrollment not found" });
      }
      
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating program progress:", error);
      res.status(500).json({ message: "Failed to update program progress" });
    }
  });
  
  // Create new study program (admin/instructor only)
  app.post("/api/study-programs", async (req, res) => {
    if (!req.isAuthenticated() || !["admin", "instructor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const programData = insertStudyProgramSchema.parse({
        ...req.body,
        createdBy: req.user.id
      });
      
      const newProgram = await storage.createStudyProgram(programData);
      res.status(201).json(newProgram);
    } catch (error) {
      console.error("Error creating study program:", error);
      res.status(500).json({ message: "Failed to create study program" });
    }
  });
  
  // Study Session Management API Endpoints
  
  // Get user's study sessions
  app.get("/api/user/study-sessions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { programId, startDate, endDate } = req.query;
      const filters: any = {};
      
      if (programId) filters.programId = parseInt(programId as string);
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      
      const sessions = await storage.getStudySessions(req.user.id, filters);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });
  
  // Create study session
  app.post("/api/user/study-sessions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const sessionData = insertStudySessionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const newSession = await storage.createStudySession(sessionData);
      res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(500).json({ message: "Failed to create study session" });
    }
  });
  
  // Update study session
  app.put("/api/user/study-sessions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const sessionId = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedSession = await storage.updateStudySession(sessionId, updateData);
      
      if (!updatedSession) {
        return res.status(404).json({ message: "Study session not found" });
      }
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Error updating study session:", error);
      res.status(500).json({ message: "Failed to update study session" });
    }
  });
  
  // Get user's weekly study statistics
  app.get("/api/user/study-stats/weekly", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { programId } = req.query;
      const programIdNum = programId ? parseInt(programId as string) : undefined;
      
      const stats = await storage.getUserWeeklyStats(req.user.id, programIdNum);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      res.status(500).json({ message: "Failed to fetch weekly stats" });
    }
  });
  
  // Program Schedule Management API Endpoints
  
  // Get program schedules
  app.get("/api/study-programs/:id/schedules", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const programId = parseInt(req.params.id);
      const { week } = req.query;
      const weekNum = week ? parseInt(week as string) : undefined;
      
      const schedules = await storage.getProgramSchedules(programId, weekNum);
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching program schedules:", error);
      res.status(500).json({ message: "Failed to fetch program schedules" });
    }
  });
  
  // Create program schedule (admin/instructor only)
  app.post("/api/study-programs/:id/schedules", async (req, res) => {
    if (!req.isAuthenticated() || !["admin", "instructor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const programId = parseInt(req.params.id);
      const scheduleData = insertProgramScheduleSchema.parse({
        ...req.body,
        programId
      });
      
      const newSchedule = await storage.createProgramSchedule(scheduleData);
      res.status(201).json(newSchedule);
    } catch (error) {
      console.error("Error creating program schedule:", error);
      res.status(500).json({ message: "Failed to create program schedule" });
    }
  });

  // ===============================
  // STUDY PLANNING API ROUTES
  // ===============================

  // Get user's study goals
  app.get("/api/study-goals", async (req, res) => {
    let userId: number;
    
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      const goals = await db.select().from(studyGoals).where(eq(studyGoals.userId, userId));
      res.json(goals);
    } catch (error) {
      console.error("Error fetching study goals:", error);
      res.status(500).json({ message: "Failed to fetch study goals" });
    }
  });

  // Create a new study goal
  app.post("/api/study-goals", async (req, res) => {
    let userId: number;
    
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      const goalData = insertStudyGoal.parse({
        ...req.body,
        userId
      });

      const [newGoal] = await db.insert(studyGoals).values(goalData).returning();
      res.status(201).json(newGoal);
    } catch (error) {
      console.error("Error creating study goal:", error);
      res.status(500).json({ message: "Failed to create study goal" });
    }
  });

  // Generate AI study plan for a goal
  app.post("/api/study-goals/:goalId/generate-plan", async (req, res) => {
    let userId: number;
    
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      const goalId = parseInt(req.params.goalId);
      
      // Get the goal
      const [goal] = await db.select().from(studyGoals).where(
        and(eq(studyGoals.id, goalId), eq(studyGoals.userId, userId))
      );

      if (!goal) {
        return res.status(404).json({ message: "Study goal not found" });
      }

      // Generate AI-powered study plan using Anthropic
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const prompt = `Create a detailed weekly study schedule for a ${goal.goalType} goal.
      
      Goal Details:
      - Target: ${goal.targetExam || 'General Learning'}
      - Subjects: ${goal.subjects.join(', ')}
      - Weekly Hours: ${goal.studyHoursPerWeek}
      - Priority: ${goal.priority}
      - Target Date: ${goal.targetDate}
      
      Generate a JSON response with weekly schedule including:
      1. Daily study sessions with time slots
      2. Subject rotation and focus areas
      3. Review sessions and practice tests
      4. Rest days and breaks
      
      Response format:
      {
        "weeklySchedule": [
          {
            "day": 0-6 (Sunday-Saturday),
            "sessions": [
              {
                "startTime": "09:00",
                "endTime": "11:00", 
                "subject": "Mathematics",
                "activity": "Theory and Practice"
              }
            ]
          }
        ],
        "recommendations": [
          "Study tip 1",
          "Study tip 2"
        ]
      }`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }]
      });

      const aiResponse = JSON.parse(response.content[0].text);
      
      // Save the generated schedule to database
      const schedulePromises = aiResponse.weeklySchedule.flatMap((day: any) =>
        day.sessions.map((session: any) => {
          const scheduleData = {
            userId,
            goalId,
            dayOfWeek: day.day,
            startTime: session.startTime,
            endTime: session.endTime,
            subject: session.subject,
            isCompleted: false,
            scheduledDate: goal.targetDate // Use goal target date as reference
          };
          
          return db.insert(studySchedules).values(scheduleData).returning();
        })
      );

      await Promise.all(schedulePromises);

      // Create AI recommendations
      const recommendations = aiResponse.recommendations.map((rec: string) => ({
        userId,
        type: 'schedule_optimization',
        title: 'AI Study Recommendation',
        description: rec,
        actionRequired: false,
        priority: 'medium'
      }));

      if (recommendations.length > 0) {
        await db.insert(learningRecommendations).values(recommendations);
      }

      res.json({
        message: "AI study plan generated successfully",
        schedule: aiResponse.weeklySchedule,
        recommendations: aiResponse.recommendations
      });

    } catch (error) {
      console.error("Error generating AI study plan:", error);
      res.status(500).json({ message: "Failed to generate study plan" });
    }
  });

  // Get user's study schedule
  app.get("/api/study-schedule", async (req, res) => {
    let userId: number;
    
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      const schedule = await db.select().from(studySchedules).where(eq(studySchedules.userId, userId));
      res.json(schedule);
    } catch (error) {
      console.error("Error fetching study schedule:", error);
      res.status(500).json({ message: "Failed to fetch study schedule" });
    }
  });

  // Get learning recommendations
  app.get("/api/learning-recommendations", async (req, res) => {
    let userId: number;
    
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      const recommendations = await db.select().from(learningRecommendations)
        .where(eq(learningRecommendations.userId, userId));
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Update study session completion
  app.patch("/api/study-schedule/:scheduleId/complete", async (req, res) => {
    let userId: number;
    
    if (req.isAuthenticated()) {
      userId = req.user.id;
    } else {
      const headerUserId = req.headers['x-user-id'];
      if (headerUserId) {
        userId = Number(headerUserId);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    try {
      const scheduleId = parseInt(req.params.scheduleId);
      
      const [updatedSession] = await db.update(studySchedules)
        .set({ isCompleted: true })
        .where(and(eq(studySchedules.id, scheduleId), eq(studySchedules.userId, userId)))
        .returning();

      if (!updatedSession) {
        return res.status(404).json({ message: "Study session not found" });
      }

      // Update goal progress
      const [goal] = await db.select().from(studyGoals).where(eq(studyGoals.id, updatedSession.goalId));
      if (goal) {
        const completedSessions = await db.select({ count: count() })
          .from(studySchedules)
          .where(and(
            eq(studySchedules.goalId, updatedSession.goalId),
            eq(studySchedules.isCompleted, true)
          ));

        const totalSessions = await db.select({ count: count() })
          .from(studySchedules)
          .where(eq(studySchedules.goalId, updatedSession.goalId));

        const progressPercentage = Math.round((completedSessions[0].count / totalSessions[0].count) * 100);

        await db.update(studyGoals)
          .set({ currentProgress: progressPercentage })
          .where(eq(studyGoals.id, updatedSession.goalId));
      }

      res.json(updatedSession);
    } catch (error) {
      console.error("Error updating study session:", error);
      res.status(500).json({ message: "Failed to update study session" });
    }
  });

  return httpServer;
}
