import { db } from "./db";
import { challenges, userLevels } from "@shared/schema";
import { storage } from "./storage";

export async function seedChallenges() {
  try {
    // Check if we already have challenges
    const existingChallenges = await db.select().from(challenges);
    
    if (existingChallenges.length === 0) {
      console.log("Seeding challenges...");
      
      // Create a variety of challenges
      const challengesToCreate = [
        {
          title: "Complete Your First Course",
          description: "Enroll and complete your first course with 100% progress",
          type: "course" as const,
          category: "Achievement",
          difficulty: "easy" as const,
          pointsReward: 100,
          xpReward: 50,
          isActive: true,
          requirements: { completedCourses: 1 }
        },
        {
          title: "Learning Streak",
          description: "Log in and study for 7 consecutive days",
          type: "streak" as const,
          category: "Engagement",
          difficulty: "medium" as const,
          pointsReward: 150,
          xpReward: 75,
          isActive: true,
          requirements: { loginDays: 7 }
        },
        {
          title: "Knowledge Explorer",
          description: "Enroll in courses from 3 different categories",
          type: "course" as const,
          category: "Engagement",
          difficulty: "medium" as const,
          pointsReward: 200,
          xpReward: 100,
          isActive: true,
          requirements: { differentCategories: 3 }
        },
        {
          title: "Perfect Assignment",
          description: "Submit an assignment and receive a perfect score",
          type: "assignment" as const,
          category: "Mastery",
          difficulty: "hard" as const,
          pointsReward: 300,
          xpReward: 150,
          isActive: true,
          requirements: { assignmentScore: 100 }
        },
        {
          title: "Rapid Learner",
          description: "Complete a course in less than 2 days",
          type: "course" as const,
          category: "Time",
          difficulty: "hard" as const,
          pointsReward: 250,
          xpReward: 125,
          isActive: true,
          requirements: { completionDays: 2 }
        }
      ];
      
      for (const challenge of challengesToCreate) {
        await storage.createChallenge(challenge);
      }
      
      console.log("Successfully seeded challenges!");
    } else {
      console.log("Challenges already exist, skipping seeding.");
    }
    
    // Initialize user level for admin user
    const adminUser = await storage.getUserByUsername('admin');
    
    if (adminUser) {
      const userLevel = await storage.getUserLevel(adminUser.id);
      
      if (!userLevel) {
        console.log(`Initializing level for admin user...`);
        await storage.initializeUserLevel(adminUser.id);
      }
    }
    
    console.log("Challenge system initialization completed!");
    
  } catch (error) {
    console.error("Error seeding challenges:", error);
  }
}