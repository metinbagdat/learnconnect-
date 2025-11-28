import {
  eq,
  and,
  or,
  desc,
  inArray,
  asc,
  sql
} from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";

const {
  users,
  courses,
  enrollments,
  modules,
  lessons,
  assignments,
  submissions,
  quizzes,
  quizAnswers,
  achievements,
  challenges,
  dailyTasks,
  learningPaths,
  studySchedules,
  successMetrics,
  curriculumDesignParameters,
  curriculumSuccessMetrics,
  curriculumFeedbackLoops,
  integrationOrchestrationLogs,
  performanceOptimizationLogs,
  aiLearningData,
  courseIntegrationState,
  moduleIntegrationLog,
  aiRecommendationState,
  learningEcosystemState,
  userCourses,
  userAchievements,
} = schema;

export interface IStorage {
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
  getCourses(): Promise<any[]>;
  getCourse(id: number): Promise<any>;
  createCourse(course: any): Promise<any>;
  updateCourse(id: number, updates: any): Promise<any>;
  createDesignProcess(design: any): Promise<any>;
  getDesignProcess(id: number): Promise<any>;
  updateDesignProcess(id: number, updates: any): Promise<any>;
  createSuccessMetrics(metrics: any): Promise<any>;
  createFeedbackLoop(loop: any): Promise<any>;
  getFeedbackLoops(designId: number): Promise<any[]>;
  updateFeedbackLoop(id: number, updates: any): Promise<any>;
}

class DatabaseStorage implements IStorage {
  async getUser(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: any) {
    const [created] = await db.insert(users).values(userData).returning();
    return created;
  }

  async getCourses() {
    return db.select().from(courses);
  }

  async getCourse(id: number) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(courseData: any) {
    const [created] = await db.insert(courses).values(courseData).returning();
    return created;
  }

  async updateCourse(id: number, updates: any) {
    const [updated] = await db.update(courses).set(updates).where(eq(courses.id, id)).returning();
    return updated;
  }

  async createDesignProcess(design: any) {
    const [created] = await db.insert(curriculumDesignParameters).values({
      userId: design.userId || 1,
      courseId: design.courseId || 1,
      designName: design.designName,
      status: design.status || 'active',
      stage: design.stage || 'planning',
      progressPercent: design.progressPercent || 0,
      parameters: design.parameters,
      successMetrics: design.successMetrics,
      generatedCurriculum: design.generatedCurriculum,
      aiRecommendations: design.aiRecommendations,
      currentEffectiveness: design.currentEffectiveness || 0,
      version: 1,
    }).returning();
    return created;
  }

  async getDesignProcess(id: number) {
    const [design] = await db.select().from(curriculumDesignParameters).where(eq(curriculumDesignParameters.id, id));
    return design;
  }

  async updateDesignProcess(id: number, updates: any) {
    const [updated] = await db.update(curriculumDesignParameters).set(updates).where(eq(curriculumDesignParameters.id, id)).returning();
    return updated;
  }

  async createSuccessMetrics(metrics: any) {
    const [created] = await db.insert(curriculumSuccessMetrics).values(metrics).returning();
    return created;
  }

  async createFeedbackLoop(loop: any) {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number) {
    return db.select().from(curriculumFeedbackLoops).where(eq(curriculumFeedbackLoops.designId, designId)).orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any) {
    const [updated] = await db.update(curriculumFeedbackLoops).set(updates).where(eq(curriculumFeedbackLoops.id, id)).returning();
    return updated;
  }

  async getUserDesignProcesses(userId: number) {
    return db.select().from(curriculumDesignParameters).where(eq(curriculumDesignParameters.userId, userId));
  }

  async getDesignParameters(designId: number) {
    const [params] = await db.select().from(curriculumDesignParameters).where(eq(curriculumDesignParameters.id, designId));
    return params;
  }

  async getSuccessMetrics(designId: number) {
    const [metrics] = await db.select().from(curriculumSuccessMetrics).where(eq(curriculumSuccessMetrics.designId, designId));
    return metrics;
  }

  async updateDesignParameters(designId: number, updates: any) {
    const [updated] = await db.update(curriculumDesignParameters).set(updates).where(eq(curriculumDesignParameters.id, designId)).returning();
    return updated;
  }

  async updateSuccessMetrics(designId: number, updates: any) {
    const [updated] = await db.update(curriculumSuccessMetrics).set(updates).where(eq(curriculumSuccessMetrics.designId, designId)).returning();
    return updated;
  }

  async getCurriculumContextForDailyTasks(userId: number, taskIds: number[]) {
    return new Map();
  }

  async getDailyStudyTasks(userId: number, date?: string) {
    if (date) {
      return db.select().from(dailyTasks).where(eq(dailyTasks.userId, userId));
    }
    return db.select().from(dailyTasks).where(eq(dailyTasks.userId, userId));
  }

