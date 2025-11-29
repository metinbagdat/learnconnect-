import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Content-Based Course Suggestions
 * Uses collaborative filtering by matching user interests with course categories and tags
 */

export class ContentBasedSuggestions {
  /**
   * Suggest courses based on matching user interests with course attributes
   * Content-based filtering: Recommends courses similar to user's interests
   */
  async suggestCoursesByInterests(userId: number): Promise<any[]> {
    try {
      console.log(`[ContentBasedSuggestions] Generating suggestions for user ${userId}`);

      // Get user profile with interests
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      if (!user) throw new Error("User not found");

      const userInterests = user.interests || [];
      console.log(`[ContentBasedSuggestions] User interests: ${userInterests.join(", ")}`);

      // Get user's current enrollments
      const enrollments = await db
        .select()
        .from(schema.userCourses)
        .where(eq(schema.userCourses.userId, userId));

      const enrolledCourseIds = enrollments.map((e) => e.courseId);

      // Get all available courses
      const allCourses = await db.select().from(schema.courses);

      // Filter out already enrolled courses
      const availableCourses = allCourses.filter(
        (c) => !enrolledCourseIds.includes(c.id)
      );

      // Calculate relevance scores based on category/tag matching
      interface ScoredCourse {
        courseId: number;
        title: string;
        score: number;
        matchedInterests: string[];
      }

      const scoredCourses: ScoredCourse[] = availableCourses.map((course) => {
        const courseCategory = (course.category || "").toLowerCase();
        const courseTitle = (course.title || "").toLowerCase();

        // Find matching interests
        const matchedInterests: string[] = [];
        let score = 0;

        for (const interest of userInterests) {
          const interestLower = interest.toLowerCase();

          // Direct category match (high weight)
          if (courseCategory.includes(interestLower) || interestLower.includes(courseCategory)) {
            matchedInterests.push(interest);
            score += 30;
          }

          // Title match (medium weight)
          if (courseTitle.includes(interestLower)) {
            matchedInterests.push(interest);
            score += 20;
          }

          // Description match (low weight)
          if (course.description?.toLowerCase().includes(interestLower)) {
            matchedInterests.push(interest);
            score += 10;
          }
        }

        // Bonus for lower difficulty courses (good for learning)
        if (course.level === "beginner") {
          score += 5;
        }

        return {
          courseId: course.id,
          title: course.title,
          score,
          matchedInterests: [...new Set(matchedInterests)], // Remove duplicates
        };
      });

      // Sort by score and return top recommendations
      const topRecommendations = scoredCourses
        .filter((c) => c.score > 0) // Only include courses with matches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((rec) => {
          const course = availableCourses.find((c) => c.id === rec.courseId);
          return {
            courseId: rec.courseId,
            title: rec.title,
            category: course?.category,
            reason: `Matches your interests: ${rec.matchedInterests.join(", ")}`,
            relevanceScore: Math.min(100, Math.round((rec.score / 30) * 100)), // Normalize to 100
            suggestedStartDate: new Date().toISOString().split("T")[0],
          };
        });

      console.log(
        `[ContentBasedSuggestions] ✓ Generated ${topRecommendations.length} content-based recommendations`
      );
      return topRecommendations;
    } catch (error) {
      console.error("[ContentBasedSuggestions] Error:", error);
      return [];
    }
  }

  /**
   * Get courses similar to a given course (for "Related Courses" feature)
   */
  async getRelatedCourses(courseId: number, limit: number = 5): Promise<any[]> {
    try {
      // Get the reference course
      const [course] = await db.select().from(schema.courses).where(eq(schema.courses.id, courseId));
      if (!course) throw new Error("Course not found");

      // Get all other courses
      const allCourses = await db.select().from(schema.courses);
      const otherCourses = allCourses.filter((c) => c.id !== courseId);

      // Score courses by similarity
      const similarCourses = otherCourses
        .map((c) => {
          let score = 0;

          // Same category (high weight)
          if (c.category === course.category) {
            score += 50;
          }

          // Similar level
          if (c.level === course.level) {
            score += 20;
          }

          // Keyword overlap in description
          const courseKeywords = (course.description || "")
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 3);
          const otherKeywords = (c.description || "")
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 3);

          const overlap = courseKeywords.filter((k) => otherKeywords.includes(k)).length;
          score += overlap * 5;

          return { course: c, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return similarCourses.map((s) => ({
        courseId: s.course.id,
        title: s.course.title,
        category: s.course.category,
        similarity: Math.min(100, Math.round((s.score / 50) * 100)),
      }));
    } catch (error) {
      console.error("[ContentBasedSuggestions] Error getting related courses:", error);
      return [];
    }
  }
}

export const contentBasedSuggestions = new ContentBasedSuggestions();
