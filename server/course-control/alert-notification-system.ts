export interface AlertRule {
  name: string;
  condition: (metrics: any) => boolean;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  actions: string[];
  resolveCondition?: (metrics: any) => boolean;
}

export interface Alert {
  id: string;
  rule: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  actions?: string[];
  channel?: string;
}

export interface Notification {
  id: string;
  alertId: string;
  channel: "dashboard" | "email" | "slack";
  recipient: string;
  message: string;
  timestamp: number;
  read: boolean;
}

class CourseAlertNotificationSystem {
  private alertRules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private alertHistory: Alert[] = [];
  private notifications: Notification[] = [];
  private maxHistorySize: number = 500;
  private maxNotifications: number = 1000;

  constructor() {
    this.loadAlertRules();
    console.log("[CourseAlertSystem] Initialized with", this.alertRules.size, "rules");
  }

  private loadAlertRules(): void {
    const rules: AlertRule[] = [
      // High Error Rate
      {
        name: "high_error_rate",
        condition: (m: any) => (m.performance?.errorRate || 0) > 5,
        message: "High error rate in courses module detected",
        severity: "critical",
        actions: ["notify_admins", "scale_resources", "enable_fallback"],
        resolveCondition: (m: any) => (m.performance?.errorRate || 0) <= 2,
      },

      // Slow Content Delivery
      {
        name: "slow_content_delivery",
        condition: (m: any) => (m.performance?.avgResponseTime || 0) > 2000,
        message: "Slow content delivery detected - Response time exceeding 2000ms",
        severity: "high",
        actions: ["optimize_cdn", "clear_cache", "enable_compression"],
        resolveCondition: (m: any) => (m.performance?.avgResponseTime || 0) <= 1500,
      },

      // Low User Engagement
      {
        name: "low_user_engagement",
        condition: (m: any) => (m.engagement?.rate || 1) < 0.3,
        message: "Low user engagement in courses detected",
        severity: "medium",
        actions: ["trigger_recommendation", "notify_instructor", "suggest_incentive"],
        resolveCondition: (m: any) => (m.engagement?.rate || 0) >= 0.5,
      },

      // Data Sync Failure
      {
        name: "data_sync_failure",
        condition: (m: any) => (m.integration?.syncSuccessRate || 1) < 0.9,
        message: "Data synchronization issues detected - Success rate below 90%",
        severity: "high",
        actions: ["retry_sync", "notify_technical", "enable_manual_sync"],
        resolveCondition: (m: any) => (m.integration?.syncSuccessRate || 0) >= 0.95,
      },

      // High Bounce Rate
      {
        name: "high_bounce_rate",
        condition: (m: any) => (m.engagement?.bounceRate || 0) > 0.4,
        message: "High course bounce rate detected",
        severity: "medium",
        actions: ["analyze_content", "notify_instructor", "suggest_improvements"],
        resolveCondition: (m: any) => (m.engagement?.bounceRate || 0) <= 0.25,
      },

      // Integration Chain Failures
      {
        name: "integration_chain_failure",
        condition: (m: any) => (m.integration?.failedChains || 0) > 5,
        message: "Multiple integration chain failures detected",
        severity: "critical",
        actions: ["restart_integrations", "notify_admins", "enable_queue_retry"],
        resolveCondition: (m: any) => (m.integration?.failedChains || 0) <= 1,
      },

      // Module Interaction Anomaly
      {
        name: "module_interaction_anomaly",
        condition: (m: any) => {
          const interactions = m.modules || {};
          const interactionValues = Object.values(interactions) as Array<{ interactions?: number }>;
          const avgInteractions = interactionValues.reduce((sum: number, mod: { interactions?: number }) => sum + (mod.interactions || 0), 0) / Math.max(interactionValues.length, 1);
          return interactionValues.some((mod: { interactions?: number }) => (mod.interactions || 0) > avgInteractions * 5);
        },
        message: "Unusual module interaction pattern detected",
        severity: "medium",
        actions: ["investigate_module", "notify_technical"],
        resolveCondition: (m: any) => true,
      },

      // Database Performance
      {
        name: "database_performance_degradation",
        condition: (m: any) => (m.database?.queryTimePercentile95 || 0) > 5000,
        message: "Database performance degradation detected",
        severity: "high",
        actions: ["optimize_queries", "scale_database", "notify_dba"],
        resolveCondition: (m: any) => (m.database?.queryTimePercentile95 || 0) <= 2000,
      },

      // Memory Usage Alert
      {
        name: "high_memory_usage",
        condition: (m: any) => (m.system?.memoryUsagePercent || 0) > 85,
        message: "High system memory usage detected",
        severity: "high",
        actions: ["clear_cache", "optimize_memory", "scale_servers"],
        resolveCondition: (m: any) => (m.system?.memoryUsagePercent || 0) <= 70,
      },
    ];

    rules.forEach((rule) => {
      this.alertRules.set(rule.name, rule);
    });
  }

