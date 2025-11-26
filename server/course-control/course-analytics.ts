import { storage } from "../storage";

export class CourseAnalytics {
  async getCourseStats(courseId: number) {
    try {
      const enrollments = await storage.getAllUserCourses();
      const courseEnrollments = enrollments.filter((e) => e.courseId === courseId);

      const completedCount = courseEnrollments.filter((e) => e.completed).length;
      const avgProgress = courseEnrollments.length > 0
        ? Math.round(courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length)
        : 0;

      return {
        courseId,
        totalEnrollments: courseEnrollments.length,
        completedEnrollments: completedCount,
        averageProgress: avgProgress,
        completionRate: courseEnrollments.length > 0 ? Math.round((completedCount / courseEnrollments.length) * 100) : 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[CourseAnalytics] Error getting course stats:", error);
      return null;
    }
  }

  async getUserCoursesAnalytics(userId: number) {
    try {
      const userCourses = await storage.getUserCourses(userId);
      const analytics = {
        userId,
        totalCoursesEnrolled: userCourses.length,
        completedCourses: userCourses.filter((uc) => uc.completed).length,
        averageProgress: userCourses.length > 0
          ? Math.round(userCourses.reduce((sum, uc) => sum + uc.progress, 0) / userCourses.length)
          : 0,
        courses: userCourses.map((uc) => ({
          courseId: uc.courseId,
          progress: uc.progress,
          completed: uc.completed,
          enrolledAt: uc.enrolledAt,
        })),
        timestamp: new Date().toISOString(),
      };

      return analytics;
    } catch (error) {
      console.error("[CourseAnalytics] Error getting user analytics:", error);
      return null;
    }
  }

  async getEnrollmentTrends(courseId: number) {
    try {
      const enrollments = await storage.getAllUserCourses();
      const courseEnrollments = enrollments.filter((e) => e.courseId === courseId);

      // Group by date
      const trends: Record<string, number> = {};
      for (const enrollment of courseEnrollments) {
        const date = new Date(enrollment.enrolledAt).toISOString().split("T")[0];
        trends[date] = (trends[date] || 0) + 1;
      }

      return {
        courseId,
        trends: Object.entries(trends).map(([date, count]) => ({ date, enrollments: count })),
      };
    } catch (error) {
      console.error("[CourseAnalytics] Error getting enrollment trends:", error);
      return null;
    }
  }

  async getProgressDistribution(courseId: number) {
    try {
      const enrollments = await storage.getAllUserCourses();
      const courseEnrollments = enrollments.filter((e) => e.courseId === courseId);

      const distribution = {
        "0-25%": 0,
        "26-50%": 0,
        "51-75%": 0,
        "76-99%": 0,
        "100%": 0,
      };

      for (const enrollment of courseEnrollments) {
        if (enrollment.progress === 100) {
          distribution["100%"]++;
        } else if (enrollment.progress >= 76) {
          distribution["76-99%"]++;
        } else if (enrollment.progress >= 51) {
          distribution["51-75%"]++;
        } else if (enrollment.progress >= 26) {
          distribution["26-50%"]++;
        } else {
          distribution["0-25%"]++;
        }
      }

      return {
        courseId,
        distribution,
        totalEnrollments: courseEnrollments.length,
      };
    } catch (error) {
      console.error("[CourseAnalytics] Error getting progress distribution:", error);
      return null;
    }
  }

  async getTopPerformers(courseId: number, limit: number = 10) {
    try {
      const enrollments = await storage.getAllUserCourses();
      const courseEnrollments = enrollments
        .filter((e) => e.courseId === courseId)
        .sort((a, b) => b.progress - a.progress)
        .slice(0, limit);

      return {
        courseId,
        topPerformers: courseEnrollments,
      };
    } catch (error) {
      console.error("[CourseAnalytics] Error getting top performers:", error);
      return null;
    }
  }
}

export const courseAnalytics = new CourseAnalytics();
