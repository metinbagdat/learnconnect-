interface DataPipeline {
  id: string;
  name: string;
  source: string;
  targets: string[];
  schema: Record<string, any>;
  errorHandling?: string;
  status: "active" | "inactive";
  createdAt: number;
  metrics: {
    totalFlows: number;
    successfulFlows: number;
    failedFlows: number;
    averageProcessTime: number;
    lastFlowTime?: number;
  };
}

interface FlowEvent {
  id: string;
  pipelineId: string;
  type: "start" | "step" | "complete" | "error";
  timestamp: number;
  module?: string;
  status: string;
  duration?: number;
  data?: Record<string, any>;
}

export class DataFlowController {
  private pipelines: Map<string, DataPipeline> = new Map();
  private flowEvents: Map<string, FlowEvent[]> = new Map();
  private readonly maxEventsPerPipeline = 1000;

  createPipeline(
    name: string,
    source: string,
    targets: string[],
    schema: Record<string, any>,
    errorHandling: string = "log_and_continue"
  ): DataPipeline {
    const id = `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pipeline: DataPipeline = {
      id,
      name,
      source,
      targets,
      schema,
      errorHandling,
      status: "active",
      createdAt: Date.now(),
      metrics: {
        totalFlows: 0,
        successfulFlows: 0,
        failedFlows: 0,
        averageProcessTime: 0,
      },
    };

    this.pipelines.set(id, pipeline);
    this.flowEvents.set(id, []);

    return pipeline;
  }

  listPipelines(): DataPipeline[] {
    return Array.from(this.pipelines.values());
  }

  getPipeline(pipelineId: string): DataPipeline | null {
    return this.pipelines.get(pipelineId) || null;
  }

  async processDataFlow(pipelineId: string, data: Record<string, any>): Promise<any> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      return { status: "error", message: "Pipeline not found" };
    }

    const flowId = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      if (!this.validateData(data, pipeline.schema)) {
        throw new Error("Data validation failed");
      }

      this.logFlowEvent(pipelineId, {
        id: flowId,
        pipelineId,
        type: "start",
        timestamp: Date.now(),
        module: pipeline.source,
        status: "initiated",
        data,
      });

      let processedData = data;
      const stepResults: any[] = [];

      for (const target of pipeline.targets) {
        const stepStartTime = Date.now();
        try {
          processedData = await this.sendToModule(target, processedData, pipelineId);
          const stepDuration = Date.now() - stepStartTime;

          this.logFlowEvent(pipelineId, {
            id: `${flowId}_step_${target}`,
            pipelineId,
            type: "step",
            timestamp: Date.now(),
            module: target,
            status: "success",
            duration: stepDuration,
          });

          stepResults.push({ module: target, status: "success", duration: stepDuration });
        } catch (error) {
          const stepDuration = Date.now() - stepStartTime;

          if (pipeline.errorHandling === "fail_fast") {
            throw error;
          }

          stepResults.push({ module: target, status: "failed", error: String(error), duration: stepDuration });

          this.logFlowEvent(pipelineId, {
            id: `${flowId}_step_${target}`,
            pipelineId,
            type: "error",
            timestamp: Date.now(),
            module: target,
            status: "failed",
            duration: stepDuration,
            data: { error: String(error) },
          });
        }
      }

      const totalDuration = Date.now() - startTime;

      pipeline.metrics.totalFlows++;
      pipeline.metrics.successfulFlows++;
      pipeline.metrics.lastFlowTime = Date.now();
      pipeline.metrics.averageProcessTime =
        (pipeline.metrics.averageProcessTime * (pipeline.metrics.totalFlows - 1) + totalDuration) / pipeline.metrics.totalFlows;

      this.logFlowEvent(pipelineId, {
        id: `${flowId}_complete`,
        pipelineId,
        type: "complete",
        timestamp: Date.now(),
        status: "completed",
        duration: totalDuration,
        data: { steps: stepResults },
      });

      return {
        status: "success",
        flowId,
        processedData,
        duration: totalDuration,
        steps: stepResults,
      };
    } catch (error) {
      pipeline.metrics.totalFlows++;
      pipeline.metrics.failedFlows++;
      const totalDuration = Date.now() - startTime;

      this.logFlowEvent(pipelineId, {
        id: `${flowId}_error`,
        pipelineId,
        type: "error",
        timestamp: Date.now(),
        status: "failed",
        duration: totalDuration,
        data: { error: String(error) },
      });

      return {
        status: "error",
        flowId,
        error: String(error),
        duration: totalDuration,
      };
    }
  }

  private validateData(data: Record<string, any>, schema: Record<string, any>): boolean {
    if (!schema.required || !Array.isArray(schema.required)) {
      return true;
    }

    for (const field of schema.required) {
      if (!(field in data)) {
        return false;
      }
    }

    return true;
  }

  private async sendToModule(
    targetModule: string,
    data: Record<string, any>,
    pipelineId: string
  ): Promise<Record<string, any>> {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

    return {
      ...data,
      processedBy: targetModule,
      timestamp: Date.now(),
    };
  }

  private logFlowEvent(
    pipelineId: string,
    event: Omit<FlowEvent, "id">
  ): void {
    const events = this.flowEvents.get(pipelineId) || [];

    const flowEvent: FlowEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    events.push(flowEvent);

    if (events.length > this.maxEventsPerPipeline) {
      events.shift();
    }

    this.flowEvents.set(pipelineId, events);
  }

  getFlowEvents(pipelineId: string, limit: number = 50): FlowEvent[] {
    const events = this.flowEvents.get(pipelineId) || [];
    return events.slice(-limit).reverse();
  }

  getFlowMetrics(pipelineId: string): any {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      return { pipeline: null };
    }

    const events = this.flowEvents.get(pipelineId) || [];
    const completedFlows = events.filter((e) => e.type === "complete").length;
    const failedFlows = events.filter((e) => e.type === "error").length;

    return {
      pipeline,
      events: events.length,
      completedFlows,
      failedFlows,
      successRate: pipeline.metrics.totalFlows > 0 ? (pipeline.metrics.successfulFlows / pipeline.metrics.totalFlows) * 100 : 0,
    };
  }

  getAllMetrics(): any {
    const metrics: any[] = [];

    for (const [pipelineId, pipeline] of this.pipelines) {
      const events = this.flowEvents.get(pipelineId) || [];
      metrics.push({
        id: pipelineId,
        name: pipeline.name,
        metrics: pipeline.metrics,
        recentEvents: events.slice(-5).reverse(),
      });
    }

    return metrics;
  }

  clearPipelineHistory(pipelineId: string): void {
    this.flowEvents.set(pipelineId, []);
    const pipeline = this.pipelines.get(pipelineId);
    if (pipeline) {
      pipeline.metrics = {
        totalFlows: 0,
        successfulFlows: 0,
        failedFlows: 0,
        averageProcessTime: 0,
      };
    }
  }
}

export const dataFlowController = new DataFlowController();
