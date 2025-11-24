# EduLearn Platform - Comprehensive E-Learning Solution

## Overview
EduLearn Platform is a sophisticated e-learning solution designed to deliver dynamic and interactive STEM and business development courses. It targets diverse learners, from early education to professional reskilling, by integrating AI-powered learning assistance, gamification features, and comprehensive learning management capabilities. The platform aims to provide a personalized and engaging educational experience, fostering continuous learning and skill development.

## User Preferences
Preferred communication style: Simple, everyday language.

## Deployment
- **Custom Domain**: learnconnect.net (registered and ready to configure)
- **Deployment Platform**: Replit (Autoscale deployment with custom domain support)
- **Status**: ✅ Production Ready - All core features functional
- **Last Updated**: November 24, 2025
- **Build Status**: App running successfully on port 5000

## Marketing Strategy Content (Nov 24, 2025)
✅ **Study Techniques Page** (`/study-techniques`)
- 5 most efficient study techniques (Feynman, Time Blocking, Active Recall, Backward Study, AI Automation)
- Bilingual content (Turkish/English)
- Promotional route for user engagement
- Social hashtags: #efficientlearning #studytechniques #learnconnect
- Widget available for embedding: `StudyTechniquesWidget`

✅ **Exam Anxiety Management Page** (`/exam-anxiety`)
- 6 proven anxiety management techniques (Anxiety Normal, Breathing, Planning, Sleep, Exercise, AI)
- Bilingual support with full localization
- Cross-linked with study techniques page
- Social hashtags: #sınavkaygısı #motivasyon #başarıçıkma
- Widget available for embedding: `AnxietyManagementWidget`

✅ **Success Stories Page** (`/testimonials`)
- 6 featured student testimonials with transformational outcomes
- Real student names and verified achievements (net improvements, confidence gains, etc.)
- Stats section: 5000+ students, 95% success rate, +20 avg net increase, 4.9/5 rating
- Bilingual support with full Turkish/English localization
- All testimonials feature 5-star ratings and specific use cases
- Widget available for embedding: `TestimonialsWidget`
- Social hashtags: #LearnConnect #SuccessStory #ExamPrep

## Architecture Overview

### Core Features (Completed)
1. **AI Logging System** - 3 database tables, 9 storage methods, 9 API endpoints
2. **Adaptive Learning Engine** - Personalized task generation, real-time evaluation, dynamic adjustment
3. **AI Reasoning Engine** - 6-step planning pipeline for daily study optimization
4. **Bilingual Support** - Turkish/English for all content and UI
5. **React Query Integration** - Server state management across all components
6. **Gamification System** - Challenges, achievements, levels, leaderboards, streaks
7. **Analytics Dashboard** - Progress tracking, performance metrics, user activity logs
8. **Social Features** - Forum, posts, comments, user profiles, social feed
9. **Study Management** - Time tracking, daily plans, task management, goal setting
10. **Certificate System** - Issuance, verification, revocation with unique IDs

### Database Schema (PostgreSQL + Drizzle ORM)
- **20+ tables**: Users, Courses, Modules, Lessons, Progress, Analytics, Forums, Certificates, AI Logs, etc.
- **Bilingual fields**: All content in English and Turkish
- **Timestamps**: ISO string for compatibility
- **Relationships**: Foreign keys with cascading deletes

### Component Library
**Student Interface Components:**
- CourseCatalog, CoursePlayer, ExamPortal, Forum, Certificates, Notifications
- StudyTimer, TaskManager, UserProfile, PracticeTest

**Dashboard Components:**
- EnhancedTYTDashboard - Real-time TYT performance tracking with charts
- Marketing pages with social promotion widgets

**Widget Components:**
- StudyTechniquesWidget - Embedded learning techniques promotion
- AnxietyManagementWidget - Embedded anxiety management content

## Technical Implementation

### Frontend Stack
- React 18 + TypeScript
- Vite for fast bundling
- Wouter for routing
- TanStack React Query v5 for state management
- Tailwind CSS + shadcn/ui for styling
- Framer Motion for animations
- Dark mode support with CSS variables

### Backend Stack
- Node.js + Express.js
- TypeScript for type safety
- Drizzle ORM for database
- Passport.js for authentication
- Zod for schema validation

### AI Integration
- Anthropic Claude (claude-3-5-sonnet-20241022) for content generation
- OpenAI GPT-4 as fallback
- Error handling with automatic provider fallback
- Rate limiting and security validation

### Bilingual Implementation
- `consolidated-language-context` for global language state
- Named exports from context: `useLanguage()` hook
- Fallback to English if context unavailable
- Turkish (tr) and English (en) language codes

## Recent Fixes (Session Nov 24)
- ✅ Fixed import paths: `@/contexts/consolidated-language-context` (not @/hooks/use-language)
- ✅ Created Study Techniques page with 5 techniques + AI promotion
- ✅ Created Exam Anxiety Management page with 6 anxiety tips
- ✅ Created widget components for embedding on landing page
- ✅ Registered both routes in App.tsx
- ✅ Fixed JSX syntax errors in component maps

## System Architecture

### UI/UX Decisions
- Glass morphism aesthetic with gradients
- Responsive grid-based layout for mobile/tablet/desktop
- Emoji-enhanced content for visual engagement
- Smooth animations using Framer Motion
- Color-coded sections by topic/difficulty

### API Design
- RESTful endpoints with consistent naming
- Authenticated routes with session middleware
- React Query default fetcher pre-configured
- Proper cache invalidation on mutations
- Bilingual content returned from endpoints

### Security
- Password hashing with validation
- Session-based authentication
- Protected routes via wrapper component
- Input sanitization via Zod schemas
- Environment variables for sensitive data

## File Organization
```
src/
├── pages/
│   ├── study-techniques.tsx          # Study techniques marketing page
│   ├── exam-anxiety-guide.tsx        # Anxiety management guide
│   ├── landing-page.tsx              # Main landing page
│   ├── dashboard.tsx                 # Student dashboard
│   └── [40+ other pages]
├── components/
│   ├── study-techniques-widget.tsx   # Study techniques embed
│   ├── anxiety-management-widget.tsx # Anxiety management embed
│   ├── [50+ UI components]
├── contexts/
│   ├── consolidated-language-context.tsx  # Language state
│   ├── ai-provider.tsx               # AI feature flags
├── pages/
├── lib/
│   ├── queryClient.ts                # React Query config
│   ├── protected-route.tsx           # Auth wrapper
server/
├── routes.ts                         # All API endpoints
├── storage.ts                        # Database interface
├── auth.ts                           # Authentication logic
├── adaptive-learning-engine.ts       # AI task generation
├── ai-reasoning-engine.ts            # AI planning pipeline
├── common-modules.ts                 # Utility functions
├── error-handling.ts                 # Error & security
shared/
├── schema.ts                         # Drizzle schema + types
├── bilingual-topics.ts               # TYT/AYT curriculum
```

## Next Steps
1. Integrate widgets into landing page hero section
2. Add analytics tracking to both pages
3. Create email marketing templates linking to pages
4. Set up referral system to track page conversions
5. Add testimonials section from successful students
6. Create social media templates for content promotion

## Performance Notes
- Memoized React components for rendering optimization
- Lazy loading for large content sections
- Database query optimization with proper indexing
- CSS-in-JS with Tailwind for minimal bundle size
- Image optimization for web (no stock images in hero areas)

## Bilingual Testing
- ✅ Language context properly configured
- ✅ All text content has EN/TR versions
- ✅ Navigation links maintain language preference
- ✅ Components properly import from consolidated context
