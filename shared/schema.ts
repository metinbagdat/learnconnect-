import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, varchar, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("student"),
  avatarUrl: text("avatar_url"),
  interests: text("interests").array(), // Store user interests for better course recommendations
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Legacy field - deprecated
  description: text("description").notNull(), // Legacy field - deprecated
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionTr: text("description_tr").notNull().default(""),
  category: text("category").notNull(), // Legacy text category - kept for backwards compatibility
  categoryId: integer("category_id").references(() => courseCategories.id, { onDelete: 'set null' }), // New: references courseCategories table
  imageUrl: text("image_url"),
  moduleCount: integer("module_count").notNull().default(1),
  durationHours: integer("duration_hours"),
  instructorId: integer("instructor_id").notNull(),
  rating: integer("rating"),
  level: text("level"), // Beginner, Intermediate, Advanced
  isAiGenerated: boolean("is_ai_generated").default(false),
  price: numeric("price", { precision: 10, scale: 2 }).default("0.00"), // Course price in USD
  isPremium: boolean("is_premium").default(false), // Whether course requires payment
  stripePriceId: text("stripe_price_id"), // Stripe price ID for recurring billing
  parentCourseId: integer("parent_course_id"), // For hierarchical course structure
  depth: integer("depth").notNull().default(0), // Tree depth: 0 = root (e.g., AYT), 1 = subject (e.g., Mathematics), 2+ = subtopics
  order: integer("order").notNull().default(0), // Display order within same parent
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(), // Legacy field - deprecated
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionTr: text("description_tr").notNull().default(""),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(), // Legacy field - deprecated
  content: text("content"), // Legacy field - deprecated
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  contentTr: text("content_tr").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionTr: text("description_tr").notNull().default(""),
  order: integer("order").notNull(),
  estimatedTime: integer("estimated_time").default(30), // duration in minutes
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

// File uploads table for handling images, documents, and essay submissions
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // file size in bytes
  path: text("path").notNull(), // storage path or URL
  uploadType: text("upload_type", { enum: ["general", "avatar", "essay", "assignment", "document"] }).notNull().default("general"),
  entityType: text("entity_type", { enum: ["course", "assignment", "essay", "user"] }), // optional entity association
  entityId: integer("entity_id"), // reference to the associated entity
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Essays table for essay tracking and submissions
export const essays = pgTable("essays", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  title: text("title").notNull(),
  prompt: text("prompt"), // Essay prompt/question
  content: text("content"), // Essay text content
  fileId: integer("file_id").references(() => uploads.id), // Reference to uploads table if submitted as file
  status: text("status", { enum: ["draft", "submitted", "reviewed", "graded"] }).notNull().default("draft"),
  wordCount: integer("word_count"),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  grade: integer("grade"),
  aiFeedback: text("ai_feedback"), // AI-generated feedback from GPT-4
  instructorFeedback: text("instructor_feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Weekly study plans table for planning weekly study schedules
export const weeklyStudyPlans = pgTable("weekly_study_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  weekStartDate: date("week_start_date").notNull(),
  weekEndDate: date("week_end_date").notNull(),
  totalPlannedHours: integer("total_planned_hours"),
  totalActualHours: integer("total_actual_hours").default(0),
  goals: text("goals").array().default([]),
  priorities: text("priorities").array().default([]),
  aiRecommendations: text("ai_recommendations"), // GPT-4 generated study recommendations
  status: text("status", { enum: ["active", "completed", "archived"] }).default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  uniqueUserWeek: sql`UNIQUE (user_id, week_start_date)`, // Prevent duplicate weekly plans for same user
}));

