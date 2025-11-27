// Step 2.2: Advanced Spaced Repetition Engine
// Based on SuperMemo-2 algorithm with DopingHafiza optimization

export class SM2Algorithm {
  /**
   * SuperMemo-2 algorithm implementation for optimal review scheduling
   */
  calculateIntervals(
    retentionRate: number,
    contentDifficulty: number,
    previousInterval: number = 1,
    easeFactor: number = 2.5
  ): {
    nextInterval: number;
    newEaseFactor: number;
    quality: number;
  } {
    // SM-2 formula adjustments
    const quality = Math.min(
      5,
      Math.max(0, retentionRate * 5 - (5 - contentDifficulty))
    );

    let newInterval = 1;
    let newEaseFactor = easeFactor;

    if (quality < 3) {
      newInterval = 1;
    } else {
      if (previousInterval === 1) {
        newInterval = 3;
      } else if (previousInterval === 3) {
        newInterval = 7;
      } else {
        newInterval = Math.round(previousInterval * newEaseFactor);
      }
    }

    // Update ease factor
    newEaseFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );

    return {
      nextInterval: newInterval,
      newEaseFactor,
      quality: Math.round(quality * 20),
    };
  }

  /**
   * Calculate retention curve based on time elapsed
   */
  estimateRetention(
    daysSinceReview: number,
    easeFactor: number,
    strength: number = 1
  ): number {
    // Ebbinghaus forgetting curve with SM-2 modifications
    const decayFactor = (1 / easeFactor) * strength;
    const retention = Math.exp(-daysSinceReview * decayFactor);
    return Math.max(0, Math.min(1, retention));
  }
}

export class PerformanceTracker {
  /**
   * Track user performance metrics for spaced repetition optimization
   */
  getUserPerformance(userId: number): {
    retentionRate: number;
    averageDifficulty: number;
    learningVelocity: number;
    consistencyScore: number;
  } {
    return {
      retentionRate: 0.85,
      averageDifficulty: 4.5,
      learningVelocity: 2.3,
      consistencyScore: 0.82,
    };
  }

  /**
   * Track session performance
   */
  recordSessionPerformance(userId: number, sessionData: any): void {
    // Store session performance data for analysis
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(userId: number, days: number = 30): {
    retentionTrend: "improving" | "stable" | "declining";
    velocityTrend: "accelerating" | "steady" | "decelerating";
    consistencyTrend: "improving" | "stable" | "declining";
  } {
    return {
      retentionTrend: "improving",
      velocityTrend: "accelerating",
      consistencyTrend: "improving",
    };
  }
}

export class SpacedRepetitionEngine {
  private sm2Algorithm: SM2Algorithm;
  private performanceTracker: PerformanceTracker;

  constructor() {
    this.sm2Algorithm = new SM2Algorithm();
    this.performanceTracker = new PerformanceTracker();
  }

  /**
   * Generate optimal review schedule for user's curriculum
   */
  generateOptimalReviewSchedule(
    userId: number,
    curriculum: any,
    learningSessions: any[]
  ): {
    immediateReviews: any[];
    shortTermReviews: any[];
    longTermReviews: any[];
    masteryReviews: any[];
    totalReviewSessions: number;
    estimatedCompletionDays: number;
  } {
    const schedule = {
      immediateReviews: [] as any[],
      shortTermReviews: [] as any[],
      longTermReviews: [] as any[],
      masteryReviews: [] as any[],
    };

    learningSessions.forEach((session) => {
      const reviewIntervals = this._calculateReviewIntervals(session, userId);

      schedule.immediateReviews.push(
        ...this._scheduleImmediateReviews(
          session,
          reviewIntervals.immediate
        )
      );
      schedule.shortTermReviews.push(
        ...this._scheduleShortTermReviews(
          session,
          reviewIntervals.shortTerm
        )
      );
      schedule.longTermReviews.push(
        ...this._scheduleLongTermReviews(
          session,
          reviewIntervals.longTerm
        )
      );
      schedule.masteryReviews.push(
        ...this._scheduleMasteryReviews(session, reviewIntervals.mastery)
      );
    });

    const optimized = this._optimizeSchedule(schedule, userId);

    return {
      ...optimized,
      totalReviewSessions:
        schedule.immediateReviews.length +
        schedule.shortTermReviews.length +
        schedule.longTermReviews.length +
        schedule.masteryReviews.length,
      estimatedCompletionDays: 30,
    };
  }

  /**
   * Calculate optimal review intervals based on content and user performance
   */
  private _calculateReviewIntervals(learningSession: any, userId: number) {
    const userPerformance = this.performanceTracker.getUserPerformance(userId);
    const contentDifficulty = learningSession.difficulty || 5;
    const contentType = learningSession.contentType || "concept";

    // Base intervals from SM2
    const baseIntervals = this.sm2Algorithm.calculateIntervals(
      userPerformance.retentionRate,
      contentDifficulty
    );

    // Adjust for content type
    const adjusted = this._adjustForContentType(
      baseIntervals.nextInterval,
      contentType
    );

    // Adjust for cognitive profile
    const final = this._adjustForCognitiveProfile(adjusted, userId);

    return {
      immediate: [1], // Next day
      shortTerm: [3, 7], // 3-7 days
      longTerm: [14, 21, 30], // 2-4 weeks
      mastery: [60, 90, 180], // 2-6 months
      ...final,
    };
  }

