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

    // Vercel rewrites /api/* to /api?path=*
    // Extract the path from query string or reconstruct from URL
    let apiPath = '/api';
    
    // First, try to get path from query string (our rewrite pattern)
    if (req.query && req.query.path) {
      const pathValue = Array.isArray(req.query.path) 
        ? req.query.path.join('/') 
        : req.query.path;
      apiPath = `/api/${pathValue}`;
    }
    // Check original URL
    else if (req.url && req.url !== '/api' && req.url.startsWith('/api')) {
      apiPath = req.url;
    }
    // Check Vercel-specific headers
    else if (req.headers['x-vercel-path']) {
      apiPath = req.headers['x-vercel-path'];
    }
    // Check if path is in the URL path itself
    else if (req.path && req.path !== '/api' && req.path.startsWith('/api')) {
      apiPath = req.path;
    }

    // Normalize the path (remove trailing slash except for root)
    if (apiPath !== '/api' && apiPath.endsWith('/')) {
      apiPath = apiPath.slice(0, -1);
    }

    // Update request URL for Express
    req.url = apiPath;
    req.originalUrl = apiPath;
    req.path = apiPath;

    // Handle the request through Express app
    return new Promise<void>((resolve) => {
      let resolved = false;
      
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      // Handle response end
      const originalEnd = res.end.bind(res);
      res.end = function(chunk?: any, encoding?: any, cb?: any) {
        originalEnd(chunk, encoding, cb);
        cleanup();
      };

      // Handle Express app
      app(req, res, (err: any) => {
        if (err) {
          console.error("Express error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error", message: err.message });
          }
        }
        cleanup();
      });

      // Timeout fallback (shouldn't happen, but safety)
      setTimeout(cleanup, 30000);
    });
  } catch (error: any) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error?.message });
    }
  }
}

