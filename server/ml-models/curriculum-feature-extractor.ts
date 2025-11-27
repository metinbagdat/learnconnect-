// Step 7.1: Curriculum Feature Extraction for ML Models

export interface UserContext {
  userId: number;
  learningStyle?: string;
  proficiency: number;
  timeAvailable: number;
  currentGoals: string[];
  previousCourses?: number[];
  assessmentScores?: Record<string, number>;
}

export interface CourseSelection {
  courseId: number;
  priority: 'high' | 'medium' | 'low';
  targetProficiency: number;
}

export interface ExtractedFeatures {
  userProfile: number[];
  courseEmbeddings: number[];
  contextVector: number[];
  constraintVector: number[];
  timestamp: number;
}

export class CurriculumFeatureExtractor {
  /**
   * Extract ML-ready features from user context and course selections
   */
  extractFeatures(
    userContext: UserContext,
    courseSelections: CourseSelection[],
    constraints?: Record<string, any>
  ): ExtractedFeatures {
    const userProfile = this.extractUserProfile(userContext);
    const courseEmbeddings = this.extractCourseEmbeddings(courseSelections);
    const contextVector = this.buildContextVector(userContext);
    const constraintVector = this.buildConstraintVector(constraints || {});

    return {
      userProfile,
      courseEmbeddings,
      contextVector,
      constraintVector,
      timestamp: Date.now(),
    };
  }

  /**
   * Extract user profile vector (normalized to 0-1)
   */
  private extractUserProfile(context: UserContext): number[] {
    const learningStyleMap: Record<string, number> = {
      visual: 0.9,
      auditory: 0.7,
      kinesthetic: 0.8,
      reading: 0.75,
    };

    const proficiencyNormalized = Math.min(context.proficiency / 100, 1);
    const timeNormalized = Math.min(context.timeAvailable / 1000, 1);
    const learningStyleValue = learningStyleMap[context.learningStyle || 'visual'] || 0.5;

    return [
      proficiencyNormalized,
      timeNormalized,
      learningStyleValue,
      context.currentGoals.length / 10,
      (context.previousCourses?.length || 0) / 50,
    ];
  }

  /**
   * Extract course embeddings for selected courses
   */
  private extractCourseEmbeddings(selections: CourseSelection[]): number[] {
    const embeddings: number[] = [];

    selections.forEach((selection) => {
      const priorityScore =
        selection.priority === 'high' ? 1.0 : selection.priority === 'medium' ? 0.6 : 0.3;
      const proficiencyScore = Math.min(selection.targetProficiency / 100, 1);

      embeddings.push(priorityScore, proficiencyScore, selection.courseId / 1000);
    });

    // Pad embeddings to fixed length
    while (embeddings.length < 30) {
      embeddings.push(0);
    }

    return embeddings.slice(0, 30);
  }

  /**
   * Build context vector from user metadata
   */
  private buildContextVector(context: UserContext): number[] {
    return [
      context.userId % 1000 / 1000,
      Object.keys(context.assessmentScores || {}).length / 50,
      context.currentGoals.length / 10,
      Math.random(), // Add randomness for diversity
    ];
  }

  /**
   * Build constraint vector for curriculum optimization
   */
  private buildConstraintVector(constraints: Record<string, any>): number[] {
    const maxDuration = Math.min((constraints.maxDurationHours || 100) / 500, 1);
    const minDifficulty = Math.min((constraints.minDifficulty || 0) / 100, 1);
    const maxDifficulty = Math.min((constraints.maxDifficulty || 100) / 100, 1);
    const flexibilityScore = constraints.flexible ? 0.8 : 0.3;

    return [maxDuration, minDifficulty, maxDifficulty, flexibilityScore];
  }

  /**
   * Generate feature importance scores
   */
  calculateFeatureImportance(features: ExtractedFeatures): Record<string, number> {
    return {
      userProficiency: features.userProfile[0],
      timeCommitment: features.userProfile[1],
      learningStyle: features.userProfile[2],
      courseRelevance: Math.max(...features.courseEmbeddings) || 0,
      contextAlignment: Math.max(...features.contextVector) || 0,
      constraintFeasibility: Math.max(...features.constraintVector) || 0,
    };
  }
}
