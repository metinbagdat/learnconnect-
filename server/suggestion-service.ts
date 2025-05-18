// Suggestion service to provide recommendations for different aspects of the platform
// This helps create a more guided experience for users

// Goals suggestions
export const goalSuggestions = [
  "Become a Full Stack Developer",
  "Master Data Science",
  "Learn Mobile App Development",
  "Prepare for College Entrance Exams",
  "Improve Coding Skills",
  "Learn UI/UX Design",
  "Master Mathematics",
  "Prepare for YKS Exam",
  "Learn Machine Learning",
  "Develop Game Design Skills"
];

// Fields/career suggestions
export const fieldSuggestions = [
  "Computer Science",
  "Mathematics",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Game Development",
  "Artificial Intelligence",
  "Software Engineering",
  "College Preparation",
  "YKS Exam Preparation",
  "Science and Research"
];

// Course topic suggestions
export const topicSuggestions = [
  "JavaScript Fundamentals",
  "Advanced Mathematics",
  "React Development",
  "Database Design",
  "Python Programming",
  "Mobile App Development",
  "Data Structures and Algorithms",
  "Machine Learning Basics",
  "User Interface Design",
  "TYT Mathematics",
  "AYT Physics",
  "YDT English Preparation",
  "Node.js Backend Development"
];

// Timeframe suggestions for learning paths
export const timeframeSuggestions = [
  "3 months",
  "6 months",
  "1 year",
  "18 months",
  "2 years"
];

// Difficulty level suggestions
export const difficultyLevelSuggestions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

// Get suggestions based on type and optional query filter
export function getSuggestions(type: string, query?: string): string[] {
  let suggestions: string[] = [];
  
  switch (type) {
    case 'goals':
      suggestions = goalSuggestions;
      break;
    case 'fields':
      suggestions = fieldSuggestions;
      break;
    case 'courseTopics':
      suggestions = topicSuggestions;
      break;
    case 'timeframes':
      suggestions = timeframeSuggestions;
      break;
    case 'difficultyLevels':
      suggestions = difficultyLevelSuggestions;
      break;
    default:
      return [];
  }
  
  // Filter by query if provided
  if (query) {
    const lowerQuery = query.toLowerCase();
    return suggestions.filter(item => 
      item.toLowerCase().includes(lowerQuery)
    );
  }
  
  return suggestions;
}