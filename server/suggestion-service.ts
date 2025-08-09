// Suggestion service to provide recommendations for different aspects of the platform
// This helps create a more guided experience for users

// Goals suggestions - English
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

// Goals suggestions - Turkish
export const goalSuggestionsTr = [
  "Tam Yığın Geliştirici Ol",
  "Veri Bilimini Öğren",
  "Mobil Uygulama Geliştirmeyi Öğren",
  "Üniversite Sınavlarına Hazırlan",
  "Kodlama Becerilerini Geliştir",
  "UI/UX Tasarım Öğren",
  "Matematiği Öğren",
  "YKS Sınavına Hazırlan",
  "Makine Öğrenmesini Öğren",
  "Oyun Tasarımı Becerilerini Geliştir"
];

// Fields/career suggestions - English
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

// Fields/career suggestions - Turkish
export const fieldSuggestionsTr = [
  "Bilgisayar Bilimleri",
  "Matematik",
  "Veri Bilimi",
  "Web Geliştirme",
  "Mobil Geliştirme",
  "UI/UX Tasarım",
  "Oyun Geliştirme",
  "Yapay Zeka",
  "Yazılım Mühendisliği",
  "Üniversite Hazırlığı",
  "YKS Sınav Hazırlığı",
  "Bilim ve Araştırma"
];

// Course topic suggestions - English
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

// Course topic suggestions - Turkish
export const topicSuggestionsTr = [
  "JavaScript Temelleri",
  "İleri Matematik",
  "React Geliştirme",
  "Veritabanı Tasarımı",
  "Python Programlama",
  "Mobil Uygulama Geliştirme",
  "Veri Yapıları ve Algoritmalar",
  "Makine Öğrenmesi Temelleri",
  "Kullanıcı Arayüzü Tasarımı",
  "TYT Matematik",
  "AYT Fizik",
  "YDT İngilizce Hazırlığı",
  "Node.js Backend Geliştirme"
];

// Timeframe suggestions for learning paths - English
export const timeframeSuggestions = [
  "3 months",
  "6 months",
  "1 year",
  "18 months",
  "2 years"
];

// Timeframe suggestions for learning paths - Turkish
export const timeframeSuggestionsTr = [
  "3 ay",
  "6 ay",
  "1 yıl",
  "18 ay",
  "2 yıl"
];

// Difficulty level suggestions - English
export const difficultyLevelSuggestions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

// Difficulty level suggestions - Turkish
export const difficultyLevelSuggestionsTr = [
  "Başlangıç",
  "Orta",
  "İleri",
  "Uzman"
];

// Get suggestions based on type, language and optional query filter
export function getSuggestions(type: string, language: string = 'en', query?: string): string[] {
  let suggestions: string[] = [];
  
  switch (type) {
    case 'goals':
      suggestions = language === 'tr' ? goalSuggestionsTr : goalSuggestions;
      break;
    case 'fields':
      suggestions = language === 'tr' ? fieldSuggestionsTr : fieldSuggestions;
      break;
    case 'courseTopics':
      suggestions = language === 'tr' ? topicSuggestionsTr : topicSuggestions;
      break;
    case 'timeframes':
      suggestions = language === 'tr' ? timeframeSuggestionsTr : timeframeSuggestions;
      break;
    case 'difficultyLevels':
      suggestions = language === 'tr' ? difficultyLevelSuggestionsTr : difficultyLevelSuggestions;
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