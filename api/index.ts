import "dotenv/config";
import express = require("express");
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import sitemapRoutes from "../server/routes-sitemap.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SEO routes (sitemap, robots.txt)
app.use(sitemapRoutes);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
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
      error: (typeof process !== "undefined" && process.env?.NODE_ENV === 'development') ? err.stack : undefined 
    });
  }
});

// Initialize app
let appInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function initializeApp() {
  if (appInitialized) return;
  
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
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
    await initializeApp();

    // Get the original path from Vercel's rewrite
    const originalUrl = req.url || req.originalUrl || '/';
    let apiPath = originalUrl;

    // If URL doesn't start with /api, check Vercel headers
    if (!apiPath.startsWith('/api')) {
      const vercelPath = req.headers['x-vercel-path'] || req.headers['x-invoke-path'];
      if (vercelPath) {
        apiPath = vercelPath;
      } else {
        // Fallback: use query parameter or default to /api
        const pathParam = req.query?.path;
        if (pathParam) {
          apiPath = `/api/${Array.isArray(pathParam) ? pathParam.join('/') : pathParam}`;
        } else {
          apiPath = '/api';
        }
      }
    }

    // Update request for Express
    req.url = apiPath;
    req.originalUrl = apiPath;
    req.path = apiPath.split('?')[0];

    // Handle request with Express
    return new Promise<void>((resolve) => {
      let finished = false;
      
      const finish = () => {
        if (!finished) {
          finished = true;
          resolve();
        }
      };

      const originalEnd = res.end.bind(res);
      res.end = function(chunk?: any, encoding?: any, cb?: any) {
        originalEnd(chunk, encoding, cb);
        finish();
      };

      app(req, res, (err: any) => {
        if (err) {
          console.error("Express error:", err);
          if (!res.headersSent && !finished) {
            res.status(500).json({ error: "Internal server error" });
            finish();
          }
        } else if (res.finished && !finished) {
          finish();
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
