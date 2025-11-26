export interface Interaction {
  id: string;
  timestamp: number;
  source: string;
  target: string;
  action: string;
  data: any;
  sessionId: string;
  userId: number;
  validated: boolean;
}

interface DependencyMap {
  [module: string]: {
    dependsOn: string[];
    triggers: string[];
    dataFlows: string[];
  };
}

export class InteractionChainManager {
  private interactionLog: Interaction[] = [];
  private readonly maxLogSize = 1000;
  private dependencyMap: DependencyMap;
  private sessionMap: Map<string, number> = new Map();
  private currentUserId: number = 0;

  constructor() {
    this.dependencyMap = this.buildDependencyMap();
    console.log("[InteractionChainManager] Initialized with dependency mapping");
  }

  private buildDependencyMap(): DependencyMap {
    return {
      course_management: {
        dependsOn: [],
        triggers: ["content_delivery", "progress_tracking", "analytics_engine"],
        dataFlows: ["course_metadata", "enrollment_data"],
      },
      content_delivery: {
        dependsOn: ["course_management"],
        triggers: ["user_engagement", "progress_tracking"],
        dataFlows: ["content_access", "completion_events"],
      },
      progress_tracking: {
        dependsOn: ["course_management", "content_delivery"],
        triggers: ["analytics_engine", "recommendation_engine"],
        dataFlows: ["progress_updates", "achievement_events"],
      },
      user_engagement: {
        dependsOn: ["content_delivery"],
        triggers: ["analytics_engine", "recommendation_engine"],
        dataFlows: ["engagement_metrics", "interaction_patterns"],
      },
      enrollment_tracking: {
        dependsOn: ["course_management"],
        triggers: ["progress_tracking", "analytics_engine"],
        dataFlows: ["enrollment_events", "user_status_changes"],
      },
      recommendation_engine: {
        dependsOn: ["analytics_engine", "progress_tracking"],
        triggers: ["user_engagement"],
        dataFlows: ["recommendations", "personalized_paths"],
      },
      analytics_engine: {
        dependsOn: ["progress_tracking", "user_engagement"],
        triggers: ["recommendation_engine"],
        dataFlows: ["analytics_reports", "performance_metrics"],
      },
    };
  }

  setUserContext(userId: number, sessionId: string): void {
    this.currentUserId = userId;
    this.sessionMap.set(sessionId, userId);
  }

  logInteraction(
    sourceModule: string,
    targetModule: string,
    action: string,
    data: any,
    sessionId: string = "default"
  ): Interaction {
    const interaction: Interaction = {
      id: `interaction_${this.interactionLog.length + 1}_${Date.now()}`,
      timestamp: Date.now(),
      source: sourceModule,
      target: targetModule,
      action,
      data,
      sessionId,
      userId: this.currentUserId,
      validated: false,
    };

    // Validate the interaction flow
    interaction.validated = this.validateInteractionFlow(interaction);

    // Log the interaction
    this.interactionLog.push(interaction);

    // Maintain max log size
    if (this.interactionLog.length > this.maxLogSize) {
      this.interactionLog.shift();
    }

    console.log(`[InteractionChain] ${sourceModule} → ${targetModule}: ${action}`);

    return interaction;
  }

  private validateInteractionFlow(interaction: Interaction): boolean {
    const sourceDeps = this.dependencyMap[interaction.source];
    const targetDeps = this.dependencyMap[interaction.target];

    if (!sourceDeps || !targetDeps) {
      console.warn(`[InteractionChain] Unknown module: ${interaction.source} or ${interaction.target}`);
      return false;
    }

    // Check if source can trigger target
    const canTrigger = sourceDeps.triggers.includes(interaction.target);
    if (!canTrigger) {
      console.warn(
        `[InteractionChain] Invalid flow: ${interaction.source} cannot trigger ${interaction.target}`
      );
      return false;
    }

    return true;
  }

  getInteractionsByModule(moduleName: string): Interaction[] {
    return this.interactionLog.filter(
      (i) => i.source === moduleName || i.target === moduleName
    );
  }

  getInteractionsByUser(userId: number): Interaction[] {
    return this.interactionLog.filter((i) => i.userId === userId);
  }

  getInteractionsBySession(sessionId: string): Interaction[] {
    return this.interactionLog.filter((i) => i.sessionId === sessionId);
  }

  getInteractionFlow(sourceModule: string): {
    module: string;
    canTrigger: string[];
    dependsOn: string[];
    dataFlows: string[];
  } {
    const deps = this.dependencyMap[sourceModule];
    if (!deps) {
      return { module: sourceModule, canTrigger: [], dependsOn: [], dataFlows: [] };
    }

    return {
      module: sourceModule,
      canTrigger: deps.triggers,
      dependsOn: deps.dependsOn,
      dataFlows: deps.dataFlows,
    };
  }

  getDependencyMap(): DependencyMap {
    return this.dependencyMap;
  }

  getRecentInteractions(limit: number = 20): Interaction[] {
    return this.interactionLog.slice(-limit).reverse();
  }

  getInteractionStats() {
    const stats = {
      totalInteractions: this.interactionLog.length,
      interactionsBySource: {} as Record<string, number>,
      interactionsByTarget: {} as Record<string, number>,
      validatedCount: 0,
      failedValidationCount: 0,
      uniqueUsers: new Set<number>(),
      uniqueSessions: new Set<string>(),
    };

    for (const interaction of this.interactionLog) {
      // Count by source
      stats.interactionsBySource[interaction.source] =
        (stats.interactionsBySource[interaction.source] || 0) + 1;

      // Count by target
      stats.interactionsByTarget[interaction.target] =
        (stats.interactionsByTarget[interaction.target] || 0) + 1;

      // Count validation
      if (interaction.validated) {
        stats.validatedCount++;
      } else {
        stats.failedValidationCount++;
      }

      // Track unique users and sessions
      stats.uniqueUsers.add(interaction.userId);
      stats.uniqueSessions.add(interaction.sessionId);
    }

    return {
      totalInteractions: stats.totalInteractions,
      interactionsBySource: stats.interactionsBySource,
      interactionsByTarget: stats.interactionsByTarget,
      validatedCount: stats.validatedCount,
      failedValidationCount: stats.failedValidationCount,
      uniqueUsers: stats.uniqueUsers.size,
      uniqueSessions: stats.uniqueSessions.size,
      timestamp: new Date().toISOString(),
    };
  }

  clearInteractionLog(): void {
    this.interactionLog = [];
    console.log("[InteractionChainManager] Interaction log cleared");
  }

  getValidationReport() {
    const validated = this.interactionLog.filter((i) => i.validated);
    const failed = this.interactionLog.filter((i) => !i.validated);

    return {
      total: this.interactionLog.length,
      validated: validated.length,
      failed: failed.length,
      validationRate:
        this.interactionLog.length > 0
          ? Math.round((validated.length / this.interactionLog.length) * 100)
          : 0,
      failedInteractions: failed,
      timestamp: new Date().toISOString(),
    };
  }
}

export const interactionChainManager = new InteractionChainManager();
