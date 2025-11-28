# LearnConnect - AI-Powered Educational Platform

## Overview

LearnConnect is a comprehensive AI-powered educational platform designed to provide personalized, memory-enhanced, and intelligently adapted learning experiences. It leverages 9 core ML models and over 150 API endpoints across 22 subsystems to deliver a robust educational ecosystem. The platform integrates advanced spaced repetition (SuperMemo-2), smart technique integration, real-time adaptation, and a complete curriculum management system with AI-powered generation. It features a unified dashboard for students and administrators, an AI-powered subcourse generator, and comprehensive form systems for course enrollment. LearnConnect aims to enhance engagement, academic performance, and system health through detailed success metrics tracking. It supports both Turkish and English, with a specific focus on TYT/AYT exam preparation, positioning it for global learners and making it production-ready for publishing.

## User Preferences

*No user preferences were specified in the original replit.md. Please provide them if you have any specific communication, coding, workflow, or interaction preferences.*

## System Architecture

LearnConnect's architecture is built around a comprehensive, AI-driven, and highly integrated ecosystem.

**UI/UX Decisions:**
- Unified dashboard system integrating student and admin views.
- Interactive course selection grid with real-time integration impact preview.
- Utilizes React 18, TypeScript, Shadcn UI, and Recharts for a modern and responsive frontend.

**Technical Implementations:**
- **Frontend:** React 18 + TypeScript + Shadcn UI + Recharts.
- **Backend:** Express.js + PostgreSQL + Drizzle ORM.
- **ML/AI:** 9 Active Models + Integration Engine + Claude AI for personalization, memory enhancement, and intelligent adaptation.
- **Database:** 24 tables with full schema validation and an `Ecosystem Tracking` system, managed by PostgreSQL and Drizzle ORM.
- **Integration System:** Features 5 Module Connectors (Curriculum, Study Planner, Assignments, AI Recommender, Progress) and an `EcosystemStateManager` with a `ModuleDependencyGraph` for orchestration.
- **Form System:** Built with React Hook Form and Zod Validation for robust data input.

**Feature Specifications:**
- **9 Core ML Models:** For personalized recommendations, memory enhancement, and real-time adaptation.
- **Memory-Enhanced Learning System:** Integrates techniques similar to DopingHafiza.com and SuperMemo-2 for spaced repetition.
- **AI-Powered Subcourse Generator:** Breaks down courses into 4 progressive subcourses (beginner to advanced) and offers alternative learning paths.
- **Curriculum Integration Connector:** Automatically generates AI-powered curricula, personalized recommendations, and learning paths upon enrollment.
- **Study Planner Integration Connector:** Auto-generates study schedules with various session types and progress tracking.
- **Assignment Integration Connector:** Generates 3-4 diverse assignments per course with estimated hours and intelligent due date distribution.
- **Integrated Dashboards:** Student dashboard displays personalized progress and integration status; Admin dashboard provides system health, integration metrics, and AI effectiveness scoring.
- **Course Enrollment with Integration Preview:** Allows users to preview the impact of enrollment on their curriculum, study plan, and assignments before confirming.
- **Comprehensive Database Integration & AI Data Flow:** Centralized `LearningEcosystemState`, `ModuleDependencyGraph` for intelligent orchestration, and `AIIntegrationLog` for audit trails of AI decisions.
- **Success Metrics Tracking:** Monitors user engagement, academic performance, and system performance with specific metrics like completion percentages, retention rates, and synchronization rates.

**System Design Choices:**
- **Unified Ecosystem System:** A `LearningEcosystemState` acts as a central repository for a user's complete learning state, ensuring real-time synchronization across all modules.
- **Module Dependency Graph:** Maps dependencies between modules for intelligent orchestration and cascading updates.
- **AI Integration Log:** Provides a complete audit trail of all AI-driven integration decisions.
- **EcosystemStateManager:** Centralized manager for initializing, synchronizing, and monitoring the ecosystem state, including health metrics calculation and dependency management.
- **Automated Enrollment Flow:** A fully automated process from user enrollment to daily task auto-population and ecosystem synchronization.

## External Dependencies

- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **AI/ML:** Claude AI (as an integrated AI model)
- **Frontend Libraries:** React, TypeScript, Shadcn UI, Recharts
- **Backend Framework:** Express.js
- **Form Management:** React Hook Form, Zod
- **Spaced Repetition Algorithm:** SuperMemo-2 (conceptually integrated)