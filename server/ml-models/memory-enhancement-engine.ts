// Step 8: Memory Enhancement & Spaced Repetition Engine

export interface MemoryEnhancementConfig {
  userId: number;
  learningStyle?: string;
  memorizationLevel: 'low' | 'medium' | 'high';
  topicDifficulty: number;
  userPerformance?: number;
}

export class MemoryEnhancementEngine {
  /**
   * Recommend memory techniques based on topic and learning style
   */
  recommendMemoryTechniques(config: MemoryEnhancementConfig): string[] {
    const techniques: string[] = [];

    if (config.memorizationLevel === 'high') {
      // High memorization topics
      if (config.learningStyle === 'visual') {
        techniques.push('method_of_loci', 'mind_mapping', 'visual_chunking');
      } else if (config.learningStyle === 'auditory') {
        techniques.push('mnemonics', 'rhyming_systems', 'rhythm_patterns');
      } else if (config.learningStyle === 'kinesthetic') {
        techniques.push('peg_system', 'story_method', 'physical_association');
      } else {
        techniques.push('spaced_repetition', 'active_recall', 'chunking');
      }
    } else if (config.memorizationLevel === 'medium') {
      techniques.push('chunking', 'active_recall', 'concept_mapping');
    } else {
      techniques.push('understanding_first', 'practice_problems', 'real_world_examples');
    }

    return techniques;
  }

  /**
   * Calculate next spaced repetition review date using SM-2 algorithm
   */
  calculateNextReviewDate(
    quality: number,
    repetitions: number,
    easeFactor: number,
    interval: number
  ): { nextDate: Date; newEaseFactor: number; newInterval: number } {
    // SM-2 algorithm
    let newEaseFactor = easeFactor;
    let newInterval = interval;

    // Update ease factor based on quality (0-5 scale)
    newEaseFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );

    // Calculate new interval
    if (quality < 3) {
      newInterval = 1;
      repetitions = 0;
    } else {
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 3;
      } else {
        newInterval = Math.round(interval * newEaseFactor);
      }
      repetitions++;
    }

    // Calculate next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    return {
      nextDate,
      newEaseFactor,
      newInterval,
    };
  }

  /**
   * Assess learning style from answers
   */
  assessLearningStyle(answers: Record<string, number>): {
    visual: number;
    auditory: number;
    kinesthetic: number;
    readingWriting: number;
    dominant: string;
  } {
    const scores = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      readingWriting: 0,
    };

    // Simple scoring based on question categories
    Object.entries(answers).forEach(([key, score]) => {
      if (key.startsWith('visual')) scores.visual += score;
      if (key.startsWith('auditory')) scores.auditory += score;
      if (key.startsWith('kinesthetic')) scores.kinesthetic += score;
      if (key.startsWith('reading')) scores.readingWriting += score;
    });

    // Normalize scores
    const total = Object.values(scores).reduce((a, b) => a + b, 1);
    Object.keys(scores).forEach((key) => {
      (scores as any)[key] = (scores as any)[key] / total;
    });

    // Find dominant style
    let dominant = 'visual';
    let maxScore = scores.visual;

    if (scores.auditory > maxScore) {
      dominant = 'auditory';
      maxScore = scores.auditory;
    }
    if (scores.kinesthetic > maxScore) {
      dominant = 'kinesthetic';
      maxScore = scores.kinesthetic;
    }
    if (scores.readingWriting > maxScore) {
      dominant = 'reading_writing';
      maxScore = scores.readingWriting;
    }

    return { ...scores, dominant };
  }

  /**
   * Generate brain training recommendations based on performance
   */
  recommendBrainTraining(
    learningStyle: string,
    performanceLevel: number
  ): {
    type: string;
    difficulty: string;
    reason: string;
  }[] {
    const recommendations = [];

    // Based on learning style
    if (learningStyle === 'visual') {
      recommendations.push({
        type: 'pattern_recognition',
        difficulty: performanceLevel > 70 ? 'hard' : 'medium',
        reason: 'Enhances visual processing and pattern identification',
      });
    } else if (learningStyle === 'auditory') {
      recommendations.push({
        type: 'sound_discrimination',
        difficulty: performanceLevel > 70 ? 'hard' : 'medium',
        reason: 'Improves auditory focus and memory retention',
      });
    } else if (learningStyle === 'kinesthetic') {
      recommendations.push({
        type: 'speed_and_accuracy',
        difficulty: performanceLevel > 70 ? 'hard' : 'medium',
        reason: 'Develops motor control and quick response time',
      });
    }

    // Always recommend concentration and memory
    recommendations.push({
      type: 'concentration',
      difficulty: performanceLevel > 80 ? 'hard' : performanceLevel > 60 ? 'medium' : 'easy',
      reason: 'Improves focus and reduces distraction',
    });

    recommendations.push({
      type: 'memory',
      difficulty: performanceLevel > 70 ? 'hard' : 'medium',
      reason: 'Strengthens working memory and recall ability',
    });

    return recommendations;
  }

  /**
   * Estimate retention based on spaced repetition data
   */
  estimateRetention(
    timeSinceLastReview: number,
    easeFactor: number,
    interval: number
  ): number {
    // Based on Ebbinghaus forgetting curve
    // R = e^(-t/S)
    // where R is retention, t is time, S is strength factor

    const strength = easeFactor * interval;
    const days = timeSinceLastReview / (1000 * 60 * 60 * 24);
    const retention = Math.exp(-days / strength);

    return Math.max(0, Math.min(1, retention));
  }
}
