/**
 * Real-time Progress Socket Client
 * Handles WebSocket communication for live progress tracking
 */

interface ProgressMetrics {
  assignmentId: number;
  score: number;
  timeSpent: number;
  completedAt: string;
  attempts: number;
}

interface ProgressUpdate {
  userId: number;
  metrics: ProgressMetrics;
  timestamp: string;
}

export class ProgressSocket {
  private static instance: ProgressSocket;
  private callbacks: Map<string, Function[]> = new Map();

  private constructor() {
    this.setupListeners();
  }

  static getInstance(): ProgressSocket {
    if (!ProgressSocket.instance) {
      ProgressSocket.instance = new ProgressSocket();
    }
    return ProgressSocket.instance;
  }

  private setupListeners(): void {
    // Setup event listeners for progress updates
    this.on("progress_update", (data: ProgressUpdate) => {
      console.log("[ProgressSocket] Progress update received:", data);
    });

    this.on("intervention_alert", (alert: any) => {
      console.log("[ProgressSocket] Intervention alert:", alert);
    });
  }

  /**
   * Track user progress (client-side call to server)
   */
  async trackProgress(metrics: ProgressMetrics): Promise<void> {
    try {
      const res = await fetch("/api/progress/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metrics),
      });

      if (!res.ok) throw new Error("Failed to track progress");
      const data = await res.json();

      // Emit local event
      this.emit("progress_tracked", data);
    } catch (error) {
      console.error("[ProgressSocket] Error tracking progress:", error);
    }
  }

  /**
   * Subscribe to real-time progress updates
   */
  async subscribeToProgress(userId: number): Promise<void> {
    try {
      const res = await fetch(`/api/progress/subscribe/${userId}`);
      if (!res.ok) throw new Error("Failed to subscribe");
      console.log("[ProgressSocket] Subscribed to progress updates");
    } catch (error) {
      console.error("[ProgressSocket] Error subscribing:", error);
    }
  }

  /**
   * Get real-time intervention alerts
   */
  async getInterventionAlerts(userId: number): Promise<any[]> {
    try {
      const res = await fetch(`/api/progress/alerts/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return res.json();
    } catch (error) {
      console.error("[ProgressSocket] Error fetching alerts:", error);
      return [];
    }
  }

  /**
   * Register event listener
   */
  on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)?.push(callback);
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any): void {
    const callbacks = this.callbacks.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, callback: Function): void {
    const callbacks = this.callbacks.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}

export const progressSocket = ProgressSocket.getInstance();
