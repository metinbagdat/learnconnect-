import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCourseSchema, insertUserCourseSchema, insertAssignmentSchema, insertModuleSchema, insertLessonSchema } from "@shared/schema";
import { z } from "zod";
import { generateCourse, saveGeneratedCourse, generateCourseRecommendations } from "./ai-service";
import * as fs from "fs";
import * as path from "path";

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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userCourses = await storage.getUserCourses(req.user.id);
      res.json(userCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user courses" });
    }
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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const assignments = await storage.getUserAssignments(req.user.id);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
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

      // Generate course structure using AI
      const generatedCourse = await generateCourse(topic, {
        level,
        targetAudience,
        specificFocus
      });

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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Check if we have cached recommendations
      const existingRecommendations = await storage.getCourseRecommendations(req.user.id);
      
      // If we have recent recommendations (less than 24 hours old), return them
      if (existingRecommendations && 
          existingRecommendations.createdAt && 
          (new Date().getTime() - existingRecommendations.createdAt.getTime() < 24 * 60 * 60 * 1000)) {
        return res.json(existingRecommendations.recommendations);
      }
      
      // Generate new recommendations
      const interests = req.user.interests || [];
      const recommendations = await generateCourseRecommendations(req.user.id, interests);
      
      // Save to database
      const savedRecommendations = await storage.saveCourseRecommendations(req.user.id, recommendations);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
