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
  insertUserBadgeSchema
} from "@shared/schema";
import { z } from "zod";

// Define insert types based on the schemas
type InsertCourse = z.infer<typeof insertCourseSchema>;
type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;
type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
type InsertBadge = z.infer<typeof insertBadgeSchema>;
type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define SessionStore type for TypeScript
type SessionStore = ReturnType<typeof createMemoryStore>;

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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private userCourses: Map<number, UserCourse>;
  private assignments: Map<number, Assignment>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  
  userIdCounter: number;
  courseIdCounter: number;
  userCourseIdCounter: number;
  assignmentIdCounter: number;
  badgeIdCounter: number;
  userBadgeIdCounter: number;
  
  sessionStore: SessionStore;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.userCourses = new Map();
    this.assignments = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    
    this.userIdCounter = 1;
    this.courseIdCounter = 1;
    this.userCourseIdCounter = 1;
    this.assignmentIdCounter = 1;
    this.badgeIdCounter = 1;
    this.userBadgeIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample admin user
    this.createUser({
      username: "admin",
      password: "admin123", // This will be hashed in auth.ts
      displayName: "Admin User",
      role: "admin"
    });
    
    // Create sample instructor
    this.createUser({
      username: "instructor",
      password: "instructor123", // This will be hashed in auth.ts
      displayName: "John Instructor",
      role: "instructor"
    });
    
    // Create sample student
    this.createUser({
      username: "student",
      password: "student123", // This will be hashed in auth.ts
      displayName: "Alex Morgan",
      role: "student",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure avatarUrl is always a string or null to match the expected type
    const avatarUrl = insertUser.avatarUrl === undefined ? null : insertUser.avatarUrl;
    const user: User = { ...insertUser, id, avatarUrl };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Course operations
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const newCourse = { ...course, id } as Course;
    this.courses.set(id, newCourse);
    return newCourse;
  }
  
  async updateCourse(id: number, data: Partial<Course>): Promise<Course | undefined> {
    const course = await this.getCourse(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...data };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }
  
  // UserCourse operations
  async getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]> {
    const userCourses = Array.from(this.userCourses.values()).filter(
      (uc) => uc.userId === userId
    );
    
    return userCourses.map(uc => {
      const course = this.courses.get(uc.courseId);
      return {
        ...uc,
        course: course as Course
      };
    });
  }
  
  async enrollUserInCourse(userCourse: InsertUserCourse): Promise<UserCourse> {
    const id = this.userCourseIdCounter++;
    const newUserCourse = { ...userCourse, id, enrolledAt: new Date() } as UserCourse;
    this.userCourses.set(id, newUserCourse);
    return newUserCourse;
  }
  
  async updateUserCourseProgress(id: number, progress: number): Promise<UserCourse | undefined> {
    const userCourse = this.userCourses.get(id);
    if (!userCourse) return undefined;
    
    const completed = progress >= 100;
    const updatedUserCourse = { 
      ...userCourse, 
      progress, 
      completed 
    };
    
    this.userCourses.set(id, updatedUserCourse);
    return updatedUserCourse;
  }
  
  // Assignment operations
  async getAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }
  
  async getUserAssignments(userId: number): Promise<(Assignment & { course: Course })[]> {
    // Get courses the user is enrolled in
    const userCourses = await this.getUserCourses(userId);
    const courseIds = userCourses.map(uc => uc.courseId);
    
    // Filter assignments by these courses
    const userAssignments = Array.from(this.assignments.values()).filter(
      (assignment) => courseIds.includes(assignment.courseId)
    );
    
    return userAssignments.map(assignment => {
      const course = this.courses.get(assignment.courseId);
      return {
        ...assignment,
        course: course as Course
      };
    });
  }
  
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const id = this.assignmentIdCounter++;
    const newAssignment = { ...assignment, id } as Assignment;
    this.assignments.set(id, newAssignment);
    return newAssignment;
  }
  
  // Badge operations
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]> {
    const userBadges = Array.from(this.userBadges.values()).filter(
      (ub) => ub.userId === userId
    );
    
    return userBadges.map(ub => {
      const badge = this.badges.get(ub.badgeId);
      return {
        ...ub,
        badge: badge as Badge
      };
    });
  }
  
  async awardBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge> {
    const id = this.userBadgeIdCounter++;
    const newUserBadge = { ...userBadge, id, earnedAt: new Date() } as UserBadge;
    this.userBadges.set(id, newUserBadge);
    return newUserBadge;
  }
}

// Export a singleton instance of the storage
export const storage = new MemStorage();
