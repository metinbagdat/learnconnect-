import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCourseSchema, insertUserCourseSchema, insertAssignmentSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
