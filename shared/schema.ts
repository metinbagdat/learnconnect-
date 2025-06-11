import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, varchar, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("student"),
  avatarUrl: text("avatar_url"),
  interests: text("interests").array(), // Store user interests for better course recommendations
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  moduleCount: integer("module_count").notNull().default(1),
  durationHours: integer("duration_hours"),
  instructorId: integer("instructor_id").notNull(),
  rating: integer("rating"),
  level: text("level"), // Beginner, Intermediate, Advanced
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  order: integer("order").notNull(),
  duration: integer("duration_minutes"),
  type: text("type").notNull().default("text"), // text, video, interactive, quiz, assignment
  metadata: jsonb("metadata").default({}), // Store additional lesson metadata
  prerequisites: integer("prerequisites").array().default([]), // Array of lesson IDs that must be completed first
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  objectives: text("objectives").array().default([]), // Learning objectives for this lesson
  tags: text("tags").array().default([]), // Searchable tags
});

export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  progress: integer("progress").notNull().default(0),
  currentModule: integer("current_module").notNull().default(1),
  completed: boolean("completed").notNull().default(false),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at"),
});

export const userLessons = pgTable("user_lessons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completed: boolean("completed").default(false),
  progress: integer("progress").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id").notNull(),
  dueDate: timestamp("due_date"),
  points: integer("points").default(10),
});

export const userAssignments = pgTable("user_assignments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assignmentId: integer("assignment_id").notNull(),
  status: text("status").default("not_started"), // not_started, in_progress, submitted, graded
  submittedAt: timestamp("submitted_at"),
  grade: integer("grade"),
  feedback: text("feedback"),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  criteria: text("criteria"), // Criteria for earning this badge
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const courseRecommendations = pgTable("course_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goal: text("goal").notNull(),
  estimatedDuration: integer("estimated_duration_hours"),
  progress: integer("progress").notNull().default(0),
  isAiGenerated: boolean("is_ai_generated").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const learningPathSteps = pgTable("learning_path_steps", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull(),
  courseId: integer("course_id").notNull(),
  order: integer("order").notNull(),
  required: boolean("required").default(true),
  completed: boolean("completed").default(false),
  notes: text("notes"),
});

// Analytics tables
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(), // login, view_course, complete_lesson, etc.
  resourceType: text("resource_type"), // course, lesson, assignment, etc.
  resourceId: integer("resource_id"),
  metadata: jsonb("metadata"), // Additional context about the activity
  createdAt: timestamp("created_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const courseAnalytics = pgTable("course_analytics", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  totalEnrollments: integer("total_enrollments").notNull().default(0),
  completionRate: integer("completion_rate").default(0), // Percentage (0-100)
  averageRating: integer("average_rating"), // Rating (1-5)
  averageCompletionTime: integer("average_completion_time"), // In minutes
  dropoffRate: integer("dropoff_rate").default(0), // Percentage (0-100)
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userProgressSnapshots = pgTable("user_progress_snapshots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  snapshotDate: date("snapshot_date").notNull(),
  coursesEnrolled: integer("courses_enrolled").notNull().default(0),
  coursesCompleted: integer("courses_completed").notNull().default(0),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  assignmentsCompleted: integer("assignments_completed").notNull().default(0),
  totalPoints: integer("total_points").notNull().default(0),
  badgesEarned: integer("badges_earned").notNull().default(0),
  averageGrade: integer("average_grade"), // Percentage (0-100)
});

// Adaptive Learning Reward System tables

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // academic, engagement, mastery, social
  imageUrl: text("image_url"),
  criteria: jsonb("criteria").notNull().default({}), // Criteria for earning the achievement
  pointsReward: integer("points_reward").notNull().default(50),
  xpReward: integer("xp_reward").notNull().default(25),
  badgeId: integer("badge_id").references(() => badges.id),
  rarity: varchar("rarity", { length: 20 }).notNull().default("common"), // common, uncommon, rare, epic, legendary
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User Achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  pointsEarned: integer("points_earned").default(0),
  xpEarned: integer("xp_earned").default(0),
});

