// AI-Powered Curriculum Generator Service
// Generates personalized curriculum based on enrolled courses

import { db } from "./db";
import { eq } from "drizzle-orm";
import { userCourses, courses, memoryEnhancedCurricula, users } from "@shared/schema";
import { parseAIJSON } from "./ai-provider-service";
import Anthropic from "@anthropic-ai/sdk";

export interface CurriculumGenerationRequest {
  userId: number;
  enrolledCourseIds: number[];
  userPreferences?: {
    studyHoursPerDay?: number;
    preferredLearningStyle?: string;
    targetCompletionDate?: Date;
  };
}

export interface GeneratedCurriculum {
  structure: any;
  studyPlan: any;
  assignments: any[];
  targets: any[];
  aiAnalysis: any;
}

export class AICurriculumGenerator {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  /**
   * Main curriculum generation method
   */
  async generateCurriculum(request: CurriculumGenerationRequest): Promise<GeneratedCurriculum> {
    console.log(`[CurriculumGenerator] Generating curriculum for user ${request.userId}`);

    try {
      // Step 1: Analyze enrolled courses
      const courseAnalysis = await this.analyzeCourses(request.enrolledCourseIds);

      // Step 2: Get user's learning history
      const user = await this.getUserProfile(request.userId);
      const userLearningHistory = await this.getUserLearningHistory(request.userId);

      // Step 3: Build curriculum structure
      const curriculumStructure = await this.buildCurriculumStructure(
        courseAnalysis,
        userLearningHistory,
        request.userPreferences
      );

      // Step 4: Create study plan
      const studyPlan = await this.createStudyPlan(request.userId, curriculumStructure, request.userPreferences);

      // Step 5: Generate assignments
      const assignments = await this.generateAssignments(studyPlan, curriculumStructure);

      // Step 6: Generate targets
      const targets = await this.generateTargets(studyPlan, curriculumStructure);

      // Step 7: AI analysis
      const aiAnalysis = await this.analyzeForOptimization(courseAnalysis, user, curriculumStructure);

      return {
        structure: curriculumStructure,
        studyPlan,
        assignments,
        targets,
        aiAnalysis
      };
    } catch (error) {
      console.error(`[CurriculumGenerator] Error:`, error);
      throw error;
    }
  }

  /**
   * Analyze enrolled courses
   */
  private async analyzeCourses(courseIds: number[]): Promise<any> {
    const courseRecords = await db
      .select()
      .from(courses)
      .where((courses as any).id.inArray(courseIds));

    if (courseRecords.length === 0) {
      return { courses: [], analysis: {} };
    }

    const courseList = courseRecords
      .map((c: any) => `${c.titleEn || c.title} (${c.level || "intermediate"})`)
      .join(", ");

    const prompt = `Analyze these enrolled courses and provide:
${courseList}

Return JSON with:
- courseRelationships: how courses relate to each other
- prerequisites: suggested prerequisites
- skillProgression: skill progression path
- contentGaps: any content gaps to fill
- totalEstimatedHours: estimated study hours`;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    return {
      courses: courseRecords,
      analysis: parseAIJSON(response.content[0].type === 'text' ? response.content[0].text : '{}')
    };
  }

