import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import sitemapRoutes from "../server/routes-sitemap";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SEO routes (sitemap, robots.txt)
app.use(sitemapRoutes);

// Logging middleware
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
      const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      console.log(logLine);
    }
  });

  next();
});

// Error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("[ERROR]", err);
  if (!res.headersSent) {
    res.status(status).json({ 
      message, 
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
});

// Initialize app (routes will be registered on first request)
let appInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function initializeApp() {
  if (appInitialized) return;
  
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Register all routes
      await registerRoutes(app);

      appInitialized = true;
      console.log("Application initialized for Vercel");
    } catch (error) {
      console.error(`FATAL ERROR during initialization: ${error}`);
      throw error;
    }
  })();

  return initializationPromise;
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    // Initialize app on first request
    await initializeApp();

    // Vercel rewrites /api/* to /api, so we need to restore the full path
    // The original path is available in the request
    if (req.url && !req.url.startsWith('/api')) {
      // Reconstruct the API path
      const pathMatch = req.headers['x-vercel-path'] || req.url;
      req.url = pathMatch.startsWith('/api') ? pathMatch : `/api${pathMatch}`;
      req.originalUrl = req.url;
    }

    // Handle the request through Express app
    return new Promise<void>((resolve, reject) => {
      // Ensure response is properly handled
      const originalEnd = res.end.bind(res);
      let ended = false;
      
      res.end = function(chunk?: any, encoding?: any, cb?: any) {
        if (!ended) {
          ended = true;
          originalEnd(chunk, encoding, cb);
          resolve();
        }
      };

      // Handle Express app
      app(req, res, (err: any) => {
        if (err) {
          console.error("Express error:", err);
          if (!res.headersSent && !ended) {
            res.status(500).json({ error: "Internal server error" });
          }
          if (!ended) {
            ended = true;
            resolve();
          }
        } else if (!ended && (res.headersSent || res.finished)) {
          ended = true;
          resolve();
        }
      });
    });
  } catch (error: any) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

