import { Express } from "express";
import { studyPlannerControl } from "./study-planner-control";
import { controlHandlers } from "./study-planner-control-handlers";

const logger = {
  info: (msg: string) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`),
};

interface ControlRequest {
  user: { id: number; role: string };
  module: string;
  action: string;
  data?: any;
}

export class ControlPermissions {
  // Define what actions each role can perform
  private rolePermissions: { [key: string]: { [key: string]: string[] } } = {
    admin: {
      plan_generation: ["Restart", "Configure", "Test"],
      schedule_management: ["Refresh", "Optimize", "Clear Cache"],
      progress_tracking: ["Sync Data", "Recalculate", "Export"],
      motivation_engine: ["Refresh", "Update Messages"],
      analytics_engine: ["Recalculate", "Export"],
      system: ["Restart", "ClearCache", "ExportLogs", "EmergencyReset"],
    },
    instructor: {
      plan_generation: ["Test"],
      schedule_management: ["Refresh"],
      progress_tracking: ["Sync Data", "Export"],
      analytics_engine: ["Recalculate", "Export"],
      system: [],
    },
    user: {
      analytics_engine: ["Export"],
      system: [],
    },
  };

  hasPermission(
    userId: number,
    userRole: string,
    module: string,
    action: string
  ): boolean {
    const permissions = this.rolePermissions[userRole] || {};
    const moduleActions = permissions[module] || [];
    return moduleActions.includes(action);
  }

  logPermissionDenied(userId: number, module: string, action: string): void {
    logger.warn(
      `Permission denied for user ${userId}: ${action} on ${module}`
    );
  }
}

export function registerControlEndpoints(app: Express) {
  const permissions = new ControlPermissions();

  // ==========================================
  // Module Control Endpoints
  // ==========================================

  /**
   * Execute a control action on a module
   * POST /api/study-planner/control/:module/:action
   */
  app.post(
    "/api/study-planner/control/:module/:action",
    (app as any).ensureAuthenticated,
    async (req, res) => {
      try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { module, action } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role || "user";

        // Permission check
        if (!permissions.hasPermission(userId, userRole, module, action)) {
          permissions.logPermissionDenied(userId, module, action);
          return res.status(403).json({
            status: "error",
            message: "Permission denied",
            details: `User role '${userRole}' cannot perform '${action}' on '${module}'`,
          });
        }

        // Log the action attempt
        logger.info(
          `User ${userId} (${userRole}) executing ${action} on ${module}`
        );

        // Execute the action
        const result = await controlHandlers.handleModuleAction(
          module,
          action,
          userId
        );

        // Log success
        logger.info(
          `Action completed: ${action} on ${module} for user ${userId}`
        );

        return res.json({
          status: "success",
          action,
          module,
          result,
          timestamp: new Date().toISOString(),
          userId,
        });
      } catch (error) {
        logger.error(`Control action failed: ${error instanceof Error ? error.message : String(error)}`);
        return res.status(500).json({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        });
      }
    }
  );

  /**
   * Get status of a specific module or all modules
   * GET /api/study-planner/status/:module?
   */
  app.get(
    "/api/study-planner/status/:module?",
    (app as any).ensureAuthenticated,
    async (req, res) => {
      try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { module } = req.params;

        if (module) {
          // Get specific module status
          const health = studyPlannerControl.getHealthMonitorStatus();
          const moduleStatus = (health as any).status[module];

          if (!moduleStatus) {
            return res.status(404).json({
              status: "error",
              message: `Module ${module} not found`,
            });
          }

          return res.json({
            status: "success",
            module,
            data: moduleStatus,
            timestamp: new Date().toISOString(),
          });
        } else {
          // Get all modules status
          const health = studyPlannerControl.getHealthMonitorStatus();
          logger.info(`Status check for all modules by user ${req.user.id}`);

          return res.json({
            status: "success",
            data: health,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        logger.error(`Failed to fetch status: ${error instanceof Error ? error.message : String(error)}`);
        return res.status(500).json({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  /**
   * Get detailed module metrics
   * GET /api/study-planner/metrics
   */
  app.get(
    "/api/study-planner/metrics",
    (app as any).ensureAuthenticated,
    async (req, res) => {
      try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const metrics = studyPlannerControl.getHealthMonitorMetrics();
        logger.info(`Metrics retrieved for user ${req.user.id}`);

        return res.json({
          status: "success",
          data: metrics,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error(`Failed to fetch metrics: ${error instanceof Error ? error.message : String(error)}`);
        return res.status(500).json({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  /**
   * Get system alerts
   * GET /api/study-planner/alerts?type=warning|critical
   */
  app.get(
    "/api/study-planner/alerts",
    (app as any).ensureAuthenticated,
    async (req, res) => {
      try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const type = req.query.type as "warning" | "critical" | undefined;
        const alerts = studyPlannerControl.getHealthMonitorAlerts(type);

        return res.json({
          status: "success",
          alerts,
          count: alerts.length,
          filtered: type ? true : false,
          filter: type || "all",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error(`Failed to fetch alerts: ${error instanceof Error ? error.message : String(error)}`);
        return res.status(500).json({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  /**
   * System-level control actions
   * POST /api/study-planner/system/:action
   */
  app.post(
    "/api/study-planner/system/:action",
    (app as any).ensureAuthenticated,
    async (req, res) => {
      try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { action } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role || "user";

        // Permission check - only admins can perform system actions
        if (!permissions.hasPermission(userId, userRole, "system", action)) {
          permissions.logPermissionDenied(userId, "system", action);
          return res.status(403).json({
            status: "error",
            message: "Permission denied - only administrators can perform system actions",
          });
        }

        logger.info(`User ${userId} (${userRole}) executing system action: ${action}`);

        let result;
        switch (action) {
          case "Restart":
            result = await controlHandlers.handleRestartPlanner();
            break;
          case "ClearCache":
            result = await controlHandlers.handleClearAllCache();
            break;
          case "ExportLogs":
            result = await controlHandlers.handleExportLogs();
            break;
          case "EmergencyReset":
            result = await controlHandlers.handleSystemReset();
            break;
          default:
            return res.status(400).json({
              status: "error",
              message: `Unknown system action: ${action}`,
            });
        }

        logger.info(`System action completed: ${action} by user ${userId}`);

        return res.json({
          status: "success",
          action,
          result,
          timestamp: new Date().toISOString(),
          executedBy: userId,
        });
      } catch (error) {
        logger.error(`System action failed: ${error instanceof Error ? error.message : String(error)}`);
        return res.status(500).json({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  /**
   * Get audit log of recent control actions
   * GET /api/study-planner/audit-log?limit=50
   */
  app.get(
    "/api/study-planner/audit-log",
    (app as any).ensureAuthenticated,
    async (req, res) => {
      try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        // Only admins and instructors can view audit logs
        if (!["admin", "instructor"].includes(req.user.role || "user")) {
          return res.status(403).json({
            status: "error",
            message: "Permission denied - insufficient privileges for audit log access",
          });
        }

        const limit = Math.min(parseInt(req.query.limit as string) || 50, 1000);

        // This would typically fetch from a database
        // For now, return a placeholder structure
        const auditLog = {
          entries: [],
          total: 0,
          limit,
          timestamp: new Date().toISOString(),
        };

        return res.json({
          status: "success",
          data: auditLog,
        });
      } catch (error) {
        logger.error(`Failed to fetch audit log: ${error instanceof Error ? error.message : String(error)}`);
        return res.status(500).json({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  logger.info("Control endpoints registered successfully");
}