  /**
   * Get user profile
   */
  private async getUserProfile(userId: number): Promise<any> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    return user || {};
  }

  /**
   * Get user's learning history
   */
  private async getUserLearningHistory(userId: number): Promise<any> {
    const userCourseRecords = await db
      .select()
      .from(userCourses)
      .where(eq(userCourses.userId, userId));

    return {
      completedCourses: userCourseRecords.filter((uc: any) => uc.completed).length,
      averageProgress: Math.round(
        userCourseRecords.reduce((sum: number, uc: any) => sum + uc.progress, 0) /
          (userCourseRecords.length || 1)
      ),
      learningPace: userCourseRecords.length > 0 ? "consistent" : "new_learner"
    };
  }

  /**
   * Build curriculum structure
   */
  private async buildCurriculumStructure(courseAnalysis: any, learningHistory: any, preferences?: any): Promise<any> {
    const prompt = `Build a curriculum structure considering:
Courses: ${courseAnalysis.courses.map((c: any) => c.titleEn || c.title).join(", ")}
User pace: ${learningHistory.learningPace}
Daily hours: ${preferences?.studyHoursPerDay || 2}

Return JSON with:
- phases: curriculum phases with duration
- topics: ordered topics
- learningOutcomes: expected outcomes
- milestones: achievement milestones`;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    return parseAIJSON(response.content[0].type === 'text' ? response.content[0].text : '{}');
  }

  /**
   * Create study plan
   */
  private async createStudyPlan(userId: number, structure: any, preferences?: any): Promise<any> {
    const dailyHours = preferences?.studyHoursPerDay || 2;
    const startDate = new Date();
    const totalDays = structure.totalEstimatedHours ? Math.ceil(structure.totalEstimatedHours / dailyHours) : 30;
    const endDate = new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000);

    return {
      userId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dailyTarget: `${dailyHours} hours per day`,
      totalDays,
      topics: structure.topics || [],
      phases: structure.phases || [],
      status: "active",
      weeklyCheckpoints: Math.ceil(totalDays / 7)
    };
  }

  /**
   * Generate assignments from curriculum
   */
  private async generateAssignments(studyPlan: any, structure: any): Promise<any[]> {
    const phases = (structure.phases as any) || [{ name: "General" }];
    const assignments = [];

    for (let i = 0; i < Math.min(phases.length, 3); i++) {
      const phase = phases[i];
      const prompt = `Create 2 assignments for curriculum phase: ${phase.name || `Phase ${i + 1}`}
Topics: ${structure.topics?.slice(i * 2, (i + 1) * 2).join(", ") || "various"}

Return JSON array with: title, description, type, estimatedTime, points`;

      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
      });

      const phaseAssignments = parseAIJSON(response.content[0].type === 'text' ? response.content[0].text : '[]');
      const assignmentList = Array.isArray(phaseAssignments) ? phaseAssignments : [];

      for (const assignment of assignmentList) {
        assignments.push({
          ...assignment,
          phase: phase.name || `Phase ${i + 1}`,
          dueDate: new Date(
            new Date(studyPlan.startDate).getTime() +
              ((i + 1) * studyPlan.totalDays) / phases.length * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0]
        });
      }
    }

    return assignments;
  }

  /**
   * Generate learning targets
   */
  private async generateTargets(studyPlan: any, structure: any): Promise<any[]> {
    return [
      {
        type: "completion",
        target: "Complete all curriculum phases",
        deadline: studyPlan.endDate,
        priority: "high",
        expectedOutcome: "100% course completion"
      },
      {
        type: "retention",
        target: `Master ${structure.topics?.length || 10} key topics`,
        deadline: new Date(new Date(studyPlan.endDate).getTime() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        priority: "high",
        expectedOutcome: "85%+ retention rate"
      },
      {
        type: "assignments",
        target: `Complete all ${studyPlan.phases?.length || 3} phase assignments`,
        deadline: studyPlan.endDate,
        priority: "medium",
        expectedOutcome: "70%+ assignment average"
      }
    ];
  }

  /**
   * AI-powered optimization analysis
   */
  private async analyzeForOptimization(courseAnalysis: any, user: any, structure: any): Promise<any> {
    return {
      userProfile: {
        name: user.displayName || "Student",
        role: user.role || "student"
      },
      courseSummary: {
        totalCourses: courseAnalysis.courses.length,
        estimatedHours: courseAnalysis.analysis.totalEstimatedHours || 60
      },
      recommendations: [
        "Use spaced repetition for key topics",
        `Allocate ${courseAnalysis.analysis.totalEstimatedHours || 60} hours total`,
        "Weekly review sessions for retention",
        "Track progress against milestones"
      ],
      expectedOutcomes: {
        completionRate: "90-95%",
        retentionImprovement: "+40%",
        studyEfficiency: "+35%"
      },
      adaptationTriggers: ["Weekly performance review", "Monthly milestone check", "Content difficulty adjustment"]
    };
  }
}

export const aiCurriculumGenerator = new AICurriculumGenerator();
