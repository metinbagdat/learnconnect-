// src/services/multiAI.ts
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class MultiAIProvider {
  private openai: OpenAI;
  private palm: GoogleGenerativeAI;
  private currentProvider: 'openai' | 'palm' = 'openai';

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_KEY,
    });
    
    this.palm = new GoogleGenerativeAI(process.env.REACT_APP_PALM_KEY);
  }

  async generateStudyPlan(context: StudyPlanContext): Promise<StudyPlan> {
    const prompt = this.buildStudyPlanPrompt(context);
    
    try {
      if (this.currentProvider === 'openai') {
        return await this.generateWithOpenAI(prompt);
      } else {
        return await this.generateWithPaLM(prompt);
      }
    } catch (error) {
      // Fallback to alternative provider
      console.warn(`Primary AI provider failed, switching to fallback`);
      this.currentProvider = this.currentProvider === 'openai' ? 'palm' : 'openai';
      return await this.generateStudyPlan(context);
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<StudyPlan> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational planner specializing in personalized study plans."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  private async generateWithPaLM(prompt: string): Promise<StudyPlan> {
    const model = this.palm.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return JSON.parse(response.text());
  }

  private buildStudyPlanPrompt(context: StudyPlanContext): string {
    return `
      ENHANCED STUDY PLAN GENERATION WITH MULTI-FACTOR ANALYSIS:

      STUDENT PROFILE:
      - Name: ${context.student.name}
      - Learning Style: ${context.student.learningStyle}
      - Available Time: ${context.availableTime} hours
      - Energy Levels: ${context.energyPatterns}

      COURSE LOAD:
      ${context.courses.map(course => `
        Course: ${course.title}
        Progress: ${course.progress}%
        Upcoming Deadlines: ${course.deadlines}
        Difficulty: ${course.difficulty}
      `).join('\n')}

      PERFORMANCE HISTORY:
      ${JSON.stringify(context.performanceHistory, null, 2)}

      Generate an optimized study plan considering:
      1. Course priorities and deadlines
      2. Student's energy patterns throughout the day
      3. Optimal study session lengths based on cognitive research
      4. Balanced mix of new learning and review
      5. Break scheduling for maximum retention

      Return JSON format with time-blocked schedule.
    `;
  }
}