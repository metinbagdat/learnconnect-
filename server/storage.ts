import { 
  type User, 
  type InsertUser, 
  type Course,
  type Module,
  type Lesson,
  type UserCourse,
  type UserLesson,
  type Assignment,
  type UserAssignment,
  type Badge,
  type UserBadge,
  type CourseRecommendation,
  type LearningPath,
  type LearningPathStep,
  type InsertLearningPath,
  type InsertLearningPathStep,
  // Analytics types
  type UserActivityLog,
  type InsertUserActivityLog,
  type CourseAnalytic,
  type InsertCourseAnalytic,
  type UserProgressSnapshot,
  type InsertUserProgressSnapshot,
  insertCourseSchema,
  insertModuleSchema,
  insertLessonSchema,
  insertUserCourseSchema,
  insertUserLessonSchema,
  insertAssignmentSchema,
  insertUserAssignmentSchema,
  insertBadgeSchema,
  insertUserBadgeSchema,
  insertCourseRecommendationSchema,
  insertLearningPathSchema,
  insertLearningPathStepSchema,
  // Analytics schemas
  insertUserActivityLogSchema,
  insertCourseAnalyticsSchema,
  insertUserProgressSnapshotSchema,
  users,
  courses,
  modules,
  lessons,
  userCourses,
  userLessons,
  assignments,
  userAssignments,
  badges,
  userBadges,
  courseRecommendations,
  learningPaths,
  learningPathSteps,
  // Analytics tables
  userActivityLogs,
  courseAnalytics,
  userProgressSnapshots
} from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, and, or, desc, inArray, asc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Define insert types based on the schemas
type InsertCourse = z.infer<typeof insertCourseSchema>;
type InsertModule = z.infer<typeof insertModuleSchema>;
type InsertLesson = z.infer<typeof insertLessonSchema>;
type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;
type InsertUserLesson = z.infer<typeof insertUserLessonSchema>;
type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
type InsertUserAssignment = z.infer<typeof insertUserAssignmentSchema>;
type InsertBadge = z.infer<typeof insertBadgeSchema>;
type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
type InsertCourseRecommendation = z.infer<typeof insertCourseRecommendationSchema>;

const PostgresSessionStore = connectPg(session);

