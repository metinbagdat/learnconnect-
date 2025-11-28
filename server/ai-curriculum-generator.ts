import Anthropic from "@anthropic-ai/sdk";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

const client = new Anthropic();

interface LearningObjective {
  title: string;
  description: string;
}

interface Module {
  title: string;
  objectives: string[];
  lessons: Lesson[];
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface Lesson {
  title: string;
  content: string;
  duration: number;
  contentType: string;
}

interface CurriculumStructure {
  modules: Module[];
  totalHours: number;
  difficultyPath: string[];
  learningOutcomes: string[];
}

export class AICurriculumGenerator {
  async generateCurriculum(
    courseId: number,
    userLevel: "beginner" | "intermediate" | "advanced" = "beginner"
  ): Promise<CurriculumStructure> {
    try {
      // Get course details
      const [course] = await db.select()
        .from(schema.courses)
        .where(eq(schema.courses.id, courseId));

      if (!course) {
        throw new Error("Course not found");
      }

      // Analyze learning objectives using AI
      const objectives = course.description || "Learn the fundamentals";
      const curriculumStructure = await this.analyzeLearningObjectives(
        objectives,
        userLevel,
        course.title
      );

      // Calculate and optimize
      const totalHours = this.calculateDuration(curriculumStructure);
      const difficultyPath = this.optimizeLearningPath(curriculumStructure);

      return {
        modules: curriculumStructure,
        totalHours,
        difficultyPath,
        learningOutcomes: this.extractLearningOutcomes(curriculumStructure),
      };
    } catch (error) {
      console.error("Curriculum generation error:", error);
      throw error;
    }
  }

  async analyzeLearningObjectives(
    objectives: string,
    userLevel: string,
    courseTitle: string
  ): Promise<Module[]> {
    try {
      const prompt = `You are an expert curriculum designer. Break down these learning objectives into a structured curriculum.

Course: ${courseTitle}
User Level: ${userLevel}
Objectives: ${objectives}

Create a detailed curriculum with:
1. 3-5 modules, each with clear learning objectives
2. Each module contains 2-4 lessons
3. Estimated hours per module (30-120 min per lesson)
4. Difficulty progression (beginner → intermediate → advanced)

Return ONLY valid JSON with this exact structure:
{
  "modules": [
    {
      "title": "Module Title",
      "objectives": ["objective 1", "objective 2"],
      "difficulty": "beginner|intermediate|advanced",
      "estimatedHours": number,
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "Brief description",
          "duration": 60,
          "contentType": "video|reading|exercise|quiz"
        }
      ]
    }
  ]
}`;

      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      // Extract JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse AI response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.modules;
    } catch (error) {
      console.error("AI analysis error:", error);
      throw error;
    }
  }

  calculateDuration(modules: Module[]): number {
    return modules.reduce((total, module) => {
      const moduleDuration = module.lessons.reduce(
        (sum, lesson) => sum + (lesson.duration || 60),
        0
      );
      return total + moduleDuration;
    }, 0) / 60; // Convert to hours
  }

  optimizeLearningPath(modules: Module[]): string[] {
    // Sort by difficulty and return progression path
    const sorted = [...modules].sort((a, b) => {
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    return sorted.map(m => `${m.title} (${m.difficulty})`);
  }

  extractLearningOutcomes(modules: Module[]): string[] {
    const outcomes: string[] = [];
    modules.forEach(module => {
      outcomes.push(...(module.objectives || []));
    });
    return outcomes.slice(0, 10); // Top 10 outcomes
  }

  async generateUserAdaptedCurriculum(
    courseId: number,
    userId: number
  ): Promise<CurriculumStructure> {
    try {
      // Get user profile for level
      const [user] = await db.select()
        .from(schema.users)
        .where(eq(schema.users.id, userId));

      const userLevel = (user?.learningPace || "moderate") as any;
      const levelMap: Record<string, "beginner" | "intermediate" | "advanced"> =
      {
        slow: "beginner",
        moderate: "intermediate",
        fast: "advanced",
      };

      return this.generateCurriculum(courseId, levelMap[userLevel] || "beginner");
    } catch (error) {
      console.error("User-adapted curriculum error:", error);
      throw error;
    }
  }
}

export const aiCurriculumGenerator = new AICurriculumGenerator();
