# LearnConnect - AI-Powered Educational Platform

## Overview
LearnConnect is an AI-powered educational platform designed for personalized learning, focusing on memory enhancement, advanced spaced repetition (SuperMemo-2), and comprehensive curriculum management. It features 9 core ML models, over 150 API endpoints across 22 subsystems, and a unified dashboard for students and administrators. The platform aims to provide a tailored learning experience, including AI-powered subcourse generation, intelligent study planning, and personalized course recommendations, with a focus on TYT/AYT exam preparation and multi-language support (Turkish & English). It integrates DopingHafiza.com techniques and a Cognitive Integration Framework to track learning metrics and performance. The business vision is to provide a premium, project-based learning experience with strong career placement outcomes.

## User Preferences
I prefer that the agent focuses on high-level architectural decisions and system integrations rather than granular code implementation details. When presenting information, prioritize clarity and conciseness. I appreciate an iterative development approach where major changes are discussed before implementation. Do not make changes to the existing file structure without explicit approval. Ensure that any suggested modifications align with the established design patterns and technology stack.

## System Architecture
The platform's architecture is centered around an **AI-Powered Integration Orchestrator** (Step 6.2) and an **Ecosystem State Management** system (Step 6.1).

**UI/UX Decisions:**
- **Unified Dashboard System:** Separate but integrated dashboards for students (progress, recommendations) and administrators (system health, analytics).
- **Interactive Forms:** For course enrollment with real-time integration previews and AI recommendations.

**Technical Implementations:**
- **Orchestration System:** Features dependency-aware execution using topological sorting, AI-powered planning via Claude AI for optimal integration plans, real-time performance optimization, and a complete audit trail of AI decisions.
- **Ecosystem Management:** Maintains a centralized `LearningEcosystemState` as a single source of truth, manages `ModuleDependencyGraph`, and logs all AI decisions for transparency.
- **Authentication & Authorization:** Employs header-based authentication with a graceful fallback mechanism to create minimal user objects even if database columns are missing, ensuring resilient access to protected endpoints.
- **Course Recommendations:** A personalized engine generates suggestions based on learning history and interests, utilizing cached recommendations for performance.
- **AI Subcourse Director:** Analyzes courses to break them into progressive subcourses and creates alternative learning paths.
- **Curriculum Design Framework:** A robust framework for curriculum creation, saving learner-centric, content/pedagogy, and business/operational parameters to the database.
- **Curriculum Success KPIs:** Comprehensive tracking of engagement, outcome, and business metrics stored and queryable in the database for continuous improvement.

**Feature Specifications:**
- **Automated Workflow:** From user enrollment, the Integration Orchestrator triggers curriculum generation, study planning, assignment creation, subcourse generation, and personalized recommendations, all synchronized within the ecosystem.
- **Multi-language Support:** Turkish & English.
- **Exam Preparation:** Focus on TYT/AYT exams.

**Technology Stack:**
- **Frontend:** React 18, TypeScript, Shadcn UI, Recharts.
- **Backend:** Express.js, PostgreSQL, Drizzle ORM.
- **ML/AI:** 9 Active Models, Orchestration Engine, Claude AI.
- **Database:** 24 Tables with extensive state management and dependency tracking.
- **Orchestration:** Custom DependencyManager, AIOrchestrator, PerformanceOptimizer components.

## External Dependencies
- **AI/ML Services:** Claude AI for AI-powered planning and execution.
- **Learning Techniques:** DopingHafiza.com integration techniques for memory enhancement, SuperMemo-2 algorithm for spaced repetition.
- **Databases:** PostgreSQL.