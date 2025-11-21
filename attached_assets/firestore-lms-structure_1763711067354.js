// firestore-lms-structure.js
export const FIRESTORE_LMS_STRUCTURE = {
  // ========== LMS CORE COLLECTIONS ==========
  Categories: {
    path: 'Categories/{categoryId}',
    fields: {
      name: 'string',
      description: 'string',
      color: 'string',
      icon: 'string',
      order: 'number',
      created_at: 'timestamp',
      updated_at: 'timestamp',
      subcategories: {
        type: 'array',
        structure: {
          subcategoryId: 'string',
          name: 'string',
          description: 'string',
          order: 'number'
        }
      }
    }
  },

  Courses: {
    path: 'Courses/{courseId}',
    fields: {
      // Basic Info
      title: 'string',
      description: 'string',
      short_description: 'string',
      thumbnail_url: 'string',
      category_id: 'string',
      subcategory_id: 'string',
      
      // Course Structure
      instructor: {
        name: 'string',
        user_id: 'string',
        bio: 'string',
        avatar_url: 'string'
      },
      modules: {
        type: 'array',
        structure: {
          module_id: 'string',
          title: 'string',
          description: 'string',
          order: 'number',
          estimated_duration: 'number',
          lessons: {
            type: 'array',
            structure: {
              lesson_id: 'string',
              title: 'string',
              content_type: 'string', // 'video', 'text', 'quiz', 'assignment'
              content_url: 'string',
              duration: 'number',
              order: 'number',
              is_free: 'boolean',
              resources: 'array'
            }
          }
        }
      },

      // Exams & Assessments
      exams: {
        type: 'array',
        structure: {
          exam_id: 'string',
          title: 'string',
          description: 'string',
          duration: 'number',
          passing_score: 'number',
          max_attempts: 'number',
          available_from: 'timestamp',
          available_until: 'timestamp',
          questions: {
            type: 'array',
            structure: {
              question_id: 'string',
              type: 'string', // 'multiple_choice', 'true_false', 'short_answer'
              question: 'string',
              options: 'array',
              correct_answer: 'string',
              points: 'number',
              explanation: 'string'
            }
          }
        }
      },

      // Metadata
      level: 'string', // 'beginner', 'intermediate', 'advanced'
      language: 'string',
      price: 'number',
      is_published: 'boolean',
      tags: 'array',
      ratings: {
        average: 'number',
        count: 'number'
      },
      student_count: 'number',
      created_at: 'timestamp',
      updated_at: 'timestamp'
    }
  },

  Enrollments: {
    path: 'Enrollments/{enrollmentId}',
    fields: {
      user_id: 'string',
      course_id: 'string',
      enrolled_at: 'timestamp',
      status: 'string', // 'active', 'completed', 'dropped'
      
      // Progress Tracking
      progress: {
        completed_lessons: 'array',
        completed_modules: 'array',
        current_module: 'string',
        current_lesson: 'string',
        overall_progress: 'number', // percentage
        total_study_time: 'number', // minutes
        last_accessed: 'timestamp'
      },

      // Grades & Performance
      grades: {
        type: 'array',
        structure: {
          exam_id: 'string',
          attempt: 'number',
          score: 'number',
          total_questions: 'number',
          correct_answers: 'number',
          started_at: 'timestamp',
          completed_at: 'timestamp',
          answers: 'array' // Store user's answers for review
        }
      },

      // Course-specific goals
      goals: {
        target_completion_date: 'timestamp',
        weekly_study_hours: 'number',
        desired_grade: 'number'
      }
    }
  },

  // ========== ENHANCED STUDY PLANNER ==========
  StudyPlans: {
    path: 'StudyPlans/{planId}',
    fields: {
      user_id: 'string',
      date: 'string', // YYYY-MM-DD
      generated_at: 'timestamp',
      
      // Enhanced plan structure with course integration
      plan: {
        tasks: {
          type: 'array',
          structure: {
            task_id: 'string',
            type: 'string', // 'course_lesson', 'exam_prep', 'review', 'practice'
            course_id: 'string',
            module_id: 'string',
            lesson_id: 'string',
            exam_id: 'string',
            title: 'string',
            description: 'string',
            duration: 'number',
            priority: 'string',
            resources: 'array',
            learning_objectives: 'array'
          }
        },
        focus_areas: 'array',
        estimated_duration: 'number',
        difficulty_level: 'string'
      },
      
      // Integration with existing AI system
      ai_metadata: {
        model: 'string',
        reasoning: 'map',
        version: 'string'
      }
    }
  }
};