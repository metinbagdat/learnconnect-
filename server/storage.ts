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
  // Achievement types
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  // Interactive lesson trails types
  type LessonTrail,
  type InsertLessonTrail,
  type TrailNode,
  type InsertTrailNode,
  type UserTrailProgress,
  type InsertUserTrailProgress,
  type PersonalizedRecommendation,
  type InsertPersonalizedRecommendation,
  type LearningAnalytics,
  type InsertLearningAnalytics,
  // Leaderboard types
  type Leaderboard,
  type InsertLeaderboard,
  type LeaderboardEntry,
  type InsertLeaderboardEntry,
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
  userLevels,
  // Achievements and Leaderboards tables
  achievements,
  userAchievements,
  leaderboards,
  leaderboardEntries,
  // Interactive lesson trails tables
  lessonTrails,
  trailNodes,
  userTrailProgress,
  personalizedRecommendations,
  learningAnalytics,
  learningMilestones,
  emojiReactions,
  type LearningMilestone,
  type InsertLearningMilestone,
  type EmojiReaction,
  type InsertEmojiReaction,
  // Mentor and Program types
  type Mentor,
  type InsertMentor,
  type UserMentor,
  type InsertUserMentor,
  type StudyProgram,
  type InsertStudyProgram,
  type ProgramSchedule,
  type InsertProgramSchedule,
  type UserProgramProgress,
  type InsertUserProgramProgress,
  type StudySession,
  type InsertStudySession,
  // Assessment system types
  type LevelAssessment,
  type InsertLevelAssessment,
  type AssessmentQuestion,
  type InsertAssessmentQuestion,
  type UserSkillLevel,
  type InsertUserSkillLevel,
  mentors,
  userMentors,
  studyPrograms,
  programSchedules,
  userProgramProgress,
  studySessions,
  insertMentorSchema,
  insertUserMentorSchema,
  insertStudyProgramSchema,
  insertProgramScheduleSchema,
  insertUserProgramProgressSchema,
  insertStudySessionSchema,
  studyGoals,
  studySchedules,
  learningRecommendations,
  studyProgress,
  levelAssessments,
  assessmentQuestions,
  userSkillLevels,
  insertLevelAssessment,
  insertAssessmentQuestion,
  insertUserSkillLevel
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

