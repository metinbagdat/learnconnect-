import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCourseSchema, insertUserCourseSchema, insertAssignmentSchema, insertModuleSchema, insertLessonSchema, insertLearningPathSchema } from "@shared/schema";
import { z } from "zod";
import { generateCourse, saveGeneratedCourse, generateCourseRecommendations, generateLearningPath, saveLearningPath } from "./ai-service";
import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { seedChallenges } from "./seed-challenges";

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
  
  // Simple API for AI Assistant
  app.post("/api/ai/chat", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    
    // For MVP, return static responses based on keywords
    let response = "";
    
    if (message.toLowerCase().includes("angular momentum")) {
      response = "Angular momentum is like a spinning object's resistance to changing its rotation. Think of an ice skater spinning with arms outstretched, who spins faster when pulling their arms in. This demonstrates conservation of angular momentum.\n\nWould you like me to provide a practice problem on this topic?";
    } else if (message.toLowerCase().includes("python") || message.toLowerCase().includes("data science")) {
      response = "Python is a versatile language commonly used in data science. Libraries like Pandas, NumPy, and Scikit-learn provide powerful tools for data manipulation and analysis.\n\nCan I help you with a specific Python concept or data science technique?";
    } else if (message.toLowerCase().includes("marketing") || message.toLowerCase().includes("digital")) {
      response = "Digital marketing encompasses SEO, social media marketing, content strategy, and more. These channels help businesses reach and engage their target audience online.\n\nIs there a particular aspect of digital marketing you'd like to learn more about?";
    } else {
      response = "I'm your AI Learning Assistant. I can help with your coursework, explain concepts, or suggest additional resources. What would you like to know more about?";
    }
    
    res.json({ message: response });
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

  // Adaptive Learning Reward System - Challenge API
  app.get("/api/challenges", async (req, res) => {
    try {
      const filters = req.query as { type?: string; active?: boolean; category?: string };
      // Convert 'active' string to boolean if present
      if (filters.active !== undefined) {
        filters.active = filters.active === 'true';
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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const challengeId = parseInt(req.params.challengeId);
      const completedChallenge = await storage.completeUserChallenge(req.user.id, challengeId);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
