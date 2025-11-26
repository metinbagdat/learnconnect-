import { Express } from "express";
import { courseControl } from "./course-control/course-control";
import { insertCourseSchema } from "@shared/schema";

export function registerCourseControlEndpoints(app: Express) {
  // Course Management Endpoints
  app.post("/api/courses/create", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const courseData = insertCourseSchema.parse(req.body);
      const result = await courseControl.createCourseWithContent(
        { ...courseData, instructorId: req.user.id },
        req.user.role
      );

      if (result.status === "success") {
        res.json({ status: "success", course: result.course });
      } else {
        res.status(403).json({ message: result.status });
      }
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.get("/api/courses/search", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const query = (req.query.q as string) || "";
      const results = await courseControl.courseManager.searchCourses(query);

      res.json({ status: "success", results, count: results.length });
    } catch (error) {
      res.status(500).json({ message: "Failed to search courses" });
    }
  });

  // Enrollment Endpoints
  app.post("/api/courses/enroll", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { courseId } = req.body;
      const enrollment = await courseControl.enrollmentManager.enrollUser(req.user.id, courseId);

      res.json({ status: "success", enrollment });
    } catch (error) {
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/user/learning-dashboard", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const dashboard = await courseControl.getUserLearningDashboard(req.user.id);
      res.json({ status: "success", data: dashboard });
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning dashboard" });
    }
  });

  app.get("/api/courses/:courseId/progress", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const courseId = parseInt(req.params.courseId);
      const progress = await courseControl.enrollmentManager.getUserProgress(req.user.id, courseId);

      res.json({ status: "success", data: progress });
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.post("/api/courses/:courseId/sync-planner", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const courseId = parseInt(req.params.courseId);
      const sync = await courseControl.syncWithStudyPlanner(req.user.id, courseId);

      res.json({ status: "success", data: sync });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync with study planner" });
    }
  });

  // Recommendations Endpoint
  app.get("/api/courses/recommendations", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const recommendations = await courseControl.recommendationEngine.recommendCourses(req.user.id);
      res.json({ status: "success", recommendations });
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  app.get("/api/courses/trending", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const trending = await courseControl.recommendationEngine.getTrendingCourses(5);
      res.json({ status: "success", trending });
    } catch (error) {
      res.status(500).json({ message: "Failed to get trending courses" });
    }
  });

  // Analytics Endpoints
  app.get("/api/courses/:courseId/analytics", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const courseId = parseInt(req.params.courseId);
      const report = await courseControl.getComprehensiveCourseReport(courseId, req.user.role);

      res.json({ status: "success", data: report });
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });

  // Course Control Status
  app.get("/api/course-control/status", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const status = courseControl.getStatus();
      res.json({ status: "success", data: status });
    } catch (error) {
      res.status(500).json({ message: "Failed to get status" });
    }
  });

  console.log("[CourseControl] Endpoints registered successfully");
}
