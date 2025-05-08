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
  // Adaptive Learning Reward System types
  type Challenge,
  type InsertChallenge,
  type UserChallenge,
  type InsertUserChallenge,
  type UserLevel,
  type InsertUserLevel,
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
  // Adaptive Learning Reward System schemas
  insertChallengeSchema,
  insertUserChallengeSchema,
  insertUserLevelSchema,
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
  userProgressSnapshots,
  // Adaptive Learning Reward System tables
  challenges,
  userChallenges,
  userLevels
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
  
  // Adaptive Learning Reward System operations
  // Challenge operations
  getChallenges(filters?: { type?: string; active?: boolean; category?: string }): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, data: Partial<Challenge>): Promise<Challenge | undefined>;
  deactivateChallenge(id: number): Promise<Challenge | undefined>;
  getCourseRelatedChallenges(courseId: number): Promise<Challenge[]>;
  
  // User challenge operations
  getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]>;
  getUserActiveAndCompletedChallenges(userId: number): Promise<{
    active: (UserChallenge & { challenge: Challenge })[];
    completed: (UserChallenge & { challenge: Challenge })[];
  }>;
  assignChallengeToUser(userId: number, challengeId: number): Promise<UserChallenge>;
  updateUserChallengeProgress(userId: number, challengeId: number, progress: number): Promise<UserChallenge | undefined>;
  completeUserChallenge(userId: number, challengeId: number): Promise<UserChallenge | undefined>;
  
  // User level operations
  getUserLevel(userId: number): Promise<UserLevel | undefined>;
  initializeUserLevel(userId: number): Promise<UserLevel>;
  addUserXp(userId: number, xpAmount: number): Promise<UserLevel | undefined>;
  addUserPoints(userId: number, pointsAmount: number): Promise<UserLevel | undefined>;
  updateUserStreak(userId: number): Promise<UserLevel | undefined>;
  resetUserStreak(userId: number): Promise<UserLevel | undefined>;
  
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
      .orderBy(modules.orderIndex);
  }
  
  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }
  
  // Lesson operations
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.orderIndex);
  }
  
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
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
      .where(eq(userLessons.userId, userId))
      .orderBy(desc(userLessons.lastAccessedAt));
    
    return userLessonsResult.map(({ userLesson, lesson }) => ({
      ...userLesson,
      lesson: lesson as Lesson
    })) as (UserLesson & { lesson: Lesson })[];
  }
  
  async updateUserLessonProgress(userId: number, lessonId: number, progress: number): Promise<UserLesson> {
    // Check if a record already exists
    const existingRecord = await db
      .select()
      .from(userLessons)
      .where(
        and(
          eq(userLessons.userId, userId),
          eq(userLessons.lessonId, lessonId)
        )
      );
    
    const completed = progress >= 100;
    const now = new Date();
    
    if (existingRecord.length > 0) {
      // Update existing record
      const [updatedRecord] = await db
        .update(userLessons)
        .set({
          progress,
          completed,
          lastAccessedAt: now
        })
        .where(
          and(
            eq(userLessons.userId, userId),
            eq(userLessons.lessonId, lessonId)
          )
        )
        .returning();
      
      return updatedRecord;
    } else {
      // Create new record
      const [newRecord] = await db
        .insert(userLessons)
        .values({
          userId,
          lessonId,
          progress,
          completed,
          lastAccessedAt: now
        })
        .returning();
      
      return newRecord;
    }
  }
  
  // Course Recommendation operations
  async getCourseRecommendations(userId: number): Promise<CourseRecommendation | undefined> {
    const [recommendation] = await db
      .select()
      .from(courseRecommendations)
      .where(eq(courseRecommendations.userId, userId))
      .orderBy(desc(courseRecommendations.createdAt));
    
    return recommendation;
  }
  
  async saveCourseRecommendations(userId: number, recommendations: any): Promise<CourseRecommendation> {
    const [newRecommendation] = await db
      .insert(courseRecommendations)
      .values({
        userId,
        recommendations: recommendations,
      })
      .returning();
    
    return newRecommendation;
  }
  
  // Learning Path operations
  async getLearningPaths(userId: number): Promise<LearningPath[]> {
    return db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.userId, userId))
      .orderBy(desc(learningPaths.createdAt));
  }
  
  async getLearningPath(id: number): Promise<(LearningPath & { steps: (LearningPathStep & { course: Course })[] }) | undefined> {
    // Get learning path
    const [learningPath] = await db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.id, id));
    
    if (!learningPath) {
      return undefined;
    }
    
    // Get steps with course details
    const stepsResult = await db
      .select({
        step: learningPathSteps,
        course: courses
      })
      .from(learningPathSteps)
      .leftJoin(courses, eq(learningPathSteps.courseId, courses.id))
      .where(eq(learningPathSteps.pathId, id))
      .orderBy(learningPathSteps.orderIndex);
    
    const steps = stepsResult.map(({ step, course }) => ({
      ...step,
      course: course as Course
    })) as (LearningPathStep & { course: Course })[];
    
    return {
      ...learningPath,
      steps
    };
  }
  
  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const [newPath] = await db
      .insert(learningPaths)
      .values(path)
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
    const completed = progress >= 100;
    
    const [updatedPath] = await db
      .update(learningPaths)
      .set({
        progress,
        completed,
        updatedAt: new Date()
      })
      .where(eq(learningPaths.id, id))
      .returning();
    
    return updatedPath;
  }
  
  async markStepAsCompleted(id: number): Promise<LearningPathStep | undefined> {
    const [completedStep] = await db
      .update(learningPathSteps)
      .set({
        completed: true
      })
      .where(eq(learningPathSteps.id, id))
      .returning();
    
    if (completedStep) {
      // Update path progress
      const pathId = completedStep.pathId;
      
      // Get all steps for the path
      const allSteps = await db
        .select()
        .from(learningPathSteps)
        .where(eq(learningPathSteps.pathId, pathId));
      
      const completedSteps = allSteps.filter(step => step.completed).length;
      const totalSteps = allSteps.length;
      
      // Calculate progress percentage
      const progress = Math.round((completedSteps / totalSteps) * 100);
      
      // Update learning path progress
      await this.updateLearningPathProgress(pathId, progress);
    }
    
    return completedStep;
  }
  
  async generateLearningPath(userId: number, goal: string): Promise<LearningPath> {
    // This is a stub for now - the actual implementation will be in the AI service
    const newPath = await this.createLearningPath({
      userId,
      title: `Learning Path for: ${goal}`,
      description: `A custom learning path to achieve your goal: ${goal}`,
      goal,
      progress: 0,
      completed: false
    });
    
    return newPath;
  }
  
  // Analytics operations
  async logUserActivity(activity: InsertUserActivityLog): Promise<UserActivityLog> {
    const [newLog] = await db
      .insert(userActivityLogs)
      .values(activity)
      .returning();
    
    return newLog;
  }
  
  async getUserActivities(userId: number, limit = 20): Promise<UserActivityLog[]> {
    return db
      .select()
      .from(userActivityLogs)
      .where(eq(userActivityLogs.userId, userId))
      .orderBy(desc(userActivityLogs.timestamp))
      .limit(limit);
  }
  
  async getUserActivityByTimeframe(userId: number, startDate: Date, endDate: Date): Promise<UserActivityLog[]> {
    return db
      .select()
      .from(userActivityLogs)
      .where(
        and(
          eq(userActivityLogs.userId, userId),
          sql`${userActivityLogs.timestamp} >= ${startDate}`,
          sql`${userActivityLogs.timestamp} <= ${endDate}`
        )
      )
      .orderBy(desc(userActivityLogs.timestamp));
  }
  
  // Course Analytics operations
  async getCourseAnalytics(courseId: number): Promise<CourseAnalytic | undefined> {
    const [analytic] = await db
      .select()
      .from(courseAnalytics)
      .where(eq(courseAnalytics.courseId, courseId));
    
    return analytic;
  }
  
  async updateCourseAnalytics(courseId: number, data: Partial<InsertCourseAnalytic>): Promise<CourseAnalytic> {
    const existing = await this.getCourseAnalytics(courseId);
    
    if (existing) {
      // Update existing analytics
      const [updated] = await db
        .update(courseAnalytics)
        .set(data)
        .where(eq(courseAnalytics.id, existing.id))
        .returning();
      
      return updated;
    } else {
      // Create new analytics
      const [created] = await db
        .insert(courseAnalytics)
        .values({
          courseId,
          ...data,
          views: data.views || 0,
          enrollments: data.enrollments || 0,
          completions: data.completions || 0,
          averageRating: data.averageRating || 0,
          totalReviews: data.totalReviews || 0
        })
        .returning();
      
      return created;
    }
  }
  
  async getPopularCourses(limit = 10): Promise<(CourseAnalytic & { course: Course })[]> {
    const popularCoursesResult = await db
      .select({
        analytics: courseAnalytics,
        course: courses
      })
      .from(courseAnalytics)
      .leftJoin(courses, eq(courseAnalytics.courseId, courses.id))
      .orderBy(desc(courseAnalytics.enrollments))
      .limit(limit);
    
    return popularCoursesResult.map(({ analytics, course }) => ({
      ...analytics,
      course: course as Course
    })) as (CourseAnalytic & { course: Course })[];
  }
  
  // User Progress Snapshot operations
  async getUserProgressSnapshot(userId: number, date?: Date): Promise<UserProgressSnapshot | undefined> {
    let query = db
      .select()
      .from(userProgressSnapshots)
      .where(eq(userProgressSnapshots.userId, userId))
      .orderBy(desc(userProgressSnapshots.createdAt));
    
    if (date) {
      query = query.where(
        sql`DATE(${userProgressSnapshots.createdAt}) = DATE(${date})`
      );
    }
    
    query = query.limit(1);
    
    const [snapshot] = await query;
    return snapshot;
  }
  
  async createUserProgressSnapshot(data: InsertUserProgressSnapshot): Promise<UserProgressSnapshot> {
    const [snapshot] = await db
      .insert(userProgressSnapshots)
      .values(data)
      .returning();
    
    return snapshot;
  }
  
  async getUserProgressOverTime(userId: number, startDate: Date, endDate: Date): Promise<UserProgressSnapshot[]> {
    return db
      .select()
      .from(userProgressSnapshots)
      .where(
        and(
          eq(userProgressSnapshots.userId, userId),
          sql`${userProgressSnapshots.createdAt} >= ${startDate}`,
          sql`${userProgressSnapshots.createdAt} <= ${endDate}`
        )
      )
      .orderBy(asc(userProgressSnapshots.createdAt));
  }
  
  async getPlatformStats(): Promise<{
    totalUsers: number,
    totalCourses: number,
    totalLessonsCompleted: number,
    totalAssignmentsCompleted: number,
    averageGrade: number
  }> {
    try {
      // Count total users
      const [userCount] = await db
        .select({ count: sql`count(*)` })
        .from(users);
      
      // Count total courses
      const [courseCount] = await db
        .select({ count: sql`count(*)` })
        .from(courses);
      
      // Count completed lessons
      const [lessonCount] = await db
        .select({ count: sql`count(*)` })
        .from(userLessons)
        .where(eq(userLessons.completed, true));
      
      // Count completed assignments
      const [assignmentCount] = await db
        .select({ count: sql`count(*)` })
        .from(userAssignments)
        .where(eq(userAssignments.submitted, true));
      
      // Calculate average grade from assignments
      const [averageGradeResult] = await db
        .select({ average: sql`avg(grade)` })
        .from(userAssignments)
        .where(
          and(
            eq(userAssignments.submitted, true),
            eq(userAssignments.graded, true)
          )
        );
      
      return {
        totalUsers: Number(userCount.count) || 0,
        totalCourses: Number(courseCount.count) || 0,
        totalLessonsCompleted: Number(lessonCount.count) || 0,
        totalAssignmentsCompleted: Number(assignmentCount.count) || 0,
        averageGrade: Number(averageGradeResult.average) || 0
      };
    } catch (error) {
      console.error("Error getting platform stats:", error);
      throw error;
    }
  }

  // Challenge operations
  async getChallenges(filters?: { type?: string; active?: boolean; category?: string }): Promise<Challenge[]> {
    let query = db.select().from(challenges);
    
    if (filters) {
      if (filters.type) {
        query = query.where(eq(challenges.type, filters.type));
      }
      
      if (filters.category) {
        query = query.where(eq(challenges.category, filters.category));
      }
      
      if (filters.active !== undefined) {
        query = query.where(eq(challenges.isActive, filters.active));
      }
    }
    
    return query.orderBy(challenges.title);
  }
  
  async getChallenge(id: number): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }
  
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }
  
  async updateChallenge(id: number, data: Partial<Challenge>): Promise<Challenge | undefined> {
    const [updatedChallenge] = await db
      .update(challenges)
      .set(data)
      .where(eq(challenges.id, id))
      .returning();
    return updatedChallenge;
  }
  
  async deactivateChallenge(id: number): Promise<Challenge | undefined> {
    const [deactivatedChallenge] = await db
      .update(challenges)
      .set({ isActive: false })
      .where(eq(challenges.id, id))
      .returning();
    return deactivatedChallenge;
  }
  
  async getCourseRelatedChallenges(courseId: number): Promise<Challenge[]> {
    return db
      .select()
      .from(challenges)
      .where(and(
        eq(challenges.courseId, courseId),
        eq(challenges.isActive, true)
      ));
  }
  
  // User challenge operations
  async getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]> {
    const userChallengesResult = await db
      .select({
        userChallenge: userChallenges,
        challenge: challenges
      })
      .from(userChallenges)
      .leftJoin(challenges, eq(userChallenges.challengeId, challenges.id))
      .where(eq(userChallenges.userId, userId))
      .orderBy(desc(userChallenges.createdAt));
    
    return userChallengesResult.map(({ userChallenge, challenge }) => ({
      ...userChallenge,
      challenge: challenge as Challenge
    })) as (UserChallenge & { challenge: Challenge })[];
  }
  
  async getUserActiveAndCompletedChallenges(userId: number): Promise<{
    active: (UserChallenge & { challenge: Challenge })[];
    completed: (UserChallenge & { challenge: Challenge })[];
  }> {
    const userChallenges = await this.getUserChallenges(userId);
    
    const active = userChallenges.filter(uc => !uc.isCompleted);
    const completed = userChallenges.filter(uc => uc.isCompleted);
    
    return { active, completed };
  }
  
  async assignChallengeToUser(userId: number, challengeId: number): Promise<UserChallenge> {
    // Check if this challenge has already been assigned to the user
    const existing = await db
      .select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.challengeId, challengeId)
      ));
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    // Assign new challenge
    const [newUserChallenge] = await db
      .insert(userChallenges)
      .values({
        userId,
        challengeId,
        progress: 0,
        isCompleted: false,
        pointsEarned: 0,
        xpEarned: 0
      })
      .returning();
    
    return newUserChallenge;
  }
  
  async updateUserChallengeProgress(userId: number, challengeId: number, progress: number): Promise<UserChallenge | undefined> {
    // Handle out-of-range progress values
    const sanitizedProgress = Math.max(0, Math.min(100, progress));
    
    const [updatedUserChallenge] = await db
      .update(userChallenges)
      .set({ 
        progress: sanitizedProgress,
        // Mark as completed if progress reaches 100%
        ...(sanitizedProgress >= 100 ? { isCompleted: true } : {})
      })
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.challengeId, challengeId)
      ))
      .returning();
    
    return updatedUserChallenge;
  }
  
  async completeUserChallenge(userId: number, challengeId: number): Promise<UserChallenge | undefined> {
    // Get the challenge to determine rewards
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) {
      return undefined;
    }
    
    // Update the user challenge
    const [completedUserChallenge] = await db
      .update(userChallenges)
      .set({ 
        isCompleted: true,
        progress: 100,
        completedAt: new Date(),
        pointsEarned: challenge.pointsReward,
        xpEarned: challenge.xpReward
      })
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.challengeId, challengeId)
      ))
      .returning();
    
    if (completedUserChallenge) {
      // Add XP and points to user level
      await this.addUserXp(userId, challenge.xpReward);
      await this.addUserPoints(userId, challenge.pointsReward);
      
      // Award badge if applicable
      if (challenge.badgeId) {
        await this.awardBadgeToUser({
          userId,
          badgeId: challenge.badgeId
        });
      }
    }
    
    return completedUserChallenge;
  }
  
  // User level operations
  async getUserLevel(userId: number): Promise<UserLevel | undefined> {
    const [level] = await db
      .select()
      .from(userLevels)
      .where(eq(userLevels.userId, userId));
    
    return level;
  }
  
  async initializeUserLevel(userId: number): Promise<UserLevel> {
    // Check if user level already exists
    const existingLevel = await this.getUserLevel(userId);
    if (existingLevel) {
      return existingLevel;
    }
    
    // Create new user level
    const [newUserLevel] = await db
      .insert(userLevels)
      .values({
        userId,
        level: 1,
        currentXp: 0,
        totalXp: 0,
        nextLevelXp: 100,
        streak: 0,
        totalPoints: 0,
        lastActivityDate: new Date()
      })
      .returning();
    
    return newUserLevel;
  }
  
  async addUserXp(userId: number, xpAmount: number): Promise<UserLevel | undefined> {
    // Ensure user level exists
    let userLevel = await this.getUserLevel(userId);
    if (!userLevel) {
      userLevel = await this.initializeUserLevel(userId);
    }
    
    const newCurrentXp = userLevel.currentXp + xpAmount;
    const newTotalXp = userLevel.totalXp + xpAmount;
    
    // Check if user should level up
    let { level, nextLevelXp } = userLevel;
    let remainingXp = newCurrentXp;
    
    while (remainingXp >= nextLevelXp) {
      // Level up
      level += 1;
      remainingXp -= nextLevelXp;
      // Increase XP required for next level (formula: nextLevelXp = currentLevel * 100)
      nextLevelXp = level * 100;
    }
    
    // Update user level
    const [updatedUserLevel] = await db
      .update(userLevels)
      .set({
        level,
        currentXp: remainingXp,
        totalXp: newTotalXp,
        nextLevelXp,
        lastActivityDate: new Date()
      })
      .where(eq(userLevels.userId, userId))
      .returning();
    
    return updatedUserLevel;
  }
  
  async addUserPoints(userId: number, pointsAmount: number): Promise<UserLevel | undefined> {
    // Ensure user level exists
    let userLevel = await this.getUserLevel(userId);
    if (!userLevel) {
      userLevel = await this.initializeUserLevel(userId);
    }
    
    const newTotalPoints = userLevel.totalPoints + pointsAmount;
    
    // Update user level
    const [updatedUserLevel] = await db
      .update(userLevels)
      .set({
        totalPoints: newTotalPoints,
        lastActivityDate: new Date()
      })
      .where(eq(userLevels.userId, userId))
      .returning();
    
    return updatedUserLevel;
  }
  
  async updateUserStreak(userId: number): Promise<UserLevel | undefined> {
    // Ensure user level exists
    let userLevel = await this.getUserLevel(userId);
    if (!userLevel) {
      userLevel = await this.initializeUserLevel(userId);
      return userLevel;
    }
    
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const lastActivity = userLevel.lastActivityDate ? 
      userLevel.lastActivityDate.toISOString().split('T')[0] : null;
    
    // If already logged activity today, no streak update needed
    if (lastActivity === today) {
      return userLevel;
    }
    
    // If last activity was yesterday, increment streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = userLevel.streak;
    if (lastActivity === yesterdayStr) {
      newStreak += 1;
    } else {
      // Reset streak if more than a day has passed
      newStreak = 1;
    }
    
    // Update streak
    const [updatedUserLevel] = await db
      .update(userLevels)
      .set({
        streak: newStreak,
        lastActivityDate: new Date()
      })
      .where(eq(userLevels.userId, userId))
      .returning();
    
    return updatedUserLevel;
  }
  
  async resetUserStreak(userId: number): Promise<UserLevel | undefined> {
    const [updatedUserLevel] = await db
      .update(userLevels)
      .set({
        streak: 0
      })
      .where(eq(userLevels.userId, userId))
      .returning();
    
    return updatedUserLevel;
  }
}

export const storage = new DatabaseStorage();