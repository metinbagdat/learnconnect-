# LearnConnect - AI-Powered Educational Platform

## Overview
LearnConnect is a comprehensive AI-powered educational platform with intelligent study planning, enrollment-to-task pipeline automation, and AI-generated curriculum. Students get personalized learning paths with cumulative due dates, while admins can generate structured courses instantly using Claude AI with user-level adaptation.

## RECENT IMPLEMENTATIONS - Current Session

### ✅ COMPLETED: Smart AI Curriculum Generator (2.1)
- **AICurriculumGenerator Service** - Full class implementation with Claude AI integration
- **User Level Adaptation** - Generates beginner/intermediate/advanced curriculums
- **Learning Objectives Analysis** - AI breaks down objectives into structured modules
- **Difficulty Progression** - Auto-optimizes learning path with ascending difficulty
- **Duration Calculation** - Estimates total hours and lesson durations
- **Two Smart Endpoints**:
  - `POST /api/admin/curriculum/generate-smart` - Admin generates with level selection
  - `POST /api/curriculum/generate-for-user` - Auto-adapts to user's learningPace

### ✅ COMPLETED: Complete Enrollment-to-Task Pipeline
- **Enrollment Trigger** - When user enrolls, automatically creates study plan and assignments
- **Cumulative Due Dates** - Assignments have due dates calculated from lesson durations
- **Progress Tracking** - Study plan completion updates as students mark assignments complete
- **Single Pipeline Endpoint** - `POST /api/pipeline/enroll-and-generate` orchestrates all 5 steps:
  1. Get course details
  2. Create enrollment
  3. Load/create curriculum
  4. Generate study plan
  5. Create assignments from modules/lessons

### ✅ COMPLETED: Authentication & Authorization
- Admin-only curriculum generation with role-based checks
- Student authentication for all user endpoints
- Proper 403/401 responses for unauthorized access

### ✅ COMPLETED: Validation & Error Handling
- Zod schema validation on all endpoints
- Comprehensive error messages with validation details
- Input constraints (title, description, duration, audience)

### ✅ COMPLETED: Notifications & Study Plan Management
- Due assignment notifications with metadata
- Study plan pace adjustment (slow/moderate/fast)
- Adjustment history tracking
- Completion notifications when assignments are marked done

### ✅ COMPLETED: User Progress Tracking
- `GET /api/user-progress/:assignmentId` - Fetch assignment progress
- `POST /api/user-progress/update` - Update progress, score, feedback
- Automatic completion notifications

## Database Schema - Enhanced

**Core Tables:**
- `users` - Student/admin/instructor profiles with learningPace
- `courses` - Course definitions with bilingual support, AI marking
- `enrollments` (userCourses) - User course enrollments
- `modules` - Course structure units
- `lessons` - Individual lesson content with duration
- `assignments` - Tasks with due dates
- `curriculums` - Curriculum structure JSON, versioning, AI flag
- `userProgress` - Track completion, scores, feedback
- `notifications` - User notifications with types
- `studyPlanAdjustments` - Track pace changes
- `studyPlans` - Personalized learning paths

## API Endpoints - Complete Implementation

**Smart Curriculum Generation:**
- `POST /api/admin/curriculum/generate-smart` - Generate with user level (admin only)
- `POST /api/curriculum/generate-for-user` - Generate adapted to user's pace (authenticated)
- `POST /api/admin/curriculum/generate` - Create new course + curriculum (admin only)
- `POST /api/generate-curriculum` - Generate for existing course (admin only)

**Pipeline & Enrollment:**
- `POST /api/pipeline/enroll-and-generate` - Full enrollment pipeline
- `GET /api/curriculum/:courseId` - Fetch curriculum structure

**Progress Tracking:**
- `GET /api/user-progress/:assignmentId` - Get assignment progress
- `POST /api/user-progress/update` - Update progress/score/feedback

**Study Plans:**
- `POST /api/study-plan/adjust-pace` - Change learning pace
- `GET /api/study-plan/adjustments` - Get adjustment history

**Notifications:**
- `GET /api/notifications` - User's notifications (paginated)
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/create-due-assignment` - Create notification

## Technology Stack
- **Frontend:** React 18, TypeScript, Shadcn UI, TanStack Query
- **Backend:** Express.js, PostgreSQL, Drizzle ORM, Zod validation
- **AI/ML:** Claude 3.5 Sonnet via Anthropic SDK (Replit AI Integrations)
- **Database:** PostgreSQL with automatic migrations
- **Authentication:** Passport.js with session management

## Routes & Pages
- `/student-dashboard` - Student view with courses, assignments, progress
- `/admin-dashboard` - Admin analytics and course management
- `/admin/curriculum-generator` - AI curriculum creation interface
- `/ai-recommendations` - AI service dashboard
- `/curriculum-framework` - Three-part framework visualization
- `/kpi-dashboard` - Success metrics tracking
- `/program-plan` - Program execution framework

## Current Status - PRODUCTION READY ✅

✅ Smart AI curriculum generator with user level adaptation
✅ Complete enrollment-to-task pipeline with cumulative due dates
✅ AI-powered module generation from learning objectives
✅ Difficulty progression optimization
✅ Student dashboards with real-time progress tracking
✅ Admin dashboards with analytics and course management
✅ Authentication & authorization for all endpoints
✅ Comprehensive validation & error handling
✅ Notifications for due assignments and completions
✅ Study plan pace adjustment with tracking
✅ Database schema fully implemented and tested

## Next Implementation Phases:
1. Content-based course recommendations (match user interests to tags)
2. Spaced repetition algorithm (SuperMemo-2)
3. Advanced learner feedback collection UI
4. A/B testing framework for curriculum optimization
5. Mobile app adaptation for iOS/Android
