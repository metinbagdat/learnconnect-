export type UserRole = "student" | "instructor" | "admin" | "support" | "guest";
export type CourseAction = "view" | "create" | "update" | "delete" | "manage" | "analyze" | "interact" | "track_progress" | "troubleshoot" | "generate_reports";
export type DataAccessLevel = "own" | "course" | "department" | "system" | "none";

export interface RolePermission {
  modules: string[];
  actions: CourseAction[];
  dataAccess: DataAccessLevel[];
  maxCoursesManage?: number;
  canDelegate?: boolean;
}

export interface PermissionCheck {
  userId: number;
  role: UserRole;
  module: string;
  action: CourseAction;
  resourceId?: number;
  resourceType?: string;
  timestamp: number;
  granted: boolean;
  reason?: string;
}

class PermissionController {
  private rolePermissions: Map<UserRole, RolePermission> = new Map();
  private auditLog: PermissionCheck[] = [];
  private maxAuditLogSize: number = 10000;
  private userRoles: Map<number, UserRole> = new Map();

  constructor() {
    this.initializeRolePermissions();
    console.log("[PermissionController] Initialized with roles:", Array.from(this.rolePermissions.keys()));
  }

  private initializeRolePermissions(): void {
    const roles: Record<UserRole, RolePermission> = {
      student: {
        modules: ["content_delivery", "progress_tracking", "course_enrollment"],
        actions: ["view", "interact", "track_progress"],
        dataAccess: ["own", "course"],
        maxCoursesManage: 0,
        canDelegate: false,
      },
      instructor: {
        modules: ["course_management", "content_delivery", "analytics_engine", "student_management"],
        actions: ["view", "create", "update", "analyze", "manage"],
        dataAccess: ["own", "course", "department"],
        maxCoursesManage: 10,
        canDelegate: true,
      },
      admin: {
        modules: ["all_modules"],
        actions: ["view", "create", "update", "delete", "manage", "analyze", "troubleshoot", "generate_reports"],
        dataAccess: ["system"],
        maxCoursesManage: 1000,
        canDelegate: true,
      },
      support: {
        modules: ["course_management", "user_engagement", "analytics_engine", "troubleshooting"],
        actions: ["view", "troubleshoot", "generate_reports", "interact"],
        dataAccess: ["system", "course"],
        maxCoursesManage: 0,
        canDelegate: false,
      },
      guest: {
        modules: ["content_delivery"],
        actions: ["view", "interact"],
        dataAccess: ["course"],
        maxCoursesManage: 0,
        canDelegate: false,
      },
    };

    Object.entries(roles).forEach(([role, permissions]) => {
      this.rolePermissions.set(role as UserRole, permissions);
    });
  }

  canPerformAction(userId: number, module: string, action: CourseAction, resourceId?: number): boolean {
    const role = this.getUserRole(userId);
    const permissions = this.rolePermissions.get(role);

    if (!permissions) {
      this.logPermissionCheck(userId, role, module, action, false, "Unknown role");
      return false;
    }

    // Admin can do everything
    if (role === "admin" && permissions.modules.includes("all_modules")) {
      this.logPermissionCheck(userId, role, module, action, true, "Admin access");
      return true;
    }

    // Check module access
    if (!permissions.modules.includes(module) && !permissions.modules.includes("all_modules")) {
      this.logPermissionCheck(userId, role, module, action, false, "Module not accessible");
      return false;
    }

    // Check action permission
    if (!permissions.actions.includes(action)) {
      this.logPermissionCheck(userId, role, module, action, false, "Action not permitted");
      return false;
    }

    this.logPermissionCheck(userId, role, module, action, true, `${role} can perform ${action}`);
    return true;
  }

  canAccessData(userId: number, resourceType: string, resourceOwnerId: number): boolean {
    const role = this.getUserRole(userId);
    const permissions = this.rolePermissions.get(role);

    if (!permissions) return false;

    // Admin can access all data
    if (permissions.dataAccess.includes("system")) {
      return true;
    }

    // Owner can access their own data
    if (permissions.dataAccess.includes("own") && userId === resourceOwnerId) {
      return true;
    }

    // Course/Department access would need more context
    if (permissions.dataAccess.includes("course")) {
      return true;
    }

    return false;
  }

  setUserRole(userId: number, role: UserRole): boolean {
    if (!this.rolePermissions.has(role)) {
      return false;
    }
    this.userRoles.set(userId, role);
    return true;
  }

  getUserRole(userId: number): UserRole {
    return this.userRoles.get(userId) || "guest";
  }

  getRolePermissions(role: UserRole): RolePermission | undefined {
    return this.rolePermissions.get(role);
  }

  getAllRoles(): Record<UserRole, RolePermission> {
    const result: Record<UserRole, RolePermission> = {} as any;
    this.rolePermissions.forEach((perms, role) => {
      result[role] = perms;
    });
    return result;
  }

  private logPermissionCheck(
    userId: number,
    role: UserRole,
    module: string,
    action: CourseAction,
    granted: boolean,
    reason?: string
  ): void {
    const check: PermissionCheck = {
      userId,
      role,
      module,
      action,
      timestamp: Date.now(),
      granted,
      reason,
    };

    this.auditLog.push(check);

    // Maintain max size
    if (this.auditLog.length > this.maxAuditLogSize) {
      this.auditLog = this.auditLog.slice(-this.maxAuditLogSize);
    }
  }

  getAuditLog(userId?: number, limit: number = 100): PermissionCheck[] {
    let log = this.auditLog;

    if (userId) {
      log = log.filter((l) => l.userId === userId);
    }

    return log.slice(-limit).reverse();
  }

  getDeniedAccessLog(limit: number = 50): PermissionCheck[] {
    return this.auditLog.filter((l) => !l.granted).slice(-limit).reverse();
  }

  getPermissionStats() {
    const total = this.auditLog.length;
    const granted = this.auditLog.filter((l) => l.granted).length;
    const denied = total - granted;

    const deniedByRole: Record<string, number> = {};
    const deniedByModule: Record<string, number> = {};
    const deniedByAction: Record<string, number> = {};

    this.auditLog.filter((l) => !l.granted).forEach((l) => {
      deniedByRole[l.role] = (deniedByRole[l.role] || 0) + 1;
      deniedByModule[l.module] = (deniedByModule[l.module] || 0) + 1;
      deniedByAction[l.action] = (deniedByAction[l.action] || 0) + 1;
    });

    return {
      total,
      granted,
      denied,
      grantedPercentage: total > 0 ? ((granted / total) * 100).toFixed(2) : "0",
      deniedByRole,
      deniedByModule,
      deniedByAction,
    };
  }

  clearAuditLog(): void {
    this.auditLog = [];
  }

  exportAuditLog(): object {
    return {
      exportedAt: new Date().toISOString(),
      totalRecords: this.auditLog.length,
      records: this.auditLog,
      stats: this.getPermissionStats(),
    };
  }
}

export const permissionController = new PermissionController();
