import { courseManager } from "./course-manager";
import { contentManager } from "./content-manager";
import { enrollmentManager } from "./enrollment-manager";
import { recommendationEngine } from "./recommendation-engine";
import { courseAnalytics } from "./course-analytics";
import { coursePermissions } from "./course-permissions";
import type { Course, InsertCourse } from "@shared/schema";

export class CourseControl {
  // Unified course operations
  courseManager = courseManager;
  contentManager = contentManager;
  enrollmentManager = enrollmentManager;
  recommendationEngine = recommendationEngine;
  courseAnalytics = courseAnalytics;
  permissions = coursePermissions;

  // High-level operations combining multiple managers
  async createCourseWithContent(
    courseData: Omit<InsertCourse, "instructorId"> & { instructorId: number },
    userRole: string
  ): Promise<{ course: Course | null; status: string }> {
    if (!this.permissions.canCreateCourse(userRole)) {
      return { course: null, status: "Permission denied" };
    }

    try {
      const course = await this.courseManager.createCourse(courseData);
      console.log("[CourseControl] Course created with content");
      return { course, status: "success" };
    } catch (error) {
      return { course: null, status: "Error creating course" };
    }
  }

  async getUserLearningDashboard(userId: number) {
    try {
      const courses = await this.enrollmentManager.getUserCourses(userId);
      const recommendations = await this.recommendationEngine.recommendCourses(userId);
      const analytics = await this.courseAnalytics.getUserCoursesAnalytics(userId);

      return {
        enrolledCourses: courses,
        recommendations,
        analytics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[CourseControl] Error building learning dashboard:", error);
      return null;
    }
  }

  async generateCoursePath(userId: number, interests: string[]) {
    try {
      const courses = await this.recommendationEngine.getCoursesForLearningPath(interests, 10);
      await this.enrollmentManager.enrollUser(userId, courses[0]?.id || 1);

      return {
        userId,
        interests,
        recommendedCourses: courses,
        enrolledIn: courses[0]?.id,
        status: "success",
      };
    } catch (error) {
      console.error("[CourseControl] Error generating course path:", error);
      return null;
    }
  }

  async syncWithStudyPlanner(userId: number, courseId: number) {
    try {
      const courseContent = await this.contentManager.getCourseContent(courseId);
      const progress = await this.enrollmentManager.getUserProgress(userId, courseId);

      return {
        userId,
        courseId,
        content: courseContent,
        progress,
        status: "synced",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[CourseControl] Error syncing with study planner:", error);
      return null;
    }
  }

  async getComprehensiveCourseReport(courseId: number, userRole: string) {
    if (!this.permissions.canViewAnalytics(userRole)) {
      return { status: "Permission denied" };
    }

    try {
      const stats = await this.courseAnalytics.getCourseStats(courseId);
      const trends = await this.courseAnalytics.getEnrollmentTrends(courseId);
      const distribution = await this.courseAnalytics.getProgressDistribution(courseId);
      const topPerformers = await this.courseAnalytics.getTopPerformers(courseId);

      return {
        courseId,
        stats,
        trends,
        distribution,
        topPerformers,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[CourseControl] Error generating report:", error);
      return null;
    }
  }

  getStatus(): { status: string; modules: string[]; timestamp: string } {
    return {
      status: "operational",
      modules: ["courseManager", "contentManager", "enrollmentManager", "recommendationEngine", "courseAnalytics", "permissions"],
      timestamp: new Date().toISOString(),
    };
  }
}

export const courseControl = new CourseControl();
