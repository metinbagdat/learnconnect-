import { 
  type User, 
  type InsertUser, 
  type Course,
  type UserCourse,
  type Assignment,
  type Badge,
  type UserBadge,
  insertCourseSchema,
  insertUserCourseSchema,
  insertAssignmentSchema,
  insertBadgeSchema,
  insertUserBadgeSchema,
  users,
  courses,
  userCourses,
  assignments,
  badges,
  userBadges
} from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, and, or, desc, inArray } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Define insert types based on the schemas
type InsertCourse = z.infer<typeof insertCourseSchema>;
type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;
type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
type InsertBadge = z.infer<typeof insertBadgeSchema>;
type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

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
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, data: Partial<Course>): Promise<Course | undefined>;
  
  // UserCourse operations
  getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]>;
  enrollUserInCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourseProgress(id: number, progress: number): Promise<UserCourse | undefined>;
  
  // Assignment operations
  getAssignments(): Promise<Assignment[]>;
  getUserAssignments(userId: number): Promise<(Assignment & { course: Course })[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  
  // Badge operations
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge>;
  
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
}

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();
