// Step 7.1: Curriculum Optimization Engine

export interface CurriculumOption {
  id: string;
  courses: Array<{
    courseId: number;
    order: number;
    estimatedHours: number;
    rationale: string;
  }>;
  totalDuration: number;
  estimatedDifficulty: number;
  successProbability: number;
  alignmentScore: number;
}

export interface UserContext {
  userId: number;
  timeAvailable: number;
  proficiency: number;
  currentGoals: string[];
  learningStyle?: string;
  assessmentScores?: Record<string, number>;
}

export class CurriculumOptimizer {
  /**
   * Optimize curriculum based on user context and constraints
   */
  optimizeCurriculum(
    option: CurriculumOption,
    userContext: UserContext
  ): CurriculumOption {
    // Adjust duration based on user's time availability
    const durationAdjustment = this.calculateDurationAdjustment(
      option.totalDuration,
      userContext.timeAvailable
    );

    // Calculate difficulty alignment
    const difficultyAlignment = this.calculateDifficultyAlignment(
      option.estimatedDifficulty,
      userContext.proficiency
    );

    // Reorder courses for optimal learning progression
    const reorderedCourses = this.optimizeCourseOrder(
      option.courses,
      userContext
    );

    // Recalculate success probability based on optimization
    const optimizedSuccessProbability = this.calculateSuccessProbability(
      reorderedCourses,
      userContext,
      durationAdjustment
    );

    return {
      ...option,
      courses: reorderedCourses,
      totalDuration: option.totalDuration * durationAdjustment,
      estimatedDifficulty: option.estimatedDifficulty + difficultyAlignment,
      successProbability: optimizedSuccessProbability,
      alignmentScore: this.calculateAlignmentScore(
        reorderedCourses,
        userContext
      ),
    };
  }

  /**
   * Calculate duration adjustment factor
   */
  private calculateDurationAdjustment(baseDuration: number, timeAvailable: number): number {
    const ratio = timeAvailable / baseDuration;
    if (ratio >= 1) return 1.0; // User has enough time
    if (ratio >= 0.7) return 0.95; // Slightly compress
    if (ratio >= 0.5) return 0.8; // Moderate compression
    return 0.6; // Significant compression
  }

  /**
   * Calculate difficulty alignment score
   */
  private calculateDifficultyAlignment(
    estimatedDifficulty: number,
    userProficiency: number
  ): number {
    const gap = Math.abs(estimatedDifficulty - userProficiency);
    if (gap < 10) return 0; // Perfect alignment
    if (gap < 20) return 5; // Minor adjustment
    if (gap < 30) return 10; // Moderate adjustment
    return 15; // Significant adjustment needed
  }

  /**
   * Reorder courses for optimal learning progression
   */
  private optimizeCourseOrder(
    courses: CurriculumOption['courses'],
    userContext: UserContext
  ): CurriculumOption['courses'] {
    return courses.sort((a, b) => {
      // Prioritize courses that match learning goals
      const aGoalMatch = this.calculateGoalMatch(a.rationale, userContext.currentGoals);
      const bGoalMatch = this.calculateGoalMatch(b.rationale, userContext.currentGoals);

      if (aGoalMatch !== bGoalMatch) {
        return bGoalMatch - aGoalMatch;
      }

      // Secondary: order by estimated hours (shorter courses first for momentum)
      return a.estimatedHours - b.estimatedHours;
    });
  }

  /**
   * Calculate how well a course matches user goals
   */
  private calculateGoalMatch(courseRationale: string, goals: string[]): number {
    let matchScore = 0;
    const rationale = courseRationale.toLowerCase();

    goals.forEach((goal) => {
      if (rationale.includes(goal.toLowerCase())) {
        matchScore += 1;
      }
    });

    return matchScore;
  }

  /**
   * Calculate success probability
   */
  private calculateSuccessProbability(
    courses: CurriculumOption['courses'],
    userContext: UserContext,
    durationAdjustment: number
  ): number {
    let probability = 0.7; // Base probability

    // Adjust based on time commitment feasibility
    if (durationAdjustment >= 0.9) {
      probability += 0.15;
    } else if (durationAdjustment < 0.6) {
      probability -= 0.2;
    }

    // Adjust based on course count (fewer is better)
    if (courses.length <= 5) {
      probability += 0.1;
    } else if (courses.length > 10) {
      probability -= 0.1;
    }

    // Adjust based on user proficiency
    if (userContext.proficiency >= 70) {
      probability += 0.05;
    }

    return Math.min(Math.max(probability, 0.3), 0.95);
  }

  /**
   * Calculate overall alignment score
   */
  private calculateAlignmentScore(
    courses: CurriculumOption['courses'],
    userContext: UserContext
  ): number {
    let score = 0;
    const maxScore = 100;

    // Goal alignment (40%)
    let goalAlignment = 0;
    courses.forEach((course) => {
      goalAlignment += this.calculateGoalMatch(course.rationale, userContext.currentGoals);
    });
    score += Math.min((goalAlignment / courses.length) * 40, 40);

    // Learning style compatibility (30%)
    if (userContext.learningStyle) {
      score += 30; // Assuming courses are filtered by learning style
    }

    // Time feasibility (30%)
    const totalHours = courses.reduce((sum, c) => sum + c.estimatedHours, 0);
    if (totalHours <= userContext.timeAvailable * 1.2) {
      score += 30;
    } else if (totalHours <= userContext.timeAvailable * 1.5) {
      score += 15;
    }

    return Math.min(score, maxScore);
  }

  /**
   * Generate optimization reasoning
   */
  generateOptimizationReasoning(
    original: CurriculumOption,
    optimized: CurriculumOption,
    userContext: UserContext
  ): string[] {
    const reasoning: string[] = [];

    if (original.totalDuration !== optimized.totalDuration) {
      reasoning.push(
        `Curriculum duration adjusted from ${original.totalDuration}h to ${optimized.totalDuration.toFixed(1)}h based on your ${userContext.timeAvailable}h weekly commitment`
      );
    }

    if (original.successProbability !== optimized.successProbability) {
      reasoning.push(
        `Success probability improved from ${(original.successProbability * 100).toFixed(0)}% to ${(optimized.successProbability * 100).toFixed(0)}% with optimized course sequencing`
      );
    }

    if (original.alignmentScore !== optimized.alignmentScore) {
      reasoning.push(
        `Alignment with your goals improved to ${optimized.alignmentScore.toFixed(0)}/100 by reordering courses`
      );
    }

    reasoning.push(
      `Courses ordered by relevance to goals: ${optimized.courses
        .map((c) => `Course ${c.courseId}`)
        .join(' → ')}`
    );

    return reasoning;
  }
}
