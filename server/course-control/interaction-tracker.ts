interface InteractionRecord {
  id: string;
  userId: number;
  type: string;
  module: string;
  action: string;
  duration: number;
  status: number;
  timestamp: number;
  metadata: Record<string, any>;
}

export class InteractionTracker {
  private interactions: InteractionRecord[] = [];
  private readonly maxRecords = 5000;
  private moduleMetrics: Record<string, any> = {};

  recordInteraction(
    userId: number,
    type: string,
    module: string,
    action: string,
    duration: number = 0,
    status: number = 200,
    metadata: Record<string, any> = {}
  ): InteractionRecord {
    const record: InteractionRecord = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      module,
      action,
      duration,
      status,
      timestamp: Date.now(),
      metadata,
    };

    this.interactions.push(record);

    // Maintain max size
    if (this.interactions.length > this.maxRecords) {
      this.interactions.shift();
    }

    this.updateModuleMetrics(record);
    return record;
  }

  private updateModuleMetrics(record: InteractionRecord) {
    if (!this.moduleMetrics[record.module]) {
      this.moduleMetrics[record.module] = {
        totalInteractions: 0,
        totalDuration: 0,
        apiCalls: 0,
        userActions: 0,
        averageResponseTime: 0,
        lastActivityTime: 0,
      };
    }

    const metrics = this.moduleMetrics[record.module];
    metrics.totalInteractions++;
    metrics.totalDuration += record.duration;
    metrics.lastActivityTime = record.timestamp;

    if (record.type === "api_call") {
      metrics.apiCalls++;
    } else {
      metrics.userActions++;
    }

    metrics.averageResponseTime = metrics.totalDuration / Math.max(1, metrics.apiCalls);
  }

  getFlowMap(): Record<string, any> {
    return {
      modules: this.moduleMetrics,
      timestamp: Date.now(),
    };
  }

  getModuleMetrics(module: string): any {
    return this.moduleMetrics[module] || null;
  }

  getRecentInteractions(limit: number = 50, module?: string): InteractionRecord[] {
    let filtered = this.interactions;

    if (module) {
      filtered = filtered.filter((i) => i.module === module);
    }

    return filtered.slice(-limit).reverse();
  }

  getUserInteractions(userId: number, limit: number = 100): InteractionRecord[] {
    return this.interactions
      .filter((i) => i.userId === userId)
      .slice(-limit)
      .reverse();
  }

  getInteractionStats(): {
    totalInteractions: number;
    byType: Record<string, number>;
    byModule: Record<string, number>;
    averageResponseTime: number;
  } {
    const stats = {
      totalInteractions: this.interactions.length,
      byType: {} as Record<string, number>,
      byModule: {} as Record<string, number>,
      averageResponseTime: 0,
    };

    let totalDuration = 0;
    let apiCallCount = 0;

    for (const interaction of this.interactions) {
      stats.byType[interaction.type] = (stats.byType[interaction.type] || 0) + 1;
      stats.byModule[interaction.module] = (stats.byModule[interaction.module] || 0) + 1;

      if (interaction.type === "api_call") {
        totalDuration += interaction.duration;
        apiCallCount++;
      }
    }

    stats.averageResponseTime = apiCallCount > 0 ? totalDuration / apiCallCount : 0;

    return stats;
  }

  getFlowDiagram(): {
    flows: Array<{ source: string; target: string; count: number }>;
    timestamp: number;
  } {
    const flows: Record<string, number> = {};

    for (let i = 1; i < this.interactions.length; i++) {
      const prev = this.interactions[i - 1];
      const curr = this.interactions[i];

      if (prev.module !== curr.module && curr.timestamp - prev.timestamp < 5000) {
        const key = `${prev.module}->${curr.module}`;
        flows[key] = (flows[key] || 0) + 1;
      }
    }

    const flowArray = Object.entries(flows)
      .map(([flow, count]) => {
        const [source, target] = flow.split("->").map((s) => s.trim());
        return { source, target, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return {
      flows: flowArray,
      timestamp: Date.now(),
    };
  }

  clearInteractions(): void {
    this.interactions = [];
    this.moduleMetrics = {};
  }

  getPerformanceReport(): {
    modules: Record<string, any>;
    slowestApis: Array<{ action: string; duration: number }>;
    mostActiveModules: Array<{ module: string; interactions: number }>;
  } {
    const slowestApis = this.interactions
      .filter((i) => i.type === "api_call")
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .map((i) => ({ action: i.action, duration: i.duration }));

    const mostActive = Object.entries(this.moduleMetrics)
      .map(([module, metrics]: [string, any]) => ({
        module,
        interactions: metrics.totalInteractions,
      }))
      .sort((a, b) => b.interactions - a.interactions);

    return {
      modules: this.moduleMetrics,
      slowestApis,
      mostActiveModules: mostActive,
    };
  }
}

export const interactionTracker = new InteractionTracker();
