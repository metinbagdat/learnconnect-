import { storage } from "../storage";
import type { Module, Lesson, InsertModule, InsertLesson } from "@shared/schema";

export class ContentManager {
  async createModule(courseId: number, moduleData: Omit<InsertModule, "courseId">): Promise<Module | null> {
    try {
      const module = await storage.createModule({
        ...moduleData,
        courseId,
      });
      console.log("[ContentManager] Module created for course", courseId);
      return module;
    } catch (error) {
      console.error("[ContentManager] Error creating module:", error);
      throw error;
    }
  }

  async updateModule(moduleId: number, updates: Partial<InsertModule>): Promise<Module | null> {
    try {
      const module = await storage.updateModule(moduleId, updates);
      console.log("[ContentManager] Module updated:", moduleId);
      return module;
    } catch (error) {
      console.error("[ContentManager] Error updating module:", error);
      throw error;
    }
  }

  async deleteModule(moduleId: number): Promise<boolean> {
    try {
      await storage.deleteModule(moduleId);
      console.log("[ContentManager] Module deleted:", moduleId);
      return true;
    } catch (error) {
      console.error("[ContentManager] Error deleting module:", error);
      throw error;
    }
  }

  async getModulesByCourse(courseId: number): Promise<Module[]> {
    try {
      return await storage.getModulesByCourse(courseId);
    } catch (error) {
      console.error("[ContentManager] Error getting modules:", error);
      return [];
    }
  }

  async createLesson(moduleId: number, lessonData: Omit<InsertLesson, "moduleId">): Promise<Lesson | null> {
    try {
      const lesson = await storage.createLesson({
        ...lessonData,
        moduleId,
      });
      console.log("[ContentManager] Lesson created for module", moduleId);
      return lesson;
    } catch (error) {
      console.error("[ContentManager] Error creating lesson:", error);
      throw error;
    }
  }

  async updateLesson(lessonId: number, updates: Partial<InsertLesson>): Promise<Lesson | null> {
    try {
      const lesson = await storage.updateLesson(lessonId, updates);
      console.log("[ContentManager] Lesson updated:", lessonId);
      return lesson;
    } catch (error) {
      console.error("[ContentManager] Error updating lesson:", error);
      throw error;
    }
  }

  async deleteLesson(lessonId: number): Promise<boolean> {
    try {
      await storage.deleteLesson(lessonId);
      console.log("[ContentManager] Lesson deleted:", lessonId);
      return true;
    } catch (error) {
      console.error("[ContentManager] Error deleting lesson:", error);
      throw error;
    }
  }

  async getLessonsByModule(moduleId: number): Promise<Lesson[]> {
    try {
      return await storage.getLessonsByModule(moduleId);
    } catch (error) {
      console.error("[ContentManager] Error getting lessons:", error);
      return [];
    }
  }

  async getCourseContent(courseId: number) {
    try {
      const modules = await this.getModulesByCourse(courseId);
      const content = {
        courseId,
        modules: [] as any[],
        totalLessons: 0,
        totalDuration: 0,
      };

      for (const module of modules) {
        const lessons = await this.getLessonsByModule(module.id);
        content.modules.push({
          ...module,
          lessons,
        });
        content.totalLessons += lessons.length;
        content.totalDuration += lessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
      }

      return content;
    } catch (error) {
      console.error("[ContentManager] Error getting course content:", error);
      return null;
    }
  }
}

export const contentManager = new ContentManager();
