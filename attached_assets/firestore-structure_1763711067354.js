// firestore-structure.js
export const FIRESTORE_STRUCTURE = {
  // Core Student Data
  Students: {
    path: 'Students/{studentId}',
    fields: {
      personalInfo: {
        name: 'string',
        email: 'string', 
        phone: 'string',
        school: 'string',
        grade: 'string',
        timezone: 'string',
        avatar: 'string',
        createdAt: 'timestamp'
      },
      examPreferences: {
        targetUniversities: 'array',
        targetPrograms: 'array',
        examYear: 'string',
        examTypes: 'array', // ['TYT', 'AYT']
        prioritySubjects: 'array',
        studyLanguage: 'string' // 'tr', 'en'
      },
      studySettings: {
        dailyStudyHours: 'number',
        preferredStudyTimes: 'array',
        studyDays: 'array',
        breakIntervals: 'number',
        focusMode: 'boolean',
        notifications: 'boolean'
      },
      performanceGoals: {
        tytTargetScore: 'number',
        aytTargetScore: 'number',
        subjectTargets: 'map',
        weeklyStudyHours: 'number',
        targetUniversity: 'string'
      },
      subscription: {
        plan: 'string', // 'free', 'premium', 'elite'
        expiresAt: 'timestamp',
        features: 'array'
      },
      aiPreferences: {
        difficultyLevel: 'string', // 'beginner', 'intermediate', 'advanced'
        learningStyle: 'string', // 'visual', 'auditory', 'kinesthetic'
        motivationLevel: 'number' // 1-10
      }
    },
    indexes: [
      { fields: ['examPreferences.examYear', 'personalInfo.createdAt'] },
      { fields: ['subscription.plan', 'personalInfo.createdAt'] }
    ]
  },

  // AI Engine Collections
  AIEngine: {
    DailyPlans: {
      path: 'AIEngine/DailyPlans/{studentId}_{date}',
      fields: {
        studentId: 'string',
        date: 'string',
        plan: {
          tasks: 'array',
          focusAreas: 'array',
          estimatedDuration: 'number',
          difficulty: 'string',
          motivationalMessage: 'string',
          studyTips: 'array'
        },
        metadata: {
          generatedAt: 'timestamp',
          aiModel: 'string',
          version: 'string',
          reasoning: 'map'
        },
        completion: {
          completedTasks: 'number',
          totalTasks: 'number',
          actualDuration: 'number',
          completionRate: 'number'
        }
      },
      indexes: [
        { fields: ['studentId', 'date'] },
        { fields: ['date', 'metadata.generatedAt'] }
      ]
    },

    PerformanceLogs: {
      path: 'AIEngine/PerformanceLogs/{studentId}_{timestamp}',
      fields: {
        studentId: 'string',
        timestamp: 'timestamp',
        taskId: 'string',
        taskType: 'string',
        subject: 'string',
        topic: 'string',
        performance: {
          score: 'number',
          timeSpent: 'number',
          accuracy: 'number',
          confidence: 'number',
          difficultyPerception: 'string'
        },
        feedback: {
          aiAnalysis: 'string',
          recommendations: 'array',
          nextSteps: 'array'
        }
      },
      indexes: [
        { fields: ['studentId', 'timestamp'] },
        { fields: ['subject', 'timestamp'] }
      ]
    },

    DecisionRules: {
      path: 'AIEngine/DecisionRules/{ruleSetId}',
      fields: {
        name: 'string',
        description: 'string',
        rules: 'map',
        thresholds: 'map',
        weights: 'map',
        active: 'boolean',
        version: 'string',
        lastUpdated: 'timestamp'
      }
    }
  },

  // Curriculum Data
  Curriculum: {
    TYT: {
      Turkish: {
        path: 'Curriculum/TYT/Turkish/{topicId}',
        fields: {
          name_tr: 'string',
          name_en: 'string',
          weight: 'number',
          difficulty: 'string',
          prerequisites: 'array',
          learningObjectives: 'array',
          estimatedStudyTime: 'number',
          resources: 'array',
          aiGuide: 'string'
        }
      },
      Mathematics: {
        path: 'Curriculum/TYT/Mathematics/{topicId}',
        fields: { /* similar structure */ }
      },
      Science: {
        path: 'Curriculum/TYT/Science/{topicId}',
        fields: { /* similar structure */ }
      },
      SocialStudies: {
        path: 'Curriculum/TYT/SocialStudies/{topicId}',
        fields: { /* similar structure */ }
      }
    },
    AYT: {
      // Similar structure for AYT subjects
    }
  },

  // Additional Features
  ChatSessions: {
    path: 'ChatSessions/{studentId}_{sessionId}',
    fields: {
      studentId: 'string',
      messages: 'array',
      context: 'map',
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    }
  },

  Notifications: {
    path: 'Notifications/{studentId}_{notificationId}',
    fields: {
      studentId: 'string',
      type: 'string',
      title: 'string',
      message: 'string',
      data: 'map',
      read: 'boolean',
      scheduledFor: 'timestamp',
      sentAt: 'timestamp'
    }
  },

  Achievements: {
    path: 'Achievements/{studentId}_{achievementId}',
    fields: {
      studentId: 'string',
      type: 'string',
      title: 'string',
      description: 'string',
      earnedAt: 'timestamp',
      progress: 'number',
      target: 'number'
    }
  },

  Analytics: {
    path: 'Analytics/{reportId}',
    fields: {
      type: 'string',
      data: 'map',
      period: 'string',
      generatedAt: 'timestamp'
    }
  }
};