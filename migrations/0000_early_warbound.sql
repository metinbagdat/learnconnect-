CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"image_url" text,
	"criteria" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"points_reward" integer DEFAULT 50 NOT NULL,
	"xp_reward" integer DEFAULT 25 NOT NULL,
	"badge_id" integer,
	"rarity" varchar(20) DEFAULT 'common' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" integer NOT NULL,
	"question_number" integer NOT NULL,
	"question_text" text NOT NULL,
	"question_type" text DEFAULT 'multiple_choice' NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"correct_answer" text NOT NULL,
	"user_answer" text,
	"is_correct" boolean,
	"difficulty" text NOT NULL,
	"skill_area" text,
	"time_spent_seconds" integer DEFAULT 0,
	"ai_generated" boolean DEFAULT true,
	"explanation" text
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"course_id" integer NOT NULL,
	"due_date" timestamp,
	"points" integer DEFAULT 10
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"criteria" text
);
--> statement-breakpoint
CREATE TABLE "challenge_learning_paths" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"estimated_hours" integer DEFAULT 0,
	"prerequisites" text[] DEFAULT '{}',
	"tags" text[] DEFAULT '{}',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "challenge_path_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"path_id" integer,
	"challenge_id" integer,
	"step_order" integer NOT NULL,
	"is_required" boolean DEFAULT true,
	"unlock_conditions" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"difficulty" varchar(20) DEFAULT 'medium' NOT NULL,
	"points_reward" integer DEFAULT 10 NOT NULL,
	"xp_reward" integer DEFAULT 5 NOT NULL,
	"badge_id" integer,
	"requirements" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"course_id" integer,
	"lesson_id" integer
);
--> statement-breakpoint
CREATE TABLE "course_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"total_enrollments" integer DEFAULT 0 NOT NULL,
	"completion_rate" integer DEFAULT 0,
	"average_rating" integer,
	"average_completion_time" integer,
	"dropoff_rate" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_curriculums" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"description_tr" text NOT NULL,
	"goals" text[] DEFAULT '{}',
	"prerequisites" text[] DEFAULT '{}',
	"total_duration_hours" integer,
	"difficulty_level" text,
	"is_ai_generated" boolean DEFAULT true,
	"ai_model" text,
	"generation_prompt" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recommendations" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"title_tr" text DEFAULT '' NOT NULL,
	"description_en" text DEFAULT '' NOT NULL,
	"description_tr" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"image_url" text,
	"module_count" integer DEFAULT 1 NOT NULL,
	"duration_hours" integer,
	"instructor_id" integer NOT NULL,
	"rating" integer,
	"level" text,
	"is_ai_generated" boolean DEFAULT false,
	"price" numeric(10, 2) DEFAULT '0.00',
	"is_premium" boolean DEFAULT false,
	"stripe_price_id" text,
	"parent_course_id" integer,
	"depth" integer DEFAULT 0 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curriculum_checkpoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"curriculum_id" integer NOT NULL,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"description_tr" text NOT NULL,
	"checkpoint_type" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"required_progress" integer,
	"required_skills" integer[] DEFAULT '{}',
	"passing_score" integer,
	"estimated_duration_minutes" integer,
	"resources" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curriculum_modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"curriculum_id" integer NOT NULL,
	"skill_id" integer,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"description_tr" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"estimated_duration_hours" integer,
	"learning_objectives" text[] DEFAULT '{}',
	"resources" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curriculum_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"curriculum_id" integer NOT NULL,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"description_tr" text NOT NULL,
	"category" text NOT NULL,
	"estimated_hours" integer,
	"order" integer DEFAULT 0 NOT NULL,
	"prerequisites" integer[] DEFAULT '{}',
	"assessment_criteria" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_study_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"subject_id" integer,
	"topic_id" integer,
	"task_type" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"estimated_duration_minutes" integer DEFAULT 60,
	"actual_duration_minutes" integer,
	"scheduled_date" date NOT NULL,
	"scheduled_time" text,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"difficulty_rating" integer,
	"satisfaction_rating" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emoji_reactions" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"milestone_id" varchar(50) NOT NULL,
	"user_id" integer NOT NULL,
	"emoji" varchar(10) NOT NULL,
	"ai_context" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "essays" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer,
	"title" text NOT NULL,
	"prompt" text,
	"content" text,
	"file_id" integer,
	"status" text DEFAULT 'draft' NOT NULL,
	"word_count" integer,
	"submitted_at" timestamp,
	"reviewed_at" timestamp,
	"grade" integer,
	"ai_feedback" text,
	"instructor_feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"leaderboard_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"rank" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"timeframe" varchar(20) DEFAULT 'weekly' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"lesson_id" integer,
	"course_id" integer,
	"activity_type" text NOT NULL,
	"time_spent_seconds" integer,
	"interaction_data" jsonb DEFAULT '{}'::jsonb,
	"performance_score" numeric(3, 2),
	"difficulty_rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_milestones" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"course_id" integer,
	"lesson_id" integer,
	"achievement_id" integer,
	"progress" integer,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_path_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"path_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"order" integer NOT NULL,
	"required" boolean DEFAULT true,
	"completed" boolean DEFAULT false,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "learning_paths" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"goal" text NOT NULL,
	"estimated_duration_hours" integer,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_ai_generated" boolean DEFAULT true,
	"exam_type" text,
	"exam_subjects" text[] DEFAULT '{}',
	"difficulty_level" text DEFAULT 'intermediate',
	"target_score" integer,
	"exam_date" date,
	"study_schedule" jsonb,
	"custom_requirements" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "learning_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"action_required" boolean DEFAULT false NOT NULL,
	"priority" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_trails" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"trail_data" jsonb NOT NULL,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"estimated_time_minutes" integer,
	"is_ai_generated" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"title_en" text DEFAULT '' NOT NULL,
	"title_tr" text DEFAULT '' NOT NULL,
	"content_en" text DEFAULT '' NOT NULL,
	"content_tr" text DEFAULT '' NOT NULL,
	"description" text,
	"description_en" text DEFAULT '' NOT NULL,
	"description_tr" text DEFAULT '' NOT NULL,
	"order" integer NOT NULL,
	"estimated_time" integer DEFAULT 30,
	"tags" text[] DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE "level_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject" text NOT NULL,
	"sub_category" text,
	"assessment_type" text DEFAULT 'skill_level' NOT NULL,
	"difficulty" text NOT NULL,
	"total_questions" integer DEFAULT 10 NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"time_spent_minutes" integer DEFAULT 0 NOT NULL,
	"final_level" text,
	"confidence_score" integer DEFAULT 75,
	"recommended_next_steps" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mentors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"is_ai_mentor" boolean DEFAULT false,
	"specialization" text[] DEFAULT '{}',
	"languages" text[] DEFAULT '{"en"}',
	"availability_schedule" jsonb,
	"max_students" integer DEFAULT 50,
	"rating" numeric(3, 2) DEFAULT '5.0',
	"bio" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"title_tr" text DEFAULT '' NOT NULL,
	"description_en" text DEFAULT '' NOT NULL,
	"description_tr" text DEFAULT '' NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personalized_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recommendation_type" text NOT NULL,
	"resource_id" integer NOT NULL,
	"resource_type" text NOT NULL,
	"ai_reasoning" text NOT NULL,
	"confidence" numeric(3, 2) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"viewed_at" timestamp,
	"accepted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "program_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"week" integer NOT NULL,
	"day" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"course_id" integer,
	"lesson_id" integer,
	"activity_type" text DEFAULT 'lesson' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"resources" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "skill_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"checkpoint_id" integer,
	"user_curriculum_id" integer NOT NULL,
	"assessment_type" text NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer,
	"correct_answers" integer,
	"time_spent_minutes" integer,
	"feedback" text,
	"ai_feedback" text,
	"strengths" text[] DEFAULT '{}',
	"weaknesses" text[] DEFAULT '{}',
	"recommendations" text[] DEFAULT '{}',
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"difficulty" text NOT NULL,
	"category" text NOT NULL,
	"time_limit" integer DEFAULT 60 NOT NULL,
	"points" integer DEFAULT 10 NOT NULL,
	"xp_reward" integer DEFAULT 5 NOT NULL,
	"bonus_multiplier" numeric DEFAULT '1.0',
	"streak_bonus" integer DEFAULT 0,
	"question" text NOT NULL,
	"options" text[],
	"correct_answer" text NOT NULL,
	"explanation" text NOT NULL,
	"hint" text,
	"media_url" text,
	"code_template" text,
	"test_cases" jsonb,
	"matching_pairs" jsonb,
	"order_sequence" text[],
	"prerequisites" text[] DEFAULT '{}',
	"tags" text[] DEFAULT '{}',
	"course_id" integer,
	"module_id" integer,
	"lesson_id" integer,
	"unlock_conditions" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"goal_type" text NOT NULL,
	"target_exam" text,
	"target_date" date NOT NULL,
	"study_hours_per_week" integer NOT NULL,
	"priority" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"subjects" text[] DEFAULT '{}',
	"current_progress" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"target_group" text NOT NULL,
	"course_ids" integer[] NOT NULL,
	"total_duration_weeks" integer NOT NULL,
	"weekly_hours" integer DEFAULT 10 NOT NULL,
	"is_ai_generated" boolean DEFAULT false,
	"created_by" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "study_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"goal_id" integer NOT NULL,
	"date" date NOT NULL,
	"hours_studied" integer DEFAULT 0 NOT NULL,
	"lessons_completed" integer DEFAULT 0 NOT NULL,
	"performance_score" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"goal_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"subject" text NOT NULL,
	"lesson_id" integer,
	"is_completed" boolean DEFAULT false NOT NULL,
	"scheduled_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"program_id" integer,
	"schedule_id" integer,
	"course_id" integer,
	"lesson_id" integer,
	"session_date" date NOT NULL,
	"planned_start_time" text,
	"actual_start_time" timestamp,
	"planned_end_time" text,
	"actual_end_time" timestamp,
	"duration_minutes" integer DEFAULT 0,
	"was_planned" boolean DEFAULT true,
	"completion_rate" integer DEFAULT 0,
	"focus_score" integer,
	"difficulty_score" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"stripe_price_id" text,
	"features" jsonb NOT NULL,
	"assessment_limit" integer DEFAULT -1,
	"course_access_limit" integer DEFAULT -1,
	"analytics_level" text DEFAULT 'basic' NOT NULL,
	"ai_recommendations" boolean DEFAULT false,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trail_nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"trail_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"node_position" jsonb NOT NULL,
	"node_type" text DEFAULT 'lesson' NOT NULL,
	"unlock_conditions" jsonb DEFAULT '{}'::jsonb,
	"hover_info" jsonb NOT NULL,
	"rewards" jsonb DEFAULT '{}'::jsonb,
	"is_optional" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tyt_student_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"student_class" integer NOT NULL,
	"exam_year" integer NOT NULL,
	"target_net_score" integer NOT NULL,
	"daily_study_hours_target" integer NOT NULL,
	"weekly_study_hours_target" integer NOT NULL,
	"selected_subjects" text[] DEFAULT '{}',
	"weak_subjects" text[] DEFAULT '{}',
	"strong_subjects" text[] DEFAULT '{}',
	"study_preferences" jsonb DEFAULT '{}'::jsonb,
	"motivation_level" integer DEFAULT 5,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tyt_student_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "tyt_study_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"goal_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_value" integer NOT NULL,
	"current_value" integer DEFAULT 0,
	"unit" text NOT NULL,
	"deadline" date,
	"priority" text DEFAULT 'medium',
	"category" text NOT NULL,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tyt_study_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject_id" integer,
	"topic_id" integer,
	"task_id" integer,
	"session_type" text NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"duration_minutes" integer,
	"focus_rating" integer,
	"productivity_rating" integer,
	"distractions" text[] DEFAULT '{}',
	"study_method" text,
	"materials_used" text[] DEFAULT '{}',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tyt_study_streaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"streak_type" text NOT NULL,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_activity_date" date,
	"streak_start_date" date,
	"target" jsonb DEFAULT '{}'::jsonb,
	"rewards" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tyt_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"total_questions" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "tyt_subjects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tyt_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"estimated_study_hours" integer DEFAULT 2,
	"order" integer DEFAULT 0 NOT NULL,
	"prerequisites" text[] DEFAULT '{}',
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "tyt_trial_exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"exam_name" text NOT NULL,
	"exam_date" date NOT NULL,
	"duration_minutes" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"wrong_answers" integer NOT NULL,
	"empty_answers" integer NOT NULL,
	"net_score" numeric(5, 2) NOT NULL,
	"subject_scores" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"percentile_rank" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"path" text NOT NULL,
	"upload_type" text DEFAULT 'general' NOT NULL,
	"entity_type" text,
	"entity_id" integer,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL,
	"points_earned" integer DEFAULT 0,
	"xp_earned" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" text NOT NULL,
	"resource_type" text,
	"resource_id" integer,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "user_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"assignment_id" integer NOT NULL,
	"status" text DEFAULT 'not_started',
	"submitted_at" timestamp,
	"grade" integer,
	"feedback" text
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"badge_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_challenge_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"path_id" integer,
	"current_step" integer DEFAULT 0,
	"completed_steps" integer[] DEFAULT '{}',
	"total_score" integer DEFAULT 0,
	"completion_percentage" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"last_active_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_challenge_streaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"category" text NOT NULL,
	"current_streak" integer DEFAULT 0,
	"max_streak" integer DEFAULT 0,
	"last_correct_at" timestamp,
	"streak_started_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"challenge_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"points_earned" integer DEFAULT 0,
	"xp_earned" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"current_module" integer DEFAULT 1 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_curriculum_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_curriculum_id" integer NOT NULL,
	"daily_task_id" integer,
	"curriculum_module_id" integer,
	"skill_id" integer,
	"task_type" text NOT NULL,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"description_en" text,
	"description_tr" text,
	"scheduled_date" date,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"skill_progress" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_curriculums" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"curriculum_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"status" text DEFAULT 'active',
	"progress" integer DEFAULT 0,
	"start_date" date DEFAULT now() NOT NULL,
	"target_completion_date" date,
	"actual_completion_date" date,
	"weekly_study_hours" integer DEFAULT 10,
	"pace_preference" text DEFAULT 'normal',
	"adaptations" jsonb DEFAULT '{}'::jsonb,
	"last_evaluation_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"progress" integer DEFAULT 0,
	"last_accessed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"current_xp" integer DEFAULT 0 NOT NULL,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"next_level_xp" integer DEFAULT 100 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_activity_date" date,
	"total_points" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_levels_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_mentors" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"mentor_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	"preferred_communication" text DEFAULT 'chat',
	"communication_language" text DEFAULT 'en',
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "user_program_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"program_id" integer NOT NULL,
	"current_week" integer DEFAULT 1,
	"completed_hours" integer DEFAULT 0,
	"total_hours" integer NOT NULL,
	"progress" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp,
	"completed_at" timestamp,
	"status" text DEFAULT 'active',
	"weekly_goal_hours" integer DEFAULT 10,
	"actual_weekly_hours" integer DEFAULT 0,
	"adherence_score" numeric(3, 2) DEFAULT '100.0'
);
--> statement-breakpoint
CREATE TABLE "user_progress_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"snapshot_date" date NOT NULL,
	"courses_enrolled" integer DEFAULT 0 NOT NULL,
	"courses_completed" integer DEFAULT 0 NOT NULL,
	"lessons_completed" integer DEFAULT 0 NOT NULL,
	"assignments_completed" integer DEFAULT 0 NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"badges_earned" integer DEFAULT 0 NOT NULL,
	"average_grade" integer
);
--> statement-breakpoint
CREATE TABLE "user_skill_challenge_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"challenge_id" integer NOT NULL,
	"answer" text NOT NULL,
	"time_spent" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"points_earned" integer DEFAULT 0 NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	"bonus_points_earned" integer DEFAULT 0,
	"streak_count" integer DEFAULT 0,
	"perfect_score" boolean DEFAULT false,
	"speed_bonus" integer DEFAULT 0,
	"timed_out" boolean DEFAULT false NOT NULL,
	"hint_used" boolean DEFAULT false NOT NULL,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_skill_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject" text NOT NULL,
	"sub_category" text,
	"current_level" text NOT NULL,
	"proficiency_score" integer NOT NULL,
	"last_assessment_id" integer,
	"assessment_count" integer DEFAULT 1 NOT NULL,
	"improvement_rate" numeric(5, 2) DEFAULT '0.00',
	"strong_areas" text[] DEFAULT '{}',
	"weak_areas" text[] DEFAULT '{}',
	"next_recommended_level" text,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_skill_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"user_curriculum_id" integer NOT NULL,
	"mastery_level" integer DEFAULT 0,
	"assessment_score" integer,
	"practice_hours" integer DEFAULT 0,
	"last_practice_date" timestamp,
	"strength_areas" text[] DEFAULT '{}',
	"improvement_areas" text[] DEFAULT '{}',
	"ai_recommendations" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"stripe_subscription_id" text,
	"stripe_customer_id" text,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"trial_ends_at" timestamp,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_topic_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"topic_id" integer NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"progress_percent" integer DEFAULT 0,
	"time_spent_minutes" integer DEFAULT 0,
	"last_studied_at" timestamp,
	"mastery_level" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_trail_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"trail_id" integer NOT NULL,
	"completed_nodes" integer[] DEFAULT '{}',
	"current_node" integer,
	"progress" integer DEFAULT 0,
	"time_spent_minutes" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_usage_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"assessments_used" integer DEFAULT 0 NOT NULL,
	"courses_accessed" integer DEFAULT 0 NOT NULL,
	"analytics_views" integer DEFAULT 0 NOT NULL,
	"ai_recommendations_generated" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"display_name" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"avatar_url" text,
	"interests" text[],
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "weekly_study_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"week_start_date" date NOT NULL,
	"week_end_date" date NOT NULL,
	"total_planned_hours" integer,
	"total_actual_hours" integer DEFAULT 0,
	"goals" text[] DEFAULT '{}',
	"priorities" text[] DEFAULT '{}',
	"ai_recommendations" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessment_id_level_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."level_assessments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_path_steps" ADD CONSTRAINT "challenge_path_steps_path_id_challenge_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."challenge_learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_path_steps" ADD CONSTRAINT "challenge_path_steps_challenge_id_skill_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."skill_challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_curriculums" ADD CONSTRAINT "course_curriculums_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_checkpoints" ADD CONSTRAINT "curriculum_checkpoints_curriculum_id_course_curriculums_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."course_curriculums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_curriculum_id_course_curriculums_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."course_curriculums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_skill_id_curriculum_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."curriculum_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_skills" ADD CONSTRAINT "curriculum_skills_curriculum_id_course_curriculums_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."course_curriculums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_study_tasks" ADD CONSTRAINT "daily_study_tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_study_tasks" ADD CONSTRAINT "daily_study_tasks_subject_id_tyt_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."tyt_subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_study_tasks" ADD CONSTRAINT "daily_study_tasks_topic_id_tyt_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."tyt_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emoji_reactions" ADD CONSTRAINT "emoji_reactions_milestone_id_learning_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."learning_milestones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emoji_reactions" ADD CONSTRAINT "emoji_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essays" ADD CONSTRAINT "essays_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essays" ADD CONSTRAINT "essays_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essays" ADD CONSTRAINT "essays_file_id_uploads_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."uploads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_leaderboard_id_leaderboards_id_fk" FOREIGN KEY ("leaderboard_id") REFERENCES "public"."leaderboards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_analytics" ADD CONSTRAINT "learning_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_analytics" ADD CONSTRAINT "learning_analytics_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_analytics" ADD CONSTRAINT "learning_analytics_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_milestones" ADD CONSTRAINT "learning_milestones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_milestones" ADD CONSTRAINT "learning_milestones_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_milestones" ADD CONSTRAINT "learning_milestones_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_milestones" ADD CONSTRAINT "learning_milestones_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_trails" ADD CONSTRAINT "lesson_trails_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personalized_recommendations" ADD CONSTRAINT "personalized_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_schedules" ADD CONSTRAINT "program_schedules_program_id_study_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."study_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_schedules" ADD CONSTRAINT "program_schedules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_schedules" ADD CONSTRAINT "program_schedules_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_assessments" ADD CONSTRAINT "skill_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_assessments" ADD CONSTRAINT "skill_assessments_skill_id_curriculum_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."curriculum_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_assessments" ADD CONSTRAINT "skill_assessments_checkpoint_id_curriculum_checkpoints_id_fk" FOREIGN KEY ("checkpoint_id") REFERENCES "public"."curriculum_checkpoints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_assessments" ADD CONSTRAINT "skill_assessments_user_curriculum_id_user_curriculums_id_fk" FOREIGN KEY ("user_curriculum_id") REFERENCES "public"."user_curriculums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_programs" ADD CONSTRAINT "study_programs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_program_id_study_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."study_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_schedule_id_program_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."program_schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trail_nodes" ADD CONSTRAINT "trail_nodes_trail_id_lesson_trails_id_fk" FOREIGN KEY ("trail_id") REFERENCES "public"."lesson_trails"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trail_nodes" ADD CONSTRAINT "trail_nodes_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_student_profiles" ADD CONSTRAINT "tyt_student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_study_goals" ADD CONSTRAINT "tyt_study_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_study_sessions" ADD CONSTRAINT "tyt_study_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_study_sessions" ADD CONSTRAINT "tyt_study_sessions_subject_id_tyt_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."tyt_subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_study_sessions" ADD CONSTRAINT "tyt_study_sessions_topic_id_tyt_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."tyt_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_study_sessions" ADD CONSTRAINT "tyt_study_sessions_task_id_daily_study_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."daily_study_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_study_streaks" ADD CONSTRAINT "tyt_study_streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_topics" ADD CONSTRAINT "tyt_topics_subject_id_tyt_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."tyt_subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tyt_trial_exams" ADD CONSTRAINT "tyt_trial_exams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_path_id_challenge_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."challenge_learning_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_curriculum_tasks" ADD CONSTRAINT "user_curriculum_tasks_user_curriculum_id_user_curriculums_id_fk" FOREIGN KEY ("user_curriculum_id") REFERENCES "public"."user_curriculums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_curriculum_tasks" ADD CONSTRAINT "user_curriculum_tasks_daily_task_id_daily_study_tasks_id_fk" FOREIGN KEY ("daily_task_id") REFERENCES "public"."daily_study_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_curriculum_tasks" ADD CONSTRAINT "user_curriculum_tasks_curriculum_module_id_curriculum_modules_id_fk" FOREIGN KEY ("curriculum_module_id") REFERENCES "public"."curriculum_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_curriculum_tasks" ADD CONSTRAINT "user_curriculum_tasks_skill_id_curriculum_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."curriculum_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_curriculums" ADD CONSTRAINT "user_curriculums_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_curriculums" ADD CONSTRAINT "user_curriculums_curriculum_id_course_curriculums_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."course_curriculums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_curriculums" ADD CONSTRAINT "user_curriculums_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_levels" ADD CONSTRAINT "user_levels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mentors" ADD CONSTRAINT "user_mentors_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mentors" ADD CONSTRAINT "user_mentors_mentor_id_mentors_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_program_progress" ADD CONSTRAINT "user_program_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_program_progress" ADD CONSTRAINT "user_program_progress_program_id_study_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."study_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_levels" ADD CONSTRAINT "user_skill_levels_last_assessment_id_level_assessments_id_fk" FOREIGN KEY ("last_assessment_id") REFERENCES "public"."level_assessments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_progress" ADD CONSTRAINT "user_skill_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_progress" ADD CONSTRAINT "user_skill_progress_skill_id_curriculum_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."curriculum_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_progress" ADD CONSTRAINT "user_skill_progress_user_curriculum_id_user_curriculums_id_fk" FOREIGN KEY ("user_curriculum_id") REFERENCES "public"."user_curriculums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_progress" ADD CONSTRAINT "user_topic_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_progress" ADD CONSTRAINT "user_topic_progress_topic_id_tyt_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."tyt_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_trail_progress" ADD CONSTRAINT "user_trail_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_trail_progress" ADD CONSTRAINT "user_trail_progress_trail_id_lesson_trails_id_fk" FOREIGN KEY ("trail_id") REFERENCES "public"."lesson_trails"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_study_plans" ADD CONSTRAINT "weekly_study_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;