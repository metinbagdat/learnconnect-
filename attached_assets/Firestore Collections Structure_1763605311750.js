// Firestore Collections Structure
const FIRESTORE_SCHEMA = {
  // Kullanıcılar koleksiyonu
  users: {
    userId: {
      email: "user@example.com",
      name: "Kullanıcı Adı",
      preferences: {
        dailyStudyHours: 4,
        preferredSubjects: ["Matematik", "Fizik"],
        studySchedule: {
          morning: true,
          afternoon: false,
          evening: true
        }
      },
      subscription: "free", // free, premium
      createdAt: timestamp,
      lastLogin: timestamp
    }
  },

  // Öğrenci ilerleme takibi
  studentProgress: {
    progressId: {
      userId: "user123",
      date: "2024-01-15",
      subjects: {
        "Matematik": {
          timeStudied: 120, // dakika
          topicsCompleted: ["Integral", "Türev"],
          efficiency: 85, // %
          notes: "İntegral konusunda iyi ilerleme"
        }
      },
      dailyGoals: {
        completed: true,
        goals: ["Integral problemleri", "Fizik deneyleri"],
        achievementRate: 90
      },
      mood: "motivated", // motivated, tired, stressed, excited
      createdAt: timestamp
    }
  },

  // Günlük çalışma planları
  studyPlans: {
    planId: {
      userId: "user123",
      date: "2024-01-15",
      generatedAt: timestamp,
      plan: {
        morning: [
          {
            subject: "Matematik",
            topic: "Integral",
            duration: 45,
            resources: ["Kitap sayfa 45-50", "Online video ders"],
            priority: "high"
          }
        ],
        afternoon: [
          {
            subject: "Fizik",
            topic: "Elektrik",
            duration: 60,
            resources: ["Deney notları"],
            priority: "medium"
          }
        ],
        evening: [
          {
            subject: "Kimya",
            topic: "Organik kimya",
            duration: 30,
            resources: ["Flashcard set"],
            priority: "low"
          }
        ]
      },
      totalStudyTime: 135, // dakika
      completed: false,
      completionRate: 0
    }
  },

  // Sınavlar
  exams: {
    examId: {
      userId: "user123",
      name: "Matematik Vize Sınavı",
      date: "2024-02-15",
      subject: "Matematik",
      topic: "Calculus",
      priority: "high",
      completed: false,
      aiGenerated: true,
      questions: [...],
      studyPlan: {
        daysUntilExam: 30,
        dailyTopics: ["Türev", "Integral", "Limit"],
        recommendedResources: [...]
      },
      createdAt: timestamp
    }
  }
};