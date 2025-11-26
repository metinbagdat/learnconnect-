# EduLearn - Study Planner Control & Management Infrastructure

## Project Overview
Comprehensive educational platform (EduLearn) with AI-powered study planning, course management, and interactive learning features. Supports Turkish and English languages, focuses on exam preparation (TYT/AYT), includes AI study companions, personalized learning paths, and smart study planning.

## Latest Session: Complete Study Planner Infrastructure System ✅

### Core Infrastructure Components

#### 1. Study Planner Control System (`server/study-planner-control.ts`)
**5 Integrated Modules with Independent Control:**
- **Plan Generator** - AI-powered study plan creation
- **Schedule Manager** - Daily schedule generation and optimization
- **Progress Tracker** - Learning progress monitoring
- **Motivation Engine** - Turkish-language motivational messages
- **Analytics Engine** - Comprehensive learning analytics

#### 2. Health Monitoring System (`server/study-planner-health-monitor.ts`)
**Real-time Performance Tracking:**
- Response time monitoring per module
- Error rate calculations
- User engagement scoring
- System load tracking
- Active alert generation with severity levels

#### 3. Module-Specific Controllers (`server/module-controllers.ts`)
**5 Dedicated Controller Classes:**
- PlanGeneratorController (restart, configure, test)
- ScheduleManagerController (refresh, optimize, clear cache)
- ProgressTrackerController (sync, recalculate, export)
- MotivationEngineController (refresh, update messages)
- AnalyticsEngineController (recalculate, export)

#### 4. Control Handlers (`server/study-planner-control-handlers.ts`)
**System-level Action Execution:**
- Module action routing
- Handler execution with error management
- Logging and audit trails
- System-wide controls (restart, cache clear, logs export)

#### 5. Role-Based Permissions (`server/permissions.ts`)
**Unified Access Control System:**

**4 User Roles:**
- **Student**: Basic access (view planner, generate plans, track progress, view metrics, export basic data)
- **Premium Student**: Enhanced (+ export detailed data, advanced analytics, custom plans, priority support)
- **Support**: Maintenance (view metrics, restart modules, clear cache, view alerts)
- **Admin**: Full access (all controls, system configuration, user management, manage permissions)

**Permission Methods:**
- `hasPermission()` - Check specific module action access
- `canAccessSystemControls()` - System control access
- `canExportData()` - Export permission check
- `canViewAdvancedAnalytics()` - Analytics access check
- `canManageSystem()` - Admin-only operations

#### 6. Control Endpoints (`server/control-endpoints.ts`)
**Comprehensive REST API with Permission Checking:**

**Module Control:**
- `POST /api/study-planner/control/:module/:action` - Execute module actions
- `GET /api/study-planner/status/:module?` - Get module/system status

**System Management:**
- `GET /api/study-planner/metrics` - Get performance metrics
- `POST /api/study-planner/system/:action` - Execute system actions
- `GET /api/study-planner/audit-log?limit=50` - View audit trail

#### 7. Real-Time Monitoring (`server/real-time-monitor.ts`)
**Live Metrics Collection & Display:**
- 5-second collection interval
- 7 metric categories with detailed tracking
- Metrics history (up to 100 snapshots)
- JSON/CSV export capability

**Tracked Metrics:**
- Plan Generation (success rate, avg time, queue, operations)
- Schedule Management (active schedules, conflicts, optimization)
- Progress Tracking (sessions tracked, average progress, active goals)
- Motivation Engine (messages delivered, engagement)
- Analytics Engine (data points, metrics computed)
- System Health (CPU load, memory usage, uptime, error rate)
- User Engagement (active users, session time, completion rate)

#### 8. Alert System (`server/alert-system.ts`)
**Intelligent Alert Management with Auto-Resolution:**

**10+ Alert Rules:**
- Error rate alerts (high >5%, critical >10%)
- Performance alerts (slow responses >2000ms)
- Resource alerts (high CPU >80%, high memory >85%)
- Engagement alerts (low engagement <30%, few users <10%)
- Schedule alerts (conflicts >5%)
- Plan generation alerts (success rate <80%)

**Alert Features:**
- Automatic rule evaluation every metric cycle
- Auto-resolution when conditions improve
- Action triggering (restart, optimize, send motivation, clear cache)
- 500-item alert history with full tracking
- Severity-based severity levels (critical/high/medium/low)
- Statistics aggregation (total, critical, high, medium, low counts)

**Alert Endpoints:**
- `GET /api/study-planner/alerts` - Get active alerts with stats
- `POST /api/study-planner/alerts/dismiss` - Dismiss specific alert
- `POST /api/study-planner/alerts/clear-all` - Clear all alerts
- `GET /api/study-planner/alerts/history` - Get alert history
- `GET /api/study-planner/alerts/today` - Get today's alerts

#### 9. Real-Time Monitor Dashboard (`client/src/components/real-time-monitor-dashboard.tsx`)
**Live System Metrics Visualization:**
- 4 metric cards (Plan Gen, Schedule Mgmt, User Engagement, System Health)
- Performance trend line chart
- Module health bar chart
- Active alerts panel
- Auto-refresh toggle (5-second interval)
- Manual refresh and export buttons
- Responsive design for all devices

#### 10. Alert Management Component (`client/src/components/alert-management.tsx`)
**User-Friendly Alert Interface:**
- Real-time alert stats (total, critical, high, medium, low)
- Severity-based color coding
- Expandable alert details with metrics data
- Dismiss individual alerts
- Clear all alerts button
- Auto-update capability

