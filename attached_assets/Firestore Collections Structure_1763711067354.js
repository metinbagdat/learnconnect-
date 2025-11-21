// Firestore Collections Structure
students/
  {studentId}/
    - personalInfo: {
        name: string,
        email: string,
        phone: string,
        school: string,
        grade: string
      }
    - examPreferences: {
        targetUniversities: array,
        targetPrograms: array,
        examYear: string,
        examTypes: ["TYT", "AYT"] // Which exams student is preparing for
      }
    - studySettings: {
        dailyStudyHours: number,
        preferredStudyTimes: array,
        weakSubjects: array,
        strongSubjects: array
      }

tyt_subjects/
  - turkish: {
      grammar: { topics: array, weight: number },
      vocabulary: { topics: array, weight: number },
      paragraph: { topics: array, weight: number },
      logic: { topics: array, weight: number }
    }
  - mathematics: {
      core: { topics: array, weight: number },
      algebra: { topics: array, weight: number },
      geometry: { topics: array, weight: number },
      problems: { topics: array, weight: number }
    }
  - science: {
      physics: { topics: array, weight: number },
      chemistry: { topics: array, weight: number },
      biology: { topics: array, weight: number }
    }
  - social_sciences: {
      history: { topics: array, weight: number },
      geography: { topics: array, weight: number },
      philosophy: { topics: array, weight: number },
      religious_culture: { topics: array, weight: number }
    }

ayt_subjects/
  - mathematics_2: {
      advanced_algebra: { topics: array, weight: number },
      calculus: { topics: array, weight: number },
      trigonometry: { topics: array, weight: number }
    }
  - turkish_literature: {
      poetry: { topics: array, weight: number },
      novel: { topics: array, weight: number },
      social_1: { topics: array, weight: number }
    }
  - science_2: {
      physics: { topics: array, weight: number },
      chemistry: { topics: array, weight: number },
      biology: { topics: array, weight: number }
    }
  - history_geography_2: {
      modern_history: { topics: array, weight: number },
      modern_geography: { topics: array, weight: number }
    }

student_progress/
  {studentId}/
    tyt_progress: {
      subject_scores: {
        turkish: { net: number, targetNet: number, correct: number, wrong: number, empty: number },
        mathematics: { net: number, targetNet: number, correct: number, wrong: number, empty: number },
        science: { net: number, targetNet: number, correct: number, wrong: number, empty: number },
        social_sciences: { net: number, targetNet: number, correct: number, wrong: number, empty: number }
      },
      topic_progress: {
        // Detailed progress for each topic
        "turkish-grammar": { studied: boolean, proficiency: number, lastPracticed: timestamp },
        "mathematics-algebra": { studied: boolean, proficiency: number, lastPracticed: timestamp }
      },
      overall_tyt_score: number,
      target_tyt_score: number
    }
    ayt_progress: {
      // Similar structure for AYT subjects
    }

practice_tests/
  {studentId}/
    {testId}:
      - testType: "TYT" | "AYT" | "Mixed"
      - testDate: timestamp
      - subjects: {
          turkish: { correct: number, wrong: number, empty: number, net: number },
          mathematics: { correct: number, wrong: number, empty: number, net: number }
          // ... other subjects
        }
      - overallScore: number
      - analysis: {
          weakTopics: array,
          timeManagement: string,
          recommendations: string
        }

daily_plans/
  {studentId}/
    {date}:
      - date: string
      - examFocus: "TYT" | "AYT" | "Mixed"
      - tasks: [
          {
            subject: string,
            topic: string,
            type: "theory" | "practice" | "review" | "test",
            duration: number,
            priority: "high" | "medium" | "low",
            resources: array,
            completed: boolean
          }
        ]
      - motivationalFeedback: string
      - studyTips: string
      - dailyGoals: array