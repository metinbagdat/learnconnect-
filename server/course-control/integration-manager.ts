import { interactionChainManager } from "./interaction-chain-manager.js";
import { interactionTracker } from "./interaction-tracker.js";

interface IntegrationChain {
  id: string;
  userId: number;
  type: string;
  status: "pending" | "success" | "failed";
  steps: Array<{
    module: string;
    action: string;
    status: "pending" | "success" | "failed";
    duration: number;
    result?: any;
  }>;
  startTime: number;
  endTime?: number;
  metadata: Record<string, any>;
}

export class IntegrationManager {
  private chains: Map<string, IntegrationChain> = new Map();
  private chainHistory: IntegrationChain[] = [];
  private readonly maxHistorySize = 1000;

  async handleCourseEnrollment(userId: number, courseId: number, sessionId: string): Promise<IntegrationChain> {
    const chainId = this.generateChainId();
    const chain: IntegrationChain = {
      id: chainId,
      userId,
      type: "course_enrollment",
      status: "pending",
      steps: [
        { module: "course_management", action: "validate_enrollment", status: "pending", duration: 0 },
        { module: "user_profile", action: "update_enrolled_courses", status: "pending", duration: 0 },
        { module: "study_planner", action: "sync_with_planner", status: "pending", duration: 0 },
        { module: "notification_system", action: "send_enrollment_confirmation", status: "pending", duration: 0 },
        { module: "analytics_engine", action: "track_enrollment", status: "pending", duration: 0 },
      ],
      startTime: Date.now(),
      metadata: { courseId, sessionId },
    };

    this.chains.set(chainId, chain);
    interactionChainManager.logInteraction("integration_manager", "course_management", "validate_enrollment", { userId, courseId }, sessionId);

    try {
      for (const step of chain.steps) {
        const startTime = Date.now();
        try {
          step.result = await this.executeIntegrationStep(step.module, step.action, userId, courseId, sessionId);
          step.status = "success";
          step.duration = Date.now() - startTime;

          interactionTracker.recordInteraction(userId, "integration_step", step.module, step.action, step.duration, 200, {
            chainId,
            success: true,
          });
        } catch (error) {
          step.status = "failed";
          step.duration = Date.now() - startTime;
          step.result = { error: String(error) };

          interactionTracker.recordInteraction(userId, "integration_step", step.module, step.action, step.duration, 500, {
            chainId,
            success: false,
            error: String(error),
          });
        }
      }

      chain.status = chain.steps.every((s) => s.status === "success") ? "success" : "failed";
      chain.endTime = Date.now();
    } catch (error) {
      chain.status = "failed";
      chain.endTime = Date.now();
    }

    this.addToHistory(chain);
    return chain;
  }

  async handleCourseCompletion(userId: number, courseId: number, sessionId: string): Promise<IntegrationChain> {
    const chainId = this.generateChainId();
    const chain: IntegrationChain = {
      id: chainId,
      userId,
      type: "course_completion",
      status: "pending",
      steps: [
        { module: "course_management", action: "mark_course_complete", status: "pending", duration: 0 },
        { module: "achievement_system", action: "award_completion_badge", status: "pending", duration: 0 },
        { module: "study_planner", action: "update_completion_status", status: "pending", duration: 0 },
        { module: "notification_system", action: "send_completion_notification", status: "pending", duration: 0 },
        { module: "analytics_engine", action: "record_completion", status: "pending", duration: 0 },
      ],
      startTime: Date.now(),
      metadata: { courseId, sessionId },
    };

    this.chains.set(chainId, chain);

    try {
      for (const step of chain.steps) {
        const startTime = Date.now();
        try {
          step.result = await this.executeIntegrationStep(step.module, step.action, userId, courseId, sessionId);
          step.status = "success";
          step.duration = Date.now() - startTime;
        } catch (error) {
          step.status = "failed";
          step.duration = Date.now() - startTime;
          step.result = { error: String(error) };
        }
      }

      chain.status = chain.steps.every((s) => s.status === "success") ? "success" : "failed";
      chain.endTime = Date.now();
    } catch (error) {
      chain.status = "failed";
      chain.endTime = Date.now();
    }

    this.addToHistory(chain);
    return chain;
  }

