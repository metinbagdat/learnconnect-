import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes.js";
import sitemapRoutes from "../server/routes-sitemap.js";

// Declare process for TypeScript
declare const process: {
  env?: {
    NODE_ENV?: string;
    [key: string]: string | undefined;
  };
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ensure proper content-type headers
app.use((req: Request, res: Response, next: NextFunction) => {
  // Only set content-type if not already set
  if (!res.getHeader('content-type')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  next();
});

// SEO routes (sitemap, robots.txt)
app.use(sitemapRoutes);

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
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

// 404 handler - must be before error handler
app.use((_req: Request, res: Response) => {
  if (!res.headersSent) {
    res.status(404).json({ error: "Not Found" });
  }
});

// Error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("[ERROR]", err);
  if (!res.headersSent) {
    res.status(status).json({ 
      message, 
      error: (typeof process !== "undefined" && process?.env?.NODE_ENV === 'development') ? err.stack : undefined 
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
  // Ensure proper headers are set
  if (!res.getHeader('content-type')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }

  try {
    // Get the original path from Vercel's rewrite
    const originalUrl = req.url || req.originalUrl || '/';
    let apiPath = originalUrl;

    // Vercel sends /api/* requests to this handler via rewrite
    // Check Vercel-specific headers first
    const vercelPath = req.headers['x-vercel-path'] || req.headers['x-invoke-path'];
    if (vercelPath) {
      apiPath = vercelPath;
    }

    // Ensure we're handling an API path
    // If not, this handler shouldn't have been called, but handle gracefully
    if (!apiPath.startsWith('/api') && !vercelPath) {
      console.warn(`API handler called for non-API path: ${apiPath}`);
      if (!res.headersSent) {
        res.status(404).json({ error: "Not Found" });
      }
      return;
    }

    // Normalize API path
    if (!apiPath.startsWith('/api')) {
      apiPath = `/api${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;
    }

    // Initialize app (only once)
    await initializeApp();

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

      // Set timeout to ensure response is always sent
      const timeout = setTimeout(() => {
        if (!finished && !res.headersSent) {
          try {
            res.status(504).json({ error: "Request timeout" });
          } catch (e) {
            console.error("Error sending timeout response:", e);
          }
          finish();
        }
      }, 25000); // 25 seconds (before Vercel's 30s limit)

      app(req, res, (err: any) => {
        clearTimeout(timeout);
        
        if (err) {
          console.error("Express error:", err);
          if (!res.headersSent && !finished) {
            try {
              res.status(500).json({ error: "Internal server error" });
            } catch (e) {
              console.error("Error sending error response:", e);
            }
            finish();
          } else {
            finish();
          }
        } else if (!res.headersSent && !finished) {
          // If no response was sent, send 404
          try {
            res.status(404).json({ error: "Not Found" });
          } catch (e) {
            console.error("Error sending 404 response:", e);
          }
          finish();
        } else if (res.finished && !finished) {
          finish();
        } else {
          finish();
        }
      });
    });
  } catch (error: any) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      try {
        res.status(500).json({ error: "Internal server error" });
      } catch (e) {
        console.error("Error sending error response in catch:", e);
      }
    }
  }
}
