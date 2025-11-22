# EduLearn Platform - Comprehensive E-Learning Solution

## Overview
EduLearn Platform is a sophisticated e-learning solution designed to deliver dynamic and interactive STEM and business development courses. It targets diverse learners, from early education to professional reskilling, by integrating AI-powered learning assistance, gamification features, and comprehensive learning management capabilities. The platform aims to provide a personalized and engaging educational experience, fostering continuous learning and skill development.

## User Preferences
Preferred communication style: Simple, everyday language.

## Deployment
- **Custom Domain**: learnconnect.net (registered and ready to configure)
- **Deployment Platform**: Replit (Autoscale deployment with custom domain support)
- **Status**: ✅ Production Ready - All core features functional
- **Last Updated**: November 21, 2025
- **Build Status**: App running successfully on port 5000

## Recent Fixes (Session Nov 22)
- ✅ Fixed "e is null" runtime error in courses page
- ✅ Added safe fallbacks to useAuth hook (returns null user instead of throwing)
- ✅ Added safe fallbacks to useLanguage hook (returns English default instead of throwing)
- ✅ Implemented error boundary with try-catch in Courses component
- ✅ Fixed null safety in course tree component with defensive checks
- ✅ Fixed TypeScript type mismatches in storage.ts (Date to ISO string conversions)
- ⚠️ 65 remaining LSP diagnostics in storage.ts (non-blocking, pre-existing database layer issues)

## System Architecture

### UI/UX Decisions
The platform utilizes a modern and responsive design with Tailwind CSS for styling, complemented by Radix UI primitives and shadcn/ui for components. Framer Motion is integrated for enhanced user experience through smooth animations and transitions, such as seamless next/previous lesson navigation. The design incorporates a glass morphism UI aesthetic. Bilingual support (Turkish/English) is implemented throughout the platform, including AI-generated content.

### Technical Implementations
- **Frontend**: React with TypeScript, Vite for bundling, Wouter for routing, and TanStack Query for server state management.
- **Backend**: Node.js with Express.js and TypeScript.
- **Database**: PostgreSQL with Drizzle ORM, utilizing Neon serverless PostgreSQL for cloud deployment.
- **Authentication**: Custom authentication with session management using Passport.js.
- **API**: RESTful API with protected routes and Zod schemas for input validation.
- **AI Integration**: AI modules generate personalized content, course recommendations, daily study plans, and interactive skill challenges, adapting to user language preferences.
- **Learning Management**: Comprehensive course management, progress tracking, assignment system, and resource sharing.
- **Gamification**: Achievement system, challenge system with XP and points, leaderboards, user leveling, and streak tracking.
- **Analytics**: Detailed learning analytics, progress snapshots, course performance metrics, and user activity logs.
- **Social Features**: Social feed, user profiles with achievements, and social sharing capabilities.
- **Time Tracking**: Pomodoro timer, mood tracking, and daily goal management.
- **Forum System**: Posts, comments, view tracking, and admin controls.
- **Certificate Management**: Issuance, verification, and revocation of certificates with unique identifiers.
- **Hierarchical Course System**: Supports tree-based curriculum organization with parent-child relationships for courses.
- **Personalized Curriculum Page**: Visualizes progress, skills, tasks, and checkpoints, with AI-driven auto-sync for course enrollment.

### System Design Choices
The architecture emphasizes modularity, scalability, and maintainability. It leverages modern TypeScript for type safety across the stack. Asynchronous operations are managed to ensure a smooth user experience, particularly for AI-driven content generation. Role-based access control secures routes, and database-level timestamps support audit trails.

## External Dependencies

### AI Services
- **OpenAI API**: Utilized for GPT models in course generation and learning assistance.
- **Anthropic API**: Used for Claude models for advanced content generation, personalized learning paths, AI daily plan generation, and AI-powered emoji reactions.

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL database for persistent data storage.
- **ws library**: For WebSocket support to enable real-time features.

### UI & Styling
- **Radix UI**: Headless UI components for building accessible design systems.
- **Tailwind CSS**: Utility-first CSS framework for rapid and consistent styling.
- **Framer Motion**: Animation library for creating smooth UI transitions and animations.

### Development Tools
- **TypeScript**: Ensures type safety across both frontend and backend.
- **Vite**: Fast build tool for frontend development and optimized production builds.
- **Drizzle Kit**: Used for database schema management and migrations.