#### 11. Permissions Demo Page (`client/src/pages/permissions-demo.tsx`)
**Role Information Display:**
- Current user role display
- Role-specific permissions list
- Role hierarchy visualization
- Permission groups description
- Accessible at `/permissions` route

---

## Complete API Summary

### Study Planner Control APIs
```
# Monitoring & Metrics
GET  /api/study-planner/health              - Get module health status
GET  /api/study-planner/metrics             - Get current metrics
GET  /api/study-planner/metrics/history     - Get metrics history
POST /api/study-planner/metrics/export      - Export metrics (JSON/CSV)

# Module Control
GET  /api/study-planner/status/:module?     - Get status
POST /api/study-planner/control/:module/:action - Execute action
POST /api/study-planner/module-action       - Alternative action endpoint

# System Control
POST /api/study-planner/system/:action      - Execute system action
GET  /api/study-planner/audit-log           - View audit log

# Alert Management
GET  /api/study-planner/alerts              - Get active alerts
GET  /api/study-planner/alerts/history      - Get alert history
GET  /api/study-planner/alerts/today        - Get today's alerts
POST /api/study-planner/alerts/dismiss      - Dismiss alert
POST /api/study-planner/alerts/clear-all    - Clear all alerts

# System Setup
POST /api/study-planner/initialize          - Initialize planner
POST /api/study-planner/emergency-reset     - Emergency reset
POST /api/study-planner/clear-cache         - Clear cache
POST /api/study-planner/export-logs         - Export logs
POST /api/study-planner/restart             - Restart planner
```

---

## Frontend Routes

```
/control-panel      - Study Planner Control Panel (admin/instructor)
/monitoring         - Real-Time Monitoring Dashboard (protected)
/permissions        - Permissions & Role Information (protected)
```

---

## Access Control Matrix

| Role | View Planner | Generate Plans | Track Progress | Export Data | Advanced Analytics | System Control | User Management |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Student | ✅ | ✅ | ✅ | 📄 | ❌ | ❌ | ❌ |
| Premium | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Support | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Technology Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI, Recharts
- **Backend:** Express, TypeScript, Node.js
- **Database:** PostgreSQL (Neon)
- **AI Services:** Anthropic Claude, OpenAI (with OpenRouter fallback)
- **Real-time:** 5-second metric collection cycles
- **Language Support:** Turkish, English

---

## Key Features Implemented

✅ **Modular Control System** - 5 independent modules with unified control
✅ **Health Monitoring** - Continuous system health tracking
✅ **Role-Based Access Control** - 4 user roles with granular permissions
✅ **Real-Time Metrics** - Live performance tracking with charts
✅ **Intelligent Alerts** - 10+ alert rules with auto-resolution
✅ **Module Controllers** - Dedicated controllers for each module
✅ **Audit Logging** - Complete action tracking and audit trails
✅ **Export Functionality** - Metrics and data export (JSON/CSV)
✅ **Dashboard UI** - Beautiful real-time monitoring dashboard
✅ **Cascading Updates** - Actions propagate through all components

---

## System Architecture

```
┌─────────────────────────────────────────────┐
│   Frontend (React)                          │
│  ├─ Control Panel                           │
│  ├─ Monitoring Dashboard (Real-time)        │
│  ├─ Alert Management Component              │
│  └─ Permissions Demo                        │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│   Express Backend + TypeScript              │
│  ├─ Control Endpoints (Permission checked)  │
│  ├─ Real-Time Monitor (5s cycle)            │
│  ├─ Alert System (10+ rules)                │
│  ├─ Module Controllers (5 modules)          │
│  ├─ Health Monitor (continuous)             │
│  └─ Permissions System (4 roles)            │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│   PostgreSQL Database                       │
│  ├─ User Accounts                           │
│  ├─ Study Plans                             │
│  ├─ Progress Data                           │
│  └─ Alert History                           │
└─────────────────────────────────────────────┘
```

---

## Design Decisions

1. **Module-Based Architecture** - Each module independently controllable
2. **Permission-First Design** - All actions check permissions before execution
3. **Health-Driven Alerts** - Rules automatically trigger based on metrics
4. **Real-Time Feedback** - 5-second update cycle for immediate visibility
5. **Auto-Healing Alerts** - Alerts auto-resolve when conditions improve
6. **Granular Logging** - All actions logged for audit trail
7. **Role Hierarchy** - Student → Premium → Support → Admin

---

## User Preferences & Settings
- **Language:** Turkish support prioritized throughout
- **UI/UX:** Modern, responsive design with real-time updates
- **Monitoring:** 5-second metric collection intervals
- **Permissions:** Fine-grained role-based access control

---

## Notable Implementation Details

1. **Study Planner Initialization** - Auto-creates assignments on course enrollment
2. **Cascade Architecture** - Single action updates cascade through all modules
3. **Unified AI Provider** - Anthropic → OpenAI → OpenRouter/DeepSeek fallback
4. **Turkish Language** - Full Turkish language support in all messages
5. **Premium Detection** - Auto-detects premium status from user account
6. **Admin Override** - Admins always have full permissions

---

## Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| Permission Denied | Check user role in account settings |
| Alerts not showing | Verify alert rules are active |
| Metrics not updating | Check real-time monitor is running |
| Module unresponsive | Use emergency-reset endpoint |
| High CPU/Memory | Trigger clear-cache action |

---

**Last Updated:** November 26, 2025
**Status:** Production Ready ✅
**Infrastructure:** Complete Study Planner Control & Management System
