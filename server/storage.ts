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
  // Course category types
  type CourseCategory,
  type InsertCourseCategory,
  courseCategories,
  insertCourseCategorySchema,
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
  insertUserSkillLevel,
  // TYT Study Planning system imports
  type TytStudentProfile,
  type TytSubject,
  type TytTopic,
  type UserTopicProgress,
  type TytTrialExam,
  type DailyStudyTask,
  type TytStudySession,
  type TytStudyGoal,
  type TytStudyStreak,
  type InsertTytStudentProfile,
  type InsertTytSubject,
  type InsertTytTopic,
  type InsertUserTopicProgress,
  type InsertTytTrialExam,
  type InsertDailyStudyTask,
  type InsertTytStudySession,
  type InsertTytStudyGoal,
  type InsertTytStudyStreak,
  tytStudentProfiles,
  tytSubjects,
  tytTopics,
  userTopicProgress,
  tytTrialExams,
  dailyStudyTasks,
  tytStudySessions,
  tytStudyGoals,
  tytStudyStreaks,
  insertTytStudentProfileSchema,
  insertTytSubjectSchema,
  insertTytTopicSchema,
  insertUserTopicProgressSchema,
  insertTytTrialExamSchema,
  insertDailyStudyTaskSchema,
  insertTytStudySessionSchema,
  insertTytStudyGoalSchema,
  insertTytStudyStreakSchema,
  // New Time Tracking & Analytics types
  type DailyStudyGoal,
  type StudyHabit,
  type TytResource,
  type AiDailyPlan,
  type InsertDailyStudyGoal,
  type InsertStudyHabit,
  type InsertTytResource,
  type InsertAiDailyPlan,
  dailyStudyGoals,
  studyHabits,
  tytResources,
  aiDailyPlans,
  insertDailyStudyGoalSchema,
  insertStudyHabitSchema,
  insertTytResourceSchema,
  insertAiDailyPlanSchema,
  // AI Curriculum System types
  type CourseCurriculum,
  type InsertCourseCurriculum,
  type CurriculumSkill,
  type InsertCurriculumSkill,
  type CurriculumModule,
  type InsertCurriculumModule,
  type UserCurriculum,
  type InsertUserCurriculum,
  type UserCurriculumTask,
  type InsertUserCurriculumTask,
  type UserSkillProgress,
  type InsertUserSkillProgress,
  type CurriculumCheckpoint,
  type InsertCurriculumCheckpoint,
  type SkillAssessment,
  type InsertSkillAssessment,
  courseCurriculums,
  curriculumSkills,
  curriculumModules,
  userCurriculums,
  userCurriculumTasks,
  userSkillProgress,
  curriculumCheckpoints,
  skillAssessments,
  insertCourseCurriculumSchema,
  insertCurriculumSkillSchema,
  insertCurriculumModuleSchema,
  insertUserCurriculumSchema,
  insertUserCurriculumTaskSchema,
  insertUserSkillProgressSchema,
  insertCurriculumCheckpointSchema,
  insertSkillAssessmentSchema,
  // New feature tables
  type Upload,
  type InsertUpload,
  type Essay,
  type InsertEssay,
  type WeeklyStudyPlan,
  type InsertWeeklyStudyPlan,
  uploads,
  essays,
  weeklyStudyPlans,
  insertUploadSchema,
  insertEssaySchema,
  insertWeeklyStudyPlanSchema,
  // Daily Study Sessions
  type DailyStudySession,
  type InsertDailyStudySession,
  dailyStudySessions,
  insertDailyStudySessionSchema,
  // Forum System types
  type ForumPost,
  type InsertForumPost,
  type ForumComment,
  type InsertForumComment,
  forumPosts,
  forumComments,
  insertForumPostSchema,
  insertForumCommentSchema,
  // Certificate System types
  type Certificate,
  type InsertCertificate,
  certificates,
  insertCertificateSchema
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
  getUserById(id: number): Promise<User | undefined>;
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
  
  // Course category operations
  getCategories(): Promise<CourseCategory[]>;
  getCategory(id: number): Promise<CourseCategory | undefined>;
  createCategory(category: InsertCourseCategory): Promise<CourseCategory>;
  updateCategory(id: number, data: Partial<CourseCategory>): Promise<CourseCategory | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getCategoryTree(): Promise<CourseCategory[]>;
  getCoursesInCategory(categoryId: number): Promise<Course[]>;
  
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
  getUserLearningPaths(userId: number): Promise<LearningPath[]>;
  getLearningPath(id: number): Promise<(LearningPath & { steps: (LearningPathStep & { course: Course })[] }) | undefined>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  addLearningPathStep(step: InsertLearningPathStep): Promise<LearningPathStep>;
  updateLearningPathProgress(id: number, progress: number): Promise<LearningPath | undefined>;
  updateLearningPath(id: number, data: Partial<LearningPath>): Promise<LearningPath | undefined>;
  deleteLearningPath(id: number): Promise<boolean>;
  markStepAsCompleted(id: number): Promise<LearningPathStep | undefined>;
  generateLearningPath(userId: number, goal: string): Promise<LearningPath>;
  generateAndSyncCurriculum(userId: number, courseId: number): Promise<any>;
  
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

  // TYT Study Planning System operations
  
  // Student Profile operations
  getTytStudentProfile(userId: number): Promise<TytStudentProfile | undefined>;
  createTytStudentProfile(profile: InsertTytStudentProfile): Promise<TytStudentProfile>;
  updateTytStudentProfile(userId: number, data: Partial<TytStudentProfile>): Promise<TytStudentProfile | undefined>;
  
  // Subject and Topic operations
  getTytSubjects(): Promise<TytSubject[]>;
  getTytSubject(id: number): Promise<TytSubject | undefined>;
  createTytSubject(subject: InsertTytSubject): Promise<TytSubject>;
  getTytTopics(subjectId?: number): Promise<TytTopic[]>;
  getTytTopic(id: number): Promise<TytTopic | undefined>;
  createTytTopic(topic: InsertTytTopic): Promise<TytTopic>;
  
  // User Topic Progress operations
  getUserTopicProgress(userId: number, topicId?: number): Promise<UserTopicProgress[]>;
  updateUserTopicProgress(userId: number, topicId: number, data: Partial<UserTopicProgress>): Promise<UserTopicProgress>;
  createUserTopicProgress(progress: InsertUserTopicProgress): Promise<UserTopicProgress>;
  
  // Trial Exam operations
  getTytTrialExams(userId: number): Promise<TytTrialExam[]>;
  getTytTrialExam(id: number): Promise<TytTrialExam | undefined>;
  createTytTrialExam(exam: InsertTytTrialExam): Promise<TytTrialExam>;
  deleteTytTrialExam(id: number): Promise<boolean>;
  
  // Daily Study Task operations
  getDailyStudyTasks(userId: number, date?: string): Promise<DailyStudyTask[]>;
  getDailyStudyTask(id: number): Promise<DailyStudyTask | undefined>;
  createDailyStudyTask(task: InsertDailyStudyTask): Promise<DailyStudyTask>;
  updateDailyStudyTask(id: number, data: Partial<DailyStudyTask>): Promise<DailyStudyTask | undefined>;
  deleteDailyStudyTask(id: number): Promise<boolean>;
  completeDailyStudyTask(id: number, actualDuration?: number): Promise<DailyStudyTask | undefined>;
  getCurriculumContextForDailyTasks(userId: number, taskIds: number[]): Promise<Map<number, {
    curriculumTaskId: number;
    curriculumId: number;
    curriculumTitleEn: string;
    curriculumTitleTr: string;
    skillName: string | null;
    taskTitleEn: string;
    taskTitleTr: string;
  }>>;
  
  // Study Session operations
  getTytStudySessions(userId: number, filters?: { startDate?: Date; endDate?: Date; subjectId?: number }): Promise<TytStudySession[]>;
  getTytStudySession(id: number): Promise<TytStudySession | undefined>;
  createTytStudySession(session: InsertTytStudySession): Promise<TytStudySession>;
  updateTytStudySession(id: number, data: Partial<TytStudySession>): Promise<TytStudySession | undefined>;
  endTytStudySession(id: number): Promise<TytStudySession | undefined>;
  
  // Study Goal operations
  getTytStudyGoals(userId: number, goalType?: string): Promise<TytStudyGoal[]>;
  getTytStudyGoal(id: number): Promise<TytStudyGoal | undefined>;
  createTytStudyGoal(goal: InsertTytStudyGoal): Promise<TytStudyGoal>;
  updateTytStudyGoal(id: number, data: Partial<TytStudyGoal>): Promise<TytStudyGoal | undefined>;
  deleteTytStudyGoal(id: number): Promise<boolean>;
  
  // Study Streak operations
  getTytStudyStreaks(userId: number): Promise<TytStudyStreak[]>;
  getTytStudyStreak(userId: number, streakType: string): Promise<TytStudyStreak | undefined>;
  createTytStudyStreak(streak: InsertTytStudyStreak): Promise<TytStudyStreak>;
  updateTytStudyStreak(userId: number, streakType: string, data: Partial<TytStudyStreak>): Promise<TytStudyStreak | undefined>;
  
  // Analytics and Summary operations
  getTytStudyStats(userId: number, timeframe?: 'daily' | 'weekly' | 'monthly'): Promise<{
    totalStudyTime: number;
    completedTasks: number;
    averageNetScore: number;
    subjectProgress: Array<{ subject: string; progress: number; timeSpent: number }>;
    streaks: Array<{ type: string; current: number; longest: number }>;
  }>;

  // New Time Tracking & Analytics operations
  // Daily Study Goals operations
  getDailyStudyGoal(userId: number, date: string): Promise<DailyStudyGoal | undefined>;
  getDailyStudyGoals(userId: number, startDate?: string, endDate?: string): Promise<DailyStudyGoal[]>;
  createDailyStudyGoal(goal: InsertDailyStudyGoal): Promise<DailyStudyGoal>;
  updateDailyStudyGoal(userId: number, date: string, data: Partial<DailyStudyGoal>): Promise<DailyStudyGoal | undefined>;
  
  // Study Habits operations
  getStudyHabits(userId: number, period?: string): Promise<StudyHabit[]>;
  getStudyHabit(id: number): Promise<StudyHabit | undefined>;
  createStudyHabit(habit: InsertStudyHabit): Promise<StudyHabit>;
  
  // Daily Study Sessions operations (Time Tracking)
  getDailyStudySessions(userId: number, date?: string): Promise<DailyStudySession[]>;
  getDailyStudySession(userId: number, date: string): Promise<DailyStudySession | undefined>;
  createDailyStudySession(session: InsertDailyStudySession): Promise<DailyStudySession>;
  
  // TYT Resources operations
  getTytResources(topicId: number): Promise<TytResource[]>;
  getTytResource(id: number): Promise<TytResource | undefined>;
  createTytResource(resource: InsertTytResource): Promise<TytResource>;
  updateTytResource(id: number, data: Partial<TytResource>): Promise<TytResource | undefined>;
  deleteTytResource(id: number): Promise<boolean>;
  
  // AI Daily Plans operations
  getAiDailyPlan(userId: number, date: string): Promise<AiDailyPlan | undefined>;
  getAiDailyPlans(userId: number, startDate?: string, endDate?: string): Promise<AiDailyPlan[]>;
  createAiDailyPlan(plan: InsertAiDailyPlan): Promise<AiDailyPlan>;
  updateAiDailyPlanProgress(userId: number, date: string, completionRate: number): Promise<AiDailyPlan | undefined>;

  // Forum System operations
  getForumPosts(limit?: number, offset?: number): Promise<ForumPost[]>;
  getForumPost(id: number): Promise<ForumPost | undefined>;
  getUserForumPosts(userId: number): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined>;
  deleteForumPost(id: number): Promise<boolean>;
  incrementPostViews(id: number): Promise<void>;
  
  // Forum Comments operations
  getPostComments(postId: number): Promise<ForumComment[]>;
  getForumComment(id: number): Promise<ForumComment | undefined>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  updateForumComment(id: number, data: Partial<ForumComment>): Promise<ForumComment | undefined>;
  deleteForumComment(id: number): Promise<boolean>;
  
  // Certificate System operations
  getUserCertificates(userId: number): Promise<Certificate[]>;
  getCertificate(id: number): Promise<Certificate | undefined>;
  getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  verifyCertificate(verificationCode: string): Promise<Certificate | undefined>;
  revokeCertificate(id: number): Promise<Certificate | undefined>;

  // AI Curriculum System operations
  // Course Curriculum operations
  getCourseCurriculum(courseId: number): Promise<CourseCurriculum | undefined>;
  createCourseCurriculum(curriculum: InsertCourseCurriculum): Promise<CourseCurriculum>;
  updateCourseCurriculum(id: number, data: Partial<CourseCurriculum>): Promise<CourseCurriculum | undefined>;
  
  // Curriculum Skill operations
  getCurriculumSkills(curriculumId: number): Promise<CurriculumSkill[]>;
  getCurriculumSkill(id: number): Promise<CurriculumSkill | undefined>;
  createCurriculumSkill(skill: InsertCurriculumSkill): Promise<CurriculumSkill>;
  updateCurriculumSkill(id: number, data: Partial<CurriculumSkill>): Promise<CurriculumSkill | undefined>;
  
  // Curriculum Module operations
  getCurriculumModules(curriculumId: number): Promise<CurriculumModule[]>;
  getCurriculumModule(id: number): Promise<CurriculumModule | undefined>;
  createCurriculumModule(module: InsertCurriculumModule): Promise<CurriculumModule>;
  updateCurriculumModule(id: number, data: Partial<CurriculumModule>): Promise<CurriculumModule | undefined>;
  
  // User Curriculum operations
  getUserCurriculum(userId: number, courseId: number): Promise<UserCurriculum | undefined>;
  getUserCurriculums(userId: number): Promise<UserCurriculum[]>;
  createUserCurriculum(userCurriculum: InsertUserCurriculum): Promise<UserCurriculum>;
  updateUserCurriculumProgress(id: number, progress: number): Promise<UserCurriculum | undefined>;
  
  // User Curriculum Task operations
  getUserCurriculumTasks(userCurriculumId: number): Promise<UserCurriculumTask[]>;
  getUserCurriculumTask(id: number): Promise<UserCurriculumTask | undefined>;
  createUserCurriculumTask(task: InsertUserCurriculumTask): Promise<UserCurriculumTask>;
  updateUserCurriculumTask(id: number, data: Partial<UserCurriculumTask>): Promise<UserCurriculumTask | undefined>;
  deleteUserCurriculumTask(id: number): Promise<boolean>;
  completeUserCurriculumTask(id: number, score?: number): Promise<UserCurriculumTask | undefined>;
  
  // User Skill Progress operations
  getUserSkillProgress(userCurriculumId: number): Promise<UserSkillProgress[]>;
  getUserSkillProgressBySkill(userCurriculumId: number, skillId: number): Promise<UserSkillProgress | undefined>;
  createUserSkillProgress(progress: InsertUserSkillProgress): Promise<UserSkillProgress>;
  updateUserSkillProgress(id: number, data: Partial<UserSkillProgress>): Promise<UserSkillProgress | undefined>;
  
  // Curriculum Checkpoint operations
  getCurriculumCheckpoints(curriculumId: number): Promise<CurriculumCheckpoint[]>;
  getCurriculumCheckpoint(id: number): Promise<CurriculumCheckpoint | undefined>;
  createCurriculumCheckpoint(checkpoint: InsertCurriculumCheckpoint): Promise<CurriculumCheckpoint>;
  updateCurriculumCheckpoint(id: number, data: Partial<CurriculumCheckpoint>): Promise<CurriculumCheckpoint | undefined>;
  
  // Skill Assessment operations
  getSkillAssessments(userCurriculumId: number): Promise<SkillAssessment[]>;
  getSkillAssessment(id: number): Promise<SkillAssessment | undefined>;
  createSkillAssessment(assessment: InsertSkillAssessment): Promise<SkillAssessment>;
  updateSkillAssessment(id: number, data: Partial<SkillAssessment>): Promise<SkillAssessment | undefined>;
  
  // Curriculum generation and task sync
  generateAndSyncCurriculum(userId: number, courseId: number): Promise<{
    curriculum: UserCurriculum;
    tasks: UserCurriculumTask[];
    skills: CurriculumSkill[];
  }>;

  // File Upload operations
  getUpload(id: number): Promise<Upload | undefined>;
  getUserUploads(userId: number, uploadType?: string): Promise<Upload[]>;
  createUpload(upload: InsertUpload): Promise<Upload>;
  deleteUpload(id: number): Promise<boolean>;

  // Essay operations
  getEssay(id: number): Promise<Essay | undefined>;
  getUserEssays(userId: number, courseId?: number): Promise<Essay[]>;
  createEssay(essay: InsertEssay): Promise<Essay>;
  updateEssay(id: number, data: Partial<Essay>): Promise<Essay | undefined>;
  submitEssay(id: number): Promise<Essay | undefined>;
  generateAiFeedback(essayId: number, content: string): Promise<string>;
  
  // Weekly Study Plan operations
  getWeeklyStudyPlan(id: number): Promise<WeeklyStudyPlan | undefined>;
  getUserWeeklyStudyPlans(userId: number): Promise<WeeklyStudyPlan[]>;
  getActiveWeeklyPlan(userId: number): Promise<WeeklyStudyPlan | undefined>;
  createWeeklyStudyPlan(plan: InsertWeeklyStudyPlan): Promise<WeeklyStudyPlan>;
  updateWeeklyStudyPlan(id: number, data: Partial<WeeklyStudyPlan>): Promise<WeeklyStudyPlan | undefined>;
  completeWeeklyPlan(id: number): Promise<WeeklyStudyPlan | undefined>;
  generateWeeklyAiRecommendations(userId: number, planId: number): Promise<string>;

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

  async getUserById(id: number): Promise<User | undefined> {
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
  
  // Course category operations
  async getCategories(): Promise<CourseCategory[]> {
    return db.select().from(courseCategories).where(eq(courseCategories.isActive, true)).orderBy(courseCategories.order);
  }
  
  async getCategory(id: number): Promise<CourseCategory | undefined> {
    const [category] = await db.select().from(courseCategories).where(eq(courseCategories.id, id));
    return category;
  }
  
  async createCategory(category: InsertCourseCategory): Promise<CourseCategory> {
    const [newCategory] = await db.insert(courseCategories).values(category).returning();
    return newCategory;
  }
  
  async updateCategory(id: number, data: Partial<CourseCategory>): Promise<CourseCategory | undefined> {
    const [updated] = await db.update(courseCategories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(courseCategories.id, id))
      .returning();
    return updated;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    // Soft delete - just mark as inactive
    const result = await db.update(courseCategories)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(courseCategories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  
  async getCategoryTree(): Promise<CourseCategory[]> {
    // Get all active categories ordered by depth and order
    return db.select().from(courseCategories)
      .where(eq(courseCategories.isActive, true))
      .orderBy(courseCategories.depth, courseCategories.order);
  }
  
  async getCoursesInCategory(categoryId: number): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.categoryId, categoryId));
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

  async getUserLearningPaths(userId: number): Promise<LearningPath[]> {
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
      .orderBy(learningPathSteps.order);
    
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

  async updateLearningPath(id: number, data: Partial<LearningPath>): Promise<LearningPath | undefined> {
    const [updatedPath] = await db
      .update(learningPaths)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(learningPaths.id, id))
      .returning();
    
    return updatedPath;
  }

  async deleteLearningPath(id: number): Promise<boolean> {
    await db.delete(learningPaths).where(eq(learningPaths.id, id));
    return true;
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
      progress: 0
    });
    
    return newPath;
  }

  async generateAndSyncCurriculum(userId: number, courseId: number): Promise<any> {
    // Stub implementation for curriculum generation
    return { success: true, message: "Curriculum synced" };
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

  // TYT Study Planning System implementations

  // Student Profile operations
  async getTytStudentProfile(userId: number): Promise<TytStudentProfile | undefined> {
    const profile = await db.select().from(tytStudentProfiles).where(eq(tytStudentProfiles.userId, userId)).limit(1);
    return profile[0];
  }

  async createTytStudentProfile(profile: InsertTytStudentProfile): Promise<TytStudentProfile> {
    const [newProfile] = await db.insert(tytStudentProfiles).values(profile).returning();
    return newProfile;
  }

  async updateTytStudentProfile(userId: number, data: Partial<TytStudentProfile>): Promise<TytStudentProfile | undefined> {
    const [updated] = await db
      .update(tytStudentProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tytStudentProfiles.userId, userId))
      .returning();
    return updated;
  }

  // Subject and Topic operations
  async getTytSubjects(): Promise<TytSubject[]> {
    return await db.select().from(tytSubjects).where(eq(tytSubjects.isActive, true)).orderBy(tytSubjects.id);
  }

  async getTytSubject(id: number): Promise<TytSubject | undefined> {
    const subject = await db.select().from(tytSubjects).where(eq(tytSubjects.id, id)).limit(1);
    return subject[0];
  }

  async createTytSubject(subject: InsertTytSubject): Promise<TytSubject> {
    const [newSubject] = await db.insert(tytSubjects).values(subject).returning();
    return newSubject;
  }

  async getTytTopics(subjectId?: number): Promise<TytTopic[]> {
    let query = db.select().from(tytTopics).where(eq(tytTopics.isActive, true));
    if (subjectId) {
      query = query.where(eq(tytTopics.subjectId, subjectId));
    }
    return await query.orderBy(tytTopics.subjectId, tytTopics.order);
  }

  async getTytTopic(id: number): Promise<TytTopic | undefined> {
    const topic = await db.select().from(tytTopics).where(eq(tytTopics.id, id)).limit(1);
    return topic[0];
  }

  async createTytTopic(topic: InsertTytTopic): Promise<TytTopic> {
    const [newTopic] = await db.insert(tytTopics).values(topic).returning();
    return newTopic;
  }

  // User Topic Progress operations
  async getUserTopicProgress(userId: number, topicId?: number): Promise<UserTopicProgress[]> {
    let query = db.select().from(userTopicProgress).where(eq(userTopicProgress.userId, userId));
    if (topicId) {
      query = query.where(eq(userTopicProgress.topicId, topicId));
    }
    return await query.orderBy(userTopicProgress.topicId);
  }

  async updateUserTopicProgress(userId: number, topicId: number, data: Partial<UserTopicProgress>): Promise<UserTopicProgress> {
    const existing = await db
      .select()
      .from(userTopicProgress)
      .where(and(eq(userTopicProgress.userId, userId), eq(userTopicProgress.topicId, topicId)))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(userTopicProgress)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userTopicProgress.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userTopicProgress)
        .values({ userId, topicId, ...data })
        .returning();
      return newProgress;
    }
  }

  async createUserTopicProgress(progress: InsertUserTopicProgress): Promise<UserTopicProgress> {
    const [newProgress] = await db.insert(userTopicProgress).values(progress).returning();
    return newProgress;
  }

  // Trial Exam operations
  async getTytTrialExams(userId: number): Promise<TytTrialExam[]> {
    return await db
      .select()
      .from(tytTrialExams)
      .where(eq(tytTrialExams.userId, userId))
      .orderBy(desc(tytTrialExams.examDate));
  }

  async getTytTrialExam(id: number): Promise<TytTrialExam | undefined> {
    const exam = await db.select().from(tytTrialExams).where(eq(tytTrialExams.id, id)).limit(1);
    return exam[0];
  }

  async createTytTrialExam(exam: InsertTytTrialExam): Promise<TytTrialExam> {
    const [newExam] = await db.insert(tytTrialExams).values(exam).returning();
    return newExam;
  }

  async deleteTytTrialExam(id: number): Promise<boolean> {
    const result = await db.delete(tytTrialExams).where(eq(tytTrialExams.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Daily Study Task operations
  async getDailyStudyTasks(userId: number, date?: string): Promise<DailyStudyTask[]> {
    let query = db.select().from(dailyStudyTasks).where(eq(dailyStudyTasks.userId, userId));
    if (date) {
      query = query.where(eq(dailyStudyTasks.scheduledDate, date));
    }
    return await query.orderBy(dailyStudyTasks.scheduledDate, dailyStudyTasks.scheduledTime);
  }

  async getDailyStudyTask(id: number): Promise<DailyStudyTask | undefined> {
    const task = await db.select().from(dailyStudyTasks).where(eq(dailyStudyTasks.id, id)).limit(1);
    return task[0];
  }

  async createDailyStudyTask(task: InsertDailyStudyTask): Promise<DailyStudyTask> {
    const [newTask] = await db.insert(dailyStudyTasks).values(task).returning();
    return newTask;
  }

  async updateDailyStudyTask(id: number, data: Partial<DailyStudyTask>): Promise<DailyStudyTask | undefined> {
    const [updated] = await db
      .update(dailyStudyTasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(dailyStudyTasks.id, id))
      .returning();
    return updated;
  }

  async deleteDailyStudyTask(id: number): Promise<boolean> {
    const result = await db.delete(dailyStudyTasks).where(eq(dailyStudyTasks.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async completeDailyStudyTask(id: number, actualDuration?: number): Promise<DailyStudyTask | undefined> {
    const updateData: any = {
      isCompleted: true,
      completedAt: new Date(),
      updatedAt: new Date()
    };
    if (actualDuration) {
      updateData.actualDuration = actualDuration;
    }

    const [updated] = await db
      .update(dailyStudyTasks)
      .set(updateData)
      .where(eq(dailyStudyTasks.id, id))
      .returning();
    return updated;
  }

  async getCurriculumContextForDailyTasks(userId: number, taskIds: number[]): Promise<Map<number, {
    curriculumTaskId: number;
    curriculumId: number;
    curriculumTitleEn: string;
    curriculumTitleTr: string;
    skillName: string | null;
    taskTitleEn: string;
    taskTitleTr: string;
  }>> {
    if (taskIds.length === 0) return new Map();

    const results = await db
      .select({
        dailyTaskId: userCurriculumTasks.dailyTaskId,
        curriculumTaskId: userCurriculumTasks.id,
        curriculumId: userCurriculums.curriculumId,
        curriculumTitleEn: courseCurriculums.titleEn,
        curriculumTitleTr: courseCurriculums.titleTr,
        skillName: curriculumSkills.name,
        taskTitleEn: userCurriculumTasks.titleEn,
        taskTitleTr: userCurriculumTasks.titleTr,
      })
      .from(userCurriculumTasks)
      .innerJoin(userCurriculums, eq(userCurriculumTasks.userCurriculumId, userCurriculums.id))
      .innerJoin(courseCurriculums, eq(userCurriculums.curriculumId, courseCurriculums.id))
      .leftJoin(curriculumSkills, eq(userCurriculumTasks.skillId, curriculumSkills.id))
      .where(
        and(
          eq(userCurriculums.userId, userId),
          inArray(userCurriculumTasks.dailyTaskId, taskIds)
        )
      );

    const contextMap = new Map<number, {
      curriculumTaskId: number;
      curriculumId: number;
      curriculumTitleEn: string;
      curriculumTitleTr: string;
      skillName: string | null;
      taskTitleEn: string;
      taskTitleTr: string;
    }>();
    
    for (const row of results) {
      if (row.dailyTaskId) {
        contextMap.set(row.dailyTaskId, {
          curriculumTaskId: row.curriculumTaskId,
          curriculumId: row.curriculumId,
          curriculumTitleEn: row.curriculumTitleEn,
          curriculumTitleTr: row.curriculumTitleTr,
          skillName: row.skillName,
          taskTitleEn: row.taskTitleEn,
          taskTitleTr: row.taskTitleTr,
        });
      }
    }
    return contextMap;
  }

  // Study Session operations
  async getTytStudySessions(userId: number, filters?: { startDate?: Date; endDate?: Date; subjectId?: number }): Promise<TytStudySession[]> {
    let query = db.select().from(tytStudySessions).where(eq(tytStudySessions.userId, userId));
    
    if (filters?.startDate) {
      query = query.where(sql`${tytStudySessions.startTime} >= ${filters.startDate}`);
    }
    if (filters?.endDate) {
      query = query.where(sql`${tytStudySessions.startTime} <= ${filters.endDate}`);
    }
    if (filters?.subjectId) {
      query = query.where(eq(tytStudySessions.subjectId, filters.subjectId));
    }

    return await query.orderBy(desc(tytStudySessions.startTime));
  }

  async getTytStudySession(id: number): Promise<TytStudySession | undefined> {
    const session = await db.select().from(tytStudySessions).where(eq(tytStudySessions.id, id)).limit(1);
    return session[0];
  }

  async createTytStudySession(session: InsertTytStudySession): Promise<TytStudySession> {
    const [newSession] = await db.insert(tytStudySessions).values(session).returning();
    return newSession;
  }

  async updateTytStudySession(id: number, data: Partial<TytStudySession>): Promise<TytStudySession | undefined> {
    const [updated] = await db
      .update(tytStudySessions)
      .set(data)
      .where(eq(tytStudySessions.id, id))
      .returning();
    return updated;
  }

  async endTytStudySession(id: number): Promise<TytStudySession | undefined> {
    const session = await this.getTytStudySession(id);
    if (!session || session.endTime) return session;

    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // minutes

    const [updated] = await db
      .update(tytStudySessions)
      .set({
        endTime: endTime,
        duration: duration
      })
      .where(eq(tytStudySessions.id, id))
      .returning();
    return updated;
  }

  // Study Goal operations
  async getTytStudyGoals(userId: number, goalType?: string): Promise<TytStudyGoal[]> {
    let query = db.select().from(tytStudyGoals).where(eq(tytStudyGoals.userId, userId));
    if (goalType) {
      query = query.where(eq(tytStudyGoals.goalType, goalType));
    }
    return await query.orderBy(tytStudyGoals.deadline, desc(tytStudyGoals.createdAt));
  }

  async getTytStudyGoal(id: number): Promise<TytStudyGoal | undefined> {
    const goal = await db.select().from(tytStudyGoals).where(eq(tytStudyGoals.id, id)).limit(1);
    return goal[0];
  }

  async createTytStudyGoal(goal: InsertTytStudyGoal): Promise<TytStudyGoal> {
    const [newGoal] = await db.insert(tytStudyGoals).values(goal).returning();
    return newGoal;
  }

  async updateTytStudyGoal(id: number, data: Partial<TytStudyGoal>): Promise<TytStudyGoal | undefined> {
    const [updated] = await db
      .update(tytStudyGoals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tytStudyGoals.id, id))
      .returning();
    return updated;
  }

  async deleteTytStudyGoal(id: number): Promise<boolean> {
    const result = await db.delete(tytStudyGoals).where(eq(tytStudyGoals.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Study Streak operations
  async getTytStudyStreaks(userId: number): Promise<TytStudyStreak[]> {
    return await db
      .select()
      .from(tytStudyStreaks)
      .where(eq(tytStudyStreaks.userId, userId))
      .orderBy(tytStudyStreaks.streakType);
  }

  async getTytStudyStreak(userId: number, streakType: string): Promise<TytStudyStreak | undefined> {
    const streak = await db
      .select()
      .from(tytStudyStreaks)
      .where(and(eq(tytStudyStreaks.userId, userId), eq(tytStudyStreaks.streakType, streakType)))
      .limit(1);
    return streak[0];
  }

  async createTytStudyStreak(streak: InsertTytStudyStreak): Promise<TytStudyStreak> {
    const [newStreak] = await db.insert(tytStudyStreaks).values(streak).returning();
    return newStreak;
  }

  async updateTytStudyStreak(userId: number, streakType: string, data: Partial<TytStudyStreak>): Promise<TytStudyStreak | undefined> {
    const [updated] = await db
      .update(tytStudyStreaks)
      .set(data)
      .where(and(eq(tytStudyStreaks.userId, userId), eq(tytStudyStreaks.streakType, streakType)))
      .returning();
    return updated;
  }

  // Analytics and Summary operations
  async getTytStudyStats(userId: number, timeframe?: 'daily' | 'weekly' | 'monthly'): Promise<{
    totalStudyTime: number;
    completedTasks: number;
    averageNetScore: number;
    subjectProgress: Array<{ subject: string; progress: number; timeSpent: number }>;
    streaks: Array<{ type: string; current: number; longest: number }>;
  }> {
    // Calculate date range based on timeframe
    let startDate = new Date();
    switch (timeframe) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Get study sessions for total study time
    const sessions = await this.getTytStudySessions(userId, { startDate });
    const totalStudyTime = sessions.reduce((total, session) => total + (session.duration || 0), 0);

    // Get completed tasks count
    const tasks = await db
      .select()
      .from(dailyStudyTasks)
      .where(and(
        eq(dailyStudyTasks.userId, userId),
        eq(dailyStudyTasks.isCompleted, true),
        sql`${dailyStudyTasks.completedAt} >= ${startDate}`
      ));
    const completedTasks = tasks.length;

    // Get trial exams for average net score
    const trials = await db
      .select()
      .from(tytTrialExams)
      .where(and(
        eq(tytTrialExams.userId, userId),
        sql`${tytTrialExams.examDate} >= ${startDate}`
      ));
    const averageNetScore = trials.length > 0 
      ? trials.reduce((sum, trial) => sum + parseFloat(trial.netScore.toString()), 0) / trials.length 
      : 0;

    // Get subject progress (simplified)
    const subjectProgress = await db
      .select({
        subject: tytSubjects.displayName,
        progress: sql<number>`AVG(${userTopicProgress.progressPercent})`,
        timeSpent: sql<number>`SUM(${userTopicProgress.timeSpent})`
      })
      .from(userTopicProgress)
      .leftJoin(tytTopics, eq(userTopicProgress.topicId, tytTopics.id))
      .leftJoin(tytSubjects, eq(tytTopics.subjectId, tytSubjects.id))
      .where(eq(userTopicProgress.userId, userId))
      .groupBy(tytSubjects.id, tytSubjects.displayName);

    // Get streaks
    const streakData = await this.getTytStudyStreaks(userId);
    const streaks = streakData.map(streak => ({
      type: streak.streakType,
      current: streak.currentStreak,
      longest: streak.longestStreak
    }));

    return {
      totalStudyTime,
      completedTasks,
      averageNetScore,
      subjectProgress,
      streaks
    };
  }

  // ==================== New Time Tracking & Analytics Implementations ====================
  
  // Daily Study Goals operations
  async getDailyStudyGoal(userId: number, date: string): Promise<DailyStudyGoal | undefined> {
    const [goal] = await db
      .select()
      .from(dailyStudyGoals)
      .where(and(eq(dailyStudyGoals.userId, userId), eq(dailyStudyGoals.date, date)))
      .limit(1);
    return goal;
  }

  async getDailyStudyGoals(userId: number, startDate?: string, endDate?: string): Promise<DailyStudyGoal[]> {
    let query = db.select().from(dailyStudyGoals).where(eq(dailyStudyGoals.userId, userId));
    
    if (startDate && endDate) {
      query = query.where(and(
        eq(dailyStudyGoals.userId, userId),
        sql`${dailyStudyGoals.date} >= ${startDate}`,
        sql`${dailyStudyGoals.date} <= ${endDate}`
      ));
    } else if (startDate) {
      query = query.where(and(
        eq(dailyStudyGoals.userId, userId),
        sql`${dailyStudyGoals.date} >= ${startDate}`
      ));
    }
    
    return await query.orderBy(desc(dailyStudyGoals.date));
  }

  async createDailyStudyGoal(goal: InsertDailyStudyGoal): Promise<DailyStudyGoal> {
    const [newGoal] = await db.insert(dailyStudyGoals).values(goal).returning();
    return newGoal;
  }

  async updateDailyStudyGoal(userId: number, date: string, data: Partial<DailyStudyGoal>): Promise<DailyStudyGoal | undefined> {
    const [updated] = await db
      .update(dailyStudyGoals)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(dailyStudyGoals.userId, userId), eq(dailyStudyGoals.date, date)))
      .returning();
    return updated;
  }

  // Study Habits operations
  async getStudyHabits(userId: number, period?: string): Promise<StudyHabit[]> {
    let query = db.select().from(studyHabits).where(eq(studyHabits.userId, userId));
    
    if (period) {
      query = query.where(and(eq(studyHabits.userId, userId), eq(studyHabits.period, period)));
    }
    
    return await query.orderBy(desc(studyHabits.startDate));
  }

  async getStudyHabit(id: number): Promise<StudyHabit | undefined> {
    const [habit] = await db.select().from(studyHabits).where(eq(studyHabits.id, id)).limit(1);
    return habit;
  }

  async createStudyHabit(habit: InsertStudyHabit): Promise<StudyHabit> {
    const [newHabit] = await db.insert(studyHabits).values(habit).returning();
    return newHabit;
  }

  // Daily Study Sessions operations (Time Tracking)
  async getDailyStudySessions(userId: number, date?: string): Promise<DailyStudySession[]> {
    let query = db.select().from(dailyStudySessions).where(eq(dailyStudySessions.userId, userId));
    
    if (date) {
      query = query.where(and(eq(dailyStudySessions.userId, userId), eq(dailyStudySessions.date, date)));
    }
    
    return await query.orderBy(desc(dailyStudySessions.date));
  }

  async getDailyStudySession(userId: number, date: string): Promise<DailyStudySession | undefined> {
    const [session] = await db
      .select()
      .from(dailyStudySessions)
      .where(and(eq(dailyStudySessions.userId, userId), eq(dailyStudySessions.date, date)))
      .limit(1);
    return session;
  }

  async createDailyStudySession(session: InsertDailyStudySession): Promise<DailyStudySession> {
    const [newSession] = await db.insert(dailyStudySessions).values(session).returning();
    return newSession;
  }

  // TYT Resources operations
  async getTytResources(topicId: number): Promise<TytResource[]> {
    return await db
      .select()
      .from(tytResources)
      .where(eq(tytResources.topicId, topicId))
      .orderBy(asc(tytResources.id));
  }

  async getTytResource(id: number): Promise<TytResource | undefined> {
    const [resource] = await db.select().from(tytResources).where(eq(tytResources.id, id)).limit(1);
    return resource;
  }

  async createTytResource(resource: InsertTytResource): Promise<TytResource> {
    const [newResource] = await db.insert(tytResources).values(resource).returning();
    return newResource;
  }

  async updateTytResource(id: number, data: Partial<TytResource>): Promise<TytResource | undefined> {
    const [updated] = await db
      .update(tytResources)
      .set(data)
      .where(eq(tytResources.id, id))
      .returning();
    return updated;
  }

  async deleteTytResource(id: number): Promise<boolean> {
    const result = await db.delete(tytResources).where(eq(tytResources.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // AI Daily Plans operations
  async getAiDailyPlan(userId: number, date: string): Promise<AiDailyPlan | undefined> {
    const [plan] = await db
      .select()
      .from(aiDailyPlans)
      .where(and(eq(aiDailyPlans.userId, userId), eq(aiDailyPlans.date, date)))
      .limit(1);
    return plan;
  }

  async getAiDailyPlans(userId: number, startDate?: string, endDate?: string): Promise<AiDailyPlan[]> {
    let query = db.select().from(aiDailyPlans).where(eq(aiDailyPlans.userId, userId));
    
    if (startDate && endDate) {
      query = query.where(and(
        eq(aiDailyPlans.userId, userId),
        sql`${aiDailyPlans.date} >= ${startDate}`,
        sql`${aiDailyPlans.date} <= ${endDate}`
      ));
    } else if (startDate) {
      query = query.where(and(
        eq(aiDailyPlans.userId, userId),
        sql`${aiDailyPlans.date} >= ${startDate}`
      ));
    }
    
    return await query.orderBy(desc(aiDailyPlans.date));
  }

  async createAiDailyPlan(plan: InsertAiDailyPlan): Promise<AiDailyPlan> {
    const [newPlan] = await db.insert(aiDailyPlans).values(plan).returning();
    return newPlan;
  }

  async updateAiDailyPlanProgress(userId: number, date: string, completionRate: number): Promise<AiDailyPlan | undefined> {
    const completed = completionRate >= 100;
    const [updated] = await db
      .update(aiDailyPlans)
      .set({ completionRate, completed })
      .where(and(eq(aiDailyPlans.userId, userId), eq(aiDailyPlans.date, date)))
      .returning();
    return updated;
  }

  // ==================== Forum System Implementations ====================
  
  // Forum Posts operations
  async getForumPosts(limit: number = 20, offset: number = 0): Promise<ForumPost[]> {
    return await db
      .select()
      .from(forumPosts)
      .orderBy(desc(forumPosts.isPinned), desc(forumPosts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getForumPost(id: number): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id)).limit(1);
    return post;
  }

  async getUserForumPosts(userId: number): Promise<ForumPost[]> {
    return await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.authorId, userId))
      .orderBy(desc(forumPosts.createdAt));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const [updated] = await db
      .update(forumPosts)
      .set(data)
      .where(eq(forumPosts.id, id))
      .returning();
    return updated;
  }

  async deleteForumPost(id: number): Promise<boolean> {
    const result = await db.delete(forumPosts).where(eq(forumPosts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async incrementPostViews(id: number): Promise<void> {
    await db
      .update(forumPosts)
      .set({ viewCount: sql`${forumPosts.viewCount} + 1` })
      .where(eq(forumPosts.id, id));
  }

  // Forum Comments operations
  async getPostComments(postId: number): Promise<ForumComment[]> {
    return await db
      .select()
      .from(forumComments)
      .where(eq(forumComments.postId, postId))
      .orderBy(desc(forumComments.isAnswer), asc(forumComments.createdAt));
  }

  async getForumComment(id: number): Promise<ForumComment | undefined> {
    const [comment] = await db.select().from(forumComments).where(eq(forumComments.id, id)).limit(1);
    return comment;
  }

  async createForumComment(comment: InsertForumComment): Promise<ForumComment> {
    const [newComment] = await db.insert(forumComments).values(comment).returning();
    return newComment;
  }

  async updateForumComment(id: number, data: Partial<ForumComment>): Promise<ForumComment | undefined> {
    const [updated] = await db
      .update(forumComments)
      .set(data)
      .where(eq(forumComments.id, id))
      .returning();
    return updated;
  }

  async deleteForumComment(id: number): Promise<boolean> {
    const result = await db.delete(forumComments).where(eq(forumComments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ==================== Certificate System Implementations ====================
  
  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issueDate));
  }

  async getCertificate(id: number): Promise<Certificate | undefined> {
    const [cert] = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
    return cert;
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    const [cert] = await db.select().from(certificates).where(eq(certificates.certificateNumber, certificateNumber)).limit(1);
    return cert;
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const [newCert] = await db.insert(certificates).values(certificate).returning();
    return newCert;
  }

  async verifyCertificate(verificationCode: string): Promise<Certificate | undefined> {
    const [cert] = await db
      .select()
      .from(certificates)
      .where(and(eq(certificates.verificationCode, verificationCode), eq(certificates.isActive, true)))
      .limit(1);
    return cert;
  }

  async revokeCertificate(id: number): Promise<Certificate | undefined> {
    // Fetch certificate first for idempotent guard
    const cert = await this.getCertificate(id);
    if (!cert) return undefined;
    if (!cert.isActive) return cert; // Already revoked, return as-is
    
    // Revoke certificate
    const [updated] = await db
      .update(certificates)
      .set({ isActive: false, revokedAt: new Date() })
      .where(eq(certificates.id, id))
      .returning();
    return updated;
  }

  // ==================== AI Curriculum System Implementations ====================
  
  // Course Curriculum operations
  async getCourseCurriculum(courseId: number): Promise<CourseCurriculum | undefined> {
    const [curriculum] = await db
      .select()
      .from(courseCurriculums)
      .where(eq(courseCurriculums.courseId, courseId))
      .limit(1);
    return curriculum;
  }

  async createCourseCurriculum(curriculum: InsertCourseCurriculum): Promise<CourseCurriculum> {
    const [newCurriculum] = await db
      .insert(courseCurriculums)
      .values(curriculum)
      .returning();
    return newCurriculum;
  }

  async updateCourseCurriculum(id: number, data: Partial<CourseCurriculum>): Promise<CourseCurriculum | undefined> {
    const [updated] = await db
      .update(courseCurriculums)
      .set(data)
      .where(eq(courseCurriculums.id, id))
      .returning();
    return updated;
  }

  // Curriculum Skill operations
  async getCurriculumSkills(curriculumId: number): Promise<CurriculumSkill[]> {
    return await db
      .select()
      .from(curriculumSkills)
      .where(eq(curriculumSkills.curriculumId, curriculumId))
      .orderBy(asc(curriculumSkills.order));
  }

  async getCurriculumSkill(id: number): Promise<CurriculumSkill | undefined> {
    const [skill] = await db
      .select()
      .from(curriculumSkills)
      .where(eq(curriculumSkills.id, id))
      .limit(1);
    return skill;
  }

  async createCurriculumSkill(skill: InsertCurriculumSkill): Promise<CurriculumSkill> {
    const [newSkill] = await db
      .insert(curriculumSkills)
      .values(skill)
      .returning();
    return newSkill;
  }

  async updateCurriculumSkill(id: number, data: Partial<CurriculumSkill>): Promise<CurriculumSkill | undefined> {
    const [updated] = await db
      .update(curriculumSkills)
      .set(data)
      .where(eq(curriculumSkills.id, id))
      .returning();
    return updated;
  }

  // Curriculum Module operations
  async getCurriculumModules(curriculumId: number): Promise<CurriculumModule[]> {
    return await db
      .select()
      .from(curriculumModules)
      .where(eq(curriculumModules.curriculumId, curriculumId))
      .orderBy(asc(curriculumModules.order));
  }

  async getCurriculumModule(id: number): Promise<CurriculumModule | undefined> {
    const [module] = await db
      .select()
      .from(curriculumModules)
      .where(eq(curriculumModules.id, id))
      .limit(1);
    return module;
  }

  async createCurriculumModule(module: InsertCurriculumModule): Promise<CurriculumModule> {
    const [newModule] = await db
      .insert(curriculumModules)
      .values(module)
      .returning();
    return newModule;
  }

  async updateCurriculumModule(id: number, data: Partial<CurriculumModule>): Promise<CurriculumModule | undefined> {
    const [updated] = await db
      .update(curriculumModules)
      .set(data)
      .where(eq(curriculumModules.id, id))
      .returning();
    return updated;
  }

  // User Curriculum operations
  async getUserCurriculum(userId: number, courseId: number): Promise<UserCurriculum | undefined> {
    const [userCurriculum] = await db
      .select()
      .from(userCurriculums)
      .where(and(
        eq(userCurriculums.userId, userId),
        eq(userCurriculums.courseId, courseId)
      ))
      .limit(1);
    return userCurriculum;
  }

  async getUserCurriculums(userId: number): Promise<UserCurriculum[]> {
    return await db
      .select()
      .from(userCurriculums)
      .where(eq(userCurriculums.userId, userId))
      .orderBy(desc(userCurriculums.createdAt));
  }

  async createUserCurriculum(userCurriculum: InsertUserCurriculum): Promise<UserCurriculum> {
    const [newUserCurriculum] = await db
      .insert(userCurriculums)
      .values(userCurriculum)
      .returning();
    return newUserCurriculum;
  }

  async updateUserCurriculumProgress(id: number, progress: number): Promise<UserCurriculum | undefined> {
    const [updated] = await db
      .update(userCurriculums)
      .set({ 
        progress,
        lastAccessedAt: new Date()
      })
      .where(eq(userCurriculums.id, id))
      .returning();
    return updated;
  }

  // User Curriculum Task operations
  async getUserCurriculumTasks(userCurriculumId: number): Promise<UserCurriculumTask[]> {
    return await db
      .select()
      .from(userCurriculumTasks)
      .where(eq(userCurriculumTasks.userCurriculumId, userCurriculumId))
      .orderBy(asc(userCurriculumTasks.scheduledDate));
  }

  async getUserCurriculumTask(id: number): Promise<UserCurriculumTask | undefined> {
    const [task] = await db
      .select()
      .from(userCurriculumTasks)
      .where(eq(userCurriculumTasks.id, id))
      .limit(1);
    return task;
  }

  async createUserCurriculumTask(task: InsertUserCurriculumTask): Promise<UserCurriculumTask> {
    const [newTask] = await db
      .insert(userCurriculumTasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateUserCurriculumTask(id: number, data: Partial<UserCurriculumTask>): Promise<UserCurriculumTask | undefined> {
    const [updated] = await db
      .update(userCurriculumTasks)
      .set(data)
      .where(eq(userCurriculumTasks.id, id))
      .returning();
    return updated;
  }

  async deleteUserCurriculumTask(id: number): Promise<boolean> {
    const result = await db
      .delete(userCurriculumTasks)
      .where(eq(userCurriculumTasks.id, id));
    return true;
  }

  async completeUserCurriculumTask(id: number, score?: number): Promise<UserCurriculumTask | undefined> {
    const [updated] = await db
      .update(userCurriculumTasks)
      .set({
        isCompleted: true,
        completedAt: new Date(),
        score: score || null
      })
      .where(eq(userCurriculumTasks.id, id))
      .returning();
    return updated;
  }

  // User Skill Progress operations
  async getUserSkillProgress(userCurriculumId: number): Promise<UserSkillProgress[]> {
    return await db
      .select()
      .from(userSkillProgress)
      .where(eq(userSkillProgress.userCurriculumId, userCurriculumId));
  }

  async getUserSkillProgressBySkill(userCurriculumId: number, skillId: number): Promise<UserSkillProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userSkillProgress)
      .where(and(
        eq(userSkillProgress.userCurriculumId, userCurriculumId),
        eq(userSkillProgress.skillId, skillId)
      ))
      .limit(1);
    return progress;
  }

  async createUserSkillProgress(progress: InsertUserSkillProgress): Promise<UserSkillProgress> {
    const [newProgress] = await db
      .insert(userSkillProgress)
      .values(progress)
      .returning();
    return newProgress;
  }

  async updateUserSkillProgress(id: number, data: Partial<UserSkillProgress>): Promise<UserSkillProgress | undefined> {
    const [updated] = await db
      .update(userSkillProgress)
      .set({
        ...data,
        lastAttemptAt: new Date()
      })
      .where(eq(userSkillProgress.id, id))
      .returning();
    return updated;
  }

  // Curriculum Checkpoint operations
  async getCurriculumCheckpoints(curriculumId: number): Promise<CurriculumCheckpoint[]> {
    return await db
      .select()
      .from(curriculumCheckpoints)
      .where(eq(curriculumCheckpoints.curriculumId, curriculumId))
      .orderBy(asc(curriculumCheckpoints.order));
  }

  async getCurriculumCheckpoint(id: number): Promise<CurriculumCheckpoint | undefined> {
    const [checkpoint] = await db
      .select()
      .from(curriculumCheckpoints)
      .where(eq(curriculumCheckpoints.id, id))
      .limit(1);
    return checkpoint;
  }

  async createCurriculumCheckpoint(checkpoint: InsertCurriculumCheckpoint): Promise<CurriculumCheckpoint> {
    const [newCheckpoint] = await db
      .insert(curriculumCheckpoints)
      .values(checkpoint)
      .returning();
    return newCheckpoint;
  }

  async updateCurriculumCheckpoint(id: number, data: Partial<CurriculumCheckpoint>): Promise<CurriculumCheckpoint | undefined> {
    const [updated] = await db
      .update(curriculumCheckpoints)
      .set(data)
      .where(eq(curriculumCheckpoints.id, id))
      .returning();
    return updated;
  }

  // Skill Assessment operations
  async getSkillAssessments(userCurriculumId: number): Promise<SkillAssessment[]> {
    return await db
      .select()
      .from(skillAssessments)
      .where(eq(skillAssessments.userCurriculumId, userCurriculumId))
      .orderBy(desc(skillAssessments.attemptedAt));
  }

  async getSkillAssessment(id: number): Promise<SkillAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(skillAssessments)
      .where(eq(skillAssessments.id, id))
      .limit(1);
    return assessment;
  }

  async createSkillAssessment(assessment: InsertSkillAssessment): Promise<SkillAssessment> {
    const [newAssessment] = await db
      .insert(skillAssessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async updateSkillAssessment(id: number, data: Partial<SkillAssessment>): Promise<SkillAssessment | undefined> {
    const [updated] = await db
      .update(skillAssessments)
      .set(data)
      .where(eq(skillAssessments.id, id))
      .returning();
    return updated;
  }

  // Curriculum generation and task sync
  async generateAndSyncCurriculum(userId: number, courseId: number): Promise<{
    curriculum: UserCurriculum;
    tasks: UserCurriculumTask[];
    skills: CurriculumSkill[];
  }> {
    // Check if curriculum already exists for this user and course
    const existingUserCurriculum = await this.getUserCurriculum(userId, courseId);
    if (existingUserCurriculum) {
      // Return existing curriculum with tasks and skills
      const tasks = await this.getUserCurriculumTasks(existingUserCurriculum.id);
      const courseCurriculum = await db
        .select()
        .from(courseCurriculums)
        .where(eq(courseCurriculums.id, existingUserCurriculum.curriculumId))
        .limit(1);
      const skills = courseCurriculum[0] 
        ? await this.getCurriculumSkills(courseCurriculum[0].id)
        : [];
      
      return {
        curriculum: existingUserCurriculum,
        tasks,
        skills
      };
    }

    try {
      // Import AI service dynamically to avoid circular dependencies
      const { generateCourseCurriculum, generateCurriculumTasks } = await import('./ai-curriculum-service');
      
      // Get course, modules, and lessons (outside transaction)
      const course = await this.getCourse(courseId);
      if (!course) {
        throw new Error(`Course ${courseId} not found`);
      }
      
      const modules = await db
        .select()
        .from(db._.schema.modules)
        .where(eq(db._.schema.modules.courseId, courseId))
        .orderBy(asc(db._.schema.modules.order));
      
      const lessons = await db
        .select()
        .from(db._.schema.lessons)
        .where(inArray(
          db._.schema.lessons.moduleId,
          modules.map(m => m.id)
        ))
        .orderBy(asc(db._.schema.lessons.order));

      // Get user profile for personalization (outside transaction)
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      const userProfile = {
        currentLevel: user.level || 'Beginner',
        weeklyStudyHours: 10,
        learningPace: 'normal' as const,
        goals: user.interests || [],
        strengths: [],
        weaknesses: [],
        preferredLanguage: (user.language || 'en') as 'en' | 'tr'
      };

      // Generate curriculum and tasks using AI (outside transaction)
      const generatedCurriculum = await generateCourseCurriculum(
        course,
        modules,
        lessons,
        userProfile
      );

      const generatedTasks = await generateCurriculumTasks(
        generatedCurriculum,
        userProfile.weeklyStudyHours,
        new Date()
      );

      // Wrap all database operations in a transaction for atomicity
      return await db.transaction(async (tx) => {
        // Create course curriculum
        const [courseCurriculum] = await tx
          .insert(courseCurriculums)
          .values({
            courseId,
            titleEn: generatedCurriculum.titleEn,
            titleTr: generatedCurriculum.titleTr,
            descriptionEn: generatedCurriculum.descriptionEn,
            descriptionTr: generatedCurriculum.descriptionTr,
            goals: generatedCurriculum.goals,
            prerequisites: generatedCurriculum.prerequisites,
            totalDuration: generatedCurriculum.totalDuration,
            difficultyLevel: generatedCurriculum.difficultyLevel
          })
          .returning();

        // Create skills
        const createdSkills: CurriculumSkill[] = [];
        for (const skill of generatedCurriculum.skills) {
          const [createdSkill] = await tx
            .insert(curriculumSkills)
            .values({
              curriculumId: courseCurriculum.id,
              titleEn: skill.titleEn,
              titleTr: skill.titleTr,
              descriptionEn: skill.descriptionEn,
              descriptionTr: skill.descriptionTr,
              category: skill.category,
              estimatedHours: skill.estimatedHours,
              order: skill.order,
              prerequisites: skill.prerequisites,
              assessmentCriteria: skill.assessmentCriteria
            })
            .returning();
          createdSkills.push(createdSkill);
        }

        // Create curriculum modules
        for (const module of generatedCurriculum.modules) {
          await tx
            .insert(curriculumModules)
            .values({
              curriculumId: courseCurriculum.id,
              skillId: module.skillIndex !== undefined ? createdSkills[module.skillIndex]?.id || null : null,
              titleEn: module.titleEn,
              titleTr: module.titleTr,
              descriptionEn: module.descriptionEn,
              descriptionTr: module.descriptionTr,
              order: module.order,
              estimatedDuration: module.estimatedDuration,
              learningObjectives: module.learningObjectives,
              resources: module.resources
            });
        }

        // Create checkpoints
        for (const checkpoint of generatedCurriculum.checkpoints) {
          await tx
            .insert(curriculumCheckpoints)
            .values({
              curriculumId: courseCurriculum.id,
              titleEn: checkpoint.titleEn,
              titleTr: checkpoint.titleTr,
              descriptionEn: checkpoint.descriptionEn,
              descriptionTr: checkpoint.descriptionTr,
              checkpointType: checkpoint.checkpointType,
              order: checkpoint.order,
              requiredProgress: checkpoint.requiredProgress,
              requiredSkills: checkpoint.requiredSkills,
              passingScore: checkpoint.passingScore,
              estimatedDuration: checkpoint.estimatedDuration
            });
        }

        // Create user curriculum
        const [userCurriculum] = await tx
          .insert(userCurriculums)
          .values({
            userId,
            curriculumId: courseCurriculum.id,
            courseId,
            progress: 0,
            startedAt: new Date(),
            lastAccessedAt: new Date()
          })
          .returning();

        // Initialize skill progress for all skills
        for (const skill of createdSkills) {
          await tx
            .insert(userSkillProgress)
            .values({
              userCurriculumId: userCurriculum.id,
              skillId: skill.id,
              progress: 0,
              masteryLevel: 'beginner',
              attempts: 0,
              averageScore: 0,
              lastAttemptAt: null
            });
        }

        // Create tasks in database
        const createdTasks: UserCurriculumTask[] = [];
        for (const task of generatedTasks) {
          const [createdTask] = await tx
            .insert(userCurriculumTasks)
            .values({
              userCurriculumId: userCurriculum.id,
              skillId: task.skillIndices && task.skillIndices.length > 0 
                ? createdSkills[task.skillIndices[0]]?.id || null 
                : null,
              moduleId: null,
              titleEn: task.titleEn,
              titleTr: task.titleTr,
              descriptionEn: task.descriptionEn,
              descriptionTr: task.descriptionTr,
              taskType: task.taskType,
              scheduledDate: task.scheduledDate,
              estimatedDuration: task.estimatedDuration,
              isCompleted: false,
              completedAt: null,
              score: null
            })
            .returning();
          createdTasks.push(createdTask);
        }

        return {
          curriculum: userCurriculum,
          tasks: createdTasks,
          skills: createdSkills
        };
      });
    } catch (error) {
      console.error('Error generating and syncing curriculum:', error);
      throw new Error(`Failed to generate curriculum: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    const [upload] = await db.select().from(uploads).where(eq(uploads.id, id)).limit(1);
    return upload;
  }

  async getUserUploads(userId: number, uploadType?: string): Promise<Upload[]> {
    if (uploadType) {
      return await db.select().from(uploads)
        .where(and(eq(uploads.userId, userId), eq(uploads.uploadType, uploadType)))
        .orderBy(desc(uploads.uploadedAt));
    }
    return await db.select().from(uploads)
      .where(eq(uploads.userId, userId))
      .orderBy(desc(uploads.uploadedAt));
  }

  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [created] = await db.insert(uploads).values(upload).returning();
    return created;
  }

  async deleteUpload(id: number): Promise<boolean> {
    const result = await db.delete(uploads).where(eq(uploads.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getEssay(id: number): Promise<Essay | undefined> {
    const [essay] = await db.select().from(essays).where(eq(essays.id, id)).limit(1);
    return essay;
  }

  async getUserEssays(userId: number, courseId?: number): Promise<Essay[]> {
    if (courseId) {
      return await db.select().from(essays)
        .where(and(eq(essays.userId, userId), eq(essays.courseId, courseId)))
        .orderBy(desc(essays.createdAt));
    }
    return await db.select().from(essays)
      .where(eq(essays.userId, userId))
      .orderBy(desc(essays.createdAt));
  }

  async createEssay(essay: InsertEssay): Promise<Essay> {
    const [created] = await db.insert(essays).values(essay).returning();
    return created;
  }

  async updateEssay(id: number, data: Partial<Essay>): Promise<Essay | undefined> {
    const [updated] = await db.update(essays)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(essays.id, id))
      .returning();
    return updated;
  }

  async submitEssay(id: number): Promise<Essay | undefined> {
    const [updated] = await db.update(essays)
      .set({ 
        status: 'submitted', 
        submittedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(essays.id, id))
      .returning();
    return updated;
  }

  async generateAiFeedback(essayId: number, content: string): Promise<string> {
    return "AI feedback feature requires OpenAI API key configuration. Placeholder feedback returned.";
  }

  async getWeeklyStudyPlan(id: number): Promise<WeeklyStudyPlan | undefined> {
    const [plan] = await db.select().from(weeklyStudyPlans).where(eq(weeklyStudyPlans.id, id)).limit(1);
    return plan;
  }

  async getUserWeeklyStudyPlans(userId: number): Promise<WeeklyStudyPlan[]> {
    return await db.select().from(weeklyStudyPlans)
      .where(eq(weeklyStudyPlans.userId, userId))
      .orderBy(desc(weeklyStudyPlans.weekStartDate));
  }

  async getActiveWeeklyPlan(userId: number): Promise<WeeklyStudyPlan | undefined> {
    const [plan] = await db.select().from(weeklyStudyPlans)
      .where(and(
        eq(weeklyStudyPlans.userId, userId),
        eq(weeklyStudyPlans.status, 'active')
      ))
      .orderBy(desc(weeklyStudyPlans.weekStartDate))
      .limit(1);
    return plan;
  }

  async createWeeklyStudyPlan(plan: InsertWeeklyStudyPlan): Promise<WeeklyStudyPlan> {
    const [created] = await db.insert(weeklyStudyPlans).values(plan).returning();
    return created;
  }

  async updateWeeklyStudyPlan(id: number, data: Partial<WeeklyStudyPlan>): Promise<WeeklyStudyPlan | undefined> {
    const [updated] = await db.update(weeklyStudyPlans)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(weeklyStudyPlans.id, id))
      .returning();
    return updated;
  }

  async completeWeeklyPlan(id: number): Promise<WeeklyStudyPlan | undefined> {
    const [updated] = await db.update(weeklyStudyPlans)
      .set({ 
        status: 'completed',
        updatedAt: new Date()
      })
      .where(eq(weeklyStudyPlans.id, id))
      .returning();
    return updated;
  }

  async generateWeeklyAiRecommendations(userId: number, planId: number): Promise<string> {
    return "AI recommendations feature requires OpenAI API key configuration. Placeholder recommendations returned.";
  }
}

export const storage = new DatabaseStorage();