  async createDailyStudyTask(task: any) {
    const [created] = await db.insert(dailyTasks).values(task).returning();
    return created;
  }

  // Dashboard & Learning Methods
  async getChallenges() {
    return db.select().from(challenges);
  }

  async getUserActiveAndCompletedChallenges(userId: number) {
    return { active: [], completed: [] };
  }

  async getAiGeneratedCourses() {
    return db.select().from(courses).where(eq(courses.isAiGenerated, true));
  }

  async getCourseRecommendations(userId: number) {
    return db.select().from(aiRecommendationState).where(eq(aiRecommendationState.userId, userId));
  }

  async saveCourseRecommendations(userId: number, recommendations: any) {
    const existing = await db.select().from(aiRecommendationState).where(eq(aiRecommendationState.userId, userId));
    if (existing.length > 0) {
      await db.update(aiRecommendationState).set({ recommendedItems: recommendations }).where(eq(aiRecommendationState.userId, userId));
    } else {
      await db.insert(aiRecommendationState).values({ userId, recommendedItems: recommendations, recommendationType: 'course', confidenceScore: 0.85 });
    }
  }

  async getUserCourses(userId: number) {
    return db.select().from(userCourses).where(eq(userCourses.userId, userId));
  }

  async getUserAssignments(userId: number) {
    return db.select().from(assignments).innerJoin(userCourses, eq(assignments.courseId, userCourses.courseId)).where(eq(userCourses.userId, userId));
  }

  async getUserLevel(userId: number) {
    return { level: 1, xp: 0 };
  }

  async getUserMentor(userId: number) {
    return null;
  }

  async getUserStudyPrograms(userId: number) {
    const userEnrollments = await db.select().from(userCourses).where(eq(userCourses.userId, userId));
    if (!userEnrollments.length) return [];
    const courseIds = userEnrollments.map(e => e.courseId);
    return db.select().from(courses).where(inArray(courses.id, courseIds));
  }

  async getUserWeeklyStats(userId: number) {
    return { studyHours: 0, lessonsCompleted: 0, challengesCompleted: 0 };
  }

  async getStudySessions(userId: number) {
    return db.select().from(studySchedules).where(eq(studySchedules.userId, userId));
  }

  async getUserAchievements(userId: number) {
    const result = await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
    return result || [];
  }

  // Enrollment method
  async enrollUserInCourse(enrollmentData: any) {
    try {
      console.log('Enrolling user in course:', enrollmentData);
      const [enrolled] = await db.insert(userCourses).values(enrollmentData).returning();
      console.log('Enrollment successful:', enrolled);
      return enrolled;
    } catch (error) {
      console.error('Enrollment error in storage:', error);
      throw error;
    }
  }

  // Curriculum methods
  async getUserCurriculums(userId: number) {
    return db.select().from(curriculumDesignParameters).where(eq(curriculumDesignParameters.userId, userId));
  }

  async generateAndSyncCurriculum(userId: number, courseId: number) {
    try {
      const curriculum = await db.insert(curriculumDesignParameters).values({
        userId,
        courseId,
        designName: `Curriculum for Course ${courseId}`,
        status: 'active',
        stage: 'generation',
        progressPercent: 0,
        parameters: { courseId, userId },
        version: 1,
      }).returning();
      return curriculum[0] || null;
    } catch (error) {
      console.error('Curriculum generation error:', error);
      throw error;
    }
  }

  // Module methods
  async getModules(courseId: number) {
    return db.select().from(modules).where(eq(modules.courseId, courseId));
  }

  // Lesson methods
  async getLessons(moduleId: number) {
    try {
      return db.select().from(lessons).where(eq(lessons.moduleId, moduleId));
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  }

  async getLesson(lessonId: number) {
    try {
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId));
      return lesson;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }
  }

  async getUserLessons(userId: number) {
    try {
      // Get all lessons from courses the user is enrolled in
      const userCoursesList = await db.select().from(userCourses).where(eq(userCourses.userId, userId));
      if (userCoursesList.length === 0) return [];
      
      const courseIds = userCoursesList.map(uc => uc.courseId);
      const modulesList = await db.select().from(modules).where(inArray(modules.courseId, courseIds));
      if (modulesList.length === 0) return [];
      
      const moduleIds = modulesList.map(m => m.id);
      return db.select().from(lessons).where(inArray(lessons.moduleId, moduleIds));
    } catch (error) {
      console.error('Error fetching user lessons:', error);
      return [];
    }
  }

  // Assignment methods
  async createAssignment(assignmentData: any) {
    const [created] = await db.insert(assignments).values(assignmentData).returning();
    return created;
  }

  async createUserAssignment(userAssignmentData: any) {
    try {
      // Since there's no user_assignments table in the schema, we'll skip this for now
      // The assignments are already linked via the assignments table
      return { success: true };
    } catch (error) {
      console.error('User assignment error:', error);
      return { success: false };
    }
  }
}

export const storage = new DatabaseStorage();
