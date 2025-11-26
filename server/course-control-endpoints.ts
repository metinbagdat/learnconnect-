import { Express } from "express";
import { integrationManager } from "./integration-manager";

export function registerIntegrationEndpoints(app: Express) {
  // Enrollment Integration
  app.post("/api/course-control/integration/enroll", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { courseId } = req.body;
      const sessionId = req.headers["session-id"] as string || "default";

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

  // Completion Integration
  app.post("/api/course-control/integration/complete", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { courseId } = req.body;
      const sessionId = req.headers["session-id"] as string || "default";

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

  // Progress Integration
  app.post("/api/course-control/integration/progress", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { courseId, contentId, progress } = req.body;
      const sessionId = req.headers["session-id"] as string || "default";

      if (!courseId || contentId === undefined || progress === undefined) {
        return res.status(400).json({ message: "courseId, contentId, and progress are required" });
      }

      const chain = await integrationManager.handleContentProgress(
        req.user.id,
        courseId,
        contentId,
        progress,
        sessionId
      );

      res.json({
        status: chain.status === "success" ? "success" : "error",
        chainId: chain.id,
        chain,
      });
    } catch (error) {
      res.status(500).json({ message: "Integration failed", error: String(error) });
    }
  });

  // Get Chain Status
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

  // Get Integration History
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

  // Get Integration Stats
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

  // Get Dependency Map
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

  console.log("[IntegrationManager] Endpoints registered successfully");
}
