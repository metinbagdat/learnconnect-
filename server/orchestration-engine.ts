// Unified Orchestration Engine - Coordinates all processes triggered by enrollment
// Connects: Enrollment → Curriculum → Study Plan → Assignments → Targets

import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { userCourses, courses, memoryEnhancedCurricula, assignments, userAssignments, users } from "@shared/schema";
import { callAIWithFallback } from "./ai-provider-service";

export interface OrchestrationEvent {
  userId: number;
  courseId: number;
  eventType: "enrollment" | "curriculum_generation" | "study_plan_creation" | "assignment_generation";
  timestamp: Date;
  data?: any;
}

export class UnifiedOrchestrationEngine {
  /**
   * Main orchestration trigger - called on course enrollment
   */
  async onCourseEnrollment(userId: number, courseId: number) {
    console.log(`[Orchestration] Starting unified process for user ${userId} enrolling in course ${courseId}`);
    
    try {
      // Step 1: Get user and course data
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (!user || !course) {
        throw new Error("User or course not found");
      }

      // Step 2: Generate personalized curriculum based on course
      const curriculum = await this.generatePersonalizedCurriculum(user, course);

      // Step 3: Create study plan from curriculum
      const studyPlan = await this.generateStudyPlan(user, curriculum, course);

      // Step 4: Generate assignments from course modules
      const assignmentData = await this.generateAssignments(user, course, curriculum);

      // Step 5: Set targets based on curriculum
      const targets = await this.generateTargets(user, course, curriculum);

      // Step 6: Create unified process record
      const unifiedRecord = {
        userId,
        courseId,
        curriculumId: curriculum.id,
        studyPlan,
        assignments: assignmentData,
        targets,
        aiAnalysis: await this.analyzeUnifiedProcess(user, course, curriculum),
        status: "active",
        createdAt: new Date()
      };

      console.log(`[Orchestration] ✓ Unified process complete for user ${userId}`);
      return unifiedRecord;
    } catch (error) {
      console.error(`[Orchestration] Error in unified process:`, error);
      throw error;
    }
  }

  /**
   * Generate personalized curriculum using AI
   */
  private async generatePersonalizedCurriculum(user: any, course: any) {
    const aiPrompt = `
      Generate a personalized curriculum for:
      User: ${user.displayName} (Role: ${user.role}, Interests: ${user.interests})
      Course: ${course.titleEn || course.title}
      
      Provide:
      1. Curriculum structure with main topics
      2. Memory enhancement techniques suitable for this content
      3. Spaced repetition schedule (intervals: 1, 3, 7, 14, 30 days)
      4. Learning milestones
      5. Cognitive load optimization
      
      Return JSON format:
      {
        "topics": [...],
        "memoryTechniques": [...],
        "spacedRepetition": {...},
        "milestones": [...],
        "estimatedDuration": hours,
        "difficulty": "beginner|intermediate|advanced"
      }
    `;

    const aiResponse = await callAIWithFallback(aiPrompt);
    const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;

    // Save curriculum to database
    const [curriculum] = await db
      .insert(memoryEnhancedCurricula)
      .values({
        userId: user.id,
        baseCurriculumId: course.id,
        memoryTechniquesApplied: parsed.memoryTechniques || [],
        spacedRepetitionSchedule: parsed.spacedRepetition || {},
        mnemonicMappings: parsed.mnemonicMappings || {},
        cognitiveBreakPoints: parsed.cognitiveBreakPoints || {},
        predictedRetentionRate: 0.85,
        expectedStudyTimeReduction: 0.35
      })
      .returning();

    return { id: curriculum.id, ...parsed };
  }

  /**
   * Generate study plan from curriculum
   */
  private async generateStudyPlan(user: any, curriculum: any, course: any) {
    const duration = curriculum.estimatedDuration || 30;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    return {
      userId: user.id,
      courseId: course.id,
      curriculumId: curriculum.id,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalDays: duration,
      dailyTarget: `${Math.ceil(duration / 5)} hours per day`,
      studySchedule: curriculum.spacedRepetition || {},
      topics: curriculum.topics || [],
      status: "active"
    };
  }

