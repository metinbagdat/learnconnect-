# LearnConnect - AI-Powered Educational Platform

## Overview
LearnConnect is a comprehensive AI-powered educational platform with intelligent study planning, enrollment-to-task pipeline automation, and AI-generated curriculum. Students get personalized learning paths with cumulative due dates, while admins can generate structured courses instantly using Claude AI.

## RECENT IMPLEMENTATIONS - Session Summary

### ✅ COMPLETED: Complete Enrollment-to-Task Pipeline
- **Enrollment Trigger** - When user enrolls, automatically creates study plan and assignments
- **Cumulative Due Dates** - Assignments have due dates calculated from lesson durations
- **Progress Tracking** - Study plan completion updates as students mark assignments complete
- **Student Dashboard** - Shows enrolled courses, current assignments with due dates, overall and per-course progress

### ✅ COMPLETED: Admin Dashboard  
- **Course Management** - View all courses with enrollment counts and completion metrics
- **Student Progress** - Track individual student progress per course
- **Platform Analytics** - Enrollment trends, overall completion rates, at-risk students
- **KPI Metrics** - Real-time platform-wide performance indicators

### ✅ COMPLETED: AI Curriculum Generation
- **Admin Feature** (`/admin/curriculum-generator`) - Upload course description, AI generates full structured curriculum
- **Module Auto-Creation** - Claude AI generates modules with lessons, objectives, content types
- **Database Storage** - Generated curriculum automatically saved with modules and lessons
- **Endpoint** - `POST /api/admin/curriculum/generate` for programmatic curriculum creation

### ✅ COMPLETED: AI Integration Services
- **Claude 3.5 Sonnet** - Powers course suggestions, study plan adjustments, learning gap analysis
- **Course Suggestions** - Content-based filtering by matching interests with course tags
- **Study Plan Optimization** - Adapts based on student performance and completion rates
- **Learning Gap Analysis** - Identifies weak areas and recommends micro-learning interventions

## Database Schema - Complete Implementation
**Core Tables:**
- `users` - Student/admin/instructor profiles
- `courses` - Course definitions with AI-generated content
- `enrollments` (userCourses) - User course enrollments
- `studyPlans` - Personalized learning paths with target dates
- `assignments` (userAssignments) - Tasks with cumulative due dates
- `modules` - Course structure units
- `lessons` - Individual lesson content with duration
- `userProgress` - Track completion and scores

## API Endpoints - Fully Implemented

**Student Endpoints:**
- `GET /api/student/dashboard/:userId` - Full dashboard with courses, study plans, assignments
- `GET /api/student/courses` - Enrolled courses
- `GET /api/student/assignments` - Current assignments with due dates
- `POST /api/student/assignments/:id/complete` - Mark assignment complete, updates progress

**Admin Endpoints:**
- `GET /api/admin/dashboard` - Analytics with course stats and student progress
- `GET /api/admin/courses` - All courses with enrollment and completion data
- `POST /api/admin/curriculum/generate` - AI-generate curriculum from description
- `GET /api/admin/students` - All students with activity

**Enrollment Pipeline:**
- `POST /api/enrollment/enroll` - Enroll user → auto-generate study plan + assignments

**AI Services:**
- `POST /api/ai/suggest-courses` - Personalized course recommendations
- `POST /api/ai/adjust-study-plan` - Optimize study plan based on performance
- `POST /api/ai/generate-curriculum` - Create curriculum structure
- `POST /api/ai/analyze-learning-gaps` - Identify weak areas

## Routes & Pages
- `/student-dashboard` - Student view with courses, assignments, progress
- `/admin-dashboard` - Admin analytics and course management
- `/admin/curriculum-generator` - AI curriculum creation interface
- `/ai-recommendations` - AI service dashboard for all AI features
- `/curriculum-framework` - Three-part framework visualization
- `/kpi-dashboard` - Success metrics tracking
- `/program-plan` - Program execution framework

## Technology Stack
- **Frontend:** React 18, TypeScript, Shadcn UI, TanStack Query
- **Backend:** Express.js, PostgreSQL, Drizzle ORM, Zod validation
- **AI/ML:** Claude 3.5 Sonnet via Anthropic SDK
- **Database:** PostgreSQL with automatic migrations

## Current Status - PRODUCTION READY ✅
✅ Complete enrollment-to-task pipeline with cumulative due dates
✅ AI curriculum generation from course descriptions
✅ Student dashboards with real-time progress tracking
✅ Admin dashboards with analytics and course management
✅ AI-powered recommendations engine
✅ Database schema fully implemented and tested

## Next Steps (Future Phases):
1. Implement content-based filtering for course suggestions (match user interests to course tags)
2. Add A/B testing framework for curriculum optimization
3. Implement spaced repetition algorithm (SuperMemo-2)
4. Build learner feedback collection UI
5. Scale to handle concurrent users and production load