// New insert types for mentor and program systems
type InsertMentorType = z.infer<typeof insertMentorSchema>;
type InsertUserMentorType = z.infer<typeof insertUserMentorSchema>;
type InsertStudyProgramType = z.infer<typeof insertStudyProgramSchema>;
type InsertProgramScheduleType = z.infer<typeof insertProgramScheduleSchema>;
type InsertUserProgramProgressType = z.infer<typeof insertUserProgramProgressSchema>;
type InsertStudySessionType = z.infer<typeof insertStudySessionSchema>;

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
  
  // Achievement operations
  getAchievements(filters?: { category?: string; rarity?: string; }): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  awardAchievementToUser(userId: number, achievementId: number): Promise<UserAchievement>;
  unlockUserAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  
  // Statistics for achievement checking
  getUserCompletedChallengesCount(userId: number): Promise<number>;
  getUserCompletedCoursesCount(userId: number): Promise<number>;
  
  // Leaderboard operations
  getLeaderboards(filters?: { type?: string; timeframe?: string; }): Promise<Leaderboard[]>;
  getLeaderboard(id: number): Promise<(Leaderboard & { entries: (LeaderboardEntry & { user: User })[] }) | undefined>;
  createLeaderboard(leaderboard: InsertLeaderboard): Promise<Leaderboard>;
  updateLeaderboardEntry(userId: number, leaderboardId: number, score: number): Promise<LeaderboardEntry>;
  getLeaderboardEntries(leaderboardId: number, limit?: number): Promise<(LeaderboardEntry & { user: User })[]>;
  getUserRankings(userId: number): Promise<(LeaderboardEntry & { leaderboard: Leaderboard })[]>;
  
  // Social media operations
  getSocialFeed(userId: number, limit?: number): Promise<any[]>;
  createSocialPost(post: { userId: number; type: string; content: string; data?: any }): Promise<any>;
  togglePostLike(postId: number, userId: number): Promise<{ liked: boolean; likeCount: number }>;
  getUserSocialProfile(userId: number): Promise<any>;
  toggleUserFollow(followerId: number, followingId: number, action: string): Promise<{ following: boolean; followerCount: number }>;
  getTrendingTopics(): Promise<any[]>;
  checkAndUnlockAchievements(userId: number): Promise<Achievement[]>;

  // Mentor system operations
  getMentors(filters?: { isAiMentor?: boolean; isActive?: boolean; specialization?: string }): Promise<(Mentor & { user: User })[]>;
  getMentor(id: number): Promise<(Mentor & { user: User }) | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  updateMentor(id: number, data: Partial<Mentor>): Promise<Mentor | undefined>;
  assignMentorToUser(studentId: number, mentorId: number, options?: { preferredCommunication?: string; communicationLanguage?: string; notes?: string }): Promise<UserMentor>;
  getUserMentor(studentId: number): Promise<(UserMentor & { mentor: Mentor & { user: User } }) | undefined>;
  updateUserMentor(id: number, data: Partial<UserMentor>): Promise<UserMentor | undefined>;
  autoAssignMentor(studentId: number): Promise<UserMentor>;
  
  // Study program operations
  getStudyPrograms(filters?: { targetGroup?: string; isActive?: boolean }): Promise<(StudyProgram & { creator: User })[]>;
  getStudyProgram(id: number): Promise<(StudyProgram & { creator: User; schedules: ProgramSchedule[] }) | undefined>;
  createStudyProgram(program: InsertStudyProgram): Promise<StudyProgram>;
  updateStudyProgram(id: number, data: Partial<StudyProgram>): Promise<StudyProgram | undefined>;
  getUserStudyPrograms(userId: number): Promise<(UserProgramProgress & { program: StudyProgram })[]>;
  enrollUserInProgram(userId: number, programId: number): Promise<UserProgramProgress>;
  updateUserProgramProgress(userId: number, programId: number, data: Partial<UserProgramProgress>): Promise<UserProgramProgress | undefined>;
  
  // Program schedule operations
  getProgramSchedules(programId: number, week?: number): Promise<ProgramSchedule[]>;
  createProgramSchedule(schedule: InsertProgramSchedule): Promise<ProgramSchedule>;
  updateProgramSchedule(id: number, data: Partial<ProgramSchedule>): Promise<ProgramSchedule | undefined>;
  
  // Study session operations
  getStudySessions(userId: number, filters?: { programId?: number; startDate?: Date; endDate?: Date }): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: number, data: Partial<StudySession>): Promise<StudySession | undefined>;
  getUserWeeklyStats(userId: number, programId?: number): Promise<{ plannedHours: number; actualHours: number; adherenceScore: number }>;

  // Level Assessment operations
  createLevelAssessment(assessment: InsertLevelAssessment): Promise<number>;
  getLevelAssessment(id: number): Promise<LevelAssessment | undefined>;
  updateLevelAssessment(id: number, data: Partial<LevelAssessment>): Promise<LevelAssessment | undefined>;
  getUserAssessments(userId: number): Promise<LevelAssessment[]>;
  
  // Assessment Question operations
  createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion>;
  getAssessmentQuestions(assessmentId: number): Promise<AssessmentQuestion[]>;
  updateAssessmentQuestion(id: number, data: Partial<AssessmentQuestion>): Promise<AssessmentQuestion | undefined>;
  
  // User Skill Level operations
  getUserSkillLevels(userId: number): Promise<UserSkillLevel[]>;
  getUserSkillLevel(userId: number, subject: string, subCategory?: string): Promise<UserSkillLevel | undefined>;
  updateUserSkillLevel(userId: number, skillData: InsertUserSkillLevel): Promise<UserSkillLevel>;

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
    try {
      const result = await db
        .select()
        .from(modules)
        .where(eq(modules.courseId, courseId))
        .orderBy(asc(modules.id));
      
      return result;
    } catch (error) {
      console.error("Database error in getModules:", error);
      return [];
    }
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
      .orderBy(asc(lessons.id));
  }
  
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }
  
  // UserLesson operations
  async getUserLessons(userId: number): Promise<(UserLesson & { lesson: Lesson })[]> {
    try {
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
    } catch (error) {
      console.error('Error fetching user lessons:', error);
      return [];
    }
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
  
  async unlockUserAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        pointsEarned: 0,
        xpEarned: 0
      })
      .returning();
    
    return userAchievement;
  }
  
  async getUserCompletedChallengesCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.isCompleted, true)
      ));
    
    return result[0]?.count || 0;
  }
  
  async getUserCompletedCoursesCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(userCourses)
      .where(and(
        eq(userCourses.userId, userId),
        eq(userCourses.progress, 100)
      ));
    
    return result[0]?.count || 0;
  }
  
  // Achievement operations
  async getAchievements(filters?: { category?: string; rarity?: string; }): Promise<Achievement[]> {
    let query = db.select().from(achievements);
    
    if (filters) {
      if (filters.category) {
        query = query.where(eq(achievements.category, filters.category));
      }
      if (filters.rarity) {
        query = query.where(eq(achievements.rarity, filters.rarity));
      }
    }
    
    return query.orderBy(achievements.title);
  }
  
  async getAchievement(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    return achievement;
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }
  
  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const result = await db
      .select({
        userAchievement: userAchievements,
        achievement: achievements
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));
    
    return result.map(({ userAchievement, achievement }) => ({
      ...userAchievement,
      achievement: achievement as Achievement
    })) as (UserAchievement & { achievement: Achievement })[];
  }
  
  async awardAchievementToUser(userId: number, achievementId: number): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        pointsEarned: 0,
        xpEarned: 0
      })
      .returning();
    
    return userAchievement;
  }
  
  // Leaderboard operations
  async getLeaderboards(filters?: { type?: string; timeframe?: string; }): Promise<Leaderboard[]> {
    let query = db.select().from(leaderboards);
    
    if (filters) {
      if (filters.type) {
        query = query.where(eq(leaderboards.type, filters.type));
      }
      if (filters.timeframe) {
        query = query.where(eq(leaderboards.timeframe, filters.timeframe));
      }
    }
    
    return query.orderBy(leaderboards.title);
  }
  
  async getLeaderboard(id: number): Promise<(Leaderboard & { entries: (LeaderboardEntry & { user: User })[] }) | undefined> {
    const [leaderboard] = await db.select().from(leaderboards).where(eq(leaderboards.id, id));
    
    if (!leaderboard) {
      return undefined;
    }
    
    const entries = await this.getLeaderboardEntries(id, 100);
    
    return {
      ...leaderboard,
      entries
    };
  }
  
  async createLeaderboard(leaderboard: InsertLeaderboard): Promise<Leaderboard> {
    const [newLeaderboard] = await db.insert(leaderboards).values(leaderboard).returning();
    return newLeaderboard;
  }
  
  async updateLeaderboardEntry(userId: number, leaderboardId: number, score: number): Promise<LeaderboardEntry> {
    // Check if entry exists
    const [existingEntry] = await db
      .select()
      .from(leaderboardEntries)
      .where(and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.leaderboardId, leaderboardId)
      ));
    
    if (existingEntry) {
      // Update existing entry only if new score is better
      if (score > existingEntry.score) {
        const [updatedEntry] = await db
          .update(leaderboardEntries)
          .set({ 
            score,
            updatedAt: new Date()
          })
          .where(and(
            eq(leaderboardEntries.userId, userId),
            eq(leaderboardEntries.leaderboardId, leaderboardId)
          ))
          .returning();
        return updatedEntry;
      }
      return existingEntry;
    } else {
      // Create new entry
      const [newEntry] = await db
        .insert(leaderboardEntries)
        .values({
          userId,
          leaderboardId,
          score,
          rank: 0 // Will be calculated
        })
        .returning();
      return newEntry;
    }
  }
  
  async getLeaderboardEntries(leaderboardId: number, limit: number = 50): Promise<(LeaderboardEntry & { user: User })[]> {
    return db
      .select({
        id: leaderboardEntries.id,
        userId: leaderboardEntries.userId,
        leaderboardId: leaderboardEntries.leaderboardId,
        score: leaderboardEntries.score,
        rank: leaderboardEntries.rank,
        createdAt: leaderboardEntries.createdAt,
        updatedAt: leaderboardEntries.updatedAt,
        user: users
      })
      .from(leaderboardEntries)
      .innerJoin(users, eq(leaderboardEntries.userId, users.id))
      .where(eq(leaderboardEntries.leaderboardId, leaderboardId))
      .orderBy(desc(leaderboardEntries.score))
      .limit(limit);
  }
  
  async getUserRankings(userId: number): Promise<(LeaderboardEntry & { leaderboard: Leaderboard })[]> {
    return db
      .select({
        id: leaderboardEntries.id,
        userId: leaderboardEntries.userId,
        leaderboardId: leaderboardEntries.leaderboardId,
        score: leaderboardEntries.score,
        rank: leaderboardEntries.rank,
        createdAt: leaderboardEntries.createdAt,
        updatedAt: leaderboardEntries.updatedAt,
        leaderboard: leaderboards
      })
      .from(leaderboardEntries)
      .innerJoin(leaderboards, eq(leaderboardEntries.leaderboardId, leaderboards.id))
      .where(eq(leaderboardEntries.userId, userId))
      .orderBy(desc(leaderboardEntries.score));
  }

  // Get all users with their levels for leaderboard calculations
  async getAllUsersWithLevels(): Promise<any[]> {
    return db.select({
      userId: userLevels.userId,
      level: userLevels.level,
      currentXp: userLevels.currentXp,
      totalXp: userLevels.totalXp,
      streak: userLevels.streak,
      user: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl
      }
    })
    .from(userLevels)
    .innerJoin(users, eq(userLevels.userId, users.id))
    .orderBy(desc(userLevels.totalXp));
  }

  // Get all achievements for the achievements gallery
  async getAllAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements).where(eq(achievements.isActive, true));
  }

  // Get user activity logs
  async getUserActivityLogs(userId: number, limit: number = 10): Promise<any[]> {
    return db.select()
      .from(userActivityLogs)
      .where(eq(userActivityLogs.userId, userId))
      .orderBy(desc(userActivityLogs.createdAt))
      .limit(limit);
  }

  // Social media operations
  async getSocialFeed(userId: number, limit: number = 20): Promise<any[]> {
    // Generate realistic social feed based on user activities
    const activities = await this.getUserActivityLogs(userId, limit);
    const achievements = await this.getUserAchievements(userId);
    const userLevel = await this.getUserLevel(userId);
    
    const socialPosts = [
      {
        id: 1,
        userId: userId,
        type: 'achievement',
        content: `Just unlocked a new achievement! 🏆`,
        data: achievements.length > 0 ? achievements[0] : null,
        likes: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 10) + 2,
        createdAt: new Date(),
        user: await this.getUser(userId)
      },
      {
        id: 2,
        userId: userId,
        type: 'level_up',
        content: `Level up! Now at level ${userLevel?.level || 1} 🚀`,
        data: { level: userLevel?.level || 1, xp: userLevel?.totalXp || 0 },
        likes: Math.floor(Math.random() * 15) + 8,
        comments: Math.floor(Math.random() * 8) + 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        user: await this.getUser(userId)
      }
    ];
    
    return socialPosts;
  }

  async createSocialPost(post: { userId: number; type: string; content: string; data?: any }): Promise<any> {
    // In a real implementation, this would save to a social_posts table
    const newPost = {
      id: Date.now(),
      ...post,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      user: await this.getUser(post.userId)
    };
    
    return newPost;
  }

  async togglePostLike(postId: number, userId: number): Promise<{ liked: boolean; likeCount: number }> {
    // In a real implementation, this would update a likes table
    const isLiked = Math.random() > 0.5;
    const likeCount = Math.floor(Math.random() * 50) + 1;
    
    return {
      liked: isLiked,
      likeCount: isLiked ? likeCount + 1 : likeCount - 1
    };
  }

  async getUserSocialProfile(userId: number): Promise<any> {
    const user = await this.getUser(userId);
    const userLevel = await this.getUserLevel(userId);
    const achievements = await this.getUserAchievements(userId);
    const courses = await this.getUserCourses(userId);
    
    return {
      user,
      level: userLevel?.level || 1,
      totalXp: userLevel?.totalXp || 0,
      achievementCount: achievements.length,
      courseCount: courses.length,
      followers: Math.floor(Math.random() * 100) + 10,
      following: Math.floor(Math.random() * 150) + 20,
      postsCount: Math.floor(Math.random() * 50) + 5
    };
  }

  async toggleUserFollow(followerId: number, followingId: number, action: string): Promise<{ following: boolean; followerCount: number }> {
    // In a real implementation, this would update a follows table
    const isFollowing = action === 'follow';
    const followerCount = Math.floor(Math.random() * 500) + 50;
    
    return {
      following: isFollowing,
      followerCount: isFollowing ? followerCount + 1 : followerCount - 1
    };
  }

  async getTrendingTopics(): Promise<any[]> {
    return [
      { tag: '#WebDevelopment', posts: 1247 },
      { tag: '#JavaScript', posts: 892 },
      { tag: '#ReactJS', posts: 654 },
      { tag: '#TurkishUniversity', posts: 543 },
      { tag: '#Mathematics', posts: 432 },
      { tag: '#Programming', posts: 321 }
    ];
  }

  async checkAndUnlockAchievements(userId: number): Promise<Achievement[]> {
    const allAchievements = await this.getAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const userLevel = await this.getUserLevel(userId);
    const userChallenges = await this.getUserChallenges(userId);
    const userCourses = await this.getUserCourses(userId);
    
    const unlockedAchievementIds = userAchievements.map(ua => ua.achievement.id);
    const newlyUnlocked: Achievement[] = [];
    
    for (const achievement of allAchievements) {
      if (unlockedAchievementIds.includes(achievement.id)) continue;
      
      let shouldUnlock = false;
      
      // Check different achievement criteria
      if (achievement.category === 'course_completion') {
        const completedCourses = userCourses.filter(uc => uc.progress >= 100).length;
        shouldUnlock = completedCourses >= 1;
      } else if (achievement.category === 'challenge_completion') {
        const completedChallenges = userChallenges.filter(uc => uc.progress >= 100).length;
        shouldUnlock = completedChallenges >= 1;
      } else if (achievement.category === 'streak') {
        shouldUnlock = (userLevel?.streak || 0) >= 3;
      } else if (achievement.category === 'xp') {
        shouldUnlock = (userLevel?.totalXp || 0) >= 1000;
      } else if (achievement.category === 'level') {
        shouldUnlock = (userLevel?.level || 0) >= 5;
      }
      
      if (shouldUnlock) {
        await this.awardAchievementToUser(userId, achievement.id);
        newlyUnlocked.push(achievement);
      }
    }
    
    return newlyUnlocked;
  }

  // Interactive Lesson Trails Methods
  async getUserLearningTrails(userId: number) {
    const trails = await db.select({
      id: lessonTrails.id,
      courseId: lessonTrails.courseId,
      title: lessonTrails.title,
      description: lessonTrails.description,
      difficulty: lessonTrails.difficulty,
      estimatedTime: lessonTrails.estimatedTime,
      trailData: lessonTrails.trailData,
      createdAt: lessonTrails.createdAt
    })
    .from(lessonTrails)
    .leftJoin(userTrailProgress, eq(userTrailProgress.trailId, lessonTrails.id))
    .where(eq(userTrailProgress.userId, userId));

    // Add progress data to each trail
    const trailsWithProgress = await Promise.all(trails.map(async (trail) => {
      const [progress] = await db.select()
        .from(userTrailProgress)
        .where(and(
          eq(userTrailProgress.userId, userId),
          eq(userTrailProgress.trailId, trail.id)
        ));

      return {
        ...trail,
        progress: progress ? {
          completedNodes: progress.completedNodes || [],
          currentNode: progress.currentNode,
          totalProgress: progress.progress || 0,
          timeSpent: progress.timeSpent || 0
        } : null
      };
    }));

    return trailsWithProgress;
  }

  async acceptPersonalizedRecommendation(recommendationId: number, userId: number) {
    await db.update(personalizedRecommendations)
      .set({ acceptedAt: new Date() })
      .where(and(
        eq(personalizedRecommendations.id, recommendationId),
        eq(personalizedRecommendations.userId, userId)
      ));
  }

  async getUserLearningStats(userId: number) {
    // Get user level data
    const [userLevel] = await db.select()
      .from(userLevels)
      .where(eq(userLevels.userId, userId));

    // Get completed trails count
    const completedTrails = await db.select({ count: sql`count(*)` })
      .from(userTrailProgress)
      .where(and(
        eq(userTrailProgress.userId, userId),
        eq(userTrailProgress.progress, 100)
      ));

    // Get total study time
    const totalStudyTime = await db.select({ 
      total: sql`coalesce(sum(${userTrailProgress.timeSpent}), 0)` 
    })
    .from(userTrailProgress)
    .where(eq(userTrailProgress.userId, userId));

    // Get recent learning analytics for performance calculation
    const recentAnalytics = await db.select()
      .from(learningAnalytics)
      .where(eq(learningAnalytics.userId, userId))
      .orderBy(desc(learningAnalytics.createdAt))
      .limit(20);

    const averagePerformance = recentAnalytics.length > 0 
      ? recentAnalytics.reduce((sum, a) => sum + (Number(a.performanceScore) || 0.7), 0) / recentAnalytics.length
      : 0.7;

    return {
      level: userLevel?.level || 1,
      totalXp: userLevel?.totalXp || 0,
      streak: userLevel?.streak || 0,
      completedTrails: parseInt(completedTrails[0].count as string) || 0,
      totalStudyTime: parseInt(totalStudyTime[0].total as string) || 0,
      averagePerformance,
      learningStyle: 'visual', // Could be determined by analyzing user behavior
      bestSubject: 'Mathematics', // Could be calculated from performance data
      focusArea: 'Problem Solving' // Could be derived from recent activities
    };
  }

  // Learning Milestones methods
  async getUserMilestones(userId: number): Promise<LearningMilestone[]> {
    return await db
      .select()
      .from(learningMilestones)
      .where(eq(learningMilestones.userId, userId))
      .orderBy(desc(learningMilestones.timestamp));
  }

  async createMilestone(data: InsertLearningMilestone): Promise<LearningMilestone> {
    const [milestone] = await db
      .insert(learningMilestones)
      .values(data)
      .returning();
    return milestone;
  }

  async getMilestone(id: string): Promise<LearningMilestone | undefined> {
    const [milestone] = await db
      .select()
      .from(learningMilestones)
      .where(eq(learningMilestones.id, id));
    return milestone;
  }

  // Emoji Reactions methods
  async createEmojiReaction(data: InsertEmojiReaction): Promise<EmojiReaction> {
    const [reaction] = await db
      .insert(emojiReactions)
      .values(data)
      .returning();
    return reaction;
  }

  async getMilestoneReactions(milestoneId: string): Promise<EmojiReaction[]> {
    return await db
      .select()
      .from(emojiReactions)
      .where(eq(emojiReactions.milestoneId, milestoneId))
      .orderBy(desc(emojiReactions.timestamp));
  }

  async getUserReactions(userId: number): Promise<EmojiReaction[]> {
    return await db
      .select()
      .from(emojiReactions)
      .where(eq(emojiReactions.userId, userId))
      .orderBy(desc(emojiReactions.timestamp));
  }

  // Mentor System Operations
  async getMentors(filters?: { isAiMentor?: boolean; isActive?: boolean; specialization?: string }): Promise<(Mentor & { user: User })[]> {
    let query = db
      .select({
        mentor: mentors,
        user: users
      })
      .from(mentors)
      .leftJoin(users, eq(mentors.userId, users.id));

    if (filters?.isAiMentor !== undefined) {
      query = query.where(eq(mentors.isAiMentor, filters.isAiMentor));
    }
    if (filters?.isActive !== undefined) {
      query = query.where(eq(mentors.isActive, filters.isActive));
    }

    const result = await query.orderBy(desc(mentors.createdAt));
    return result.map(({ mentor, user }) => ({
      ...mentor,
      user: user as User
    })) as (Mentor & { user: User })[];
  }

  async getMentor(id: number): Promise<(Mentor & { user: User }) | undefined> {
    const [result] = await db
      .select({
        mentor: mentors,
        user: users
      })
      .from(mentors)
      .leftJoin(users, eq(mentors.userId, users.id))
      .where(eq(mentors.id, id));

    if (!result) return undefined;
    
    return {
      ...result.mentor,
      user: result.user as User
    } as (Mentor & { user: User });
  }

  async createMentor(mentor: InsertMentorType): Promise<Mentor> {
    const [newMentor] = await db.insert(mentors).values(mentor).returning();
    return newMentor;
  }

  async updateMentor(id: number, data: Partial<Mentor>): Promise<Mentor | undefined> {
    const [updatedMentor] = await db
      .update(mentors)
      .set(data)
      .where(eq(mentors.id, id))
      .returning();
    return updatedMentor;
  }

  async assignMentorToUser(studentId: number, mentorId: number, options?: { preferredCommunication?: string; communicationLanguage?: string; notes?: string }): Promise<UserMentor> {
    // First, deactivate any existing mentor assignments for this student
    await db
      .update(userMentors)
      .set({ isActive: false })
      .where(eq(userMentors.studentId, studentId));

    const [newAssignment] = await db
      .insert(userMentors)
      .values({
        studentId,
        mentorId,
        preferredCommunication: options?.preferredCommunication || 'chat',
        communicationLanguage: options?.communicationLanguage || 'en',
        notes: options?.notes
      })
      .returning();
    
    return newAssignment;
  }

  async getUserMentor(studentId: number): Promise<(UserMentor & { mentor: Mentor & { user: User } }) | undefined> {
    const [result] = await db
      .select({
        userMentor: userMentors,
        mentor: mentors,
        user: users
      })
      .from(userMentors)
      .leftJoin(mentors, eq(userMentors.mentorId, mentors.id))
      .leftJoin(users, eq(mentors.userId, users.id))
      .where(and(eq(userMentors.studentId, studentId), eq(userMentors.isActive, true)))
      .limit(1);

    if (!result) return undefined;

    return {
      ...result.userMentor,
      mentor: {
        ...result.mentor,
        user: result.user as User
      }
    } as (UserMentor & { mentor: Mentor & { user: User } });
  }

  async updateUserMentor(id: number, data: Partial<UserMentor>): Promise<UserMentor | undefined> {
    const [updatedUserMentor] = await db
      .update(userMentors)
      .set(data)
      .where(eq(userMentors.id, id))
      .returning();
    return updatedUserMentor;
  }

  async autoAssignMentor(studentId: number): Promise<UserMentor> {
    // First try to find an available human mentor
    const availableMentors = await db
      .select({ mentor: mentors })
      .from(mentors)
      .where(and(
        eq(mentors.isActive, true),
        eq(mentors.isAiMentor, false)
      ))
      .orderBy(mentors.rating, mentors.createdAt);

    let mentorToAssign: Mentor | null = null;

    // Check capacity of human mentors
    for (const { mentor } of availableMentors) {
      const currentStudentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(userMentors)
        .where(and(
          eq(userMentors.mentorId, mentor.id),
          eq(userMentors.isActive, true)
        ));

      if (currentStudentCount[0]?.count < mentor.maxStudents) {
        mentorToAssign = mentor;
        break;
      }
    }

    // If no human mentor available, create or find AI mentor
    if (!mentorToAssign) {
      let aiMentor = await db
        .select()
        .from(mentors)
        .where(and(eq(mentors.isAiMentor, true), eq(mentors.isActive, true)))
        .limit(1);

      if (aiMentor.length === 0) {
        // Create AI mentor system user if doesn't exist
        let aiUser = await this.getUserByUsername("ai_mentor");
        if (!aiUser) {
          aiUser = await this.createUser({
            username: "ai_mentor",
            password: "$2b$10$randomhashedpassword",
            displayName: "AI Learning Assistant",
            role: "instructor"
          });
        }

        // Create AI mentor
        mentorToAssign = await this.createMentor({
          userId: aiUser.id,
          isAiMentor: true,
          specialization: ["general", "mathematics", "science", "language"],
          languages: ["en", "tr"],
          maxStudents: 10000,
          bio: "AI-powered learning mentor providing 24/7 personalized guidance and support.",
          rating: 5.0
        });
      } else {
        mentorToAssign = aiMentor[0];
      }
    }

    return await this.assignMentorToUser(studentId, mentorToAssign.id, {
      preferredCommunication: 'chat',
      communicationLanguage: 'en',
      notes: mentorToAssign.isAiMentor ? 'Auto-assigned AI mentor' : 'Auto-assigned human mentor'
    });
  }

  // Study Program Operations
  async getStudyPrograms(filters?: { targetGroup?: string; isActive?: boolean }): Promise<(StudyProgram & { creator: User })[]> {
    let query = db
      .select({
        program: studyPrograms,
        creator: users
      })
      .from(studyPrograms)
      .leftJoin(users, eq(studyPrograms.createdBy, users.id));

    if (filters?.targetGroup) {
      query = query.where(eq(studyPrograms.targetGroup, filters.targetGroup));
    }
    if (filters?.isActive !== undefined) {
      query = query.where(eq(studyPrograms.isActive, filters.isActive));
    }

    const result = await query.orderBy(desc(studyPrograms.createdAt));
    return result.map(({ program, creator }) => ({
      ...program,
      creator: creator as User
    })) as (StudyProgram & { creator: User })[];
  }

  async getStudyProgram(id: number): Promise<(StudyProgram & { creator: User; schedules: ProgramSchedule[] }) | undefined> {
    const [programResult] = await db
      .select({
        program: studyPrograms,
        creator: users
      })
      .from(studyPrograms)
      .leftJoin(users, eq(studyPrograms.createdBy, users.id))
      .where(eq(studyPrograms.id, id));

    if (!programResult) return undefined;

    const schedules = await db
      .select()
      .from(programSchedules)
      .where(eq(programSchedules.programId, id))
      .orderBy(programSchedules.week, programSchedules.day, programSchedules.startTime);

    return {
      ...programResult.program,
      creator: programResult.creator as User,
      schedules
    } as (StudyProgram & { creator: User; schedules: ProgramSchedule[] });
  }

  async createStudyProgram(program: InsertStudyProgramType): Promise<StudyProgram> {
    const [newProgram] = await db.insert(studyPrograms).values(program).returning();
    return newProgram;
  }

  async updateStudyProgram(id: number, data: Partial<StudyProgram>): Promise<StudyProgram | undefined> {
    const [updatedProgram] = await db
      .update(studyPrograms)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(studyPrograms.id, id))
      .returning();
    return updatedProgram;
  }

  async getUserStudyPrograms(userId: number): Promise<(UserProgramProgress & { program: StudyProgram })[]> {
    const result = await db
      .select({
        progress: userProgramProgress,
        program: studyPrograms
      })
      .from(userProgramProgress)
      .leftJoin(studyPrograms, eq(userProgramProgress.programId, studyPrograms.id))
      .where(eq(userProgramProgress.userId, userId))
      .orderBy(desc(userProgramProgress.startedAt));

    return result.map(({ progress, program }) => ({
      ...progress,
      program: program as StudyProgram
    })) as (UserProgramProgress & { program: StudyProgram })[];
  }

  async enrollUserInProgram(userId: number, programId: number): Promise<UserProgramProgress> {
    const program = await this.getStudyProgram(programId);
    if (!program) throw new Error('Program not found');

    const totalHours = program.totalDurationWeeks * program.weeklyHours;

    const [newProgress] = await db
      .insert(userProgramProgress)
      .values({
        userId,
        programId,
        totalHours,
        weeklyGoalHours: program.weeklyHours
      })
      .returning();

    return newProgress;
  }

  async updateUserProgramProgress(userId: number, programId: number, data: Partial<UserProgramProgress>): Promise<UserProgramProgress | undefined> {
    const [updatedProgress] = await db
      .update(userProgramProgress)
      .set({ ...data, lastAccessedAt: new Date() })
      .where(and(
        eq(userProgramProgress.userId, userId),
        eq(userProgramProgress.programId, programId)
      ))
      .returning();
    return updatedProgress;
  }

  // Program Schedule Operations
  async getProgramSchedules(programId: number, week?: number): Promise<ProgramSchedule[]> {
    let query = db
      .select()
      .from(programSchedules)
      .where(eq(programSchedules.programId, programId));

    if (week) {
      query = query.where(eq(programSchedules.week, week));
    }

    return await query.orderBy(programSchedules.week, programSchedules.day, programSchedules.startTime);
  }

  async createProgramSchedule(schedule: InsertProgramScheduleType): Promise<ProgramSchedule> {
    const [newSchedule] = await db.insert(programSchedules).values(schedule).returning();
    return newSchedule;
  }

  async updateProgramSchedule(id: number, data: Partial<ProgramSchedule>): Promise<ProgramSchedule | undefined> {
    const [updatedSchedule] = await db
      .update(programSchedules)
      .set(data)
      .where(eq(programSchedules.id, id))
      .returning();
    return updatedSchedule;
  }

  // Study Session Operations
  async getStudySessions(userId: number, filters?: { programId?: number; startDate?: Date; endDate?: Date }): Promise<StudySession[]> {
    let query = db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId));

    if (filters?.programId) {
      query = query.where(eq(studySessions.programId, filters.programId));
    }

    return await query.orderBy(desc(studySessions.sessionDate));
  }

  async createStudySession(session: InsertStudySessionType): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async updateStudySession(id: number, data: Partial<StudySession>): Promise<StudySession | undefined> {
    const [updatedSession] = await db
      .update(studySessions)
      .set(data)
      .where(eq(studySessions.id, id))
      .returning();
    return updatedSession;
  }

  // Stripe payment methods
  async updateUserStripeInfo(userId: number, stripeInfo: { customerId?: string; subscriptionId?: string }): Promise<User | undefined> {
    const updateData: any = {};
    if (stripeInfo.customerId) updateData.stripeCustomerId = stripeInfo.customerId;
    if (stripeInfo.subscriptionId) updateData.stripeSubscriptionId = stripeInfo.subscriptionId;
    
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async getUserWeeklyStats(userId: number, programId?: number): Promise<{ plannedHours: number; actualHours: number; adherenceScore: number }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let query = db
      .select({
        totalDuration: sql<number>`SUM(duration_minutes) / 60.0`,
        sessionCount: sql<number>`COUNT(*)`
      })
      .from(studySessions)
      .where(and(
        eq(studySessions.userId, userId),
        sql`session_date >= ${oneWeekAgo}`
      ));

    if (programId) {
      query = query.where(eq(studySessions.programId, programId));
    }

    const [result] = await query;
    const actualHours = result?.totalDuration || 0;

    // Get planned hours from user program progress
    let plannedHours = 10; // default
    if (programId) {
      const progress = await db
        .select({ weeklyGoalHours: userProgramProgress.weeklyGoalHours })
        .from(userProgramProgress)
        .where(and(
          eq(userProgramProgress.userId, userId),
          eq(userProgramProgress.programId, programId)
        ))
        .limit(1);
      
      plannedHours = progress[0]?.weeklyGoalHours || 10;
    }

    const adherenceScore = plannedHours > 0 ? Math.min(100, (actualHours / plannedHours) * 100) : 0;

    return {
      plannedHours,
      actualHours,
      adherenceScore: Math.round(adherenceScore * 100) / 100
    };
  }

  // Level Assessment Operations
  async createLevelAssessment(assessment: InsertLevelAssessment): Promise<number> {
    const [newAssessment] = await db.insert(levelAssessments).values(assessment).returning();
    return newAssessment.id;
  }

  async getLevelAssessment(id: number): Promise<LevelAssessment | undefined> {
    const [assessment] = await db.select().from(levelAssessments).where(eq(levelAssessments.id, id));
    return assessment;
  }

  async updateLevelAssessment(id: number, data: Partial<LevelAssessment>): Promise<LevelAssessment | undefined> {
    const [updatedAssessment] = await db
      .update(levelAssessments)
      .set(data)
      .where(eq(levelAssessments.id, id))
      .returning();
    return updatedAssessment;
  }

  async getUserAssessments(userId: number): Promise<LevelAssessment[]> {
    return db
      .select()
      .from(levelAssessments)
      .where(eq(levelAssessments.userId, userId))
      .orderBy(desc(levelAssessments.createdAt));
  }

  // Assessment Question Operations
  async createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion> {
    const [newQuestion] = await db.insert(assessmentQuestions).values(question).returning();
    return newQuestion;
  }

  async getAssessmentQuestions(assessmentId: number): Promise<AssessmentQuestion[]> {
    return db
      .select()
      .from(assessmentQuestions)
      .where(eq(assessmentQuestions.assessmentId, assessmentId))
      .orderBy(assessmentQuestions.questionNumber);
  }

  async updateAssessmentQuestion(id: number, data: Partial<AssessmentQuestion>): Promise<AssessmentQuestion | undefined> {
    const [updatedQuestion] = await db
      .update(assessmentQuestions)
      .set(data)
      .where(eq(assessmentQuestions.id, id))
      .returning();
    return updatedQuestion;
  }

  // User Skill Level Operations
  async getUserSkillLevels(userId: number): Promise<UserSkillLevel[]> {
    return db
      .select()
      .from(userSkillLevels)
      .where(eq(userSkillLevels.userId, userId))
      .orderBy(desc(userSkillLevels.lastUpdated));
  }

  async getUserSkillLevel(userId: number, subject: string, subCategory?: string): Promise<UserSkillLevel | undefined> {
    let query = db
      .select()
      .from(userSkillLevels)
      .where(and(
        eq(userSkillLevels.userId, userId),
        eq(userSkillLevels.subject, subject)
      ));

    if (subCategory) {
      query = query.where(eq(userSkillLevels.subCategory, subCategory));
    }

    const [skillLevel] = await query;
    return skillLevel;
  }

  async updateUserSkillLevel(userId: number, skillData: InsertUserSkillLevel): Promise<UserSkillLevel> {
    // Check if skill level already exists
    const existing = await this.getUserSkillLevel(userId, skillData.subject, skillData.subCategory);
    
    if (existing) {
      // Update existing skill level
      const [updated] = await db
        .update(userSkillLevels)
        .set({
          ...skillData,
          lastUpdated: new Date(),
          assessmentCount: existing.assessmentCount + 1
        })
        .where(eq(userSkillLevels.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new skill level
      const [newSkillLevel] = await db.insert(userSkillLevels).values(skillData).returning();
      return newSkillLevel;
    }
  }
}

export const storage = new DatabaseStorage();