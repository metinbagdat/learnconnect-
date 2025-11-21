// Enhanced Firestore Schema with Time Tracking
const FIRESTORE_SCHEMA = {
  // ... existing collections ...

  // Time Tracking Sessions
  timeSessions: {
    sessionId: {
      userId: "user123",
      courseId: "course123", // optional
      examId: "exam123", // optional
      subject: "Mathematics",
      topic: "Integral Calculus",
      taskType: "study", // study, practice, review, exam_prep
      startTime: timestamp,
      endTime: timestamp,
      duration: 45, // minutes
      completed: true,
      efficiency: 85, // percentage
      notes: "Focused on integration techniques",
      tags: ["calculus", "homework"],
      distractions: 2, // number of distractions during session
      mood: "focused", // focused, tired, distracted, energetic
      goals: ["Complete chapter 5", "Solve 10 problems"],
      goalsCompleted: true,
      createdAt: timestamp
    }
  },

  // Daily Time Goals
  dailyGoals: {
    goalId: {
      userId: "user123",
      date: "2024-01-15",
      targetStudyTime: 240, // minutes (4 hours)
      actualStudyTime: 180, // minutes
      subjects: {
        "Mathematics": {
          target: 120,
          actual: 90,
          sessions: 2
        },
        "Physics": {
          target: 60,
          actual: 45,
          sessions: 1
        }
      },
      completed: false,
      completionRate: 75, // percentage
      streak: 5, // consecutive days meeting goals
      createdAt: timestamp
    }
  },

  // Study Habits Analytics
  studyHabits: {
    habitId: {
      userId: "user123",
      period: "week", // week, month
      startDate: "2024-01-15",
      endDate: "2024-01-21",
      totalStudyTime: 1260, // minutes
      averageSessionLength: 52, // minutes
      preferredStudyTimes: {
        morning: 35, // percentage
        afternoon: 25,
        evening: 40
      },
      mostProductiveDays: ["Monday", "Wednesday"],
      efficiencyTrend: [65, 70, 75, 80, 78, 82, 85],
      commonDistractions: ["Phone", "Social Media", "Noise"],
      recommendations: ["Study in the evening", "Take more breaks"],
      createdAt: timestamp
    }
  }
};