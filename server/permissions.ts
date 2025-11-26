export type UserRole = "student" | "premium_student" | "admin" | "support";

export interface User {
  id: number;
  role?: string;
  isPremium?: boolean;
  isAdmin?: boolean;
}

export interface PermissionSet {
  student: string[];
  premium_student: string[];
  admin: string[];
  support: string[];
}

export class StudyPlannerPermissions {
  private rolePermissions: PermissionSet = {
    student: [
      "view_planner",
      "generate_plan",
      "track_progress",
      "view_metrics",
      "export_basic_data",
    ],
    premium_student: [
      "view_planner",
      "generate_plan",
      "track_progress",
      "view_metrics",
      "export_data",
      "advanced_analytics",
      "custom_plans",
      "priority_support",
    ],
    admin: [
      "all_controls",
      "system_configuration",
      "user_management",
      "restart_modules",
      "clear_cache",
      "view_all_metrics",
      "export_system_data",
      "manage_permissions",
    ],
    support: [
      "view_metrics",
      "restart_modules",
      "clear_cache",
      "view_alerts",
      "export_data",
    ],
  };

  private permissionGroups: { [key: string]: string[] } = {
    system_controls: ["restart", "configure", "test"],
    advanced_controls: ["optimize", "clear_cache", "refresh"],
    export_permissions: ["export_progress", "export_analytics"],
    view_permissions: ["view_metrics", "view_alerts", "view_health"],
    admin_permissions: ["system_configuration", "user_management", "restart_modules"],
  };

  constructor() {
    console.log("[Permissions] Initialized with role-based access control");
  }

  /**
   * Check if user has permission for specific module action
   */
  hasPermission(user: User, module: string, action: string): boolean {
    const userRole = this.getUserRole(user);

    // Admin has all permissions
    if (userRole === "admin") {
      return true;
    }

    const userPermissions = this.rolePermissions[userRole] || [];

    // Check for direct permission
    const directPermission = `${module}.${action}`;
    if (userPermissions.includes(directPermission)) {
      return true;
    }

    // Check for action-based permissions
    if (
      userPermissions.includes("export_data") &&
      action.toLowerCase().includes("export")
    ) {
      return true;
    }

    if (
      userPermissions.includes("advanced_analytics") &&
      (action === "Recalculate" || action === "Export")
    ) {
      return true;
    }

    if (
      userPermissions.includes("view_metrics") &&
      (action === "Test" || action === "Refresh" || action === "Sync Data")
    ) {
      return true;
    }

    // Support staff can restart and clear cache
    if (
      userRole === "support" &&
      (userPermissions.includes("restart_modules") ||
        userPermissions.includes("clear_cache"))
    ) {
      if (
        ["Restart", "Clear Cache", "Refresh", "Optimize"].includes(action)
      ) {
        return true;
      }
    }

    // Premium students can generate and export
    if (userRole === "premium_student") {
      if (
        ["Generate", "Export", "Recalculate", "Sync Data"].includes(action)
      ) {
        return true;
      }
    }

    // Basic students can view and track
    if (userRole === "student") {
      if (["Test", "Refresh", "Sync Data"].includes(action)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if user can access system controls
   */
  canAccessSystemControls(user: User): boolean {
    const userRole = this.getUserRole(user);
    return userRole === "admin" || userRole === "support";
  }

  /**
   * Check if user can export data
   */
  canExportData(user: User): boolean {
    const userRole = this.getUserRole(user);
    const permissions = this.rolePermissions[userRole] || [];
    return (
      userRole === "admin" ||
      permissions.includes("export_data") ||
      permissions.includes("export_basic_data")
    );
  }

  /**
   * Check if user can view advanced analytics
   */
  canViewAdvancedAnalytics(user: User): boolean {
    const userRole = this.getUserRole(user);
    const permissions = this.rolePermissions[userRole] || [];
    return userRole === "admin" || permissions.includes("advanced_analytics");
  }

  /**
   * Check if user can manage system
   */
  canManageSystem(user: User): boolean {
    return this.getUserRole(user) === "admin";
  }

  /**
   * Determine user role based on account type
   */
  getUserRole(user: User): UserRole {
    if (user.isAdmin) {
      return "admin";
    }

    if (user.role === "support") {
      return "support";
    }

    if (user.isPremium) {
      return "premium_student";
    }

    return "student";
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(role: UserRole): string[] {
    return this.rolePermissions[role] || [];
  }

  /**
   * Get user role name
   */
  getRoleName(user: User): string {
    const role = this.getUserRole(user);
    return role.replace(/_/g, " ").toUpperCase();
  }

  /**
   * Get permission description
   */
  getPermissionDescription(permission: string): string {
    const descriptions: { [key: string]: string } = {
      view_planner: "View study planner dashboard",
      generate_plan: "Generate AI study plans",
      track_progress: "Track learning progress",
      view_metrics: "View system metrics",
      export_basic_data: "Export basic learning data",
      export_data: "Export detailed learning data",
      advanced_analytics: "Access advanced analytics",
      custom_plans: "Create custom study plans",
      priority_support: "Get priority support",
      all_controls: "Access all system controls",
      system_configuration: "Configure system settings",
      user_management: "Manage user accounts",
      restart_modules: "Restart study planner modules",
      clear_cache: "Clear system cache",
      view_all_metrics: "View all system metrics",
      export_system_data: "Export system-wide data",
      manage_permissions: "Manage user permissions",
      view_alerts: "View system alerts",
    };

    return descriptions[permission] || permission;
  }
}

// Export singleton instance
export const permissions = new StudyPlannerPermissions();
