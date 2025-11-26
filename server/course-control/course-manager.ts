import { storage } from "../storage";
import type { Course, InsertCourse } from "@shared/schema";

export class CourseManager {
  async createCourse(courseData: InsertCourse & { instructorId: number }): Promise<Course | null> {
    try {
      const course = await storage.createCourse(courseData);
      console.log("[CourseManager] Course created:", course?.id);
      return course;
    } catch (error) {
      console.error("[CourseManager] Error creating course:", error);
      throw error;
    }
  }

  async updateCourse(courseId: number, updates: Partial<InsertCourse>): Promise<Course | null> {
    try {
      const course = await storage.updateCourse(courseId, updates);
      console.log("[CourseManager] Course updated:", courseId);
      return course;
    } catch (error) {
      console.error("[CourseManager] Error updating course:", error);
      throw error;
    }
  }

  async deleteCourse(courseId: number): Promise<boolean> {
    try {
      await storage.deleteCourse(courseId);
      console.log("[CourseManager] Course deleted:", courseId);
      return true;
    } catch (error) {
      console.error("[CourseManager] Error deleting course:", error);
      throw error;
    }
  }

  async getCourse(courseId: number): Promise<Course | null> {
    try {
      return await storage.getCourse(courseId);
    } catch (error) {
      console.error("[CourseManager] Error getting course:", error);
      return null;
    }
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      return await storage.getAllCourses();
    } catch (error) {
      console.error("[CourseManager] Error getting all courses:", error);
      return [];
    }
  }

  async searchCourses(query: string): Promise<Course[]> {
    try {
      const allCourses = await storage.getAllCourses();
      const lowerQuery = query.toLowerCase();
      return allCourses.filter(
        (c) =>
          c.titleEn?.toLowerCase().includes(lowerQuery) ||
          c.titleTr?.toLowerCase().includes(lowerQuery) ||
          c.descriptionEn?.toLowerCase().includes(lowerQuery) ||
          c.descriptionTr?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("[CourseManager] Error searching courses:", error);
      return [];
    }
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    try {
      const allCourses = await storage.getAllCourses();
      return allCourses.filter((c) => c.categoryId === categoryId);
    } catch (error) {
      console.error("[CourseManager] Error getting courses by category:", error);
      return [];
    }
  }

  async getCoursesByInstructor(instructorId: number): Promise<Course[]> {
    try {
      const allCourses = await storage.getAllCourses();
      return allCourses.filter((c) => c.instructorId === instructorId);
    } catch (error) {
      console.error("[CourseManager] Error getting courses by instructor:", error);
      return [];
    }
  }
}

export const courseManager = new CourseManager();
