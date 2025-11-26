import { storage } from "../storage";
import type { UserCourse, UserLesson, InsertUserCourse, InsertUserLesson } from "@shared/schema";

export class EnrollmentManager {
  async enrollUser(userId: number, courseId: number): Promise<UserCourse | null> {
    try {
      const existing = await storage.getUserCourse(userId, courseId);
      if (existing) {
        return existing;
      }

      const enrollment = await storage.createUserCourse({
        userId,
        courseId,
        progress: 0,
        currentModule: 1,
        completed: false,
      });
      console.log("[EnrollmentManager] User", userId, "enrolled in course", courseId);
      return enrollment;
    } catch (error) {
      console.error("[EnrollmentManager] Error enrolling user:", error);
      throw error;
    }
  }

  async unenrollUser(userId: number, courseId: number): Promise<boolean> {
    try {
      await storage.deleteUserCourse(userId, courseId);
      console.log("[EnrollmentManager] User", userId, "unenrolled from course", courseId);
      return true;
    } catch (error) {
      console.error("[EnrollmentManager] Error unenrolling user:", error);
      throw error;
    }
  }

  async updateProgress(userId: number, courseId: number, progress: number): Promise<UserCourse | null> {
    try {
      const enrollment = await storage.getUserCourse(userId, courseId);
      if (!enrollment) return null;

      const updated = await storage.updateUserCourse(userId, courseId, {
        progress: Math.min(100, Math.max(0, progress)),
      });
      console.log("[EnrollmentManager] Progress updated for user", userId, "in course", courseId);
      return updated;
    } catch (error) {
      console.error("[EnrollmentManager] Error updating progress:", error);
      throw error;
    }
  }

  async markLessonComplete(userId: number, lessonId: number): Promise<UserLesson | null> {
    try {
      const userLesson = await storage.getUserLesson(userId, lessonId);
      if (userLesson) {
        return await storage.updateUserLesson(userId, lessonId, {
          completed: true,
          progress: 100,
        });
      }

      const created = await storage.createUserLesson({
        userId,
        lessonId,
        completed: true,
        progress: 100,
      });
      console.log("[EnrollmentManager] Lesson", lessonId, "marked complete for user", userId);
      return created;
    } catch (error) {
      console.error("[EnrollmentManager] Error marking lesson complete:", error);
      throw error;
    }
  }

  async getUserCourses(userId: number): Promise<UserCourse[]> {
    try {
      return await storage.getUserCourses(userId);
    } catch (error) {
      console.error("[EnrollmentManager] Error getting user courses:", error);
      return [];
    }
  }

  async getUserProgress(userId: number, courseId: number): Promise<{ progress: number; completedLessons: number; totalLessons: number } | null> {
    try {
      const enrollment = await storage.getUserCourse(userId, courseId);
      if (!enrollment) return null;

      const userLessons = await storage.getUserLessons(userId);
      const courseModules = await storage.getModulesByCourse(courseId);
      
      let totalLessons = 0;
      const completedLessonIds = new Set(userLessons.filter((ul) => ul.completed).map((ul) => ul.lessonId));

      for (const module of courseModules) {
        const lessons = await storage.getLessonsByModule(module.id);
        totalLessons += lessons.length;
      }

      const completedLessons = completedLessonIds.size;

      return {
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        completedLessons,
        totalLessons,
      };
    } catch (error) {
      console.error("[EnrollmentManager] Error getting progress:", error);
      return null;
    }
  }

  async completeEnrollment(userId: number, courseId: number): Promise<UserCourse | null> {
    try {
      const updated = await storage.updateUserCourse(userId, courseId, {
        completed: true,
        progress: 100,
      });
      console.log("[EnrollmentManager] Course", courseId, "completed for user", userId);
      return updated;
    } catch (error) {
      console.error("[EnrollmentManager] Error completing course:", error);
      throw error;
    }
  }
}

export const enrollmentManager = new EnrollmentManager();
