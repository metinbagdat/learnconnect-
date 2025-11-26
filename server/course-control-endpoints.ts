import { Express } from "express";
import { courseControl } from "./course-control/course-control";
import { interactionTracker } from "./course-control/interaction-tracker";
import { integrationManager } from "./course-control/integration-manager";
import { registerDataFlowEndpoints } from "./course-control/data-flow-endpoints";
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

  // Interaction Chain Management Endpoints
  app.post("/api/course-control/interaction-log", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { sourceModule, targetModule, action, data } = req.body;
      const sessionId = (req.session as any)?.id || "default";

      const interaction = courseControl.interactionChain.logInteraction(sourceModule, targetModule, action, data, sessionId);

      res.json({ status: "success", interaction });
    } catch (error) {
      res.status(500).json({ message: "Failed to log interaction" });
    }
  });

  app.get("/api/course-control/interactions/recent", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const limit = parseInt((req.query.limit as string) || "50");
      const interactions = courseControl.interactionChain.getRecentInteractions(limit);

      res.json({ status: "success", interactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to get interactions" });
    }
  });

  app.get("/api/course-control/interactions/stats", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const stats = courseControl.interactionChain.getInteractionStats();

      res.json({ status: "success", data: stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  app.get("/api/course-control/interactions/user/:userId", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const userId = parseInt(req.params.userId);
      const interactions = courseControl.interactionChain.getUserInteractions(userId);

      res.json({ status: "success", interactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user interactions" });
    }
  });

  app.get("/api/course-control/interactions/module/:moduleName", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const moduleName = req.params.moduleName;
      const interactions = courseControl.interactionChain.getModuleInteractions(moduleName);

      res.json({ status: "success", interactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to get module interactions" });
    }
  });

  app.get("/api/course-control/interactions/validation-report", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const report = courseControl.interactionChain.getValidationReport();

      res.json({ status: "success", data: report });
    } catch (error) {
      res.status(500).json({ message: "Failed to get validation report" });
    }
  });

  app.get("/api/course-control/dependency-map", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const dependencyMap = courseControl.interactionChain.getDependencyMap();

      res.json({ status: "success", data: dependencyMap });
    } catch (error) {
      res.status(500).json({ message: "Failed to get dependency map" });
    }
  });

  app.get("/api/course-control/interactions/flow/:moduleName", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const moduleName = req.params.moduleName;
      const flowMap = courseControl.interactionChain.getModuleTriggers(moduleName);

      res.json({ status: "success", data: flowMap });
    } catch (error) {
      res.status(500).json({ message: "Failed to get module flow" });
    }
  });

  // Integration Manager Endpoints
  app.post("/api/course-control/integration/enroll", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { courseId } = req.body;
      const sessionId = (req.session as any)?.id || "default";

      if (!courseId) {
        return res.status(400).json({ message: "courseId is required" });
      }

      const chain = await integrationManager.handleCourseEnrollment(req.user.id, courseId, sessionId);

      res.json({
        status: chain.status === "success" ? "success" : "error",
        chainId: chain.id,
        chain,
      });
    } catch (error) {
      res.status(500).json({ message: "Integration failed", error: String(error) });
    }
  });

  app.post("/api/course-control/integration/complete", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { courseId } = req.body;
      const sessionId = (req.session as any)?.id || "default";

      if (!courseId) {
        return res.status(400).json({ message: "courseId is required" });
      }

      const chain = await integrationManager.handleCourseCompletion(req.user.id, courseId, sessionId);

      res.json({
        status: chain.status === "success" ? "success" : "error",
        chainId: chain.id,
        chain,
      });
    } catch (error) {
      res.status(500).json({ message: "Integration failed", error: String(error) });
    }
  });

  app.post("/api/course-control/integration/progress", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { courseId, contentId, progress } = req.body;
      const sessionId = (req.session as any)?.id || "default";

      if (!courseId || contentId === undefined || progress === undefined) {
        return res.status(400).json({ message: "courseId, contentId, and progress are required" });
      }

      const chain = await integrationManager.handleContentProgress(req.user.id, courseId, contentId, progress, sessionId);

      res.json({
        status: chain.status === "success" ? "success" : "error",
        chainId: chain.id,
        chain,
      });
    } catch (error) {
      res.status(500).json({ message: "Integration failed", error: String(error) });
    }
  });

  app.get("/api/course-control/integration/chain/:chainId", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const chain = integrationManager.getChainStatus(req.params.chainId);

      if (!chain) {
        return res.status(404).json({ message: "Chain not found" });
      }

      res.json({ status: "success", chain });
    } catch (error) {
      res.status(500).json({ message: "Failed to get chain status" });
    }
  });

  app.get("/api/course-control/integration/history", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const limit = parseInt((req.query.limit as string) || "50");
      const history = integrationManager.getChainHistory(limit);

      res.json({
        status: "success",
        chains: history,
        count: history.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get integration history" });
    }
  });

  app.get("/api/course-control/integration/stats", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const stats = integrationManager.getIntegrationStats();

      res.json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get integration stats" });
    }
  });

  app.get("/api/course-control/integration/dependencies", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const map = integrationManager.getDependencyMap();

      res.json({
        status: "success",
        data: map,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get dependency map" });
    }
  });

  // Interaction Tracker Endpoints
  app.post("/api/course-control/interactions/track", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { type, module, action, duration = 0, status = 200, metadata = {} } = req.body;
      const record = interactionTracker.recordInteraction(req.user.id, type, module, action, duration, status, metadata);

      res.json({ status: "success", record });
    } catch (error) {
      res.status(500).json({ message: "Failed to track interaction" });
    }
  });

  app.get("/api/course-control/interactions/flow-map", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const flowMap = interactionTracker.getFlowMap();
      res.json({ status: "success", data: flowMap });
    } catch (error) {
      res.status(500).json({ message: "Failed to get flow map" });
    }
  });

  app.get("/api/course-control/interactions/flow-diagram", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const diagram = interactionTracker.getFlowDiagram();
      res.json({ status: "success", data: diagram });
    } catch (error) {
      res.status(500).json({ message: "Failed to get flow diagram" });
    }
  });

  app.get("/api/course-control/interactions/performance-report", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const report = interactionTracker.getPerformanceReport();
      res.json({ status: "success", data: report });
    } catch (error) {
      res.status(500).json({ message: "Failed to get performance report" });
    }
  });

  app.get("/api/user/interactions", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const limit = parseInt((req.query.limit as string) || "100");
      const interactions = interactionTracker.getUserInteractions(req.user.id, limit);

      res.json({ status: "success", interactions, count: interactions.length });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user interactions" });
    }
  });

  // Register data flow endpoints
  registerDataFlowEndpoints(app);

  console.log("[CourseControl] Endpoints registered successfully");
}
