// Enhanced Firestore Schema
export const FIRESTORE_SCHEMA = {
  // ... existing collections ...
  certificates: {
    name: 'certificates',
    fields: {
      userId: 'string',
      courseId: 'string',
      issueDate: 'timestamp',
      url: 'string'
    }
  },
  posts: {
    name: 'posts',
    fields: {
      title: 'string',
      content: 'string',
      authorId: 'string',
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    },
    subcollections: {
      comments: {
        name: 'comments',
        fields: {
          content: 'string',
          authorId: 'string',
          createdAt: 'timestamp'
        }
      }
    }
  }
};

const FIRESTORE_SCHEMA = {
  // Users collection (existing)
  users: {
    userId: {
      email: "user@example.com",
      name: "Kullanıcı Adı",
      role: "student", // student, instructor, admin
      profile: {
        avatar: "url",
        bio: "Hakkımda",
        specialization: ["Matematik", "Fizik"]
      },
      preferences: {
        dailyStudyHours: 4,
        preferredSubjects: ["Matematik", "Fizik"],
        studySchedule: {
          morning: true,
          afternoon: false,
          evening: true
        }
      },
      subscription: "free",
      createdAt: timestamp,
      lastLogin: timestamp
    }
  },

  // Course Categories & Structure
  categories: {
    categoryId: {
      name: "Matematik",
      description: "Matematik dersleri ve konuları",
      color: "#3B82F6",
      icon: "calculate",
      order: 1,
      isActive: true,
      createdAt: timestamp,
      createdBy: "adminUserId"
    }
  },

  subcategories: {
    subcategoryId: {
      categoryId: "categoryId",
      name: "Calculus",
      description: "Türev, integral ve limit konuları",
      order: 1,
      isActive: true,
      createdAt: timestamp
    }
  },

  courses: {
    courseId: {
      title: "Calculus 101",
      description: "Temel calculus dersi",
      categoryId: "categoryId",
      subcategoryId: "subcategoryId",
      instructorId: "instructorUserId",
      thumbnail: "url",
      price: 0, // free course
      duration: 3600, // total minutes
      level: "beginner", // beginner, intermediate, advanced
      language: "turkish",
      tags: ["matematik", "calculus", "türev"],
      enrollmentCount: 150,
      rating: 4.5,
      isPublished: true,
      isFeatured: false,
      requirements: ["Temel matematik bilgisi"],
      learningOutcomes: ["Türev almayı öğreneceksiniz", "Integral hesaplayabileceksiniz"],
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },

  courseModules: {
    moduleId: {
      courseId: "courseId",
      title: "Türev ve Uygulamaları",
      description: "Türev alma kuralları ve gerçek hayat uygulamaları",
      order: 1,
      duration: 180, // minutes
      isPublished: true,
      createdAt: timestamp
    }
  },

  lessons: {
    lessonId: {
      moduleId: "moduleId",
      courseId: "courseId",
      title: "Türev Tanımı ve Kuralları",
      content: "Ders içeriği HTML/Markdown",
      videoUrl: "video_url",
      duration: 45, // minutes
      order: 1,
      lessonType: "video", // video, text, quiz, assignment
      isFree: true,
      isPublished: true,
      resources: [
        {
          name: "Ders Notları",
          type: "pdf",
          url: "resource_url"
        }
      ],
      createdAt: timestamp
    }
  },

  // Student enrollments and progress
  enrollments: {
    enrollmentId: {
      userId: "studentUserId",
      courseId: "courseId",
      enrolledAt: timestamp,
      progress: {
        completedLessons: ["lessonId1", "lessonId2"],
        completedModules: ["moduleId1"],
        currentLesson: "lessonId3",
        overallProgress: 35, // percentage
        timeSpent: 560, // minutes
        lastAccessed: timestamp
      },
      certificateEarned: false,
      completedAt: null
    }
  },

  // Existing collections (enhanced)
  studentProgress: {
    // ... existing structure enhanced with course data
    courseId: "courseId",
    lessonId: "lessonId"
  },

  studyPlans: {
    // ... existing structure enhanced with course recommendations
    recommendedCourses: ["courseId1", "courseId2"]
  },

  exams: {
    // ... existing structure enhanced with course linkage
    courseId: "courseId",
    moduleId: "moduleId"
  }
};