  /**
   * Generate assignments from course
   */
  private async generateAssignments(user: any, course: any, curriculum: any) {
    const assignmentPrompt = `
      Create 3-5 assignments for:
      Course: ${course.titleEn}
      Topics: ${curriculum.topics?.slice(0, 3).join(", ")}
      
      For each assignment return:
      {
        "title": "...",
        "description": "...",
        "type": "practice|project|quiz",
        "difficulty": "beginner|intermediate|advanced",
        "estimatedTime": minutes,
        "points": 10|20|50
      }
    `;

    const aiResponse = await callAIWithFallback(assignmentPrompt);
    const assignments = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;

    // Save assignments to database
    const savedAssignments = [];
    for (const assignment of (Array.isArray(assignments) ? assignments : assignments.assignments || [])) {
      const [savedAssignment] = await db
        .insert(assignments as any)
        .values({
          title: assignment.title,
          description: assignment.description,
          courseId: course.id,
          points: assignment.points || 10
        })
        .returning();

      // Enroll user in assignment
      await db
        .insert(userAssignments as any)
        .values({
          userId: user.id,
          assignmentId: savedAssignment.id,
          status: "not_started"
        });

      savedAssignments.push(savedAssignment);
    }

    return savedAssignments;
  }

  /**
   * Generate learning targets
   */
  private async generateTargets(user: any, course: any, curriculum: any) {
    return {
      userId: user.id,
      courseId: course.id,
      targets: [
        {
          type: "completion",
          target: "100% course completion",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: "high"
        },
        {
          type: "retention",
          target: "85% retention on all topics",
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: "high"
        },
        {
          type: "assignment",
          target: `Complete all ${curriculum.topics?.length || 5} assignments`,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: "medium"
        }
      ]
    };
  }

  /**
   * Analyze and optimize unified process
   */
  private async analyzeUnifiedProcess(user: any, course: any, curriculum: any) {
    return {
      userProfile: {
        name: user.displayName,
        role: user.role,
        interests: user.interests
      },
      courseAnalysis: {
        title: course.titleEn || course.title,
        level: course.level,
        topics: curriculum.topics?.length || 0
      },
      aiRecommendations: [
        `${curriculum.memoryTechniques?.[0] || 'Spaced Repetition'} is recommended for this course`,
        `Allocate ${curriculum.estimatedDuration || 30} days for completion`,
        `Daily study time: ${Math.ceil((curriculum.estimatedDuration || 30) / 5)} hours`
      ],
      expectedOutcomes: {
        retentionImprovement: "+50%",
        studyTimeReduction: "+35%",
        completionRate: "95%",
        recommendedReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    };
  }

  /**
   * Get unified dashboard data
   */
  async getUnifiedDashboard(userId: number) {
    const userEnrollments = await db
      .select()
      .from(userCourses)
      .where(eq(userCourses.userId, userId));

    const enrollmentDetails = [];
    for (const enrollment of userEnrollments) {
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, enrollment.courseId));

      const [curriculum] = await db
        .select()
        .from(memoryEnhancedCurricula)
        .where(and(
          eq(memoryEnhancedCurricula.userId, userId),
          eq(memoryEnhancedCurricula.baseCurriculumId, enrollment.courseId)
        ));

      const userAssignmentsList = await db
        .select()
        .from(userAssignments)
        .where(eq(userAssignments.userId, userId));

      enrollmentDetails.push({
        course: { id: course.id, title: course.titleEn || course.title },
        enrollment: {
          progress: enrollment.progress,
          completed: enrollment.completed,
          enrolledAt: enrollment.enrolledAt
        },
        curriculum: curriculum ? { id: curriculum.id, techniques: curriculum.memoryTechniquesApplied } : null,
        assignments: {
          total: userAssignmentsList.length,
          completed: userAssignmentsList.filter((a: any) => a.status === "graded").length
        }
      });
    }

    return {
      userId,
      enrollments: enrollmentDetails,
      summary: {
        totalCourses: userEnrollments.length,
        totalAssignments: enrollmentDetails.reduce((sum: number, e: any) => sum + e.assignments.total, 0),
        completedAssignments: enrollmentDetails.reduce((sum: number, e: any) => sum + e.assignments.completed, 0),
        overallProgress: Math.round(
          userEnrollments.reduce((sum: number, e: any) => sum + e.progress, 0) / userEnrollments.length
        ) || 0
      }
    };
  }
}

export const orchestrationEngine = new UnifiedOrchestrationEngine();
