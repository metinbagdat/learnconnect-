import { db } from "./db";
import { studyGoals, studySessions } from "@shared/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAiStudyPlan(
  userId: number,
  goal: { title: string; targetExam?: string; subjects: string[]; studyHoursPerWeek: number; targetDate: Date }
): Promise<{ sessions: any[]; recommendations: string }> {
  try {
    const prompt = `Generate a detailed study plan for the following goal:
Title: ${goal.title}
Target Exam: ${goal.targetExam || "General"}
Subjects: ${goal.subjects.join(", ")}
Study Hours Per Week: ${goal.studyHoursPerWeek}
Target Date: ${goal.targetDate.toLocaleDateString()}

Create a JSON response with:
1. sessions: Array of study sessions with scheduledDate, subject, activity, durationMinutes
2. recommendations: A motivational study plan overview

Return valid JSON only, no markdown.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type === "text") {
      const parsed = JSON.parse(content.text);
      return {
        sessions: parsed.sessions || [],
        recommendations: parsed.recommendations || "Study plan created successfully!",
      };
    }
  } catch (error) {
    console.error("AI generation error:", error);
  }

  return {
    sessions: [],
    recommendations: "Study plan created. Use the dashboard to manage your sessions.",
  };
}

export async function createStudyGoal(userId: number, data: any) {
  const [created] = await db.insert(studyGoals).values({ ...data, userId }).returning();
  return created;
}

export async function getUserStudyGoals(userId: number) {
  return await db
    .select()
    .from(studyGoals)
    .where(eq(studyGoals.userId, userId))
    .orderBy(desc(studyGoals.createdAt));
}

export async function updateStudyGoal(goalId: number, data: any) {
  const [updated] = await db
    .update(studyGoals)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(studyGoals.id, goalId))
    .returning();
  return updated;
}

export async function createStudySession(userId: number, data: any) {
  const [created] = await db.insert(studySessions).values({ ...data, userId }).returning();
  return created;
}

export async function getUserStudySessions(userId: number, upcomingOnly = false) {
  let query = db.select().from(studySessions).where(eq(studySessions.userId, userId));

  if (upcomingOnly) {
    const today = new Date().toISOString().split("T")[0];
    query = query.where(gte(studySessions.sessionDate, today as any)) as any;
  }

  return await (query as any).orderBy(studySessions.sessionDate);
}

export async function markSessionComplete(sessionId: number, completionRate: number, focusScore: number, notes?: string) {
  const now = new Date();
  const [updated] = await db
    .update(studySessions)
    .set({
      actualEndTime: now,
      completionRate,
      focusScore,
      notes,
      status: "completed",
    } as any)
    .where(eq(studySessions.id, sessionId))
    .returning();
  return updated;
}

export async function getProgressCharts(userId: number) {
  const sessionsData = await db
    .select()
    .from(studySessions)
    .where(eq(studySessions.userId, userId))
    .orderBy(studySessions.sessionDate);

  const byDate: Record<string, number> = {};
  sessionsData.forEach((session: any) => {
    const date = session.sessionDate instanceof Date 
      ? session.sessionDate.toISOString().split('T')[0]
      : String(session.sessionDate);
    byDate[date] = (byDate[date] || 0) + 1;
  });

  return {
    sessionsPerDay: Object.entries(byDate).map(([date, count]) => ({ date, count })),
    totalSessions: sessionsData.length,
    completedSessions: sessionsData.filter((s: any) => s.status === "completed").length,
  };
}
