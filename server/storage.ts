import { 

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type User, 

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUser, 

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Course,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Module,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Lesson,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserCourse,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserLesson,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Assignment,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserAssignment,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Badge,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserBadge,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type CourseRecommendation,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type LearningPath,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type LearningPathStep,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLearningPath,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLearningPathStep,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Analytics types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserActivityLog,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserActivityLog,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type CourseAnalytic,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertCourseAnalytic,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserProgressSnapshot,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserProgressSnapshot,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Adaptive Learning Reward System types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Challenge,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertChallenge,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserChallenge,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserChallenge,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserLevel,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserLevel,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Achievement types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Achievement,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertAchievement,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserAchievement,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserAchievement,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Interactive lesson trails types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type LessonTrail,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLessonTrail,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TrailNode,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTrailNode,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserTrailProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserTrailProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type PersonalizedRecommendation,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertPersonalizedRecommendation,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type LearningAnalytics,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLearningAnalytics,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Leaderboard types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Leaderboard,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLeaderboard,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type LeaderboardEntry,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLeaderboardEntry,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertCourseSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertModuleSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertLessonSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserCourseSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserLessonSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertAssignmentSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserAssignmentSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertBadgeSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserBadgeSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertCourseRecommendationSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertLearningPathSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertLearningPathStepSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Analytics schemas

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserActivityLogSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertCourseAnalyticsSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserProgressSnapshotSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Adaptive Learning Reward System schemas

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertChallengeSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserChallengeSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserLevelSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  users,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  courses,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  modules,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  lessons,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userCourses,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userLessons,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  assignments,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userAssignments,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  badges,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userBadges,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  courseRecommendations,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  learningPaths,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  learningPathSteps,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Analytics tables

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userActivityLogs,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  courseAnalytics,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userProgressSnapshots,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Adaptive Learning Reward System tables

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  challenges,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userChallenges,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userLevels,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Achievements and Leaderboards tables

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  achievements,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userAchievements,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  leaderboards,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  leaderboardEntries,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Interactive lesson trails tables

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  lessonTrails,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  trailNodes,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userTrailProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  personalizedRecommendations,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  learningAnalytics,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  learningMilestones,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  emojiReactions,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type LearningMilestone,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLearningMilestone,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type EmojiReaction,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertEmojiReaction,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Course category types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type CourseCategory,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertCourseCategory,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  courseCategories,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertCourseCategorySchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Mentor and Program types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type Mentor,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertMentor,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserMentor,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserMentor,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type StudyProgram,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertStudyProgram,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type ProgramSchedule,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertProgramSchedule,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserProgramProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserProgramProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type StudySession,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertStudySession,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // Assessment system types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type LevelAssessment,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertLevelAssessment,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type AssessmentQuestion,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertAssessmentQuestion,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserSkillLevel,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserSkillLevel,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  mentors,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userMentors,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  studyPrograms,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  programSchedules,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userProgramProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  studySessions,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertMentorSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserMentorSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertStudyProgramSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertProgramScheduleSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserProgramProgressSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertStudySessionSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  studyGoals,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  studySchedules,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  learningRecommendations,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  studyProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  levelAssessments,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  assessmentQuestions,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userSkillLevels,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertLevelAssessment,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertAssessmentQuestion,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserSkillLevel,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // TYT Study Planning system imports

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytStudentProfile,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytSubject,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytTopic,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type UserTopicProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytTrialExam,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type DailyStudyTask,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytStudySession,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytStudyGoal,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytStudyStreak,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytStudentProfile,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytSubject,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytTopic,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertUserTopicProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytTrialExam,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertDailyStudyTask,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytStudySession,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytStudyGoal,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytStudyStreak,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytStudentProfiles,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytSubjects,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytTopics,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  userTopicProgress,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytTrialExams,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  dailyStudyTasks,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytStudySessions,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytStudyGoals,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytStudyStreaks,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytStudentProfileSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytSubjectSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytTopicSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertUserTopicProgressSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytTrialExamSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertDailyStudyTaskSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytStudySessionSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytStudyGoalSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytStudyStreakSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  // New Time Tracking & Analytics types

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type DailyStudyGoal,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type StudyHabit,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type TytResource,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type AiDailyPlan,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertDailyStudyGoal,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertStudyHabit,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertTytResource,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  type InsertAiDailyPlan,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  dailyStudyGoals,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  studyHabits,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  tytResources,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  aiDailyPlans,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertDailyStudyGoalSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertStudyHabitSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
  insertTytResourceSchema,

  // Feedback Loop Operations
  async createFeedbackLoop(loop: any): Promise<any> {
    const [created] = await db.insert(curriculumFeedbackLoops).values(loop).returning();
    return created;
  }

  async getFeedbackLoops(designId: number): Promise<any[]> {
    return db.select().from(curriculumFeedbackLoops)
      .where(eq(curriculumFeedbackLoops.designId, designId))
      .orderBy(desc(curriculumFeedbackLoops.cycleNumber));
  }

  async updateFeedbackLoop(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(curriculumFeedbackLoops)
      .set(updates)
      .where(eq(curriculumFeedbackLoops.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
