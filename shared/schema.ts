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

// AI Logging tables
export const aiConceptLogs = pgTable("ai_concept_logs", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), createdAt: timestamp("created_at").notNull().defaultNow() });
export const aiStudyTipsLogs = pgTable("ai_study_tips_logs", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), createdAt: timestamp("created_at").notNull().defaultNow() });
export const aiReviewLogs = pgTable("ai_review_logs", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), createdAt: timestamp("created_at").notNull().defaultNow() });

// AI Data Flow tables (Step 6.1)
export const aiCurriculumGenerationSessions = pgTable("ai_curriculum_generation_sessions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), createdAt: timestamp("created_at").notNull().defaultNow() });
export const curriculumProductionArchives = pgTable("curriculum_production_archives", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), createdAt: timestamp("created_at").notNull().defaultNow() });
export const aiLearningData = pgTable("ai_learning_data", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), createdAt: timestamp("created_at").notNull().defaultNow() });

// Additional system tables for backward compatibility
export const tytStudentProfiles = pgTable("tyt_student_profiles", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const tytSubjects = pgTable("tyt_subjects", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const tytTopics = pgTable("tyt_topics", { id: serial("id").primaryKey(), subjectId: integer("subject_id").notNull() });
export const userTopicProgress = pgTable("user_topic_progress", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const tytTrialExams = pgTable("tyt_trial_exams", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const tytStudySessions = pgTable("tyt_study_sessions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const tytStudyGoals = pgTable("tyt_study_goals", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const tytStudyStreaks = pgTable("tyt_study_streaks", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const dailyStudyGoals = pgTable("daily_study_goals", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const studyHabits = pgTable("study_habits", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const tytResources = pgTable("tyt_resources", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const aiDailyPlans = pgTable("ai_daily_plans", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const courseCurriculums = pgTable("course_curriculums", { id: serial("id").primaryKey(), courseId: integer("course_id").notNull() });
export const curriculumSkills = pgTable("curriculum_skills", { id: serial("id").primaryKey(), curriculumId: integer("curriculum_id").notNull() });
export const curriculumModules = pgTable("curriculum_modules", { id: serial("id").primaryKey(), curriculumId: integer("curriculum_id").notNull() });
export const userCurriculums = pgTable("user_curriculums", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const userCurriculumTasks = pgTable("user_curriculum_tasks", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const userSkillProgress = pgTable("user_skill_progress", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const curriculumCheckpoints = pgTable("curriculum_checkpoints", { id: serial("id").primaryKey(), curriculumId: integer("curriculum_id").notNull() });
export const skillAssessments = pgTable("skill_assessments", { id: serial("id").primaryKey(), skillId: integer("skill_id") });
export const essays = pgTable("essays", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const uploads = pgTable("uploads", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const weeklyStudyPlans = pgTable("weekly_study_plans", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const forumPosts = pgTable("forum_posts", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const forumComments = pgTable("forum_comments", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const certificates = pgTable("certificates", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const dailyStudySessions = pgTable("daily_study_sessions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const studyProgress = pgTable("study_progress", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const learningRecommendations = pgTable("learning_recommendations", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });

// Insert schema stubs for backward compatibility
export const insertTytStudentProfileSchema = z.object({ userId: z.number() });
export const insertTytSubjectSchema = z.object({ title: z.string() });
export const insertTytTopicSchema = z.object({ subjectId: z.number() });
export const insertUserTopicProgressSchema = z.object({ userId: z.number() });
export const insertTytTrialExamSchema = z.object({ userId: z.number() });
export const insertDailyStudyTaskSchema = z.object({ userId: z.number() });
export const insertTytStudySessionSchema = z.object({ userId: z.number() });
export const insertTytStudyGoalSchema = z.object({ userId: z.number() });
export const insertTytStudyStreakSchema = z.object({ userId: z.number() });
export const insertDailyStudyGoalSchema = z.object({ userId: z.number() });
export const insertStudyHabitSchema = z.object({ userId: z.number() });
export const insertTytResourceSchema = z.object({ title: z.string() });
export const insertAiDailyPlanSchema = z.object({ userId: z.number() });
export const insertCourseCurriculumSchema = z.object({ courseId: z.number() });
export const insertCurriculumSkillSchema = z.object({ curriculumId: z.number() });
export const insertCurriculumModuleSchema = z.object({ curriculumId: z.number() });
export const insertUserCurriculumSchema = z.object({ userId: z.number() });
export const insertUserCurriculumTaskSchema = z.object({ userId: z.number() });
export const insertUserSkillProgressSchema = z.object({ userId: z.number() });
export const insertCurriculumCheckpointSchema = z.object({ curriculumId: z.number() });
export const insertSkillAssessmentSchema = z.object({ skillId: z.number().optional() });
export const insertEssaySchema = z.object({ userId: z.number() });
export const insertUploadSchema = z.object({ userId: z.number() });
export const insertWeeklyStudyPlanSchema = z.object({ userId: z.number() });
export const insertForumPostSchema = z.object({ userId: z.number() });
export const insertForumCommentSchema = z.object({ userId: z.number() });
export const insertCertificateSchema = z.object({ userId: z.number() });
export const insertDailyStudySessionSchema = z.object({ userId: z.number() });
export const insertAiConceptLogSchema = z.object({ userId: z.number() });
export const insertAiStudyTipsLogSchema = z.object({ userId: z.number() });
export const insertAiReviewLogSchema = z.object({ userId: z.number() });
export const insertAiCurriculumGenerationSessionSchema = z.object({ userId: z.number() });
export const insertCurriculumProductionArchiveSchema = z.object({ userId: z.number() });
export const insertAiLearningDataSchema = z.object({ userId: z.number() });

// Type stubs for backward compatibility
export type TytStudentProfile = typeof tytStudentProfiles.$inferSelect;
export type InsertTytStudentProfile = z.infer<typeof insertTytStudentProfileSchema>;
export type TytSubject = typeof tytSubjects.$inferSelect;
export type InsertTytSubject = z.infer<typeof insertTytSubjectSchema>;
export type TytTopic = typeof tytTopics.$inferSelect;
export type InsertTytTopic = z.infer<typeof insertTytTopicSchema>;
export type UserTopicProgress = typeof userTopicProgress.$inferSelect;
export type InsertUserTopicProgress = z.infer<typeof insertUserTopicProgressSchema>;
export type TytTrialExam = typeof tytTrialExams.$inferSelect;
export type InsertTytTrialExam = z.infer<typeof insertTytTrialExamSchema>;
export type DailyStudyTask = typeof dailyStudyTasks.$inferSelect;
export type InsertDailyStudyTask = z.infer<typeof insertDailyStudyTaskSchema>;
export type TytStudySession = typeof tytStudySessions.$inferSelect;
export type InsertTytStudySession = z.infer<typeof insertTytStudySessionSchema>;
export type TytStudyGoal = typeof tytStudyGoals.$inferSelect;
export type InsertTytStudyGoal = z.infer<typeof insertTytStudyGoalSchema>;
export type TytStudyStreak = typeof tytStudyStreaks.$inferSelect;
export type InsertTytStudyStreak = z.infer<typeof insertTytStudyStreakSchema>;
export type DailyStudyGoal = typeof dailyStudyGoals.$inferSelect;
export type InsertDailyStudyGoal = z.infer<typeof insertDailyStudyGoalSchema>;
export type StudyHabit = typeof studyHabits.$inferSelect;
export type InsertStudyHabit = z.infer<typeof insertStudyHabitSchema>;
export type TytResource = typeof tytResources.$inferSelect;
export type InsertTytResource = z.infer<typeof insertTytResourceSchema>;
export type AiDailyPlan = typeof aiDailyPlans.$inferSelect;
export type InsertAiDailyPlan = z.infer<typeof insertAiDailyPlanSchema>;
export type CourseCurriculum = typeof courseCurriculums.$inferSelect;
export type InsertCourseCurriculum = z.infer<typeof insertCourseCurriculumSchema>;
export type CurriculumSkill = typeof curriculumSkills.$inferSelect;
export type InsertCurriculumSkill = z.infer<typeof insertCurriculumSkillSchema>;
export type CurriculumModule = typeof curriculumModules.$inferSelect;
export type InsertCurriculumModule = z.infer<typeof insertCurriculumModuleSchema>;
export type UserCurriculum = typeof userCurriculums.$inferSelect;
export type InsertUserCurriculum = z.infer<typeof insertUserCurriculumSchema>;
export type UserCurriculumTask = typeof userCurriculumTasks.$inferSelect;
export type InsertUserCurriculumTask = z.infer<typeof insertUserCurriculumTaskSchema>;
export type UserSkillProgress = typeof userSkillProgress.$inferSelect;
export type InsertUserSkillProgress = z.infer<typeof insertUserSkillProgressSchema>;
export type CurriculumCheckpoint = typeof curriculumCheckpoints.$inferSelect;
export type InsertCurriculumCheckpoint = z.infer<typeof insertCurriculumCheckpointSchema>;
export type SkillAssessment = typeof skillAssessments.$inferSelect;
export type InsertSkillAssessment = z.infer<typeof insertSkillAssessmentSchema>;
export type Essay = typeof essays.$inferSelect;
export type InsertEssay = z.infer<typeof insertEssaySchema>;
export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type WeeklyStudyPlan = typeof weeklyStudyPlans.$inferSelect;
export type InsertWeeklyStudyPlan = z.infer<typeof insertWeeklyStudyPlanSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type DailyStudySession = typeof dailyStudySessions.$inferSelect;
export type InsertDailyStudySession = z.infer<typeof insertDailyStudySessionSchema>;
export type AiConceptLog = typeof aiConceptLogs.$inferSelect;
export type InsertAiConceptLog = z.infer<typeof insertAiConceptLogSchema>;
export type AiStudyTipsLog = typeof aiStudyTipsLogs.$inferSelect;
export type InsertAiStudyTipsLog = z.infer<typeof insertAiStudyTipsLogSchema>;
export type AiReviewLog = typeof aiReviewLogs.$inferSelect;
export type InsertAiReviewLog = z.infer<typeof insertAiReviewLogSchema>;
export type AiCurriculumGenerationSession = typeof aiCurriculumGenerationSessions.$inferSelect;
export type InsertAiCurriculumGenerationSession = z.infer<typeof insertAiCurriculumGenerationSessionSchema>;
export type CurriculumProductionArchive = typeof curriculumProductionArchives.$inferSelect;
export type InsertCurriculumProductionArchive = z.infer<typeof insertCurriculumProductionArchiveSchema>;
export type AiLearningDataRecord = typeof aiLearningData.$inferSelect;
export type InsertAiLearningData = z.infer<typeof insertAiLearningDataSchema>;

// Missing system tables - Subscription & Goals
export const subscriptionPlans = pgTable("subscription_plans", { id: serial("id").primaryKey(), name: text("name").notNull() });
export const userSubscriptions = pgTable("user_subscriptions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const userUsageTracking = pgTable("user_usage_tracking", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const userGoals = pgTable("user_goals", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), goalText: text("goal_text").notNull() });
export const userInterests = pgTable("user_interests", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), interest: text("interest").notNull() });
export const studyPlans = pgTable("study_plans", { id: serial("id").primaryKey(), userId: integer("user_id").notNull(), title: text("title").notNull() });
export const studyMilestones = pgTable("study_milestones", { id: serial("id").primaryKey(), planId: integer("plan_id").notNull() });
export const courseSuggestions = pgTable("course_suggestions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const goalSuggestions = pgTable("goal_suggestions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const aiProfiles = pgTable("ai_profiles", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const aiSuggestions = pgTable("ai_suggestions", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const enhancedInteractionLogs = pgTable("enhanced_interaction_logs", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });
export const skillChallenges = pgTable("skill_challenges", { id: serial("id").primaryKey(), title: text("title").notNull() });
export const reminders = pgTable("reminders", { id: serial("id").primaryKey(), userId: integer("user_id").notNull() });

// Insert schemas for missing tables
export const insertSubscriptionPlanSchema = z.object({ name: z.string() });
export const insertUserSubscriptionSchema = z.object({ userId: z.number() });
export const insertUserUsageTrackingSchema = z.object({ userId: z.number() });
export const insertUserGoalSchema = z.object({ userId: z.number(), goalText: z.string() });
export const insertUserInterestSchema = z.object({ userId: z.number(), interest: z.string() });
export const insertStudyPlanSchema = z.object({ userId: z.number(), title: z.string() });
export const insertStudyMilestoneSchema = z.object({ planId: z.number() });
export const insertCourseSuggestionSchema = z.object({ userId: z.number() });
export const insertGoalSuggestionSchema = z.object({ userId: z.number() });
export const insertAiProfileSchema = z.object({ userId: z.number() });
export const insertAiSuggestionSchema = z.object({ userId: z.number() });
export const insertEnhancedInteractionLogSchema = z.object({ userId: z.number() });
export const insertSkillChallengeSchema = z.object({ title: z.string() });
export const insertReminderSchema = z.object({ userId: z.number() });

// Types for missing tables
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserUsageTracking = typeof userUsageTracking.$inferSelect;
export type InsertUserUsageTracking = z.infer<typeof insertUserUsageTrackingSchema>;
export type UserGoal = typeof userGoals.$inferSelect;
export type InsertUserGoal = z.infer<typeof insertUserGoalSchema>;
export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = z.infer<typeof insertUserInterestSchema>;
export type StudyPlan = typeof studyPlans.$inferSelect;
export type InsertStudyPlan = z.infer<typeof insertStudyPlanSchema>;
export type StudyMilestone = typeof studyMilestones.$inferSelect;
export type InsertStudyMilestone = z.infer<typeof insertStudyMilestoneSchema>;
export type CourseSuggestion = typeof courseSuggestions.$inferSelect;
export type InsertCourseSuggestion = z.infer<typeof insertCourseSuggestionSchema>;
export type GoalSuggestion = typeof goalSuggestions.$inferSelect;
export type InsertGoalSuggestion = z.infer<typeof insertGoalSuggestionSchema>;
export type AiProfile = typeof aiProfiles.$inferSelect;
export type InsertAiProfile = z.infer<typeof insertAiProfileSchema>;
export type AiSuggestion = typeof aiSuggestions.$inferSelect;
export type InsertAiSuggestion = z.infer<typeof insertAiSuggestionSchema>;
export type EnhancedInteractionLog = typeof enhancedInteractionLogs.$inferSelect;
export type InsertEnhancedInteractionLog = z.infer<typeof insertEnhancedInteractionLogSchema>;
export type SkillChallenge = typeof skillChallenges.$inferSelect;
export type InsertSkillChallenge = z.infer<typeof insertSkillChallengeSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

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
