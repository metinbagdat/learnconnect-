import { storage } from "../storage";
import type { Course } from "@shared/schema";

export class RecommendationEngine {
  async recommendCourses(userId: number, limit: number = 5): Promise<Course[]> {
    try {
      const userCourses = await storage.getUserCourses(userId);
      const enrolledCourseIds = new Set(userCourses.map((uc) => uc.courseId));
      
      const allCourses = await storage.getAllCourses();
      const user = await storage.getUser(userId);

      const recommendations = allCourses.filter((c) => !enrolledCourseIds.has(c.id));

      // Score courses based on user interests
      const scored = recommendations.map((course) => {
        let score = 0;

        // Match with user interests
        if (user?.interests && Array.isArray(user.interests)) {
          const courseTitle = (course.titleEn || "") + (course.titleTr || "");
          const userInterests = user.interests || [];
          for (const interest of userInterests) {
            if (courseTitle.toLowerCase().includes(interest.toLowerCase())) {
              score += 30;
            }
          }
        }

        // Boost popular courses
        if (course.rating && course.rating >= 4) {
          score += 20;
        }

        // Prefer beginner courses
        if (course.level === "Beginner") {
          score += 10;
        }

        return { course, score };
      });

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.course);
    } catch (error) {
      console.error("[RecommendationEngine] Error recommending courses:", error);
      return [];
    }
  }

  async getRelatedCourses(courseId: number, limit: number = 5): Promise<Course[]> {
    try {
      const course = await storage.getCourse(courseId);
      if (!course) return [];

      const allCourses = await storage.getAllCourses();
      const related = allCourses.filter(
        (c) =>
          c.id !== courseId &&
          (c.categoryId === course.categoryId || c.level === course.level)
      );

      return related.slice(0, limit);
    } catch (error) {
      console.error("[RecommendationEngine] Error getting related courses:", error);
      return [];
    }
  }

  async getTrendingCourses(limit: number = 5): Promise<Course[]> {
    try {
      const allCourses = await storage.getAllCourses();
      const trending = allCourses
        .filter((c) => c.rating !== null)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);

      return trending;
    } catch (error) {
      console.error("[RecommendationEngine] Error getting trending courses:", error);
      return [];
    }
  }

  async getCoursesForLearningPath(interests: string[], limit: number = 10): Promise<Course[]> {
    try {
      const allCourses = await storage.getAllCourses();
      
      const scored = allCourses.map((course) => {
        let score = 0;
        const courseText = (course.titleEn + course.titleTr).toLowerCase();

        for (const interest of interests) {
          if (courseText.includes(interest.toLowerCase())) {
            score += 20;
          }
        }

        if (course.rating && course.rating >= 4) {
          score += 10;
        }

        if (course.level === "Beginner") {
          score += 5;
        }

        return { course, score };
      });

      return scored
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.course);
    } catch (error) {
      console.error("[RecommendationEngine] Error generating learning path:", error);
      return [];
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
