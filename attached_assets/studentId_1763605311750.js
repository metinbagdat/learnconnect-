{
  name: string,
  email: string,
  subjects: array of strings, // e.g., ['Math', 'Physics']
  goals: {
    [subject]: string // goal for each subject
  },
  preferences: {
    studyHours: number, // preferred study hours per day
    breakFrequency: number, // break frequency in minutes
  },
  createdAt: timestamp
}