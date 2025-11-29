import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Enhanced Authentication and Authorization Middleware
 */

// Authorization middleware for admins only
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
}

// Authorization middleware for instructors and admins
export function requireInstructor(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (req.user?.role !== "instructor" && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Instructor or admin access required" });
  }
  
  next();
}

// Authorization middleware - verify ownership or admin
export function requireAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  next();
}

// Comprehensive request validation
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message
        }))
      });
    }
    
    // Attach validated data to request
    (req as any).validatedData = validation.data;
    next();
  };
}

// Schema definitions for validation
export const curriculumGenerationSchema = z.object({
  courseId: z.number().int().positive("Course ID must be a positive integer"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters")
});

export const studyPlanAdjustmentSchema = z.object({
  pace: z.enum(["slow", "moderate", "fast"]).optional(),
  reason: z.string().max(500).optional(),
  extendDays: z.number().int().min(0).max(90).optional()
});

export const courseEnrollmentSchema = z.object({
  courseId: z.number().int().positive("Course ID must be a positive integer")
});

export const assignmentCompletionSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed"]),
  score: z.number().int().min(0).max(100).optional()
});

// Error response formatter
export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  timestamp?: string;
}

export function formatErrorResponse(
  message: string,
  statusCode: number,
  errors?: any[]
): ErrorResponse {
  return {
    success: false,
    message,
    statusCode,
    errors,
    timestamp: new Date().toISOString()
  };
}
