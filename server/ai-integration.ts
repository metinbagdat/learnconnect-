import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function suggestCourses(userProfile: { interests: string[]; completedCourses: string[]; learningPace: string; skillLevel: string; }): Promise<any[]> {
  try {
    const prompt = `Suggest 3 relevant courses based on: interests: ${userProfile.interests.join(", ")}, pace: ${userProfile.learningPace}. Return JSON array with title, description, reason, estimatedDuration, difficulty.`;
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0]?.type === "text" ? message.content[0].text : "[]";
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch (error) {
    console.error("Course suggestion error:", error);
    return [];
  }
}

export async function adjustStudyPlan(data: any): Promise<any> {
  try {
    const prompt = `Analyze study performance: ${JSON.stringify(data)}. Recommend adjusted hours, focus areas, pace. Return JSON.`;
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0]?.type === "text" ? message.content[0].text : "{}";
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  } catch (error) {
    console.error("Study plan adjustment error:", error);
    return {};
  }
}

export async function generateCurriculum(courseInfo: any): Promise<any> {
  try {
    const prompt = `Generate curriculum for course: ${courseInfo.courseTitle}. Duration: ${courseInfo.durationWeeks} weeks. Target: ${courseInfo.targetAudience}. Return JSON with modules array.`;
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0]?.type === "text" ? message.content[0].text : "{}";
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  } catch (error) {
    console.error("Curriculum generation error:", error);
    return {};
  }
}

export async function analyzeLearningGaps(data: any): Promise<any> {
  try {
    const prompt = `Analyze learning gaps: ${JSON.stringify(data)}. Recommend interventions for weak areas. Return JSON with interventions array.`;
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0]?.type === "text" ? message.content[0].text : "{}";
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  } catch (error) {
    console.error("Learning gap analysis error:", error);
    return {};
  }
}
