// Step 7.2: User Interaction Feedback Processor

export interface InteractionData {
  userId: number;
  curriculumId: string;
  courseId?: number;
  action: 'view' | 'complete' | 'struggle' | 'quick-pass' | 'review' | 'skip';
  timestamp: number;
  duration: number;
  successRate?: number;
  difficultyRating?: number;
  feedback?: string;
}

export interface InteractionInsights {
  engagementLevel: number;
  learningVelocity: number;
  difficultyPerception: number;
  preferenceSignals: Record<string, number>;
  timestamp: number;
}

export class FeedbackProcessor {
  /**
   * Analyze user interaction for adaptation insights
   */
  analyzeInteraction(interactions: InteractionData[]): InteractionInsights {
    if (interactions.length === 0) {
      return {
        engagementLevel: 0.5,
        learningVelocity: 0.5,
        difficultyPerception: 0.5,
        preferenceSignals: {},
        timestamp: Date.now(),
      };
    }

    const engagementLevel = this.calculateEngagement(interactions);
    const learningVelocity = this.calculateLearningVelocity(interactions);
    const difficultyPerception = this.assessDifficultyPerception(interactions);
    const preferenceSignals = this.extractPreferenceSignals(interactions);

    return {
      engagementLevel,
      learningVelocity,
      difficultyPerception,
      preferenceSignals,
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate engagement level (0-1 scale)
   */
  private calculateEngagement(interactions: InteractionData[]): number {
    let engagement = 0;

    interactions.forEach((interaction) => {
      const durationScore = Math.min(interaction.duration / 3600000, 1); // 1 hour max
      const actionWeights: Record<string, number> = {
        complete: 1.0,
        view: 0.4,
        review: 0.8,
        struggle: 0.6,
        'quick-pass': 0.3,
        skip: -0.2,
      };

      engagement += (actionWeights[interaction.action] || 0) * durationScore;
    });

    return Math.min(Math.max(engagement / interactions.length, 0), 1);
  }

  /**
   * Calculate learning velocity (0-1 scale, how quickly user progresses)
   */
  private calculateLearningVelocity(interactions: InteractionData[]): number {
    let velocity = 0;
    let completions = 0;

    interactions.forEach((interaction) => {
      if (interaction.action === 'complete') {
        completions++;
        // Success rate impacts velocity
        if (interaction.successRate !== undefined) {
          velocity += interaction.successRate / 100;
        } else {
          velocity += 0.7; // Default assumption
        }
      }
    });

    if (completions === 0) return 0.5;

    const completionRate = completions / interactions.length;
    const successVelocity = velocity / completions;

    return (completionRate + successVelocity) / 2;
  }

  /**
   * Assess how user perceives difficulty (0-1 scale)
   */
  private assessDifficultyPerception(interactions: InteractionData[]): number {
    let difficultySum = 0;
    let ratedCount = 0;

    interactions.forEach((interaction) => {
      if (interaction.difficultyRating !== undefined) {
        // Normalize to 0-1 scale (assuming 1-10 scale input)
        difficultySum += interaction.difficultyRating / 10;
        ratedCount++;
      } else {
        // Infer from action
        if (interaction.action === 'struggle') {
          difficultySum += 0.8;
          ratedCount++;
        } else if (interaction.action === 'quick-pass') {
          difficultySum += 0.2;
          ratedCount++;
        } else if (interaction.action === 'complete') {
          difficultySum += 0.5;
          ratedCount++;
        }
      }
    });

    if (ratedCount === 0) return 0.5;
    return Math.min(difficultySum / ratedCount, 1);
  }

  /**
   * Extract user preference signals from interactions
   */
  private extractPreferenceSignals(
    interactions: InteractionData[]
  ): Record<string, number> {
    const signals: Record<string, number> = {};

    interactions.forEach((interaction) => {
      // Extract from feedback text
      if (interaction.feedback) {
        const feedbackLower = interaction.feedback.toLowerCase();
        const topics = [
          'video',
          'text',
          'interactive',
          'examples',
          'quizzes',
          'projects',
          'theory',
          'practical',
        ];

        topics.forEach((topic) => {
          if (feedbackLower.includes(topic)) {
            signals[topic] = (signals[topic] || 0) + 1;
          }
        });
      }

      // Extract from action patterns
      if (interaction.action === 'review') {
        signals['review_focused'] = (signals['review_focused'] || 0) + 1;
      }

      if (interaction.action === 'complete' && interaction.successRate !== undefined && interaction.successRate > 80) {
        signals['strong_completion'] = (signals['strong_completion'] || 0) + 1;
      }
    });

    // Normalize signals
    const totalSignals = Object.values(signals).reduce((a, b) => a + b, 0);
    if (totalSignals > 0) {
      Object.keys(signals).forEach((key) => {
        signals[key] = signals[key] / totalSignals;
      });
    }

    return signals;
  }

  /**
   * Process batch of interactions for trend analysis
   */
  processBatch(interactions: InteractionData[]): {
    insights: InteractionInsights;
    trends: Record<string, number>;
    anomalies: string[];
  } {
    const insights = this.analyzeInteraction(interactions);
    const trends = this.identifyTrends(interactions);
    const anomalies = this.detectAnomalies(interactions);

    return {
      insights,
      trends,
      anomalies,
    };
  }

  /**
   * Identify trends in user behavior
   */
  private identifyTrends(interactions: InteractionData[]): Record<string, number> {
    const trends: Record<string, number> = {};

    if (interactions.length < 2) return trends;

    // Check engagement trend
    const recent = interactions.slice(-5);
    const older = interactions.slice(-10, -5);

    const recentEngagement = this.calculateEngagement(recent);
    const olderEngagement = older.length > 0 ? this.calculateEngagement(older) : 0.5;

    trends['engagement_trend'] = recentEngagement - olderEngagement;
    trends['velocity_trend'] = this.calculateLearningVelocity(recent) - (older.length > 0 ? this.calculateLearningVelocity(older) : 0.5);

    return trends;
  }

  /**
   * Detect anomalies in user behavior
   */
  private detectAnomalies(interactions: InteractionData[]): string[] {
    const anomalies: string[] = [];

    if (interactions.length === 0) return anomalies;

    // Check for sudden engagement drop
    if (interactions.length >= 3) {
      const lastEngagement = this.calculateEngagement([interactions[interactions.length - 1]]);
      const avgEngagement = this.calculateEngagement(interactions.slice(0, -1));

      if (Math.abs(lastEngagement - avgEngagement) > 0.5) {
        anomalies.push('Unusual engagement change detected');
      }
    }

    // Check for unusual activity patterns
    const actions = interactions.map((i) => i.action);
    const skips = actions.filter((a) => a === 'skip').length;
    if (skips > interactions.length * 0.5) {
      anomalies.push('High rate of course skipping detected');
    }

    // Check for struggle pattern
    const struggles = actions.filter((a) => a === 'struggle').length;
    if (struggles > interactions.length * 0.7) {
      anomalies.push('User consistently struggling - consider easier content');
    }

    return anomalies;
  }
}
