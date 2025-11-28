import { pgTable, serial, text, integer, boolean, timestamp, decimal, json, varchar, numeric, smallint, date, real, unique, primaryKey, foreignKey, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// CORE TABLES
// ============================================================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("student"), // student, instructor, admin
  interests: text("interests").array().default([]),
  learningPace: text("learning_pace").default("moderate"), // slow, moderate, fast
  profileComplete: boolean("profile_complete").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionTr: text("description_tr").notNull().default(""),
  category: text("category").notNull(),
  categoryId: integer("category_id"),
  imageUrl: text("image_url"),
  moduleCount: integer("module_count").notNull().default(1),
  durationHours: integer("duration_hours"),
  instructorId: integer("instructor_id").notNull(),
  rating: integer("rating"),
  level: text("level"),
  isAiGenerated: boolean("is_ai_generated").default(false),
  price: numeric("price", { precision: 10, scale: 2 }).default("0.00"),
  isPremium: boolean("is_premium").default(false),
  stripePriceId: text("stripe_price_id"),
  parentCourseId: integer("parent_course_id"),
  depth: integer("depth").notNull().default(0),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionTr: text("description_tr").notNull().default(""),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  titleEn: text("title_en").notNull().default(""),
  titleTr: text("title_tr").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  contentTr: text("content_tr").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionTr: text("description_tr").notNull().default(""),
  order: integer("order").notNull(),
  durationMinutes: integer("duration_minutes").default(30),
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
  description: text("description"),
  courseId: integer("course_id").notNull(),
  points: integer("points").default(0),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// STUDY PLANNING & CURRICULUM TABLES
// ============================================================================

export const studyGoals = pgTable("study_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  goal: text("goal").notNull(),
  dueDate: date("due_date"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studySchedules = pgTable("study_schedules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id"),
  weeklyHours: smallint("weekly_hours").default(5),
  sessionCount: smallint("session_count").default(3),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  courses: integer("courses").array(),
  completion: smallint("completion").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const memoryEnhancedCurricula = pgTable("memory_enhanced_curricula", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  baseCurriculumId: integer("base_curriculum_id").notNull(),
  memoryTechniquesApplied: json("memory_techniques_applied"),
  spacedRepetitionSchedule: json("spaced_repetition_schedule"),
  mnemonicMappings: json("mnemonic_mappings"),
  cognitiveBreakPoints: json("cognitive_break_points"),
  predictedRetentionRate: text("predicted_retention_rate"),
  personalizationScore: real("personalization_score"),
  completionRate: real("completion_rate").default(0),
  studyDuration: integer("study_duration"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================================
// INTEGRATION & ORCHESTRATION TABLES (Step 1.2)
// ============================================================================

export const courseIntegrationState = pgTable("course_integration_state", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseIds: integer("course_ids").array(),
  curriculumIntegrated: boolean("curriculum_integrated").default(false),
  studyPlanGenerated: boolean("study_plan_generated").default(false),
  assignmentsCreated: boolean("assignments_created").default(false),
  targetsUpdated: boolean("targets_updated").default(false),
  aiRecommendationsGenerated: boolean("ai_recommendations_generated").default(false),
  integrationStatus: text("integration_status").default("pending"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const moduleIntegrationLog = pgTable("module_integration_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  integrationId: text("integration_id").notNull(),
  module: text("module").notNull(),
  action: text("action").notNull(),
  status: text("status").notNull(),
  details: json("details"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const aiRecommendationState = pgTable("ai_recommendation_state", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recommendationType: text("recommendation_type").notNull(),
  recommendedItems: json("recommended_items"),
  confidenceScore: real("confidence_score"),
  reason: text("reason"),
  applied: boolean("applied").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// STEP 6.1: COMPREHENSIVE INTEGRATION MODELS
// ============================================================================

export const learningEcosystemState = pgTable("learning_ecosystem_state", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  activeCourses: json("active_courses"),
  currentCurriculum: json("current_curriculum"),
  activeStudyPlan: json("active_study_plan"),
  pendingAssignments: json("pending_assignments"),
  activeTargets: json("active_targets"),
  aiRecommendations: json("ai_recommendations"),
  lastEcosystemUpdate: timestamp("last_ecosystem_update").notNull().defaultNow(),
  ecosystemVersion: varchar("ecosystem_version", { length: 50 }).default("1.0.0"),
  synchronizationStatus: json("synchronization_status"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const moduleDependencyGraph = pgTable("module_dependency_graph", {
  id: serial("id").primaryKey(),
  sourceModule: varchar("source_module", { length: 100 }).notNull(),
  targetModule: varchar("target_module", { length: 100 }).notNull(),
  dependencyType: varchar("dependency_type", { length: 50 }).notNull(), // data, trigger, sequence
  dependencyStrength: real("dependency_strength").notNull().default(1), // 0-1 scale
  required: boolean("required").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  unique: unique().on(table.sourceModule, table.targetModule),
}));

export const aiIntegrationLog = pgTable("ai_integration_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  integrationTrigger: varchar("integration_trigger", { length: 100 }).notNull(),
  aiModelUsed: varchar("ai_model_used", { length: 100 }).notNull(),
  inputData: json("input_data"),
  aiDecision: json("ai_decision"),
  confidenceScore: real("confidence_score"),
  executionResult: json("execution_result"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// ADDITIONAL SYSTEM TABLES
// ============================================================================

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  completed: boolean("completed").default(false),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at"),
});

export const dailyTasks = pgTable("daily_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id"),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courseCategories = pgTable("course_categories", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameTr: text("name_tr").notNull(),
  descriptionEn: text("description_en"),
  descriptionTr: text("description_tr"),
  order: integer("order").default(0),
});

export const learningPathSteps = pgTable("learning_path_steps", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull(),
  stepOrder: integer("step_order").notNull(),
  courseId: integer("course_id"),
  title: text("title").notNull(),
  description: text("description"),
});

// Stub tables for backward compatibility
export const badges = pgTable("badges", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const userBadges = pgTable("user_badges", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const courseRecommendations = pgTable("course_recommendations", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const userActivityLogs = pgTable("user_activity_logs", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const courseAnalytics = pgTable("course_analytics", { id: serial("id").primaryKey(), courseId: integer("course_id").notNull() });
export const userProgressSnapshots = pgTable("user_progress_snapshots", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const userLevels = pgTable("user_levels", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const leaderboards = pgTable("leaderboards", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const leaderboardEntries = pgTable("leaderboard_entries", { id: serial("id").primaryKey(), leaderboardId: integer("leaderboard_id").notNull() });
export const lessonTrails = pgTable("lesson_trails", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const trailNodes = pgTable("trail_nodes", { id: serial("id").primaryKey(), trailId: integer("trail_id").notNull() });
export const userTrailProgress = pgTable("user_trail_progress", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const personalizedRecommendations = pgTable("personalized_recommendations", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const learningAnalytics = pgTable("learning_analytics", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const learningMilestones = pgTable("learning_milestones", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const emojiReactions = pgTable("emoji_reactions", { id: serial("id").primaryKey(), emoji: text("emoji").notNull() });
export const mentors = pgTable("mentors", { id: serial("id").primaryKey(), name: text("name").notNull() });
export const userMentors = pgTable("user_mentors", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const studyPrograms = pgTable("study_programs", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const programSchedules = pgTable("program_schedules", { id: serial("id").primaryKey(), programId: integer("program_id").notNull() });
export const userProgramProgress = pgTable("user_program_progress", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const studySessions = pgTable("study_sessions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const levelAssessments = pgTable("level_assessments", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const assessmentQuestions = pgTable("assessment_questions", { id: serial("id").primaryKey(), assessmentId: integer("assessment_id").notNull() });
export const userSkillLevels = pgTable("user_skill_levels", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const userAssignments = pgTable("user_assignments", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const dailyStudyTasks = pgTable("daily_study_tasks", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });

// ============================================================================
// SCHEMAS & TYPES
// ============================================================================

export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, createdAt: true });
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;

export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export const insertUserCourseSchema = createInsertSchema(userCourses).omit({ id: true, enrolledAt: true });
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;
export type UserCourse = typeof userCourses.$inferSelect;

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({ id: true, createdAt: true });
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;

export const insertStudyGoalSchema = createInsertSchema(studyGoals).omit({ id: true, createdAt: true });
export type InsertStudyGoal = z.infer<typeof insertStudyGoalSchema>;
export type StudyGoal = typeof studyGoals.$inferSelect;

export const insertStudyScheduleSchema = createInsertSchema(studySchedules).omit({ id: true, createdAt: true });
export type InsertStudySchedule = z.infer<typeof insertStudyScheduleSchema>;
export type StudySchedule = typeof studySchedules.$inferSelect;

export const insertLearningEcosystemStateSchema = createInsertSchema(learningEcosystemState).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLearningEcosystemState = z.infer<typeof insertLearningEcosystemStateSchema>;
export type LearningEcosystemState = typeof learningEcosystemState.$inferSelect;

export const insertModuleDependencyGraphSchema = createInsertSchema(moduleDependencyGraph).omit({ id: true, createdAt: true });
export type InsertModuleDependencyGraph = z.infer<typeof insertModuleDependencyGraphSchema>;
export type ModuleDependencyGraph = typeof moduleDependencyGraph.$inferSelect;

export const insertAIIntegrationLogSchema = createInsertSchema(aiIntegrationLog).omit({ id: true, createdAt: true });
export type InsertAIIntegrationLog = z.infer<typeof insertAIIntegrationLogSchema>;
export type AIIntegrationLog = typeof aiIntegrationLog.$inferSelect;
