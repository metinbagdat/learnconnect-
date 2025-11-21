{
  studentId: string, // reference to student
  date: string, // e.g., 'YYYY-MM-DD'
  subjects: {
    [subject]: {
      timeStudied: number, // in minutes
      topicsCovered: array of strings,
      // ... other subject-specific progress
    }
  },
  overallProgress: number, // percentage
  notes: string // any notes by the student
}