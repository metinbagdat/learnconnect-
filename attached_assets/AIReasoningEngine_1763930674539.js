// engines/AIReasoningEngine.js
export class AIReasoningEngine {
  constructor(openai) {
    this.openai = openai;
  }

  // 🧠 Step 1: Analyze Inputs
  async Step1_AnalyzeInputs(studentId, studentProfile, examTarget, progressData) {
    const analysisPrompt = `
      STUDENT PROFILE ANALYSIS:
      - Student: ${studentProfile.personalInfo.name}
      - Target: ${examTarget.targetPrograms.join(', ')}
      - Exam Types: ${examTarget.examTypes.join(' + ')}
      - Daily Study Time: ${studentProfile.studySettings.dailyStudyHours} hours
      - Current TYT Score: ${progressData.tyt_progress?.overall_tyt_score || 'Not available'}
      - Target TYT Score: ${examTarget.tytTargetScore}
      
      PROGRESS DATA:
      ${JSON.stringify(progressData, null, 2)}
      
      Analyze this student's current situation and learning context. Identify:
      1. Current performance level vs targets
      2. Study habits and patterns
      3. Available resources and constraints
      4. Learning preferences and strengths
      
      Provide a comprehensive analysis in JSON format.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational analyst. Analyze student data thoroughly and provide insights for personalized learning planning."
        },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // 🎯 Step 2: Assess Weaknesses
  async Step2_AssessWeaknesses(progressData, testResults, targetScores) {
    const weaknessPrompt = `
      WEAKNESS ASSESSMENT:
      
      CURRENT PERFORMANCE:
      ${JSON.stringify(progressData, null, 2)}
      
      RECENT TEST RESULTS:
      ${JSON.stringify(testResults, null, 2)}
      
      TARGET SCORES:
      ${JSON.stringify(targetScores, null, 2)}
      
      Identify and prioritize weaknesses by:
      1. Calculating accuracy gaps for each topic
      2. Comparing current performance vs target scores
      3. Considering topic weight and importance
      4. Analyzing performance trends over time
      
      Return prioritized weak topics with:
      - topicId and name
      - current proficiency (0-100)
      - target proficiency needed
      - improvement priority (high/medium/low)
      - specific skill gaps identified
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a diagnostic assessment specialist. Identify learning gaps and prioritize them for intervention."
        },
        { role: "user", content: weaknessPrompt }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // 📚 Step 3: Select Content
  async Step3_SelectContent(weakTopics, availableTime, studentLevel) {
    const contentPrompt = `
      CONTENT SELECTION FOR ADAPTIVE LEARNING:
      
      IDENTIFIED WEAK TOPICS:
      ${JSON.stringify(weakTopics, null, 2)}
      
      CONSTRAINTS:
      - Available Time: ${availableTime} minutes
      - Student Level: ${studentLevel}
      - Priority: Focus on high-impact topics first
      
      Select optimal learning content by calculating:
      Priority Score = TopicWeight × (1 - CurrentProficiency) × UrgencyFactor
      
      Consider:
      - Prerequisite relationships between topics
      - Cognitive load and learning progression
      - Mix of theory, practice, and review
      - Student's learning preferences
      
      Return selected topics with:
      - topicId and allocation time
      - learning sequence order
      - recommended task types
      - prerequisite checks
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a curriculum design expert. Select and sequence learning content optimally based on learning science principles."
        },
        { role: "user", content: contentPrompt }
      ],
      temperature: 0.5,
      max_tokens: 1200
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // ⏰ Step 4: Allocate Time
  async Step4_AllocateTime(selectedTopics, availableTime, studyPatterns) {
    const timePrompt = `
      TIME ALLOCATION OPTIMIZATION:
      
      SELECTED TOPICS:
      ${JSON.stringify(selectedTopics, null, 2)}
      
      CONSTRAINTS:
      - Total Available Time: ${availableTime} minutes
      - Study Patterns: ${JSON.stringify(studyPatterns)}
      - Attention Span: Consider optimal session lengths
      
      Allocate time using:
      Time Allocation = (PriorityScore / TotalPriority) × AvailableTime × EfficiencyFactor
      
      Consider:
      - Cognitive fatigue and breaks
      - Transition time between topics
      - Review and practice balance
      - Student's historical performance patterns
      
      Return detailed time allocation with:
      - topic-wise time distribution
      - session breakdown (theory/practice/review)
      - break scheduling
      - buffer time for adjustments
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a time management and learning efficiency expert. Optimize time allocation for maximum learning impact."
        },
        { role: "user", content: timePrompt }
      ],
      temperature: 0.4,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // 📝 Step 5: Generate Plan
  async Step5_GeneratePlan(timeAllocation, studentProfile, learningObjectives) {
    const planPrompt = `
      DAILY STUDY PLAN GENERATION:
      
      TIME ALLOCATION:
      ${JSON.stringify(timeAllocation, null, 2)}
      
      STUDENT PROFILE:
      ${JSON.stringify(studentProfile, null, 2)}
      
      LEARNING OBJECTIVES:
      ${JSON.stringify(learningObjectives, null, 2)}
      
      Generate structured daily tasks with:
      - Clear learning objectives for each session
      - Specific activities (watch, solve, review, practice)
      - Resource recommendations
      - Success criteria and checkpoints
      - Adaptive difficulty levels
      
      Ensure the plan is:
      - Realistic and achievable
      - Varied to maintain engagement
      - Progressive in difficulty
      - Aligned with learning objectives
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational planner. Create engaging, effective, and personalized daily study plans."
        },
        { role: "user", content: planPrompt }
      ],
      temperature: 0.6,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // 🔄 Step 6: Review Feedback
  async Step6_ReviewFeedback(completedTasks, performanceData, originalPlan) {
    const feedbackPrompt = `
      PERFORMANCE REVIEW AND ADAPTATION:
      
      COMPLETED TASKS:
      ${JSON.stringify(completedTasks, null, 2)}
      
      PERFORMANCE DATA:
      ${JSON.stringify(performanceData, null, 2)}
      
      ORIGINAL PLAN:
      ${JSON.stringify(originalPlan, null, 2)}
      
      Analyze and provide:
      1. Task completion rate and quality
      2. Learning efficiency metrics
      3. Knowledge retention indicators
      4. Fatigue and engagement levels
      
      Generate adaptive recommendations:
      - Adjust tomorrow's difficulty level
      - Modify time allocations
      - Suggest alternative learning strategies
      - Identify need for remediation or acceleration
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a learning analytics expert. Analyze performance data and provide adaptive recommendations for continuous improvement."
        },
        { role: "user", content: feedbackPrompt }
      ],
      temperature: 0.5,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // 🎯 Complete Adaptive Planning Pipeline
  async generateAdaptiveDailyPlan(studentId, studentData, progressData, testResults) {
    try {
      console.log(`Starting adaptive planning for student: ${studentId}`);
      
      // Step 1: Analyze Inputs
      const contextAnalysis = await this.Step1_AnalyzeInputs(
        studentId, 
        studentData, 
        studentData.examPreferences, 
        progressData
      );
      
      // Step 2: Assess Weaknesses
      const weaknessAnalysis = await this.Step2_AssessWeaknesses(
        progressData,
        testResults,
        studentData.examPreferences
      );
      
      // Step 3: Select Content
      const contentSelection = await this.Step3_SelectContent(
        weaknessAnalysis.prioritizedTopics,
        studentData.studySettings.dailyStudyHours * 60, // Convert to minutes
        contextAnalysis.studentLevel
      );
      
      // Step 4: Allocate Time
      const timeAllocation = await this.Step4_AllocateTime(
        contentSelection.selectedTopics,
        studentData.studySettings.dailyStudyHours * 60,
        contextAnalysis.studyPatterns
      );
      
      // Step 5: Generate Plan
      const dailyPlan = await this.Step5_GeneratePlan(
        timeAllocation,
        studentData,
        contentSelection.learningObjectives
      );
      
      // Add metadata
      dailyPlan.metadata = {
        generatedAt: new Date().toISOString(),
        studentId: studentId,
        reasoningSteps: {
          contextAnalysis,
          weaknessAnalysis,
          contentSelection,
          timeAllocation
        },
        adaptiveParameters: {
          difficultyLevel: contextAnalysis.recommendedDifficulty,
          learningPace: contextAnalysis.optimalPace,
          focusAreas: weaknessAnalysis.highPriorityAreas
        }
      };
      
      return dailyPlan;
      
    } catch (error) {
      console.error('Error in adaptive planning pipeline:', error);
      throw new Error(`Adaptive planning failed: ${error.message}`);
    }
  }
}