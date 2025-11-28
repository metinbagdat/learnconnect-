# LearnConnect - AI-Powered Educational Platform

## Overview
LearnConnect is a comprehensive AI-powered educational platform featuring intelligent study planning, automated enrollment-to-task pipeline automation, AI-generated curriculum, adaptive learning adjustments, and real-time progress tracking. Students receive personalized learning paths with cumulative due dates calculated from lesson durations. Admins can instantly generate structured courses using Claude AI with user-level adaptation (beginner/intermediate/advanced).

---

## 🎯 COMPLETE IMPLEMENTATION - FEATURES 2.1 THROUGH 4.2

### ✅ FEATURE 2.1: Smart AI Curriculum Generator
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

### ✅ FEATURE 2.2: Automated Enrollment Pipeline
**EnrollmentPipeline Class** - Full 5-step orchestration:
1. **Create Enrollment** - Register user in course, prevent duplicates
2. **Get/Generate Curriculum** - Fetch existing or auto-generate via AI
3. **Create Study Plan** - Generate 30-day personalized study path
4. **Generate Assignments** - Create tasks with **cumulative due dates** (each assignment's due date = start date + accumulated lesson durations)
5. **Welcome Package** - Send 3 notifications:
   - Course enrollment confirmation
   - Study plan overview
   - First assignment ready

**Single Endpoint:**
- `POST /api/pipeline/enroll-and-generate` - Orchestrates entire 5-step process

### ✅ FEATURE 3.1: Student Dashboard Components
**Four Smart Widgets** - Comprehensive learning interface:

1. **ProgressWidget** - Current course, completion %, next assignment at a glance
2. **AISuggestions** - AI-powered personalized recommendations (3 suggestions shown)
3. **StudyTimeline** - Study plan visualization with pace adjustment controls
4. **PerformanceAnalytics** - Key metrics (avg score, completion rate, hours), strengths, improvement areas

**Dashboard Route:**
- `/dashboard-smart` - Full smart dashboard with all widgets integrated

### ✅ FEATURE 4.1: Intelligent Suggestions Engine
**SuggestionEngine Service** - AI-powered recommendation system:
- Analyzes user's learning data (completion rates, scores, engagement patterns)
- Generates 5 suggestion types in parallel:
  - **Learning Path** - Start advanced modules or review foundations
  - **Resource** - Target weak areas with extra materials
  - **Pace** - Slow down if struggling, speed up if excelling
  - **Peer Learning** - Join study groups or become mentor
  - **Review** - Catch performance dips and recommend reviews
- Prioritizes suggestions by urgency (high/medium/low) and type
- Provides reasoning for each suggestion
- **Two API Endpoints:**
  - `GET /api/suggestions/generate/:userId` - Full detailed suggestions (admin/self)
  - `GET /api/ai/suggestions/smart` - Dashboard-optimized top 5 suggestions

### ✅ FEATURE 4.2: Adaptive Learning System
**AdaptiveLearningSystem Service** - Dynamic curriculum optimization:
- Analyzes performance data (scores, trends, engagement)
- Detects learning patterns: improving/declining/stable trends
- Automatically adjusts study plans when needed
- Re-optimizes assignment due dates based on performance insights
- Updates user's learning pace (slow/moderate/fast)
- Sends notifications explaining plan adjustments
- **Two API Endpoints:**
  - `POST /api/adaptive/adjust-curriculum` - Manual curriculum adjustment
  - `POST /api/adaptive/auto-check` - Automated check (triggers on 3+ assignments)

---

## 📊 Complete Database Schema

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

---

## 🔌 Complete API Endpoints

**Smart Curriculum Generation:**
- `POST /api/admin/curriculum/generate-smart` - Generate with level (admin)
- `POST /api/curriculum/generate-for-user` - Auto-adapted to user (authenticated)
- `POST /api/admin/curriculum/generate` - Create course + curriculum (admin)
- `GET /api/curriculum/:courseId` - Fetch curriculum structure (public)

**Automated Enrollment Pipeline:**
- `POST /api/pipeline/enroll-and-generate` - Single endpoint orchestrates 5 steps

**AI Suggestions Engine:**
- `GET /api/suggestions/generate/:userId` - Full suggestion generation
- `GET /api/ai/suggestions/smart` - Dashboard suggestions (top 5)

**Adaptive Learning System:**
- `POST /api/adaptive/adjust-curriculum` - Manual adjustment with performance data
- `POST /api/adaptive/auto-check` - Automated check and adjustment

**Progress Tracking:**
- `GET /api/user-progress/:assignmentId` - Get assignment progress
- `POST /api/user-progress/update` - Update progress/score

**Study Plans:**
- `POST /api/study-plan/adjust-pace` - Adjust learning pace
- `GET /api/study-plan/adjustments` - View adjustment history

**Notifications:**
- `GET /api/notifications` - User's notifications (paginated)
- `PATCH /api/notifications/:id/read` - Mark as read

**Dashboard & Analytics:**
- `GET /api/admin/dashboard` - Admin analytics
- `GET /api/admin/analytics` - Platform metrics
- `GET /api/student/dashboard/:userId` - Student dashboard data

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Shadcn UI, TanStack Query, Wouter
- **Backend:** Express.js with TypeScript, Drizzle ORM, Passport.js
- **Database:** PostgreSQL with type-safe queries
- **AI/ML:** Claude 3.5 Sonnet (via Anthropic SDK)
- **Validation:** Zod schemas for type safety
- **Authentication:** Passport.js sessions with role-based access

---

## 📱 Frontend Routes

- `/` - Landing page (public)
- `/login` - Authentication page (public)
- `/student-dashboard` - Student view: courses, assignments, progress
- `/dashboard-smart` - Smart dashboard with AI widgets
- `/admin-dashboard` - Admin analytics: enrollments, completion rates
- `/admin/curriculum-generator` - AI curriculum creation UI
- `/ai-recommendations` - AI features dashboard
- `/curriculum-framework` - Design framework visualization
- `/kpi-dashboard` - Success metrics
- `/program-plan` - Program execution framework

---

## ✅ Implementation Status - PRODUCTION READY

**Fully Implemented Features:**
✅ AI curriculum generator with multi-level adaptation (beginner/intermediate/advanced)
✅ Automated enrollment pipeline with 5-step orchestration
✅ Cumulative due date calculation from lesson durations
✅ Bilingual curriculum support (English/Turkish)
✅ Student dashboard with 4 smart widgets
✅ AI-powered suggestions engine with 5 recommendation types
✅ Adaptive learning system with performance-based curriculum adjustments
✅ Smart notifications for all lifecycle events
✅ Progress tracking with scoring and feedback
✅ Study plan pace adjustment with history
✅ Complete authentication and authorization
✅ Comprehensive Zod validation on all inputs
✅ Error handling with user-friendly notifications
✅ TypeScript type safety throughout
✅ Database schema fully aligned with specification
✅ Cumulative assignment due dates prevent clustering
✅ Performance analysis with trend detection
✅ User pace recommendations based on performance

**Current Status:** ✅ **PRODUCTION READY** - All core features implemented, tested, and integrated. Server running successfully on port 5000 with all endpoints operational.

**Future Enhancements:**
1. Spaced repetition algorithm (SuperMemo-2)
2. Content-based course recommendations using ML
3. A/B testing framework for curriculum optimization
4. Advanced learner feedback UI with detailed analytics
5. Mobile app adaptation
6. Real-time collaboration features
7. Advanced reporting and insights dashboard

---

## 🚀 Deployment

The application is ready for deployment:
1. Database migrations are automatically managed via Drizzle ORM
2. API endpoints are fully functional and tested
3. Frontend routes are properly configured with authentication
4. AI integration is active using Replit's Anthropic integration
5. Error handling is comprehensive across all layers

**To Deploy:**
- Use Replit's built-in publishing to make the app live on a .replit.app domain
- All environment variables and secrets are securely managed via Replit's system
- No additional configuration needed - the app is production-ready

---

## 📝 Notes

- All features use type-safe operations via TypeScript and Zod validation
- Database operations use Drizzle ORM for type safety and migrations
- AI features leverage Claude 3.5 Sonnet via official Anthropic SDK
- Authentication uses Passport.js with session-based auth
- Frontend is fully responsive and mobile-friendly with Tailwind CSS
- All endpoints include proper error handling and logging
- Notifications are sent for all important user events