// Leaderboards
export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // points, xp, courses_completed, streaks
  timeframe: varchar("timeframe", { length: 20 }).notNull().default("weekly"), // daily, weekly, monthly, all_time
  isActive: boolean("is_active").notNull().default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Leaderboard Entries
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  leaderboardId: integer("leaderboard_id").notNull().references(() => leaderboards.id),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").notNull().default(0),
  rank: integer("rank"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // daily, skill, course, streak
  category: varchar("category", { length: 50 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("medium"), // easy, medium, hard
  pointsReward: integer("points_reward").notNull().default(10),
  xpReward: integer("xp_reward").notNull().default(5),
  badgeId: integer("badge_id").references(() => badges.id),
  requirements: jsonb("requirements").notNull().default({}), // JSON with completion criteria
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  courseId: integer("course_id").references(() => courses.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
});

// User challenge progress
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  progress: integer("progress").notNull().default(0), // 0-100
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  pointsEarned: integer("points_earned").default(0),
  xpEarned: integer("xp_earned").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Skill challenges - bite-sized learning challenges
export const skillChallenges = pgTable("skill_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // multiple_choice, short_answer, coding, drag_drop, true_false
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  category: text("category").notNull(),
  timeLimit: integer("time_limit").notNull().default(60), // in seconds
  points: integer("points").notNull().default(10),
  xpReward: integer("xp_reward").notNull().default(5),
  question: text("question").notNull(),
  options: text("options").array(), // For multiple choice questions
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  hint: text("hint"),
  prerequisites: text("prerequisites").array().default([]),
  tags: text("tags").array().default([]),
  courseId: integer("course_id"), // Optional: link to specific course
  moduleId: integer("module_id"), // Optional: link to specific module
  lessonId: integer("lesson_id"), // Optional: link to specific lesson
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userSkillChallengeAttempts = pgTable("user_skill_challenge_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  answer: text("answer").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  isCorrect: boolean("is_correct").notNull(),
  pointsEarned: integer("points_earned").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  timedOut: boolean("timed_out").notNull().default(false),
  hintUsed: boolean("hint_used").notNull().default(false),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

// User level and experience tracking
export const userLevels = pgTable("user_levels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  level: integer("level").notNull().default(1),
  currentXp: integer("current_xp").notNull().default(0),
  totalXp: integer("total_xp").notNull().default(0),
  nextLevelXp: integer("next_level_xp").notNull().default(100),
  streak: integer("streak").notNull().default(0), // consecutive days of activity
  lastActivityDate: date("last_activity_date"),
  totalPoints: integer("total_points").notNull().default(0),
});

// Interactive lesson trails
export const lessonTrails = pgTable("lesson_trails", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  trailData: jsonb("trail_data").notNull(), // Contains node positions, connections, metadata
  difficulty: text("difficulty").notNull().default("medium"),
  estimatedTime: integer("estimated_time_minutes"),
  isAiGenerated: boolean("is_ai_generated").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Trail nodes (individual lessons in the trail)
export const trailNodes = pgTable("trail_nodes", {
  id: serial("id").primaryKey(),
  trailId: integer("trail_id").notNull().references(() => lessonTrails.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  nodePosition: jsonb("node_position").notNull(), // x, y coordinates for visualization
  nodeType: text("node_type").notNull().default("lesson"), // lesson, checkpoint, bonus, assessment
  unlockConditions: jsonb("unlock_conditions").default({}), // Prerequisites and conditions
  hoverInfo: jsonb("hover_info").notNull(), // Educational information shown on hover
  rewards: jsonb("rewards").default({}), // XP, points, badges for completing this node
  isOptional: boolean("is_optional").default(false),
});

// User progress on lesson trails
export const userTrailProgress = pgTable("user_trail_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  trailId: integer("trail_id").notNull().references(() => lessonTrails.id),
  completedNodes: integer("completed_nodes").array().default([]), // Array of completed node IDs
  currentNode: integer("current_node"),
  progress: integer("progress").default(0), // 0-100 percentage
  timeSpent: integer("time_spent_minutes").default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at"),
  completedAt: timestamp("completed_at"),
});

// Personalized learning recommendations
export const personalizedRecommendations = pgTable("personalized_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  recommendationType: text("recommendation_type").notNull(), // lesson, course, trail, skill_gap
  resourceId: integer("resource_id").notNull(), // ID of recommended resource
  resourceType: text("resource_type").notNull(), // lesson, course, trail
  aiReasoning: text("ai_reasoning").notNull(), // AI explanation for recommendation
  confidence: numeric("confidence", { precision: 3, scale: 2 }).notNull(), // 0.00-1.00
  metadata: jsonb("metadata").default({}), // Additional data like difficulty adjustment
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  viewedAt: timestamp("viewed_at"),
  acceptedAt: timestamp("accepted_at"),
});

// Learning analytics for AI personalization
export const learningAnalytics = pgTable("learning_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: text("session_id").notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id),
  courseId: integer("course_id").references(() => courses.id),
  activityType: text("activity_type").notNull(), // view, complete, struggle, skip, revisit
  timeSpent: integer("time_spent_seconds"),
  interactionData: jsonb("interaction_data").default({}), // Detailed interaction tracking
  performanceScore: numeric("performance_score", { precision: 3, scale: 2 }), // 0.00-1.00
  difficultyRating: integer("difficulty_rating"), // User's subjective difficulty rating 1-5
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  role: z.enum(["admin", "instructor", "student"]).default("student"),
  interests: z.array(z.string()).optional(),
}).omit({ id: true });

export const insertCourseSchema = createInsertSchema(courses, {
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
}).omit({ id: true, createdAt: true });

export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertUserCourseSchema = createInsertSchema(userCourses).omit({ id: true, enrolledAt: true, lastAccessedAt: true });
export const insertUserLessonSchema = createInsertSchema(userLessons).omit({ id: true, lastAccessedAt: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true });
export const insertUserAssignmentSchema = createInsertSchema(userAssignments).omit({ id: true, submittedAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true });
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });
export const insertCourseRecommendationSchema = createInsertSchema(courseRecommendations).omit({ id: true, createdAt: true });
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLearningPathStepSchema = createInsertSchema(learningPathSteps).omit({ id: true });

