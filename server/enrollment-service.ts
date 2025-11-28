import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export async function enrollUserInCourse(userId: number, courseId: number) {
  try {
    // 1. Create enrollment record
    const [enrollment] = await db.insert(schema.userCourses).values({
      userId,
      courseId,
      progress: 0,
      currentModule: 1,
      completed: false,
      enrolledAt: new Date(),
    }).returning();

    // 2. Get course curriculum (predefined modules and lessons)
    const modules = await db.select().from(schema.modules).where(eq(schema.modules.courseId, courseId));
    
    if (modules.length === 0) {
      return { enrollment, studyPlan: null, assignments: [] };
    }

    // 3. Calculate total duration
    let totalDays = 0;
    const lessons = await db.select().from(schema.lessons).where(
      eq(schema.lessons.moduleId, modules[0].id)
    );
    lessons.forEach(l => {
      totalDays += Math.ceil((l.durationMinutes || 30) / 60 / 5); // rough estimate: 5 hours per day
    });

    // 4. Create study plan
    const now = new Date();
    const targetDate = new Date(now.getTime() + totalDays * 24 * 60 * 60 * 1000);
    
    const [studyPlan] = await db.insert(schema.studyPlans).values({
      userId,
      courseId,
      curriculum: { modules: modules.length, lessons: lessons.length },
      duration: Math.ceil(totalDays / 7),
      weeklyHoursRequired: 5,
      status: "active",
      startDate: now,
      targetCompletionDate: targetDate,
      completionPercentage: 0,
    }).returning();

    // 5. Create assignments for each lesson
    const assignments = [];
    let dayOffset = 0;
    
    for (const module of modules) {
      const moduleLessons = await db.select().from(schema.lessons).where(eq(schema.lessons.moduleId, module.id));
      
      for (let i = 0; i < moduleLessons.length; i++) {
        const lesson = moduleLessons[i];
        const dueDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        dayOffset += Math.ceil((lesson.durationMinutes || 30) / 60 / 5);

        const [assignment] = await db.insert(schema.userAssignments).values({
          userId,
          studyPlanId: studyPlan.id,
          assignmentId: lesson.id,
          title: lesson.title,
          description: `Complete lesson: ${lesson.title}`,
          moduleId: module.id,
          type: i === moduleLessons.length - 1 ? "project" : "lesson",
          dueDate,
          status: "pending",
          order: i + 1,
        }).returning();
        
        assignments.push(assignment);
      }
    }

    return { enrollment, studyPlan, assignments };
  } catch (error) {
    console.error("Enrollment error:", error);
    throw error;
  }
}

export async function completeAssignment(userId: number, assignmentId: number, score?: number) {
  const now = new Date();
  const [updated] = await db.update(schema.userAssignments)
    .set({ status: "completed", completedAt: now, score: score || 100 })
    .where(eq(schema.userAssignments.id, assignmentId))
    .returning();
  return updated;
}

export async function getUserAssignments(userId: number) {
  return db.select().from(schema.userAssignments).where(eq(schema.userAssignments.userId, userId));
}

export async function getUserProgress(userId: number, studyPlanId: number) {
  const [progress] = await db.select().from(schema.userProgress).where(
    eq(schema.userProgress.userId, userId) && eq(schema.userProgress.studyPlanId, studyPlanId)
  );
  return progress;
}