// Define SessionStore type
type SessionStore = session.Store;

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  updateUserInterests(userId: number, interests: string[]): Promise<User | undefined>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, data: Partial<Course>): Promise<Course | undefined>;
  getAiGeneratedCourses(): Promise<Course[]>;
  
  // Module operations
  getModules(courseId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Lesson operations
  getLessons(moduleId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // UserCourse operations
  getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]>;
  enrollUserInCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourseProgress(id: number, progress: number): Promise<UserCourse | undefined>;
  
  // UserLesson operations
  getUserLessons(userId: number): Promise<(UserLesson & { lesson: Lesson })[]>;
  updateUserLessonProgress(userId: number, lessonId: number, progress: number): Promise<UserLesson>;
  
  // Assignment operations
  getAssignments(): Promise<Assignment[]>;
  getUserAssignments(userId: number): Promise<(Assignment & { course: Course })[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  
  // Badge operations
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  // Course recommendation operations
  getCourseRecommendations(userId: number): Promise<CourseRecommendation | undefined>;
  saveCourseRecommendations(userId: number, recommendations: any): Promise<CourseRecommendation>;
  
  // Learning path operations
  getLearningPaths(userId: number): Promise<LearningPath[]>;
  getLearningPath(id: number): Promise<(LearningPath & { steps: (LearningPathStep & { course: Course })[] }) | undefined>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  addLearningPathStep(step: InsertLearningPathStep): Promise<LearningPathStep>;
  updateLearningPathProgress(id: number, progress: number): Promise<LearningPath | undefined>;
  markStepAsCompleted(id: number): Promise<LearningPathStep | undefined>;
  generateLearningPath(userId: number, goal: string): Promise<LearningPath>;
  
  // Analytics operations
  logUserActivity(activity: InsertUserActivityLog): Promise<UserActivityLog>;
  getUserActivities(userId: number, limit?: number): Promise<UserActivityLog[]>;
  getUserActivityByTimeframe(userId: number, startDate: Date, endDate: Date): Promise<UserActivityLog[]>;
  
  // Course analytics operations
  getCourseAnalytics(courseId: number): Promise<CourseAnalytic | undefined>;
  updateCourseAnalytics(courseId: number, data: Partial<InsertCourseAnalytic>): Promise<CourseAnalytic>;
  getPopularCourses(limit?: number): Promise<(CourseAnalytic & { course: Course })[]>;
  
  // User progress operations
  getUserProgressSnapshot(userId: number, date?: Date): Promise<UserProgressSnapshot | undefined>;
  createUserProgressSnapshot(data: InsertUserProgressSnapshot): Promise<UserProgressSnapshot>;
  getUserProgressOverTime(userId: number, startDate: Date, endDate: Date): Promise<UserProgressSnapshot[]>;
  getPlatformStats(): Promise<{
    totalUsers: number,
    totalCourses: number,
    totalLessonsCompleted: number,
    totalAssignmentsCompleted: number,
    averageGrade: number
  }>;
  
  // Session store
  sessionStore: SessionStore;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
    
    // Check if we need to seed the database
    this.seedDatabaseIfEmpty();
  }
  
  private async seedDatabaseIfEmpty() {
    try {
      // Check if we have any courses
      const existingCourses = await this.getCourses();
      if (existingCourses.length === 0) {
        console.log("Seeding database with initial data...");
        await this.seedSampleData();
      }
    } catch (error) {
      console.error("Error checking or seeding database:", error);
    }
  }
  
  private async seedSampleData() {
    try {
      // First check if we have an instructor
      let instructorId = 1; // Default to the first user
      const instructorUser = await this.getUserByUsername("instructor");
      
      if (!instructorUser) {
        // Create a sample instructor user
        const instructor = await this.createUser({
          username: "instructor",
          password: "$2b$10$D8OXXrBpHCqB/JikS6UT5Or2w9K1q4kBTfTa9L4cFbz/5lxDxjOe.", // instructor123
          displayName: "John Instructor",
          role: "instructor"
        });
        instructorId = instructor.id;
      } else {
        instructorId = instructorUser.id;
      }
      
      // Create sample courses
      const course1 = await this.createCourse({
        title: "Introduction to JavaScript",
        description: "Learn the basics of JavaScript programming language",
        category: "Programming",
        moduleCount: 8,
        durationHours: 24,
        instructorId,
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        rating: 4
      });
      
      const course2 = await this.createCourse({
        title: "Data Science Fundamentals",
        description: "Introduction to data science concepts and tools",
        category: "Data Science",
        moduleCount: 10,
        durationHours: 30,
        instructorId,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        rating: 5
      });
      
      const course3 = await this.createCourse({
        title: "Web Development Bootcamp",
        description: "Comprehensive course on full-stack web development",
        category: "Web Development",
        moduleCount: 12,
        durationHours: 40,
        instructorId,
        imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        rating: 5
      });
      
      // Create sample assignments
      await this.createAssignment({
        title: "JavaScript Basics Quiz",
        description: "Test your knowledge of JavaScript fundamentals",
        courseId: course1.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // One week from now
      });
      
      await this.createAssignment({
        title: "Data Analysis Project",
        description: "Analyze a real-world dataset and present your findings",
        courseId: course2.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Two weeks from now
      });
      
      await this.createAssignment({
        title: "Portfolio Website",
        description: "Build a personal portfolio website using HTML, CSS, and JavaScript",
        courseId: course3.id,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // Three weeks from now
      });
      
      // Create sample badges
      const badge1 = await this.createBadge({
        title: "JavaScript Master",
        description: "Completed the JavaScript course with excellence",
        imageUrl: "https://img.icons8.com/color/96/000000/javascript.png"
      });
      
      const badge2 = await this.createBadge({
        title: "Data Scientist",
        description: "Successfully completed the data science course",
        imageUrl: "https://img.icons8.com/color/96/000000/python.png"
      });
      
      const badge3 = await this.createBadge({
        title: "Web Developer",
        description: "Mastered full-stack web development",
        imageUrl: "https://img.icons8.com/color/96/000000/html-5.png"
      });
      
      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Course operations
  async getCourses(): Promise<Course[]> {
    return db.select().from(courses).orderBy(courses.title);
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }
  
  async updateCourse(id: number, data: Partial<Course>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(data)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }
  
  // UserCourse operations
  async getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]> {
    const userCoursesResult = await db
      .select({
        userCourse: userCourses,
        course: courses
      })
      .from(userCourses)
      .leftJoin(courses, eq(userCourses.courseId, courses.id))
      .where(eq(userCourses.userId, userId))
      .orderBy(desc(userCourses.enrolledAt));
    
    return userCoursesResult.map(({ userCourse, course }) => ({
      ...userCourse,
      course: course as Course // Type cast to handle potential null
    })) as (UserCourse & { course: Course })[];
  }
  
  async enrollUserInCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const [newUserCourse] = await db
      .insert(userCourses)
      .values(userCourse)
      .returning();
    return newUserCourse;
  }
  
  async updateUserCourseProgress(id: number, progress: number): Promise<UserCourse | undefined> {
    const completed = progress >= 100;
    
    const [updatedUserCourse] = await db
      .update(userCourses)
      .set({ 
        progress, 
        completed 
      })
      .where(eq(userCourses.id, id))
      .returning();
    
    return updatedUserCourse;
  }
  
  // Assignment operations
  async getAssignments(): Promise<Assignment[]> {
    return db.select().from(assignments).orderBy(desc(assignments.dueDate));
  }
  
  async getUserAssignments(userId: number): Promise<(Assignment & { course: Course })[]> {
    // Get courses the user is enrolled in
    const userCoursesResult = await db
      .select({ courseId: userCourses.courseId })
      .from(userCourses)
      .where(eq(userCourses.userId, userId));
    
    const courseIds = userCoursesResult.map(row => row.courseId);
    
    if (courseIds.length === 0) {
      return [];
    }
    
    // Get assignments for these courses with course details
    const assignmentsResult = await db
      .select({
        assignment: assignments,
        course: courses
      })
      .from(assignments)
      .leftJoin(courses, eq(assignments.courseId, courses.id))
      .where(inArray(assignments.courseId, courseIds))
      .orderBy(desc(assignments.dueDate));
    
    return assignmentsResult.map(({ assignment, course }) => ({
      ...assignment,
      course: course as Course // Type cast to handle potential null
    })) as (Assignment & { course: Course })[];
  }
  
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db
      .insert(assignments)
      .values(assignment)
      .returning();
    return newAssignment;
  }
  
  // Badge operations
  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db.insert(badges).values(badge).returning();
    return newBadge;
  }
  
  async getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]> {
    const userBadgesResult = await db
      .select({
        userBadge: userBadges,
        badge: badges
      })
      .from(userBadges)
      .leftJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));
    
    return userBadgesResult.map(({ userBadge, badge }) => ({
      ...userBadge,
      badge: badge as Badge // Type cast to handle potential null
    })) as (UserBadge & { badge: Badge })[];
  }
  
  async awardBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge> {
    const [newUserBadge] = await db
      .insert(userBadges)
      .values(userBadge)
      .returning();
    return newUserBadge;
  }
  
  // User Interest operations
  async updateUserInterests(userId: number, interests: string[]): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ interests })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // AI Generated Courses
  async getAiGeneratedCourses(): Promise<Course[]> {
    return db
      .select()
      .from(courses)
      .where(eq(courses.isAiGenerated, true))
      .orderBy(desc(courses.createdAt));
  }

  // Module operations
  async getModules(courseId: number): Promise<Module[]> {
    return db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(modules.order);
  }

  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db
      .insert(modules)
      .values(module)
      .returning();
    return newModule;
  }

  // Lesson operations
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db
      .insert(lessons)
      .values(lesson)
      .returning();
    return newLesson;
  }

  // UserLesson operations
  async getUserLessons(userId: number): Promise<(UserLesson & { lesson: Lesson })[]> {
    const userLessonsResult = await db
      .select({
        userLesson: userLessons,
        lesson: lessons
      })
      .from(userLessons)
      .leftJoin(lessons, eq(userLessons.lessonId, lessons.id))
      .where(eq(userLessons.userId, userId));
    
    return userLessonsResult.map(({ userLesson, lesson }) => ({
      ...userLesson,
      lesson: lesson as Lesson
    })) as (UserLesson & { lesson: Lesson })[];
  }

  async updateUserLessonProgress(userId: number, lessonId: number, progress: number): Promise<UserLesson> {
    // Check if the user-lesson record exists
    const [existingUserLesson] = await db
      .select()
      .from(userLessons)
      .where(and(
        eq(userLessons.userId, userId),
        eq(userLessons.lessonId, lessonId)
      ));
    
    if (existingUserLesson) {
      // Update existing record
      const completed = progress >= 100;
      const [updatedUserLesson] = await db
        .update(userLessons)
        .set({ 
          progress, 
          completed,
          lastAccessedAt: new Date()
        })
        .where(eq(userLessons.id, existingUserLesson.id))
        .returning();
      return updatedUserLesson;
    } else {
      // Create new record
      const [newUserLesson] = await db
        .insert(userLessons)
        .values({
          userId,
          lessonId,
          progress,
          completed: progress >= 100,
          lastAccessedAt: new Date()
        })
        .returning();
      return newUserLesson;
    }
  }

  // Course recommendation operations
  async getCourseRecommendations(userId: number): Promise<CourseRecommendation | undefined> {
    const [recommendations] = await db
      .select()
      .from(courseRecommendations)
      .where(eq(courseRecommendations.userId, userId))
      .orderBy(desc(courseRecommendations.createdAt))
      .limit(1);
    
    return recommendations;
  }

  async saveCourseRecommendations(userId: number, recommendations: any): Promise<CourseRecommendation> {
    const [newRecommendations] = await db
      .insert(courseRecommendations)
      .values({
        userId,
        recommendations,
        createdAt: new Date()
      })
      .returning();
    
    return newRecommendations;
  }

  // Learning path operations
  async getLearningPaths(userId: number): Promise<LearningPath[]> {
    return db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.userId, userId))
      .orderBy(desc(learningPaths.createdAt));
  }

  async getLearningPath(id: number): Promise<(LearningPath & { steps: (LearningPathStep & { course: Course })[] }) | undefined> {
    const [path] = await db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.id, id));

    if (!path) {
      return undefined;
    }

    const stepsResult = await db
      .select({
        step: learningPathSteps,
        course: courses
      })
      .from(learningPathSteps)
      .leftJoin(courses, eq(learningPathSteps.courseId, courses.id))
      .where(eq(learningPathSteps.pathId, id))
      .orderBy(learningPathSteps.order);

    const steps = stepsResult.map(({ step, course }) => ({
      ...step,
      course: course as Course
    })) as (LearningPathStep & { course: Course })[];

    return {
      ...path,
      steps
    };
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const [newPath] = await db
      .insert(learningPaths)
      .values({
        ...path,
        createdAt: new Date()
      })
      .returning();
    
    return newPath;
  }

  async addLearningPathStep(step: InsertLearningPathStep): Promise<LearningPathStep> {
    const [newStep] = await db
      .insert(learningPathSteps)
      .values(step)
      .returning();
    
    return newStep;
  }

  async updateLearningPathProgress(id: number, progress: number): Promise<LearningPath | undefined> {
    const [updatedPath] = await db
      .update(learningPaths)
      .set({ 
        progress,
        updatedAt: new Date()
      })
      .where(eq(learningPaths.id, id))
      .returning();
    
    return updatedPath;
  }

  async markStepAsCompleted(id: number): Promise<LearningPathStep | undefined> {
    const [updatedStep] = await db
      .update(learningPathSteps)
      .set({ completed: true })
      .where(eq(learningPathSteps.id, id))
      .returning();
    
    return updatedStep;
  }

  async generateLearningPath(userId: number, goal: string): Promise<LearningPath> {
    // We'll implement the AI generation logic in the server routes
    // This is just a placeholder that creates an empty learning path
    const [newPath] = await db
      .insert(learningPaths)
      .values({
        userId,
        title: `Path toward ${goal}`,
        description: "AI-generated learning path",
        goal,
        progress: 0,
        isAiGenerated: true,
        createdAt: new Date()
      })
      .returning();
    
    return newPath;
  }

  // Analytics operations
  async logUserActivity(activity: InsertUserActivityLog): Promise<UserActivityLog> {
    try {
      const [logEntry] = await db.insert(userActivityLogs).values(activity).returning();
      return logEntry;
    } catch (error) {
      console.error("Error logging user activity:", error);
      throw error;
    }
  }

  async getUserActivities(userId: number, limit = 20): Promise<UserActivityLog[]> {
    try {
      return db.select()
        .from(userActivityLogs)
        .where(eq(userActivityLogs.userId, userId))
        .orderBy(desc(userActivityLogs.createdAt))
        .limit(limit);
    } catch (error) {
      console.error("Error getting user activities:", error);
      throw error;
    }
  }

  async getUserActivityByTimeframe(userId: number, startDate: Date, endDate: Date): Promise<UserActivityLog[]> {
    try {
      return db.select()
        .from(userActivityLogs)
        .where(and(
          eq(userActivityLogs.userId, userId),
          sql`${userActivityLogs.createdAt} >= ${startDate}`,
          sql`${userActivityLogs.createdAt} <= ${endDate}`
        ))
        .orderBy(asc(userActivityLogs.createdAt));
    } catch (error) {
      console.error("Error getting user activities by timeframe:", error);
      throw error;
    }
  }

  // Course analytics operations
  async getCourseAnalytics(courseId: number): Promise<CourseAnalytic | undefined> {
    try {
      const [analytics] = await db.select()
        .from(courseAnalytics)
        .where(eq(courseAnalytics.courseId, courseId));
      return analytics;
    } catch (error) {
      console.error("Error getting course analytics:", error);
      throw error;
    }
  }

  async updateCourseAnalytics(courseId: number, data: Partial<InsertCourseAnalytic>): Promise<CourseAnalytic> {
    try {
      // Check if analytics exist for this course
      const existing = await this.getCourseAnalytics(courseId);
      
      if (existing) {
        // Update existing analytics
        const [updated] = await db.update(courseAnalytics)
          .set({
            ...data,
            updatedAt: new Date()
          })
          .where(eq(courseAnalytics.courseId, courseId))
          .returning();
        return updated;
      } else {
        // Create new analytics entry
        const [created] = await db.insert(courseAnalytics)
          .values({
            courseId,
            ...data,
            totalEnrollments: data.totalEnrollments || 0,
            completionRate: data.completionRate || 0,
            dropoffRate: data.dropoffRate || 0
          })
          .returning();
        return created;
      }
    } catch (error) {
      console.error("Error updating course analytics:", error);
      throw error;
    }
  }

  async getPopularCourses(limit = 10): Promise<(CourseAnalytic & { course: Course })[]> {
    try {
      const result = await db.select({
        analytics: courseAnalytics,
        course: courses
      })
      .from(courseAnalytics)
      .leftJoin(courses, eq(courseAnalytics.courseId, courses.id))
      .orderBy(desc(courseAnalytics.totalEnrollments))
      .limit(limit);
      
      return result.map(({ analytics, course }) => ({
        ...analytics,
        course: course as Course
      })) as (CourseAnalytic & { course: Course })[];
    } catch (error) {
      console.error("Error getting popular courses:", error);
      throw error;
    }
  }

  // User progress operations
  async getUserProgressSnapshot(userId: number, date?: Date): Promise<UserProgressSnapshot | undefined> {
    try {
      let query = db.select()
        .from(userProgressSnapshots)
        .where(eq(userProgressSnapshots.userId, userId));
      
      if (date) {
        // Convert Date to string in YYYY-MM-DD format
        const dateStr = date.toISOString().split('T')[0];
        query = db.select()
          .from(userProgressSnapshots)
          .where(and(
            eq(userProgressSnapshots.userId, userId),
            eq(userProgressSnapshots.snapshotDate, dateStr)
          ));
      } else {
        // Get the most recent snapshot if no date specified
        query = db.select()
          .from(userProgressSnapshots)
          .where(eq(userProgressSnapshots.userId, userId))
          .orderBy(desc(userProgressSnapshots.snapshotDate))
          .limit(1);
      }
      
      const [snapshot] = await query;
      return snapshot;
    } catch (error) {
      console.error("Error getting user progress snapshot:", error);
      throw error;
    }
  }

  async createUserProgressSnapshot(data: InsertUserProgressSnapshot): Promise<UserProgressSnapshot> {
    try {
      const [snapshot] = await db.insert(userProgressSnapshots)
        .values(data)
        .returning();
      return snapshot;
    } catch (error) {
      console.error("Error creating user progress snapshot:", error);
      throw error;
    }
  }

  async getUserProgressOverTime(userId: number, startDate: Date, endDate: Date): Promise<UserProgressSnapshot[]> {
    try {
      // Convert dates to string in YYYY-MM-DD format
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      return db.select()
        .from(userProgressSnapshots)
        .where(and(
          eq(userProgressSnapshots.userId, userId),
          sql`${userProgressSnapshots.snapshotDate} >= ${startDateStr}`,
          sql`${userProgressSnapshots.snapshotDate} <= ${endDateStr}`
        ))
        .orderBy(asc(userProgressSnapshots.snapshotDate));
    } catch (error) {
      console.error("Error getting user progress over time:", error);
      throw error;
    }
  }

  async getPlatformStats(): Promise<{
    totalUsers: number,
    totalCourses: number,
    totalLessonsCompleted: number,
    totalAssignmentsCompleted: number,
    averageGrade: number
  }> {
    try {
      // Get total users
      const [usersResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
      const totalUsers = usersResult ? Number(usersResult.count) : 0;
      
      // Get total courses
      const [coursesResult] = await db.select({ count: sql<number>`count(*)` }).from(courses);
      const totalCourses = coursesResult ? Number(coursesResult.count) : 0;
      
      // Get lessons completed
      const [lessonsResult] = await db.select({ 
        count: sql<number>`count(*)`
      }).from(userLessons).where(eq(userLessons.completed, true));
      const totalLessonsCompleted = lessonsResult ? Number(lessonsResult.count) : 0;
      
      // Get assignments completed
      const [assignmentsResult] = await db.select({ 
        count: sql<number>`count(*)`
      }).from(userAssignments).where(eq(userAssignments.status, "submitted"));
      const totalAssignmentsCompleted = assignmentsResult ? Number(assignmentsResult.count) : 0;
      
      // Calculate average grade
      const [gradesResult] = await db.select({ 
        average: sql<number>`avg(grade)`
      }).from(userAssignments).where(sql`grade is not null`);
      const averageGrade = gradesResult && gradesResult.average ? Number(gradesResult.average) : 0;
      
      return {
        totalUsers,
        totalCourses,
        totalLessonsCompleted,
        totalAssignmentsCompleted,
        averageGrade
      };
    } catch (error) {
      console.error("Error getting platform stats:", error);
      throw error;
    }
  }
}

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();