// Course categories table for hierarchical organization (e.g., Math → Algebra → Linear Algebra)
export const courseCategories = pgTable("course_categories", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameTr: text("name_tr").notNull(),
  descriptionEn: text("description_en"),
  descriptionTr: text("description_tr"),
  parentCategoryId: integer("parent_category_id").references((): any => courseCategories.id, { onDelete: 'set null' }), // null for root categories
  icon: text("icon"), // icon name from lucide-react or URL
  color: text("color").default("#3B82F6"), // hex color for UI theming
  order: integer("order").notNull().default(0), // display order within same parent
  depth: integer("depth").notNull().default(0), // 0 = root category, 1 = subcategory, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  examType: text("exam_type"), // lycee, college, university, sat, act, ap, ielts, toefl, gre, gmat, etc.
  examSubjects: text("exam_subjects").array().default([]), // subjects covered in this exam path
  difficultyLevel: text("difficulty_level").default("intermediate"), // beginner, intermediate, advanced
  targetScore: integer("target_score"), // target exam score if applicable
  examDate: date("exam_date"), // planned exam date
  studySchedule: jsonb("study_schedule"), // weekly study plan and milestones
  customRequirements: jsonb("custom_requirements"), // specific requirements or focus areas
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
  type: text("type").notNull(), // multiple_choice, short_answer, coding, drag_drop, true_false, fill_blank, matching, ordering, image_quiz, video_quiz
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  category: text("category").notNull(),
  timeLimit: integer("time_limit").notNull().default(60), // in seconds
  points: integer("points").notNull().default(10),
  xpReward: integer("xp_reward").notNull().default(5),
  bonusMultiplier: numeric("bonus_multiplier").default("1.0"), // Bonus multiplier for perfect scores or speed
  streakBonus: integer("streak_bonus").default(0), // Extra points for consecutive correct answers
  question: text("question").notNull(),
  options: text("options").array(), // For multiple choice questions
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  hint: text("hint"),
  mediaUrl: text("media_url"), // For image/video based challenges
  codeTemplate: text("code_template"), // For coding challenges
  testCases: jsonb("test_cases"), // For coding challenges validation
  matchingPairs: jsonb("matching_pairs"), // For matching challenges
  orderSequence: text("order_sequence").array(), // For ordering challenges
  prerequisites: text("prerequisites").array().default([]),
  tags: text("tags").array().default([]),
  courseId: integer("course_id"), // Optional: link to specific course
  moduleId: integer("module_id"), // Optional: link to specific module
  lessonId: integer("lesson_id"), // Optional: link to specific lesson
  unlockConditions: jsonb("unlock_conditions").default({}), // Conditions to unlock this challenge
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
  bonusPointsEarned: integer("bonus_points_earned").default(0),
  streakCount: integer("streak_count").default(0),
  perfectScore: boolean("perfect_score").default(false),
  speedBonus: integer("speed_bonus").default(0),
  timedOut: boolean("timed_out").notNull().default(false),
  hintUsed: boolean("hint_used").notNull().default(false),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

// Challenge streaks and achievements
export const userChallengeStreaks = pgTable("user_challenge_streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  currentStreak: integer("current_streak").default(0),
  maxStreak: integer("max_streak").default(0),
  lastCorrectAt: timestamp("last_correct_at"),
  streakStartedAt: timestamp("streak_started_at"),
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

// TYT Study Planning System Tables

// TYT Student Profiles
export const tytStudentProfiles = pgTable("tyt_student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  studentClass: integer("student_class").notNull(), // 9, 10, 11, 12
  examYear: integer("exam_year").notNull(), // Target exam year
  targetNetScore: integer("target_net_score").notNull(), // Target total net score
  dailyStudyHoursTarget: integer("daily_study_hours_target").notNull(), // Target daily study hours
  weeklyStudyHoursTarget: integer("weekly_study_hours_target").notNull(), // Target weekly study hours
  selectedSubjects: text("selected_subjects").array().default([]), // TYT subjects: turkish, math, science, social
  weakSubjects: text("weak_subjects").array().default([]), // Subjects student struggles with
  strongSubjects: text("strong_subjects").array().default([]), // Subjects student excels at
  studyPreferences: jsonb("study_preferences").default({}), // Study time preferences, break intervals, etc.
  motivationLevel: integer("motivation_level").default(5), // 1-10 scale
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// TYT Subjects and Topics
export const tytSubjects = pgTable("tyt_subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // turkish, math, science, social
  displayName: text("display_name").notNull(), // Turkish: Türkçe, Math: Matematik
  description: text("description"),
  totalQuestions: integer("total_questions").notNull(), // Number of questions in TYT exam
  isActive: boolean("is_active").default(true),
});

export const tytTopics = pgTable("tyt_topics", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => tytSubjects.id),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull().default("medium"), // easy, medium, hard
  estimatedStudyHours: integer("estimated_study_hours").default(2),
  order: integer("order").notNull().default(0),
  prerequisites: text("prerequisites").array().default([]), // Topic names that should be studied first
  isActive: boolean("is_active").default(true),
});