  private _adjustForContentType(baseInterval: number, contentType: string): {
    immediate: number[];
    shortTerm: number[];
    longTerm: number[];
    mastery: number[];
  } {
    const adjustments: Record<
      string,
      { multiplier: number; baseReviewCount: number }
    > = {
      formula: { multiplier: 1.5, baseReviewCount: 6 }, // Formulas need more reviews
      timeline: { multiplier: 1.2, baseReviewCount: 5 },
      definition: { multiplier: 1.3, baseReviewCount: 5 },
      concept: { multiplier: 1.0, baseReviewCount: 4 },
      narrative: { multiplier: 0.8, baseReviewCount: 3 },
      list: { multiplier: 1.4, baseReviewCount: 5 },
    };

    const adj = adjustments[contentType] || adjustments.concept;

    return {
      immediate: [1],
      shortTerm: [Math.ceil(3 * adj.multiplier), Math.ceil(7 * adj.multiplier)],
      longTerm: [14, 21, 30],
      mastery: [60, 90, 180],
    };
  }

  private _adjustForCognitiveProfile(intervals: any, userId: number): any {
    const trends = this.performanceTracker.getPerformanceTrends(userId);

    // Accelerate reviews if user is improving
    if (trends.retentionTrend === "improving") {
      return {
        immediate: intervals.immediate,
        shortTerm: intervals.shortTerm.map((d: number) =>
          Math.ceil(d * 0.9)
        ),
        longTerm: intervals.longTerm,
        mastery: intervals.mastery,
      };
    }

    return intervals;
  }

  private _scheduleImmediateReviews(session: any, intervals: number[]): any[] {
    const today = new Date();
    return intervals.map((days) => {
      const reviewDate = new Date(today);
      reviewDate.setDate(reviewDate.getDate() + days);
      return {
        topicId: session.id,
        topicName: session.title,
        type: "immediate",
        scheduledDate: reviewDate.toISOString().split("T")[0],
        priority: "high",
        duration: 15,
      };
    });
  }

  private _scheduleShortTermReviews(session: any, intervals: number[]): any[] {
    const today = new Date();
    return intervals.map((days) => {
      const reviewDate = new Date(today);
      reviewDate.setDate(reviewDate.getDate() + days);
      return {
        topicId: session.id,
        topicName: session.title,
        type: "short_term",
        scheduledDate: reviewDate.toISOString().split("T")[0],
        priority: "medium",
        duration: 20,
      };
    });
  }

  private _scheduleLongTermReviews(session: any, intervals: number[]): any[] {
    const today = new Date();
    return intervals.map((days) => {
      const reviewDate = new Date(today);
      reviewDate.setDate(reviewDate.getDate() + days);
      return {
        topicId: session.id,
        topicName: session.title,
        type: "long_term",
        scheduledDate: reviewDate.toISOString().split("T")[0],
        priority: "medium",
        duration: 25,
      };
    });
  }

  private _scheduleMasteryReviews(session: any, intervals: number[]): any[] {
    const today = new Date();
    return intervals.map((days) => {
      const reviewDate = new Date(today);
      reviewDate.setDate(reviewDate.getDate() + days);
      return {
        topicId: session.id,
        topicName: session.title,
        type: "mastery",
        scheduledDate: reviewDate.toISOString().split("T")[0],
        priority: "low",
        duration: 30,
      };
    });
  }

  private _optimizeSchedule(schedule: any, userId: number): any {
    // Consolidate overlapping reviews
    const allReviews = [
      ...schedule.immediateReviews,
      ...schedule.shortTermReviews,
      ...schedule.longTermReviews,
      ...schedule.masteryReviews,
    ];

    // Group by date for optimization
    const reviewsByDate: Record<string, any[]> = {};
    allReviews.forEach((review) => {
      if (!reviewsByDate[review.scheduledDate]) {
        reviewsByDate[review.scheduledDate] = [];
      }
      reviewsByDate[review.scheduledDate].push(review);
    });

    // Limit daily load to ~60 minutes
    const optimizedSchedule = { ...schedule };
    Object.entries(reviewsByDate).forEach(([date, reviews]) => {
      const totalMinutes = reviews.reduce((sum, r) => sum + r.duration, 0);
      if (totalMinutes > 60) {
        const excessReviews = reviews.slice(
          Math.ceil(60 / (totalMinutes / reviews.length))
        );
        excessReviews.forEach((review) => {
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          review.scheduledDate = nextDate.toISOString().split("T")[0];
        });
      }
    });

    return optimizedSchedule;
  }

  /**
   * Adapt schedule based on performance feedback
   */
  adaptScheduleBasedOnPerformance(
    userId: number,
    topicId: number,
    performanceScore: number,
    currentEaseFactor: number = 2.5
  ): {
    newInterval: number;
    newEaseFactor: number;
    nextReviewDate: string;
  } {
    const retention = performanceScore / 100;
    const intervals = this.sm2Algorithm.calculateIntervals(
      retention,
      5,
      1,
      currentEaseFactor
    );

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervals.nextInterval);

    return {
      newInterval: intervals.nextInterval,
      newEaseFactor: intervals.newEaseFactor,
      nextReviewDate: nextDate.toISOString().split("T")[0],
    };
  }
}
