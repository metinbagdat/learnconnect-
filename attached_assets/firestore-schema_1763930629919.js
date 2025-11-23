export const FIRESTORE_SCHEMA = {
  // Existing schemas
  users: {
    name: 'users',
    fields: {
      userId: 'string',
      email: 'string',
      displayName: 'string',
      enrolledCourses: 'array',
      completedCourses: 'array',
      createdAt: 'timestamp'
    }
  },

  courses: {
    name: 'courses',
    fields: {
      courseId: 'string',
      title: 'string',
      description: 'string',
      instructor: 'string',
      duration: 'number',
      lessons: 'array',
      published: 'boolean',
      createdAt: 'timestamp'
    }
  },

  // NEW: Certificates Schema
  certificates: {
    name: 'certificates',
    fields: {
      certificateId: 'string',
      userId: 'string',
      courseId: 'string',
      userName: 'string',
      courseTitle: 'string',
      issueDate: 'timestamp',
      expirationDate: 'timestamp',
      certificateUrl: 'string',
      verificationCode: 'string',
      status: 'string', // 'active', 'expired', 'revoked'
      achievements: 'array',
      grade: 'number',
      instructorSignature: 'string'
    }
  },

  // NEW: Forum Schema
  forum: {
    name: 'forum',
    fields: {
      postId: 'string',
      title: 'string',
      content: 'string',
      authorId: 'string',
      authorName: 'string',
      courseId: 'string',
      tags: 'array',
      upvotes: 'number',
      downvotes: 'number',
      views: 'number',
      isPinned: 'boolean',
      isResolved: 'boolean',
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    },
    subcollections: {
      comments: {
        name: 'comments',
        fields: {
          commentId: 'string',
          postId: 'string',
          authorId: 'string',
          authorName: 'string',
          content: 'string',
          upvotes: 'number',
          isSolution: 'boolean',
          createdAt: 'timestamp'
        }
      },
      votes: {
        name: 'votes',
        fields: {
          userId: 'string',
          voteType: 'string' // 'upvote', 'downvote'
        }
      }
    }
  },

  // Progress tracking for certificates
  userProgress: {
    name: 'userProgress',
    fields: {
      userId: 'string',
      courseId: 'string',
      completedLessons: 'array',
      totalProgress: 'number',
      lastAccessed: 'timestamp',
      quizScores: 'array',
      certificateEligible: 'boolean'
    }
  }
};