// User Topic Progress
export const userTopicProgress = pgTable("user_topic_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  topicId: integer("topic_id").notNull().references(() => tytTopics.id),
  status: text("status").notNull().default("not_started"), // not_started, working, repeated, completed, missing
  progressPercent: integer("progress_percent").default(0), // 0-100
  timeSpent: integer("time_spent_minutes").default(0),
  lastStudiedAt: timestamp("last_studied_at"),
  masteryLevel: integer("mastery_level").default(0), // 0-5 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// TYT Trial Exams
export const tytTrialExams = pgTable("tyt_trial_exams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  examName: text("exam_name").notNull(), // Name/source of the trial exam
  examDate: date("exam_date").notNull(),
  duration: integer("duration_minutes").notNull(), // Exam duration in minutes
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  wrongAnswers: integer("wrong_answers").notNull(),
  emptyAnswers: integer("empty_answers").notNull(),
  netScore: numeric("net_score", { precision: 5, scale: 2 }).notNull(), // Calculated net score
  subjectScores: jsonb("subject_scores").notNull().default({}), // Scores per subject
  percentileRank: integer("percentile_rank"), // If available from exam source
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Daily Study Tasks
export const dailyStudyTasks = pgTable("daily_study_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  subjectId: integer("subject_id").references(() => tytSubjects.id),
  topicId: integer("topic_id").references(() => tytTopics.id),
  taskType: text("task_type").notNull(), // study, practice, review, trial_exam, homework
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  estimatedDuration: integer("estimated_duration_minutes").default(60),
  actualDuration: integer("actual_duration_minutes"),
  scheduledDate: date("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time"), // HH:MM format for preferred time
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  difficulty: integer("difficulty_rating"), // 1-5, filled after completion
  satisfaction: integer("satisfaction_rating"), // 1-5, user satisfaction with task
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// TYT Study Sessions  
export const tytStudySessions = pgTable("tyt_study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  subjectId: integer("subject_id").references(() => tytSubjects.id),
  topicId: integer("topic_id").references(() => tytTopics.id),
  taskId: integer("task_id").references(() => dailyStudyTasks.id),
  sessionType: text("session_type").notNull(), // focused_study, practice, review, break
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration_minutes"),
  focusRating: integer("focus_rating"), // 1-5, how focused was the session
  productivityRating: integer("productivity_rating"), // 1-5, how productive was the session
  distractions: text("distractions").array().default([]), // phone, social_media, noise, etc.
  studyMethod: text("study_method"), // reading, note_taking, practice_questions, flashcards, etc.
  materialsUsed: text("materials_used").array().default([]), // textbook, online_course, video, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Study Goals and Targets
export const tytStudyGoals = pgTable("tyt_study_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  goalType: text("goal_type").notNull(), // daily, weekly, monthly, exam_preparation
  title: text("title").notNull(),
  description: text("description"),
  targetValue: integer("target_value").notNull(), // hours, questions, topics, etc.
  currentValue: integer("current_value").default(0),
  unit: text("unit").notNull(), // hours, questions, topics, trials, etc.
  deadline: date("deadline"),
  priority: text("priority").default("medium"), // low, medium, high
  category: text("category").notNull(), // study_time, net_score, subject_mastery, trial_performance
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata").default({}), // Additional goal-specific data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Study Streaks and Habits
export const tytStudyStreaks = pgTable("tyt_study_streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  streakType: text("streak_type").notNull(), // daily_study, weekly_target, trial_improvement
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: date("last_activity_date"),
  streakStartDate: date("streak_start_date"),
  target: jsonb("target").default({}), // What constitutes maintaining the streak
  rewards: jsonb("rewards").default({}), // Rewards for streak milestones
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// AI-Driven Curriculum System
export const courseCurriculums = pgTable("course_curriculums", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionTr: text("description_tr").notNull(),
  goals: text("goals").array().default([]), // Learning goals
  prerequisites: text("prerequisites").array().default([]), // Required prior knowledge
  totalDuration: integer("total_duration_hours"), // Total curriculum duration
  difficultyLevel: text("difficulty_level"), // Beginner, Intermediate, Advanced
  isAiGenerated: boolean("is_ai_generated").default(true),
  aiModel: text("ai_model"), // Which AI model generated this (gpt-4, claude-3, etc.)
  generationPrompt: text("generation_prompt"), // Prompt used for generation
  metadata: jsonb("metadata").default({}), // Additional curriculum data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const curriculumSkills = pgTable("curriculum_skills", {
  id: serial("id").primaryKey(),
  curriculumId: integer("curriculum_id").notNull().references(() => courseCurriculums.id),
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionTr: text("description_tr").notNull(),
  category: text("category").notNull(), // technical, analytical, practical, conceptual
  estimatedHours: integer("estimated_hours"), // Hours to master this skill
  order: integer("order").notNull().default(0), // Display order
  prerequisites: integer("prerequisites").array().default([]), // IDs of prerequisite skills
  assessmentCriteria: text("assessment_criteria").array().default([]), // How to assess mastery
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const curriculumModules = pgTable("curriculum_modules", {
  id: serial("id").primaryKey(),
  curriculumId: integer("curriculum_id").notNull().references(() => courseCurriculums.id),
  skillId: integer("skill_id").references(() => curriculumSkills.id), // Optional: link to skill being taught
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionTr: text("description_tr").notNull(),
  order: integer("order").notNull().default(0),
  estimatedDuration: integer("estimated_duration_hours"),
  learningObjectives: text("learning_objectives").array().default([]),
  resources: jsonb("resources").default({}), // Links, materials, references
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userCurriculums = pgTable("user_curriculums", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  curriculumId: integer("curriculum_id").notNull().references(() => courseCurriculums.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  status: text("status").default("active"), // active, paused, completed
  progress: integer("progress").default(0), // 0-100 percentage
  startDate: date("start_date").notNull().defaultNow(),
  targetCompletionDate: date("target_completion_date"),
  actualCompletionDate: date("actual_completion_date"),
  weeklyStudyHours: integer("weekly_study_hours").default(10), // User's available time
  pacePreference: text("pace_preference").default("normal"), // slow, normal, fast, intensive
  adaptations: jsonb("adaptations").default({}), // AI-personalized adjustments
  lastEvaluationDate: timestamp("last_evaluation_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userCurriculumTasks = pgTable("user_curriculum_tasks", {
  id: serial("id").primaryKey(),
  userCurriculumId: integer("user_curriculum_id").notNull().references(() => userCurriculums.id),
  dailyTaskId: integer("daily_task_id").references(() => dailyStudyTasks.id), // Link to daily task
  curriculumModuleId: integer("curriculum_module_id").references(() => curriculumModules.id),
  skillId: integer("skill_id").references(() => curriculumSkills.id),
  taskType: text("task_type").notNull(), // study, practice, assessment, checkpoint
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  descriptionEn: text("description_en"),
  descriptionTr: text("description_tr"),
  scheduledDate: date("scheduled_date"),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  skillProgress: integer("skill_progress"), // Contribution to skill mastery (0-100)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userSkillProgress = pgTable("user_skill_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => curriculumSkills.id),
  userCurriculumId: integer("user_curriculum_id").notNull().references(() => userCurriculums.id),
  masteryLevel: integer("mastery_level").default(0), // 0-100 scale
  assessmentScore: integer("assessment_score"), // Latest assessment score
  practiceHours: integer("practice_hours").default(0), // Total practice time
  lastPracticeDate: timestamp("last_practice_date"),
  strengthAreas: text("strength_areas").array().default([]),
  improvementAreas: text("improvement_areas").array().default([]),
  aiRecommendations: text("ai_recommendations").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const curriculumCheckpoints = pgTable("curriculum_checkpoints", {
  id: serial("id").primaryKey(),
  curriculumId: integer("curriculum_id").notNull().references(() => courseCurriculums.id),
  titleEn: text("title_en").notNull(),
  titleTr: text("title_tr").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionTr: text("description_tr").notNull(),
  checkpointType: text("checkpoint_type").notNull(), // quiz, project, skill_assessment, milestone
  order: integer("order").notNull().default(0),
  requiredProgress: integer("required_progress"), // Progress % needed to unlock
  requiredSkills: integer("required_skills").array().default([]), // Skill IDs required
  passingScore: integer("passing_score"), // Minimum score to pass
  estimatedDuration: integer("estimated_duration_minutes"),
  resources: jsonb("resources").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const skillAssessments = pgTable("skill_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => curriculumSkills.id),
  checkpointId: integer("checkpoint_id").references(() => curriculumCheckpoints.id),
  userCurriculumId: integer("user_curriculum_id").notNull().references(() => userCurriculums.id),
  assessmentType: text("assessment_type").notNull(), // quiz, practical, project, ai_evaluation
  score: integer("score").notNull(), // 0-100
  totalQuestions: integer("total_questions"),
  correctAnswers: integer("correct_answers"),
  timeSpent: integer("time_spent_minutes"),
  feedback: text("feedback"),
  aiFeedback: text("ai_feedback"), // AI-generated personalized feedback
  strengths: text("strengths").array().default([]),
  weaknesses: text("weaknesses").array().default([]),
  recommendations: text("recommendations").array().default([]),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// New Time Tracking & Analytics Tables (complementary to existing TYT tables)
export const dailyStudyGoals = pgTable("daily_study_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  targetStudyTime: integer("target_study_time").notNull(), // in minutes
  actualStudyTime: integer("actual_study_time").default(0), // in minutes
  subjects: jsonb("subjects").default({}), // { "Math": { target: 120, actual: 90, sessions: 2 }, ... }
  completed: boolean("completed").default(false),
  completionRate: integer("completion_rate").default(0), // percentage
  streak: integer("streak").default(0), // consecutive days meeting goals
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueUserDate: sql`UNIQUE (user_id, date)`,
}));

export const studyHabits = pgTable("study_habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  period: text("period").notNull(), // week, month
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalStudyTime: integer("total_study_time").default(0), // in minutes
  averageSessionLength: integer("average_session_length"), // in minutes
  preferredStudyTimes: jsonb("preferred_study_times").default({}), // { morning: 35, afternoon: 25, evening: 40 }
  mostProductiveDays: text("most_productive_days").array().default([]),
  efficiencyTrend: integer("efficiency_trend").array().default([]),
  commonDistractions: text("common_distractions").array().default([]),
  recommendations: text("recommendations").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Daily Study Sessions - Individual session tracking for Time Tracking feature
// Multiple sessions can be logged per day (no unique constraint)
export const dailyStudySessions = pgTable("daily_study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  totalStudyMinutes: integer("total_study_minutes").notNull(),
  subjectsStudied: text("subjects_studied").array().default([]),
  pomodoroCount: integer("pomodoro_count").default(0),
  breaksTaken: integer("breaks_taken").default(0),
  mood: text("mood"), // happy, neutral, tired
  productivityRating: integer("productivity_rating"), // 1-5
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TYT Resources table (new addition to existing TYT system)
export const tytResources = pgTable("tyt_resources", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => tytTopics.id),
  type: text("type").notNull(), // video, test, pdf, link
  nameEn: text("name_en").notNull(),
  nameTr: text("name_tr").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minutes for videos
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// AI Daily Study Plans
export const aiDailyPlans = pgTable("ai_daily_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  plan: jsonb("plan").notNull(), // { morning: [...], afternoon: [...], evening: [...] }
  totalStudyTime: integer("total_study_time").notNull(), // in minutes
  motivationalMessage: text("motivational_message"),
  studyTips: text("study_tips").array().default([]),
  completed: boolean("completed").default(false),
  completionRate: integer("completion_rate").default(0),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  uniqueUserDate: sql`UNIQUE (user_id, date)`,
}));

// Forum System - Posts and Comments
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPosts.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  likeCount: integer("like_count").default(0),
  isAnswer: boolean("is_answer").default(false), // For marking as accepted answer
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Certificate System
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  certificateNumber: text("certificate_number").notNull().unique(),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  url: text("url"), // URL to certificate PDF/image
  verificationCode: text("verification_code").notNull().unique(),
  isActive: boolean("is_active").default(true),
  revokedAt: timestamp("revoked_at"), // Track when certificate was revoked
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  uniqueUserCourse: sql`UNIQUE (user_id, course_id)`,
}));

// AI Logging Tables for Adaptive Learning System
export const aiConceptLogs = pgTable("ai_concept_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  topicId: integer("topic_id").references(() => tytTopics.id),
  courseId: integer("course_id").references(() => courses.id),
  conceptName: text("concept_name").notNull(),
  aiModel: text("ai_model").notNull(), // gpt-4, claude-3, etc.
  explanation: text("explanation").notNull(),
  language: text("language").notNull(), // en, tr
  complexity: text("complexity").notNull(), // beginner, intermediate, advanced
  userRating: integer("user_rating"), // 1-5 rating of explanation quality
  helpful: boolean("helpful").default(false),
  usedInReview: boolean("used_in_review").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiStudyTipsLogs = pgTable("ai_study_tips_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  topicId: integer("topic_id").references(() => tytTopics.id),
  subjectId: integer("subject_id").references(() => tytSubjects.id),
  aiModel: text("ai_model").notNull(), // gpt-4, claude-3, etc.
  tips: text("tips").array().notNull(), // Array of study tips
  language: text("language").notNull(), // en, tr
  context: text("context").notNull(), // why these tips were generated
  appliedAt: timestamp("applied_at"), // when student started using these tips
  effectiveness: integer("effectiveness"), // 1-5 rating after use
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiReviewLogs = pgTable("ai_review_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  topicId: integer("topic_id").references(() => tytTopics.id),
  courseId: integer("course_id").references(() => courses.id),
  aiModel: text("ai_model").notNull(), // gpt-4, claude-3, etc.
  reviewContent: text("review_content").notNull(),
  language: text("language").notNull(), // en, tr
  focusAreas: text("focus_areas").array().notNull(), // areas reviewed
  difficultyLevel: text("difficulty_level"), // easy, medium, hard
  conceptsReviewed: text("concepts_reviewed").array().notNull(),
  estimatedRetention: numeric("estimated_retention", { precision: 3, scale: 2 }), // 0.00-1.00
  studentFeedback: text("student_feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  role: z.enum(["admin", "instructor", "student"]).default("student"),
  interests: z.array(z.string()).optional(),
}).omit({ id: true, stripeCustomerId: true, stripeSubscriptionId: true });

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
export const insertUploadSchema = createInsertSchema(uploads).omit({ id: true, uploadedAt: true });
export const insertEssaySchema = createInsertSchema(essays).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWeeklyStudyPlanSchema = createInsertSchema(weeklyStudyPlans).omit({ id: true, createdAt: true, updatedAt: true });
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

// TYT Study Planning insert schemas
export const insertTytStudentProfileSchema = createInsertSchema(tytStudentProfiles, {
  studentClass: z.number().min(9).max(12),
  examYear: z.number().min(2024).max(2030),
  targetNetScore: z.number().min(0).max(200),
  dailyStudyHoursTarget: z.number().min(1).max(12),
  weeklyStudyHoursTarget: z.number().min(7).max(84),
  motivationLevel: z.number().min(1).max(10),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertTytSubjectSchema = createInsertSchema(tytSubjects).omit({ id: true });

export const insertTytTopicSchema = createInsertSchema(tytTopics, {
  difficulty: z.enum(["easy", "medium", "hard"]),
}).omit({ id: true });

export const insertUserTopicProgressSchema = createInsertSchema(userTopicProgress, {
  status: z.enum(["not_started", "working", "repeated", "completed", "missing"]),
  progressPercent: z.number().min(0).max(100),
  masteryLevel: z.number().min(0).max(5),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  lastStudiedAt: true 
});

export const insertTytTrialExamSchema = createInsertSchema(tytTrialExams).omit({ 
  id: true, 
  createdAt: true 
});

export const insertDailyStudyTaskSchema = createInsertSchema(dailyStudyTasks, {
  taskType: z.enum(["study", "practice", "review", "trial_exam", "homework"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  completedAt: true 
});

export const insertTytStudySessionSchema = createInsertSchema(tytStudySessions, {
  sessionType: z.enum(["focused_study", "practice", "review", "break"]),
}).omit({ 
  id: true, 
  createdAt: true, 
  endTime: true 
});

export const insertTytStudyGoalSchema = createInsertSchema(tytStudyGoals, {
  goalType: z.enum(["daily", "weekly", "monthly", "exam_preparation"]),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["study_time", "net_score", "subject_mastery", "trial_performance"]),
  unit: z.enum(["hours", "minutes", "questions", "topics", "trials", "points"]),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  completedAt: true 
});

export const insertTytStudyStreakSchema = createInsertSchema(tytStudyStreaks, {
  streakType: z.enum(["daily_study", "weekly_target", "trial_improvement"]),
}).omit({ 
  id: true, 
  createdAt: true 
});

// AI-Driven Curriculum System insert schemas
export const insertCourseCurriculumSchema = createInsertSchema(courseCurriculums, {
  difficultyLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCurriculumSkillSchema = createInsertSchema(curriculumSkills, {
  category: z.enum(["technical", "analytical", "practical", "conceptual"]),
}).omit({ 
  id: true, 
  createdAt: true 
});

export const insertCurriculumModuleSchema = createInsertSchema(curriculumModules).omit({ 
  id: true, 
  createdAt: true 
});

export const insertUserCurriculumSchema = createInsertSchema(userCurriculums, {
  status: z.enum(["active", "paused", "completed"]),
  pacePreference: z.enum(["slow", "normal", "fast", "intensive"]),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertUserCurriculumTaskSchema = createInsertSchema(userCurriculumTasks, {
  taskType: z.enum(["study", "practice", "assessment", "checkpoint"]),
}).omit({ 
  id: true, 
  createdAt: true, 
  completedAt: true 
});

export const insertUserSkillProgressSchema = createInsertSchema(userSkillProgress).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCurriculumCheckpointSchema = createInsertSchema(curriculumCheckpoints, {
  checkpointType: z.enum(["quiz", "project", "skill_assessment", "milestone"]),
}).omit({ 
  id: true, 
  createdAt: true 
});

export const insertSkillAssessmentSchema = createInsertSchema(skillAssessments, {
  assessmentType: z.enum(["quiz", "practical", "project", "ai_evaluation"]),
}).omit({ 
  id: true, 
  createdAt: true, 
  completedAt: true 
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

// Mentor System Tables
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Teacher or AI system user
  isAiMentor: boolean("is_ai_mentor").default(false),
  specialization: text("specialization").array().default([]), // Subject areas of expertise
  languages: text("languages").array().default(["en"]), // Languages supported
  availabilitySchedule: jsonb("availability_schedule"), // Weekly availability for teachers
  maxStudents: integer("max_students").default(50), // Maximum students this mentor can handle
  rating: numeric("rating", { precision: 3, scale: 2 }).default("5.0"), // Mentor rating
  bio: text("bio"), // Mentor biography
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userMentors = pgTable("user_mentors", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  mentorId: integer("mentor_id").notNull().references(() => mentors.id),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  isActive: boolean("is_active").default(true),
  preferredCommunication: text("preferred_communication").default("chat"), // chat, video, email
  communicationLanguage: text("communication_language").default("en"),
  notes: text("notes"), // Special notes about the mentorship
});

// Study Program Management Tables
export const studyPrograms = pgTable("study_programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetGroup: text("target_group").notNull(), // "all", "beginners", "intermediate", "advanced"
  courseIds: integer("course_ids").array().notNull(), // Array of course IDs in this program
  totalDurationWeeks: integer("total_duration_weeks").notNull(),
  weeklyHours: integer("weekly_hours").notNull().default(10), // Recommended weekly study hours
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdBy: integer("created_by").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mentor system insert schemas
export const insertMentorSchema = createInsertSchema(mentors).omit({ 
  id: true, 
  createdAt: true 
});

export const insertUserMentorSchema = createInsertSchema(userMentors).omit({ 
  id: true, 
  assignedAt: true 
});

// Study program insert schemas will be defined after table definitions

export const programSchedules = pgTable("program_schedules", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => studyPrograms.id),
  week: integer("week").notNull(), // Week number (1, 2, 3...)
  day: integer("day").notNull(), // Day of week (1=Monday, 7=Sunday)
  startTime: text("start_time").notNull(), // "09:00" format
  endTime: text("end_time").notNull(), // "10:30" format
  courseId: integer("course_id").references(() => courses.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  activityType: text("activity_type").notNull().default("lesson"), // lesson, assignment, review, break
  title: text("title").notNull(),
  description: text("description"),
  resources: jsonb("resources").default([]), // Additional resources for this time slot
});

export const userProgramProgress = pgTable("user_program_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  programId: integer("program_id").notNull().references(() => studyPrograms.id),
  currentWeek: integer("current_week").default(1),
  completedHours: integer("completed_hours").default(0),
  totalHours: integer("total_hours").notNull(),
  progress: integer("progress").default(0), // 0-100 percentage
  startedAt: timestamp("started_at").notNull().defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at"),
  completedAt: timestamp("completed_at"),
  status: text("status").default("active"), // active, paused, completed, dropped
  weeklyGoalHours: integer("weekly_goal_hours").default(10),
  actualWeeklyHours: integer("actual_weekly_hours").default(0),
  adherenceScore: numeric("adherence_score", { precision: 3, scale: 2 }).default("100.0"), // How well user follows schedule
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  programId: integer("program_id").references(() => studyPrograms.id),
  scheduleId: integer("schedule_id").references(() => programSchedules.id),
  courseId: integer("course_id").references(() => courses.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  sessionDate: date("session_date").notNull(),
  plannedStartTime: text("planned_start_time"), // "09:00"
  actualStartTime: timestamp("actual_start_time"),
  plannedEndTime: text("planned_end_time"), // "10:30"
  actualEndTime: timestamp("actual_end_time"),
  durationMinutes: integer("duration_minutes").default(0),
  wasPlanned: boolean("was_planned").default(true), // Was this session part of the schedule?
  completionRate: integer("completion_rate").default(0), // 0-100 how much of planned content was completed
  focusScore: integer("focus_score"), // Self-reported focus level 1-5
  difficultyScore: integer("difficulty_score"), // Self-reported difficulty 1-5
  notes: text("notes"), // User notes about the session
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Study program insert schemas (after table definitions)
export const insertStudyProgramSchema = createInsertSchema(studyPrograms).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertProgramScheduleSchema = createInsertSchema(programSchedules).omit({ 
  id: true 
});

export const insertUserProgramProgressSchema = createInsertSchema(userProgramProgress).omit({ 
  id: true, 
  startedAt: true, 
  lastAccessedAt: true, 
  completedAt: true 
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Mentor = typeof mentors.$inferSelect;
export type UserMentor = typeof userMentors.$inferSelect;
export type StudyProgram = typeof studyPrograms.$inferSelect;
export type ProgramSchedule = typeof programSchedules.$inferSelect;
export type UserProgramProgress = typeof userProgramProgress.$inferSelect;
export type StudySession = typeof studySessions.$inferSelect;

// Insert Types for new tables
export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type InsertUserMentor = z.infer<typeof insertUserMentorSchema>;
export type InsertStudyProgram = z.infer<typeof insertStudyProgramSchema>;
export type InsertProgramSchedule = z.infer<typeof insertProgramScheduleSchema>;
export type InsertUserProgramProgress = z.infer<typeof insertUserProgramProgressSchema>;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

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

// Challenge Learning Paths
export const challengeLearningPaths = pgTable("challenge_learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedHours: integer("estimated_hours").default(0),
  prerequisites: text("prerequisites").array().default([]),
  tags: text("tags").array().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challengePathSteps = pgTable("challenge_path_steps", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").references(() => challengeLearningPaths.id, { onDelete: "cascade" }),
  challengeId: integer("challenge_id").references(() => skillChallenges.id, { onDelete: "cascade" }),
  stepOrder: integer("step_order").notNull(),
  isRequired: boolean("is_required").default(true),
  unlockConditions: text("unlock_conditions").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  pathId: integer("path_id").references(() => challengeLearningPaths.id, { onDelete: "cascade" }),
  currentStep: integer("current_step").default(0),
  completedSteps: integer("completed_steps").array().default([]),
  totalScore: integer("total_score").default(0),
  completionPercentage: integer("completion_percentage").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

// Insert schemas for challenge learning paths
export const insertChallengeLearningPathSchema = createInsertSchema(challengeLearningPaths);
export const insertChallengePathStepSchema = createInsertSchema(challengePathSteps);
export const insertUserChallengeProgressSchema = createInsertSchema(userChallengeProgress);

// Challenge Learning Path types
export type ChallengeLearningPath = typeof challengeLearningPaths.$inferSelect;
export type InsertChallengeLearningPath = z.infer<typeof insertChallengeLearningPathSchema>;
export type ChallengePathStep = typeof challengePathSteps.$inferSelect;
export type InsertChallengePathStep = z.infer<typeof insertChallengePathStepSchema>;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertUserChallengeProgress = z.infer<typeof insertUserChallengeProgressSchema>;

// Learning Milestones and Emoji Reactions tables
export const learningMilestones = pgTable("learning_milestones", {
  id: varchar("id", { length: 50 }).primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'course_completion', 'lesson_completion', etc.
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id").references(() => courses.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  progress: integer("progress"),
  metadata: jsonb("metadata"), // Additional context data
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emojiReactions = pgTable("emoji_reactions", {
  id: varchar("id", { length: 50 }).primaryKey(),
  milestoneId: varchar("milestone_id", { length: 50 }).references(() => learningMilestones.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  aiContext: text("ai_context"), // AI-generated context for the emoji
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});



// Insert schemas
export const insertLearningMilestoneSchema = createInsertSchema(learningMilestones);
export const insertEmojiReactionSchema = createInsertSchema(emojiReactions);

// Types for Learning Milestones and Emoji Reactions
export type LearningMilestone = typeof learningMilestones.$inferSelect;

// Study Planning Tables
export const studyGoals = pgTable("study_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  goalType: text("goal_type").notNull(),
  targetExam: text("target_exam"),
  targetDate: date("target_date").notNull(),
  studyHoursPerWeek: integer("study_hours_per_week").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull().default("active"),
  subjects: text("subjects").array().default([]),
  currentProgress: integer("current_progress").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const studySchedules = pgTable("study_schedules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  goalId: integer("goal_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  subject: text("subject").notNull(),
  lessonId: integer("lesson_id"),
  isCompleted: boolean("is_completed").notNull().default(false),
  scheduledDate: date("scheduled_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const learningRecommendations = pgTable("learning_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  actionRequired: boolean("action_required").notNull().default(false),
  priority: text("priority").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studyProgress = pgTable("study_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  goalId: integer("goal_id").notNull(),
  date: date("date").notNull(),
  hoursStudied: integer("hours_studied").notNull().default(0),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  performanceScore: integer("performance_score"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Level Assessment System Tables
export const levelAssessments = pgTable("level_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject").notNull(), // Mathematics, Programming, English, etc.
  subCategory: text("sub_category"), // Algebra, JavaScript, Grammar, etc.
  assessmentType: text("assessment_type").notNull().default("skill_level"), // skill_level, placement, diagnostic
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  totalQuestions: integer("total_questions").notNull().default(10),
  correctAnswers: integer("correct_answers").notNull().default(0),
  timeSpentMinutes: integer("time_spent_minutes").notNull().default(0),
  finalLevel: text("final_level"), // beginner, intermediate, advanced
  confidenceScore: integer("confidence_score").default(75), // 0-100 AI confidence in level determination
  recommendedNextSteps: jsonb("recommended_next_steps").default([]), // AI recommendations
  status: text("status").notNull().default("in_progress"), // in_progress, completed, abandoned
  language: text("language").notNull().default("en"), // en, tr for language-specific assessments
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const assessmentQuestions = pgTable("assessment_questions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull().references(() => levelAssessments.id),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull().default("multiple_choice"), // multiple_choice, true_false, open_ended
  options: jsonb("options").default([]), // For multiple choice questions
  correctAnswer: text("correct_answer").notNull(),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct"),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  skillArea: text("skill_area"), // specific skill being tested
  timeSpentSeconds: integer("time_spent_seconds").default(0),
  aiGenerated: boolean("ai_generated").default(true),
  explanation: text("explanation"), // AI-generated explanation of correct answer
});

export const userSkillLevels = pgTable("user_skill_levels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject").notNull(),
  subCategory: text("sub_category"),
  currentLevel: text("current_level").notNull(), // beginner, intermediate, advanced
  proficiencyScore: integer("proficiency_score").notNull(), // 0-100
  lastAssessmentId: integer("last_assessment_id").references(() => levelAssessments.id),
  assessmentCount: integer("assessment_count").notNull().default(1),
  improvementRate: numeric("improvement_rate", { precision: 5, scale: 2 }).default("0.00"), // Track learning velocity
  strongAreas: text("strong_areas").array().default([]), // Areas where user excels
  weakAreas: text("weak_areas").array().default([]), // Areas needing improvement
  nextRecommendedLevel: text("next_recommended_level"), // What level to work toward
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Subscription and Payment Management
export const subscriptionPlans = pgTable("subscription_plans", {
  id: text("id").primaryKey(), // "free", "premium"  
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  stripePriceId: text("stripe_price_id"),
  features: jsonb("features").notNull(), // Array of feature names/limits
  assessmentLimit: integer("assessment_limit").default(-1), // -1 = unlimited, 0+ = daily limit
  courseAccessLimit: integer("course_access_limit").default(-1), // -1 = unlimited
  analyticsLevel: text("analytics_level").notNull().default("basic"), // basic, detailed, advanced
  aiRecommendations: boolean("ai_recommendations").default(false),
  priority: integer("priority").notNull().default(0), // Display order (higher = premium)
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: text("plan_id").notNull(),
  status: text("status").notNull().default("active"), // active, cancelled, expired, trial
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  trialEndsAt: timestamp("trial_ends_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Usage tracking for subscription limits
export const userUsageTracking = pgTable("user_usage_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull().defaultNow(),
  assessmentsUsed: integer("assessments_used").notNull().default(0),
  coursesAccessed: integer("courses_accessed").notNull().default(0),
  analyticsViews: integer("analytics_views").notNull().default(0),
  aiRecommendationsGenerated: integer("ai_recommendations_generated").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStudyGoal = createInsertSchema(studyGoals);
export const insertStudySchedule = createInsertSchema(studySchedules);
export const insertLearningRecommendation = createInsertSchema(learningRecommendations);
export const insertStudyProgress = createInsertSchema(studyProgress);

// Assessment system insert schemas
export const insertLevelAssessment = createInsertSchema(levelAssessments).omit({ 
  id: true, 
  createdAt: true, 
  completedAt: true 
});
export const insertAssessmentQuestion = createInsertSchema(assessmentQuestions).omit({ 
  id: true 
});
export const insertUserSkillLevel = createInsertSchema(userSkillLevels).omit({ 
  id: true, 
  createdAt: true, 
  lastUpdated: true 
});

// Subscription system insert schemas
export const insertSubscriptionPlan = createInsertSchema(subscriptionPlans).omit({ 
  createdAt: true 
});
export const insertUserSubscription = createInsertSchema(userSubscriptions).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertUserUsageTracking = createInsertSchema(userUsageTracking).omit({ 
  id: true, 
  createdAt: true 
});

export type StudyGoal = typeof studyGoals.$inferSelect;
export type StudySchedule = typeof studySchedules.$inferSelect;
export type LearningRecommendation = typeof learningRecommendations.$inferSelect;
export type StudyProgress = typeof studyProgress.$inferSelect;

// Assessment system types
export type LevelAssessment = typeof levelAssessments.$inferSelect;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type UserSkillLevel = typeof userSkillLevels.$inferSelect;
export type InsertLevelAssessment = z.infer<typeof insertLevelAssessment>;
export type InsertAssessmentQuestion = z.infer<typeof insertAssessmentQuestion>;
export type InsertUserSkillLevel = z.infer<typeof insertUserSkillLevel>;

// Subscription system types
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type UserUsageTracking = typeof userUsageTracking.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlan>;
export type InsertUserSubscription = z.infer<typeof insertUserSubscription>;
export type InsertUserUsageTracking = z.infer<typeof insertUserUsageTracking>;

export type InsertLearningMilestone = z.infer<typeof insertLearningMilestoneSchema>;
export type EmojiReaction = typeof emojiReactions.$inferSelect;
export type InsertEmojiReaction = z.infer<typeof insertEmojiReactionSchema>;

// TYT Study Planning type exports
export type TytStudentProfile = typeof tytStudentProfiles.$inferSelect;
export type TytSubject = typeof tytSubjects.$inferSelect;
export type TytTopic = typeof tytTopics.$inferSelect;
export type UserTopicProgress = typeof userTopicProgress.$inferSelect;
export type TytTrialExam = typeof tytTrialExams.$inferSelect;
export type DailyStudyTask = typeof dailyStudyTasks.$inferSelect;
export type TytStudySession = typeof tytStudySessions.$inferSelect;
export type TytStudyGoal = typeof tytStudyGoals.$inferSelect;
export type TytStudyStreak = typeof tytStudyStreaks.$inferSelect;

// TYT Insert type exports
export type InsertTytStudentProfile = z.infer<typeof insertTytStudentProfileSchema>;
export type InsertTytSubject = z.infer<typeof insertTytSubjectSchema>;
export type InsertTytTopic = z.infer<typeof insertTytTopicSchema>;
export type InsertUserTopicProgress = z.infer<typeof insertUserTopicProgressSchema>;
export type InsertTytTrialExam = z.infer<typeof insertTytTrialExamSchema>;
export type InsertDailyStudyTask = z.infer<typeof insertDailyStudyTaskSchema>;
export type InsertTytStudySession = z.infer<typeof insertTytStudySessionSchema>;
export type InsertTytStudyGoal = z.infer<typeof insertTytStudyGoalSchema>;
export type InsertTytStudyStreak = z.infer<typeof insertTytStudyStreakSchema>;

// AI-Driven Curriculum System type exports
export type CourseCurriculum = typeof courseCurriculums.$inferSelect;
export type CurriculumSkill = typeof curriculumSkills.$inferSelect;
export type CurriculumModule = typeof curriculumModules.$inferSelect;
export type UserCurriculum = typeof userCurriculums.$inferSelect;
export type UserCurriculumTask = typeof userCurriculumTasks.$inferSelect;
export type UserSkillProgress = typeof userSkillProgress.$inferSelect;
export type CurriculumCheckpoint = typeof curriculumCheckpoints.$inferSelect;
export type SkillAssessment = typeof skillAssessments.$inferSelect;

// AI-Driven Curriculum Insert type exports
export type InsertCourseCurriculum = z.infer<typeof insertCourseCurriculumSchema>;
export type InsertCurriculumSkill = z.infer<typeof insertCurriculumSkillSchema>;
export type InsertCurriculumModule = z.infer<typeof insertCurriculumModuleSchema>;
export type InsertUserCurriculum = z.infer<typeof insertUserCurriculumSchema>;
export type InsertUserCurriculumTask = z.infer<typeof insertUserCurriculumTaskSchema>;
export type InsertUserSkillProgress = z.infer<typeof insertUserSkillProgressSchema>;
export type InsertCurriculumCheckpoint = z.infer<typeof insertCurriculumCheckpointSchema>;
export type InsertSkillAssessment = z.infer<typeof insertSkillAssessmentSchema>;

// New module type exports
export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Essay = typeof essays.$inferSelect;
export type InsertEssay = z.infer<typeof insertEssaySchema>;
export type WeeklyStudyPlan = typeof weeklyStudyPlans.$inferSelect;
export type InsertWeeklyStudyPlan = z.infer<typeof insertWeeklyStudyPlanSchema>;

// Course category type exports
export const insertCourseCategorySchema = createInsertSchema(courseCategories).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type CourseCategory = typeof courseCategories.$inferSelect;
export type InsertCourseCategory = z.infer<typeof insertCourseCategorySchema>;

// New Time Tracking & Analytics insert schemas and type exports
export const insertDailyStudyGoalSchema = createInsertSchema(dailyStudyGoals).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudyHabitSchema = createInsertSchema(studyHabits).omit({ id: true, createdAt: true });
export const insertTytResourceSchema = createInsertSchema(tytResources).omit({ id: true, createdAt: true });
export const insertAiDailyPlanSchema = createInsertSchema(aiDailyPlans).omit({ id: true, createdAt: true, generatedAt: true });
export const insertDailyStudySessionSchema = createInsertSchema(dailyStudySessions).omit({ id: true, createdAt: true });

export type DailyStudyGoal = typeof dailyStudyGoals.$inferSelect;
export type StudyHabit = typeof studyHabits.$inferSelect;
export type TytResource = typeof tytResources.$inferSelect;
export type AiDailyPlan = typeof aiDailyPlans.$inferSelect;
export type DailyStudySession = typeof dailyStudySessions.$inferSelect;
export type InsertDailyStudyGoal = z.infer<typeof insertDailyStudyGoalSchema>;
export type InsertStudyHabit = z.infer<typeof insertStudyHabitSchema>;
export type InsertTytResource = z.infer<typeof insertTytResourceSchema>;
export type InsertAiDailyPlan = z.infer<typeof insertAiDailyPlanSchema>;
export type InsertDailyStudySession = z.infer<typeof insertDailyStudySessionSchema>;

// Forum System insert schemas and type exports
export const insertForumPostSchema = createInsertSchema(forumPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertForumCommentSchema = createInsertSchema(forumComments).omit({ id: true, createdAt: true, updatedAt: true });

export type ForumPost = typeof forumPosts.$inferSelect;
export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;

// Certificate System insert schemas and type exports
export const insertCertificateSchema = createInsertSchema(certificates, {
  issueDate: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

// AI Logging insert schemas and type exports
export const insertAiConceptLogSchema = createInsertSchema(aiConceptLogs).omit({ id: true, createdAt: true });
export const insertAiStudyTipsLogSchema = createInsertSchema(aiStudyTipsLogs).omit({ id: true, createdAt: true });
export const insertAiReviewLogSchema = createInsertSchema(aiReviewLogs).omit({ id: true, createdAt: true });

export type AiConceptLog = typeof aiConceptLogs.$inferSelect;
export type InsertAiConceptLog = z.infer<typeof insertAiConceptLogSchema>;
export type AiStudyTipsLog = typeof aiStudyTipsLogs.$inferSelect;
export type InsertAiStudyTipsLog = z.infer<typeof insertAiStudyTipsLogSchema>;
export type AiReviewLog = typeof aiReviewLogs.$inferSelect;
export type InsertAiReviewLog = z.infer<typeof insertAiReviewLogSchema>;
