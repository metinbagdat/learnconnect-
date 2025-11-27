import { Express } from "express";
import { aiDataModels } from "./ai-data-models";

export function registerAIDataFlowEndpoints(app: Express) {
  // Update AI user profile
  app.post("/api/ai/profile/update", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const result = await aiDataModels.updateAIUserProfile({
        userId: req.user.id,
        ...req.body,
      });

      res.json({ status: "success", data: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to update AI profile" });
    }
  });

  // Get AI user profile
  app.get("/api/ai/profile", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const profile = await aiDataModels.getAIUserProfile(req.user.id);

      res.json({ status: "success", data: profile });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI profile" });
    }
  });

  // Log AI suggestion
  app.post("/api/ai/suggestions/log", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const result = await aiDataModels.logAISuggestion({
        userId: req.user.id,
        ...req.body,
      });

      res.json({ status: "success", data: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to log suggestion" });
    }
  });

  // Archive AI interaction
  app.post("/api/ai/interactions/archive", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const result = await aiDataModels.archiveAIInteraction({
        userId: req.user.id,
        ...req.body,
      });

      res.json({ status: "success", data: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to archive interaction" });
    }
  });

  // Get interaction history
  app.get("/api/ai/interactions/archive", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const limit = parseInt((req.query.limit as string) || "100");
      const history = await aiDataModels.getInteractionHistory(req.user.id, limit);

      res.json({ status: "success", data: history, count: history.length });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interaction history" });
    }
  });

  // Calculate AI insights
  app.get("/api/ai/insights", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const insights = await aiDataModels.calculateAIInsights(req.user.id);

      res.json({ status: "success", data: insights });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate insights" });
    }
  });

  // Generate success prediction
  app.post("/api/ai/predict-success", (app as any).ensureAuthenticated, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const prediction = aiDataModels.generateSuccessPrediction(req.user.id, req.body);

      res.json({ status: "success", data: { successProbability: prediction } });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate prediction" });
    }
  });

  console.log("[AIDataFlow] Endpoints registered successfully");
}
