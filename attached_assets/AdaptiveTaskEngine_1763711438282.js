// engines/AdaptiveTaskEngine.js
export class AdaptiveTaskEngine {
  constructor(db, openai) {
    this.db = db;
    this.openai = openai;
    this.reasoningEngine = new AIReasoningEngine(openai);
  }

  // Generate adaptive tasks based on daily plan
  async generateAdaptiveTasks(dailyPlan, studentId) {
    const tasks = [];
    
    for (const topicPlan of dailyPlan.topics) {
      const topic = getTopicById(topicPlan.topicId);
      const adaptiveTask = await this.createAdaptiveTask(topic, topicPlan, studentId);
      tasks.push(adaptiveTask);
    }
    
    return {
      date: dailyPlan.date,
      tasks: tasks,
      overallObjectives: dailyPlan.learningObjectives,
      adaptiveSettings: dailyPlan.adaptiveParameters
    };
  }

  async createAdaptiveTask(topic, topicPlan, studentId) {
    // Get student's historical performance on this topic
    const performanceHistory = await this.getTopicPerformance(studentId, topic.id);
    
    const taskPrompt = `
      CREATE ADAPTIVE LEARNING TASK:
      
      TOPIC: ${topic.name_tr} (${topic.name_en})
      ALLOCATED TIME: ${topicPlan.allocatedTime} minutes
      STUDENT LEVEL: ${topicPlan.difficultyLevel}
      PERFORMANCE HISTORY: ${JSON.stringify(performanceHistory, null, 2)}
      LEARNING OBJECTIVES: ${topic.learningObjectives.join(', ')}
      
      Generate a specific learning task that:
      1. Matches the student's current level
      2. Addresses identified learning gaps
      3. Uses appropriate learning strategies
      4. Includes clear success criteria
      5. Provides immediate feedback mechanisms
      
      Task structure:
      - Title (bilingual)
      - Instructions (clear and actionable)
      - Resources needed
      - Success metrics
      - Difficulty calibration
      - Time breakdown
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert instructional designer. Create engaging, effective, and adaptive learning tasks."
        },
        { role: "user", content: taskPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const taskData = JSON.parse(response.choices[0].message.content);
    
    return {
      taskId: this.generateTaskId(),
      topicId: topic.id,
      ...taskData,
      adaptiveSettings: {
        initialDifficulty: topicPlan.difficultyLevel,
        canAdjustDifficulty: true,
        retryAttempts: 2,
        feedbackMechanism: 'immediate'
      },
      evaluationCriteria: this.createEvaluationCriteria(topic, performanceHistory)
    };
  }

  // Real-time task evaluation after completion
  async evaluateTaskPerformance(taskId, studentId, performanceData) {
    const task = await this.getTask(taskId);
    const student = await this.getStudent(studentId);
    
    const evaluationPrompt = `
      TASK PERFORMANCE EVALUATION:
      
      TASK: ${task.title}
      STUDENT: ${student.personalInfo.name}
      PERFORMANCE DATA: ${JSON.stringify(performanceData, null, 2)}
      EXPECTED OUTCOMES: ${JSON.stringify(task.evaluationCriteria, null, 2)}
      
      Evaluate and provide:
      1. Performance score (0-100)
      2. Learning effectiveness analysis
      3. Specific strengths demonstrated
      4. Identified areas for improvement
      5. Recommendations for follow-up
      6. Difficulty adjustment suggestions
      
      Also calculate:
      - Knowledge acquisition rate
      - Skill application quality
      - Retention indicators
      - Engagement level
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert learning assessment specialist. Evaluate task performance comprehensively and provide actionable insights."
        },
        { role: "user", content: evaluationPrompt }
      ],
      temperature: 0.4,
      max_tokens: 1200
    });

    const evaluation = JSON.parse(response.choices[0].message.content);
    
    // Update student progress based on evaluation
    await this.updateStudentProgress(studentId, task.topicId, evaluation);
    
    // Generate adaptive follow-up recommendations
    const followUp = await this.generateFollowUpTasks(evaluation, task);
    
    return {
      evaluation,
      followUp,
      progressUpdate: this.calculateProgressUpdate(evaluation)
    };
  }

  // Generate follow-up tasks based on performance
  async generateFollowUpTasks(evaluation, originalTask) {
    const followUpPrompt = `
      FOLLOW-UP TASK GENERATION:
      
      PERFORMANCE EVALUATION: ${JSON.stringify(evaluation, null, 2)}
      ORIGINAL TASK: ${JSON.stringify(originalTask, null, 2)}
      
      Generate follow-up tasks based on performance:
      
      If performance < 70%: Remediation tasks
      - Focus on foundational concepts
      - Simplified exercises
      - Additional practice
      
      If performance 70-85%: Reinforcement tasks  
      - Varied practice problems
      - Application exercises
      - Mild challenge increase
      
      If performance > 85%: Extension tasks
      - Advanced applications
      - Critical thinking challenges
      - Real-world problem solving
      
      Provide 2-3 follow-up task options with:
      - Clear learning focus
      - Estimated time
      - Difficulty level
      - Success criteria
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an adaptive learning specialist. Create appropriate follow-up tasks based on student performance."
        },
        { role: "user", content: followUpPrompt }
      ],
      temperature: 0.6,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // Update the daily plan in real-time based on task performance
  async adaptDailyPlan(originalPlan, performanceEvaluations) {
    const adaptationPrompt = `
      REAL-TIME PLAN ADAPTATION:
      
      ORIGINAL DAILY PLAN: ${JSON.stringify(originalPlan, null, 2)}
      TASK PERFORMANCE EVALUATIONS: ${JSON.stringify(performanceEvaluations, null, 2)}
      
      Analyze and adapt the remaining daily plan:
      
      1. Reallocate time from well-performed topics to struggling topics
      2. Adjust difficulty levels based on performance
      3. Modify task types for better engagement
      4. Add remediation or extension activities
      5. Optimize break scheduling based on fatigue indicators
      
      Provide adapted plan with:
      - Updated time allocations
      - Modified task sequences
      - New learning objectives
      - Performance-based adjustments
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a dynamic learning plan optimizer. Adapt plans in real-time based on ongoing performance data."
        },
        { role: "user", content: adaptationPrompt }
      ],
      temperature: 0.5,
      max_tokens: 1500
    });

    const adaptedPlan = JSON.parse(response.choices[0].message.content);
    
    // Log the adaptation for learning analytics
    await this.logPlanAdaptation(originalPlan, adaptedPlan, performanceEvaluations);
    
    return adaptedPlan;
  }

  // Helper methods
  async getTopicPerformance(studentId, topicId) {
    const snapshot = await this.db.collection('student_progress')
      .doc(studentId)
      .collection('topic_performance')
      .where('topicId', '==', topicId)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }

  async updateStudentProgress(studentId, topicId, evaluation) {
    const progressUpdate = {
      topicId: topicId,
      timestamp: new Date(),
      performanceScore: evaluation.performanceScore,
      learningGains: evaluation.learningEffectiveness,
      difficultyLevel: evaluation.recommendedDifficulty,
      followUpNeeded: evaluation.followUpRecommendations.length > 0
    };

    await this.db.collection('student_progress')
      .doc(studentId)
      .collection('topic_performance')
      .add(progressUpdate);
  }

  createEvaluationCriteria(topic, performanceHistory) {
    return {
      knowledgeUnderstanding: {
        weight: 0.4,
        criteria: ['Concept mastery', 'Terminology accuracy', 'Principle application']
      },
      skillApplication: {
        weight: 0.35,
        criteria: ['Problem-solving', 'Procedure execution', 'Analysis quality']
      },
      retentionQuality: {
        weight: 0.25,
        criteria: ['Recall accuracy', 'Application flexibility', 'Error pattern analysis']
      }
    };
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}