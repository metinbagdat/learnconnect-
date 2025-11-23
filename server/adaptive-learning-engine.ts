import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export class AdaptiveTaskEngine {
  async generateAdaptiveTasks(dailyPlan: any, studentId: number) {
    const tasks = [];
    
    for (const topicPlan of dailyPlan.topics || []) {
      const adaptiveTask = await this.createAdaptiveTask(topicPlan, studentId);
      tasks.push(adaptiveTask);
    }
    
    return {
      date: dailyPlan.date,
      tasks: tasks,
      overallObjectives: dailyPlan.learningObjectives,
      adaptiveSettings: dailyPlan.adaptiveParameters
    };
  }

  private async createAdaptiveTask(topicPlan: any, studentId: number) {
    const taskPrompt = `
      CREATE ADAPTIVE LEARNING TASK:
      
      TOPIC: ${topicPlan.name}
      ALLOCATED TIME: ${topicPlan.allocatedTime} minutes
      DIFFICULTY LEVEL: ${topicPlan.difficultyLevel}
      LEARNING OBJECTIVES: ${topicPlan.objectives?.join(', ') || ''}
      
      Generate a specific learning task that:
      1. Matches the student's current level
      2. Includes clear success criteria
      3. Provides immediate feedback mechanisms
      4. Covers theory, practice, and review phases
      
      Return JSON with: title, instructions, resources, successMetrics, timeBreakdown
    `;

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: taskPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') throw new Error('Invalid response');
      
      const taskData = JSON.parse(content.text);
      
      return {
        taskId: this.generateTaskId(),
        topicId: topicPlan.id,
        ...taskData,
        adaptiveSettings: {
          initialDifficulty: topicPlan.difficultyLevel,
          canAdjustDifficulty: true,
          retryAttempts: 2,
          feedbackMechanism: 'immediate'
        }
      };
    } catch (error) {
      console.error('Error creating adaptive task:', error);
      return {
        taskId: this.generateTaskId(),
        topicId: topicPlan.id,
        title: topicPlan.name,
        instructions: `Study ${topicPlan.name} for ${topicPlan.allocatedTime} minutes`,
        resources: [],
        successMetrics: ['Complete review', 'Practice 3 problems', 'Score 70%+'],
        timeBreakdown: { theory: 5, practice: topicPlan.allocatedTime - 10, review: 5 }
      };
    }
  }

  async evaluateTaskPerformance(taskId: string, studentId: number, performanceData: any) {
    const evaluationPrompt = `
      TASK PERFORMANCE EVALUATION:
      
      TASK ID: ${taskId}
      PERFORMANCE DATA: ${JSON.stringify(performanceData, null, 2)}
      
      Evaluate and provide:
      1. Performance score (0-100)
      2. Learning effectiveness analysis
      3. Specific strengths demonstrated
      4. Areas for improvement
      5. Recommendations for follow-up
      6. Difficulty adjustment suggestions
      
      Return JSON with these fields.
    `;

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: evaluationPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') throw new Error('Invalid response');
      
      return JSON.parse(content.text);
    } catch (error) {
      console.error('Error evaluating task:', error);
      return {
        performanceScore: (performanceData.correctAnswers / performanceData.totalQuestions) * 100,
        learningEffectiveness: 'moderate',
        strengths: ['Completed task'],
        improvements: ['Review weak areas'],
        recommendations: ['Continue practicing'],
        difficultyAdjustment: 'maintain'
      };
    }
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const adaptiveTaskEngine = new AdaptiveTaskEngine();
