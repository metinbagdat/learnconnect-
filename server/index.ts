import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedChallenges } from "./seed-challenges";
import { seedAchievements } from "./seed-achievements";
import { seedSkillChallenges } from "./seed-skill-challenges";
import { seedModulesAndLessons } from "./seed-modules-and-lessons";
import { seedTytAytCurriculum } from "./seed-tyt-ayt-curriculum";
import sitemapRoutes from "./routes-sitemap";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SEO routes (sitemap, robots.txt)
app.use(sitemapRoutes);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      log("Setting up Vite...");
      await setupVite(app, server);
      log("Vite setup complete");
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

    // Run seeding operations asynchronously AFTER server starts
    // This prevents blocking the port opening and deployment timeout
    (async () => {
      // Add a small delay to ensure port is fully opened
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Seed TYT/AYT curriculum first (most important for the platform)
      try {
        await seedTytAytCurriculum();
        log("TYT/AYT curriculum seeded successfully");
      } catch (error) {
        log(`Failed to seed TYT/AYT curriculum: ${error}`);
      }
      
      // Seed modules and lessons as fallback
      try {
        await seedModulesAndLessons();
        log("Modules and lessons seeded successfully");
      } catch (error) {
        log(`Failed to seed modules and lessons: ${error}`);
      }
      
      // Seed challenges
      try {
        await seedChallenges();
        log("Challenge system initialized successfully");
      } catch (error) {
        log(`Failed to seed challenges: ${error}`);
      }
    })();
  } catch (error) {
    log(`FATAL ERROR: ${error}`);
    process.exit(1);
  }
})();