  async handleContentProgress(
    userId: number,
    courseId: number,
    contentId: number,
    progress: number,
    sessionId: string
  ): Promise<IntegrationChain> {
    const chainId = this.generateChainId();
    const chain: IntegrationChain = {
      id: chainId,
      userId,
      type: "content_progress",
      status: "pending",
      steps: [
        { module: "course_management", action: "update_progress", status: "pending", duration: 0 },
        { module: "analytics_engine", action: "track_progress", status: "pending", duration: 0 },
        { module: "study_planner", action: "sync_progress", status: "pending", duration: 0 },
      ],
      startTime: Date.now(),
      metadata: { courseId, contentId, progress, sessionId },
    };

    this.chains.set(chainId, chain);

    try {
      for (const step of chain.steps) {
        const startTime = Date.now();
        try {
          step.result = await this.executeIntegrationStep(
            step.module,
            step.action,
            userId,
            courseId,
            sessionId,
            { contentId, progress }
          );
          step.status = "success";
          step.duration = Date.now() - startTime;
        } catch (error) {
          step.status = "failed";
          step.duration = Date.now() - startTime;
          step.result = { error: String(error) };
        }
      }

      chain.status = chain.steps.every((s) => s.status === "success") ? "success" : "failed";
      chain.endTime = Date.now();
    } catch (error) {
      chain.status = "failed";
      chain.endTime = Date.now();
    }

    this.addToHistory(chain);
    return chain;
  }

  private async executeIntegrationStep(
    module: string,
    action: string,
    userId: number,
    courseId: number,
    sessionId: string,
    metadata?: Record<string, any>
  ): Promise<any> {
    // Simulate module operations - in production, these would call actual module APIs
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate async work

    return {
      module,
      action,
      userId,
      courseId,
      timestamp: new Date().toISOString(),
      metadata,
    };
  }

  getChainStatus(chainId: string): IntegrationChain | null {
    return this.chains.get(chainId) || null;
  }

  getChainHistory(limit: number = 50): IntegrationChain[] {
    return this.chainHistory.slice(-limit).reverse();
  }

  private addToHistory(chain: IntegrationChain): void {
    this.chainHistory.push(chain);
    if (this.chainHistory.length > this.maxHistorySize) {
      this.chainHistory.shift();
    }
  }

  private generateChainId(): string {
    return `chain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getIntegrationStats(): {
    totalChains: number;
    successfulChains: number;
    failedChains: number;
    averageChainDuration: number;
    chainsByType: Record<string, number>;
  } {
    const stats = {
      totalChains: this.chainHistory.length,
      successfulChains: 0,
      failedChains: 0,
      averageChainDuration: 0,
      chainsByType: {} as Record<string, number>,
    };

    let totalDuration = 0;

    for (const chain of this.chainHistory) {
      if (chain.status === "success") stats.successfulChains++;
      if (chain.status === "failed") stats.failedChains++;

      const duration = (chain.endTime || Date.now()) - chain.startTime;
      totalDuration += duration;

      stats.chainsByType[chain.type] = (stats.chainsByType[chain.type] || 0) + 1;
    }

    stats.averageChainDuration = stats.totalChains > 0 ? totalDuration / stats.totalChains : 0;

    return stats;
  }

  getDependencyMap(): {
    dependencies: Array<{ from: string; to: string[] }>;
    integrationTypes: string[];
  } {
    return {
      dependencies: [
        { from: "course_management", to: ["analytics_engine", "user_profile"] },
        { from: "user_profile", to: ["study_planner", "notification_system"] },
        { from: "study_planner", to: ["analytics_engine"] },
        { from: "analytics_engine", to: [] },
        { from: "achievement_system", to: ["notification_system", "analytics_engine"] },
      ],
      integrationTypes: ["course_enrollment", "course_completion", "content_progress"],
    };
  }
}

export const integrationManager = new IntegrationManager();