  checkMetricsAndAlert(metrics: any): Alert[] {
    const newAlerts: Alert[] = [];

    for (const [ruleName, rule] of this.alertRules) {
      const isActive = this.activeAlerts.has(ruleName);
      const conditionMet = rule.condition(metrics);

      if (conditionMet && !isActive) {
        const alert = this.createAlert(ruleName, rule, metrics);
        this.activeAlerts.set(ruleName, alert);
        newAlerts.push(alert);
        this.addToHistory(alert);
      } else if (!conditionMet && isActive && rule.resolveCondition) {
        if (rule.resolveCondition(metrics)) {
          const alert = this.activeAlerts.get(ruleName)!;
          alert.resolved = true;
          alert.resolvedAt = Date.now();
          this.activeAlerts.delete(ruleName);
        }
      }
    }

    return newAlerts;
  }

  private createAlert(ruleName: string, rule: AlertRule, metrics: any): Alert {
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      rule: ruleName,
      message: rule.message,
      severity: rule.severity,
      timestamp: Date.now(),
      resolved: false,
      actions: rule.actions,
    };
  }

  private addToHistory(alert: Alert): void {
    this.alertHistory.push(alert);
    if (this.alertHistory.length > this.maxHistorySize) {
      this.alertHistory.shift();
    }
  }

  createNotifications(alert: Alert, channels: string[] = ["dashboard"]): Notification[] {
    const notifications: Notification[] = [];

    for (const channel of channels) {
      const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        alertId: alert.id,
        channel: channel as "dashboard" | "email" | "slack",
        recipient: channel === "email" ? "admin@edulearn.com" : channel === "slack" ? "#alerts" : "all-users",
        message: alert.message,
        timestamp: Date.now(),
        read: false,
      };
      notifications.push(notification);
      this.addNotification(notification);
    }

    return notifications;
  }

  private addNotification(notification: Notification): void {
    this.notifications.push(notification);
    if (this.notifications.length > this.maxNotifications) {
      this.notifications.shift();
    }
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values());
  }

  getAlertHistory(limit: number = 50): Alert[] {
    return this.alertHistory.slice(-limit).reverse();
  }

  getNotifications(unreadOnly: boolean = false, limit: number = 100): Notification[] {
    let notifs = this.notifications;
    if (unreadOnly) {
      notifs = notifs.filter((n) => !n.read);
    }
    return notifs.slice(-limit).reverse();
  }

  markNotificationRead(notificationId: string): boolean {
    const notif = this.notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  dismissAlert(alertId: string): boolean {
    for (const [, alert] of this.activeAlerts) {
      if (alert.id === alertId) {
        alert.resolved = true;
        alert.resolvedAt = Date.now();
        this.activeAlerts.delete(alert.rule);
        return true;
      }
    }
    return false;
  }

  getAlertStats() {
    const active = this.getActiveAlerts();
    const critical = active.filter((a) => a.severity === "critical").length;
    const high = active.filter((a) => a.severity === "high").length;
    const medium = active.filter((a) => a.severity === "medium").length;

    return {
      total: active.length,
      critical,
      high,
      medium,
      history: this.alertHistory.length,
      notifications: this.notifications.length,
      unreadNotifications: this.notifications.filter((n) => !n.read).length,
    };
  }

  getAlertsByToday(): Alert[] {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    return this.alertHistory.filter((a) => now - a.timestamp < oneDayMs);
  }

  getNotificationsByType(channel: string): Notification[] {
    return this.notifications.filter((n) => n.channel === channel);
  }

  getSeverityDistribution(): Record<string, number> {
    const distribution = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    this.alertHistory.forEach((alert) => {
      distribution[alert.severity]++;
    });

    return distribution;
  }
}

export const courseAlertNotificationSystem = new CourseAlertNotificationSystem();
