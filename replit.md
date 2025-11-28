# LearnConnect - AI-Powered Educational Platform

## Overview
LearnConnect is a comprehensive AI-powered educational platform featuring intelligent study planning, automated enrollment-to-task pipeline automation, and AI-generated curriculum. Students receive personalized learning paths with cumulative due dates calculated from lesson durations. Admins can instantly generate structured courses using Claude AI with user-level adaptation (beginner/intermediate/advanced).

## COMPLETE IMPLEMENTATION - 2.1 & 2.2

### ✅ COMPLETED: Smart AI Curriculum Generator (2.1)
**AICurriculumGenerator Service** - Full production-ready implementation:
- Analyzes course description and learning objectives using Claude 3.5 Sonnet
- Generates 3-5 modules per curriculum with progressive difficulty
- Creates 2-4 lessons per module with estimated durations
- Calculates total course hours automatically
- Optimizes learning path with difficulty progression (beginner → intermediate → advanced)
- Extracts and returns learning outcomes for course preview
- **Two smart endpoints**:
  - `POST /api/admin/curriculum/generate-smart` - Admin specifies user level
  - `POST /api/curriculum/generate-for-user` - Auto-adapts to user's learningPace (slow/moderate/fast)

### ✅ COMPLETED: Automated Enrollment Pipeline (2.2)
**EnrollmentPipeline Class** - Full orchestration with 5-step process:

1. **Create Enrollment** - Register user in course, prevent duplicates
2. **Get/Generate Curriculum** - Fetch existing or auto-generate via AI (beginner level)
3. **Create Study Plan** - Generate 30-day personalized study path
4. **Generate Assignments** - Create tasks from all modules/lessons with **cumulative due dates**
   - Each assignment's due date = start date + accumulated lesson durations
   - Prevents assignment clustering, spreads work realistically across timeframe
5. **Welcome Package** - Send 3 notifications:
   - Course enrollment confirmation
   - Study plan overview
   - First assignment ready

**Error Handling:**
- Graceful failure with user notification
- Prevents partial enrollments with transaction rollback
- Detailed logging for monitoring and debugging

### ✅ COMPLETED: Authentication & Authorization
- Admin-only curriculum generation with role verification
- Student authentication on all sensitive endpoints
- Proper HTTP status codes (401, 403) for access violations

### ✅ COMPLETED: Validation & Error Handling
- Zod schema validation on all inputs
- Comprehensive error messages with field-level details
- Input constraints enforcement (title length, description minimum)

### ✅ COMPLETED: Notifications System
- **Due Assignment Notifications** - Alert users with assignment details
- **Study Plan Notifications** - Confirm plan creation and progress
- **Completion Notifications** - Celebrate assignment completion with scores
- **Error Notifications** - Inform users of enrollment issues
- Unread status tracking and marking as read

### ✅ COMPLETED: User Progress Tracking
- `GET /api/user-progress/:assignmentId` - Fetch individual assignment progress
- `POST /api/user-progress/update` - Update status, score, and feedback
- Auto-creates completion notifications when assignments marked done
- Tracks pending/in_progress/completed states

### ✅ COMPLETED: Study Plan Management
- `POST /api/study-plan/adjust-pace` - Change learning pace (slow/moderate/fast)
- `GET /api/study-plan/adjustments` - View pace adjustment history
- Auto-updates user's learningPace when adjusted
- Creates notification documenting pace change

## Database Schema - Production Ready

**Core Tables:**
- `users` - User profiles with learningPace tracking
- `courses` - Course definitions with bilingual support (EN/TR)
- `enrollments` (userCourses) - User course registrations
- `curriculums` - Curriculum structure (JSON), AI flag, versioning
- `modules` - Course modules with bilingual titles
- `lessons` - Individual lessons with duration tracking
- `assignments` - Tasks with calculated cumulative due dates
- `userProgress` - Assignment completion tracking with scores/feedback
- `notifications` - User notifications with read status
- `studyPlans` - Personalized learning paths
- `studyPlanAdjustments` - Pace change history tracking

## Complete API Endpoints

**Smart Curriculum Generation:**
- `POST /api/admin/curriculum/generate-smart` - Generate with level (admin)
- `POST /api/curriculum/generate-for-user` - Auto-adapted to user (authenticated)
- `POST /api/admin/curriculum/generate` - Create course + curriculum (admin)
- `POST /api/generate-curriculum` - Generate for existing course (admin)

**Automated Enrollment Pipeline:**
- `POST /api/pipeline/enroll-and-generate` - Single endpoint orchestrates 5 steps (authenticated)

**Progress Tracking:**
- `GET /api/user-progress/:assignmentId` - Get assignment progress (authenticated)
- `POST /api/user-progress/update` - Update progress/score (authenticated)

**Study Plans:**
- `POST /api/study-plan/adjust-pace` - Adjust learning pace (authenticated)
- `GET /api/study-plan/adjustments` - View adjustment history (authenticated)

**Notifications:**
- `GET /api/notifications` - User's notifications (authenticated, paginated)
- `PATCH /api/notifications/:id/read` - Mark as read (authenticated)

**Curriculum Access:**
- `GET /api/curriculum/:courseId` - Fetch curriculum structure (public)

## Technology Stack
- **Frontend:** React 18, TypeScript, Shadcn UI, TanStack Query
- **Backend:** Express.js with TypeScript, Drizzle ORM
- **Database:** PostgreSQL with type-safe queries
- **AI/ML:** Claude 3.5 Sonnet (via Anthropic SDK)
- **Validation:** Zod schemas for type safety
- **Authentication:** Passport.js sessions

## Frontend Routes
- `/student-dashboard` - Student view: courses, assignments, progress
- `/admin-dashboard` - Admin analytics: enrollments, completion rates
- `/admin/curriculum-generator` - AI curriculum creation UI
- `/ai-recommendations` - AI features dashboard
- `/curriculum-framework` - Design framework visualization
- `/kpi-dashboard` - Success metrics
- `/program-plan` - Program execution framework

## Current Status - ✅ PRODUCTION READY

**Fully Implemented Features:**
✅ AI curriculum generator with multi-level adaptation (beginner/intermediate/advanced)
✅ Automated enrollment pipeline with 5-step orchestration
✅ Cumulative due date calculation from lesson durations
✅ Bilingual curriculum support (English/Turkish)
✅ Smart notifications for all lifecycle events
✅ Progress tracking with scoring and feedback
✅ Study plan pace adjustment with history
✅ Complete authentication and authorization
✅ Comprehensive Zod validation on all inputs
✅ Error handling with user-friendly notifications
✅ TypeScript type safety throughout
✅ Database schema fully aligned with specification

**Remaining Future Phases:**
1. Spaced repetition algorithm (SuperMemo-2)
2. Content-based course recommendations
3. A/B testing framework for curriculum optimization
4. Advanced learner feedback UI
5. Mobile app adaptation