// Analytics insert schemas
export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).omit({ 
  id: true, 
  createdAt: true 
});

export const insertCourseAnalyticsSchema = createInsertSchema(courseAnalytics).omit({ 
  id: true, 
  updatedAt: true 
});

export const insertUserProgressSnapshotSchema = createInsertSchema(userProgressSnapshots).omit({ 
  id: true 
});

// Interactive lesson trails insert schemas
export const insertLessonTrailSchema = createInsertSchema(lessonTrails).omit({ 
  id: true, 
  createdAt: true 
});

export const insertTrailNodeSchema = createInsertSchema(trailNodes).omit({ 
  id: true 
});

export const insertUserTrailProgressSchema = createInsertSchema(userTrailProgress).omit({ 
  id: true, 
  startedAt: true, 
  lastAccessedAt: true, 
  completedAt: true 
});

export const insertPersonalizedRecommendationSchema = createInsertSchema(personalizedRecommendations).omit({ 
  id: true, 
  createdAt: true, 
  viewedAt: true, 
  acceptedAt: true 
});

export const insertLearningAnalyticsSchema = createInsertSchema(learningAnalytics).omit({ 
  id: true, 
  createdAt: true 
});

// Adaptive Learning Reward System insert schemas

// Achievement schemas
export const insertAchievementSchema = createInsertSchema(achievements, {
  category: z.enum(["academic", "engagement", "mastery", "social"]),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
}).omit({ 
  id: true,
  createdAt: true
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ 
  id: true,
  earnedAt: true
});

// Leaderboard schemas
export const insertLeaderboardSchema = createInsertSchema(leaderboards, {
  type: z.enum(["points", "xp", "courses_completed", "streaks"]),
  timeframe: z.enum(["daily", "weekly", "monthly", "all_time"]),
}).omit({ 
  id: true,
  createdAt: true
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).omit({ 
  id: true,
  updatedAt: true
});

// Challenge schemas
export const insertChallengeSchema = createInsertSchema(challenges, {
  type: z.enum(["daily", "skill", "course", "streak", "assignment"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
}).omit({ 
  id: true,
  createdAt: true
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({ 
  id: true,
  createdAt: true,
  completedAt: true
});

export const insertSkillChallengeSchema = createInsertSchema(skillChallenges).omit({ 
  id: true, 
  createdAt: true 
});

export const insertUserSkillChallengeAttemptSchema = createInsertSchema(userSkillChallengeAttempts).omit({ 
  id: true, 
  attemptedAt: true 
});

export const insertUserLevelSchema = createInsertSchema(userLevels).omit({ 
  id: true 
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type UserCourse = typeof userCourses.$inferSelect;
export type UserLesson = typeof userLessons.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type UserAssignment = typeof userAssignments.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type CourseRecommendation = typeof courseRecommendations.$inferSelect;
export type LearningPath = typeof learningPaths.$inferSelect;
export type LearningPathStep = typeof learningPathSteps.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type InsertLearningPathStep = z.infer<typeof insertLearningPathStepSchema>;

// Analytics types
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type CourseAnalytic = typeof courseAnalytics.$inferSelect;
export type InsertCourseAnalytic = z.infer<typeof insertCourseAnalyticsSchema>;
export type UserProgressSnapshot = typeof userProgressSnapshots.$inferSelect;
export type InsertUserProgressSnapshot = z.infer<typeof insertUserProgressSnapshotSchema>;

// Adaptive Learning Reward System types

// Achievement types
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

// Leaderboard types
export type Leaderboard = typeof leaderboards.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;

// Challenge types
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type SkillChallenge = typeof skillChallenges.$inferSelect;
export type InsertSkillChallenge = z.infer<typeof insertSkillChallengeSchema>;
export type UserSkillChallengeAttempt = typeof userSkillChallengeAttempts.$inferSelect;
export type InsertUserSkillChallengeAttempt = z.infer<typeof insertUserSkillChallengeAttemptSchema>;
export type UserLevel = typeof userLevels.$inferSelect;
export type InsertUserLevel = z.infer<typeof insertUserLevelSchema>;

// Interactive lesson trails types
export type LessonTrail = typeof lessonTrails.$inferSelect;
export type InsertLessonTrail = z.infer<typeof insertLessonTrailSchema>;
export type TrailNode = typeof trailNodes.$inferSelect;
export type InsertTrailNode = z.infer<typeof insertTrailNodeSchema>;
export type UserTrailProgress = typeof userTrailProgress.$inferSelect;
export type InsertUserTrailProgress = z.infer<typeof insertUserTrailProgressSchema>;
export type PersonalizedRecommendation = typeof personalizedRecommendations.$inferSelect;
export type InsertPersonalizedRecommendation = z.infer<typeof insertPersonalizedRecommendationSchema>;
export type LearningAnalytics = typeof learningAnalytics.$inferSelect;
export type InsertLearningAnalytics = z.infer<typeof insertLearningAnalyticsSchema>;
