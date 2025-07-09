import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the available languages
export type Language = 'en' | 'tr';

// Create the translations object for both languages
const translations = {
  en: {
    // Common
    appName: 'EduLearn Platform',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    
    // Navigation
    dashboard: 'Dashboard',
    courses: 'Courses',
    assignments: 'Assignments',
    calendar: 'Calendar',
    resources: 'Resources',
    achievements: 'Achievements',
    profile: 'Profile',
    adminPanel: 'Admin Panel',
    courseGenerator: 'AI Course Generator',
    
    // Auth
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    displayName: 'Display Name',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    haveAccount: 'Already have an account?',
    loginNow: 'Login Now',
    registerNow: 'Register Now',
    logout: 'Logout',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    yourProgress: 'Your Progress',
    enrolledCourses: 'Enrolled Courses',
    upcomingAssignments: 'Upcoming Assignments',
    viewAll: 'View All',
    enrolledIn: 'Enrolled in',
    course: 'Course',
    coursesPlural: 'Courses',
    continueLeaning: 'Continue Learning',
    completed: 'Completed',
    dueDate: 'Due Date',
    
    // Courses
    allCourses: 'All Courses',
    availableCourses: 'Available Courses',
    enrolled: 'Enrolled',
    myCourses: 'My Courses',
    enrollNow: 'Enroll Now',
    continueButton: 'Continue',
    noCourses: 'No courses available',
    courseDuration: 'Duration',
    courseModules: 'Modules',
    hours: 'hours',
    
    // Course Generator
    generateCourse: 'Generate Course',
    courseTitle: 'Course Title',
    courseDescription: 'Course Description',
    courseCategory: 'Category',
    topicInput: 'Topic',
    generateCourseButton: 'Generate Course',
    courseGenerated: 'Course Generated Successfully',
    saveCourse: 'Save Course',
    
    // Course Detail
    courseOverview: 'Course Overview',
    moduleOverview: 'Module Overview',
    lessonContent: 'Lesson Content',
    prerequisites: 'Prerequisites',
    learningOutcomes: 'Learning Outcomes',
    difficultyLevel: 'Difficulty Level',
    estimatedDuration: 'Estimated Duration',
    completionRate: 'Completion Rate',
    
    // Lesson Page
    lessonNotFound: 'Lesson Not Found',
    lessonNotFoundDescription: 'The lesson you are looking for does not exist or has not been created yet.',
    backToCourse: 'Back to Course',
    personalizedIntro: 'AI Personalized Introduction',
    practiceExercises: 'Practice Exercises',
    nextSteps: 'Next Steps',
    completeLesson: 'Complete Lesson',
    nextLesson: 'Next Lesson',
    previousLesson: 'Previous Lesson',
    minutes: 'minutes',
    completed: 'completed',
    levelInput: 'Level',
    targetAudienceInput: 'Target Audience',
    specificFocusInput: 'Specific Focus',
    generatingCourse: 'Generating Course...',
    generateButton: 'Generate',
    
    // Assignments
    assignmentsDue: 'Assignments Due',
    noAssignments: 'No assignments due',
    submitAssignment: 'Submit Assignment',
    viewDetails: 'View Details',
    
    // Calendar
    monthlyView: 'Monthly View',
    upcoming: 'Upcoming',
    noEvents: 'No events on this date',
    hasAssignments: 'assignments due',
    selectDate: 'Select a date',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    manageUsers: 'Manage Users',
    manageCourses: 'Manage Courses',
    addTurkishCourses: 'Add Turkish University Entrance Exam Courses',
    
    // Turkish Exam Courses
    turkishCoursesAdded: 'Turkish university entrance exam courses added successfully',
    tyt: 'TYT',
    ayt: 'AYT',
    ydt: 'YDT',
    
    // Resources
    allResources: 'All Resources',
    documents: 'Documents',
    media: 'Media',
    links: 'Links',
    uploadResource: 'Upload Resource',
    downloadResource: 'Download',
    openLink: 'Open Link',
    searchResources: 'Search resources...',
    filterByCourse: 'Filter by Course',

    // AI Features
    aiPoweredModules: 'AI-Powered Learning Modules',
    personalizedContent: 'Personalized Content',
    aiLearningAssistant: 'AI Learning Assistant',
    personalizedForYou: 'Personalized for You',
    learningObjectives: 'Learning Objectives',
    aiAdaptedContent: 'AI-Adapted Content',
    recommendedPractice: 'Recommended Practice',
    nextRecommendedSteps: 'Next recommended steps',
    startLearning: 'Start Learning',
    refreshContent: 'Refresh Content',
    noAiModulesAvailable: 'No AI Modules Available',
    aiPersonalization: 'AI Personalization',
    
    // Entrance Exams
    entranceExamPrep: 'Entrance Exam Preparation',
    myLearningPaths: 'My Learning Paths',
    exploreExams: 'Explore Exams',
    createNewPath: 'Create New Path',
    createAiPoweredPath: 'Create AI-Powered Learning Path',
    learningPath: 'Learning Path',
    aiPersonalized: 'AI-Personalized',
    moduleTree: 'Module Tree',
    aiEnhanced: 'AI Enhanced',
    examType: 'Exam Type',
    specificExam: 'Specific Exam',
    currentLevel: 'Current Level',
    learningStyle: 'Learning Style',
    weeklyStudyHours: 'Weekly Study Hours',
    targetScore: 'Target Score',
    examDate: 'Exam Date',
    strengths: 'Strengths',
    areasForImprovement: 'Areas for Improvement',
    specialRequirements: 'Special Requirements',
    generateLearningPath: 'Generate Learning Path',
    continueLearning: 'Continue Learning',
    
    // Course Detail
    courseNotFound: 'Course not found',
    courseNotFoundDescription: 'The course you\'re looking for doesn\'t exist.',
  },
  tr: {
    // Common
    appName: 'EduLearn Platformu',
    loading: 'Yükleniyor...',
    save: 'Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    delete: 'Sil',
    confirm: 'Onayla',
    back: 'Geri',
    next: 'İleri',
    previous: 'Önceki',
    search: 'Ara',
    filter: 'Filtrele',
    sort: 'Sırala',
    refresh: 'Yenile',
    
    // Navigation
    dashboard: 'Gösterge Paneli',
    courses: 'Kurslar',
    assignments: 'Ödevler',
    calendar: 'Takvim',
    resources: 'Kaynaklar',
    achievements: 'Başarılar',
    profile: 'Profil',
    adminPanel: 'Admin Paneli',
    courseGenerator: 'Yapay Zeka Kurs Oluşturucu',
    
    // Auth
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    confirmPassword: 'Şifreyi Onayla',
    displayName: 'Görünen Ad',
    forgotPassword: 'Şifreni mi unuttun?',
    noAccount: 'Hesabınız yok mu?',
    haveAccount: 'Zaten hesabınız var mı?',
    loginNow: 'Şimdi Giriş Yap',
    registerNow: 'Şimdi Kayıt Ol',
    logout: 'Çıkış Yap',
    
    // Dashboard
    welcomeBack: 'Tekrar hoş geldiniz',
    yourProgress: 'İlerlemeniz',
    enrolledCourses: 'Kayıtlı Kurslar',
    upcomingAssignments: 'Yaklaşan Ödevler',
    viewAll: 'Tümünü Görüntüle',
    enrolledIn: 'Kayıtlı',
    course: 'Kurs',
    coursesPlural: 'Kurslar',
    continueLeaning: 'Öğrenmeye Devam Et',
    completed: 'Tamamlandı',
    dueDate: 'Bitiş Tarihi',
    
    // Courses
    allCourses: 'Tüm Kurslar',
    availableCourses: 'Mevcut Kurslar',
    enrolled: 'Kayıtlı',
    myCourses: 'Kurslarım',
    enrollNow: 'Şimdi Kaydol',
    continueButton: 'Devam Et',
    noCourses: 'Mevcut kurs yok',
    courseDuration: 'Süre',
    courseModules: 'Modüller',
    hours: 'saat',
    
    // Course Generator
    generateCourse: 'Kurs Oluştur',
    courseTitle: 'Kurs Başlığı',
    courseDescription: 'Kurs Açıklaması',
    courseCategory: 'Kategori',
    topicInput: 'Konu',
    generateCourseButton: 'Kurs Oluştur',
    courseGenerated: 'Kurs Başarıyla Oluşturuldu',
    saveCourse: 'Kursu Kaydet',
    
    // Course Detail
    courseOverview: 'Kurs Genel Bakış',
    moduleOverview: 'Modül Genel Bakış',
    lessonContent: 'Ders İçeriği',
    prerequisites: 'Ön Koşullar',
    learningOutcomes: 'Öğrenme Çıktıları',
    difficultyLevel: 'Zorluk Seviyesi',
    estimatedDuration: 'Tahmini Süre',
    completionRate: 'Tamamlanma Oranı',
    
    // Lesson Page
    lessonNotFound: 'Ders Bulunamadı',
    lessonNotFoundDescription: 'Aradığınız ders mevcut değil veya henüz oluşturulmadı.',
    backToCourse: 'Kursa Dön',
    personalizedIntro: 'AI Kişiselleştirilmiş Giriş',
    practiceExercises: 'Alıştırmalar',
    nextSteps: 'Sonraki Adımlar',
    completeLesson: 'Dersi Tamamla',
    nextLesson: 'Sonraki Ders',
    previousLesson: 'Önceki Ders',
    minutes: 'dakika',
    completed: 'tamamlandı',
    levelInput: 'Seviye',
    targetAudienceInput: 'Hedef Kitle',
    specificFocusInput: 'Özel Odak',
    generatingCourse: 'Kurs Oluşturuluyor...',
    generateButton: 'Oluştur',
    
    // Assignments
    assignmentsDue: 'Yaklaşan Ödevler',
    noAssignments: 'Yaklaşan ödev yok',
    submitAssignment: 'Ödevi Gönder',
    viewDetails: 'Detayları Görüntüle',
    
    // Calendar
    monthlyView: 'Aylık Görünüm',
    upcoming: 'Yaklaşan',
    noEvents: 'Bu tarihte etkinlik yok',
    hasAssignments: 'ödev var',
    selectDate: 'Bir tarih seçin',
    
    // Admin
    adminDashboard: 'Admin Gösterge Paneli',
    manageUsers: 'Kullanıcıları Yönet',
    manageCourses: 'Kursları Yönet',
    addTurkishCourses: 'YKS Kurslarını Ekle',
    
    // Turkish Exam Courses
    turkishCoursesAdded: 'YKS kursları başarıyla eklendi',
    tyt: 'TYT',
    ayt: 'AYT',
    ydt: 'YDT',
    
    // Resources
    allResources: 'Tüm Kaynaklar',
    documents: 'Dokümanlar',
    media: 'Medya',
    links: 'Bağlantılar',
    uploadResource: 'Kaynak Yükle',
    downloadResource: 'İndir',
    openLink: 'Bağlantıyı Aç',
    searchResources: 'Kaynakları ara...',
    filterByCourse: 'Kursa Göre Filtrele',

    // AI Features
    aiPoweredModules: 'Yapay Zeka Destekli Öğrenme Modülleri',
    personalizedContent: 'Kişiselleştirilmiş İçerik',
    aiLearningAssistant: 'Yapay Zeka Öğrenme Asistanı',
    personalizedForYou: 'Sizin İçin Kişiselleştirildi',
    learningObjectives: 'Öğrenme Hedefleri',
    aiAdaptedContent: 'Yapay Zeka Uyarlanmış İçerik',
    recommendedPractice: 'Önerilen Pratik',
    nextRecommendedSteps: 'Önerilen sonraki adımlar',
    startLearning: 'Öğrenmeye Başla',
    refreshContent: 'İçeriği Yenile',
    noAiModulesAvailable: 'Yapay Zeka Modülü Mevcut Değil',
    aiPersonalization: 'Yapay Zeka Kişiselleştirmesi',
    
    // Entrance Exams
    entranceExamPrep: 'Üniversite Sınavı Hazırlığı',
    myLearningPaths: 'Öğrenme Yollarım',
    exploreExams: 'Sınavları Keşfet',
    createNewPath: 'Yeni Yol Oluştur',
    createAiPoweredPath: 'Yapay Zeka Destekli Öğrenme Yolu Oluştur',
    examType: 'Sınav Türü',
    specificExam: 'Belirli Sınav',
    currentLevel: 'Mevcut Seviye',
    learningStyle: 'Öğrenme Stili',
    weeklyStudyHours: 'Haftalık Çalışma Saati',
    targetScore: 'Hedef Puan',
    examDate: 'Sınav Tarihi',
    strengths: 'Güçlü Yönler',
    areasForImprovement: 'Geliştirilmesi Gereken Alanlar',
    specialRequirements: 'Özel Gereksinimler',
    generateLearningPath: 'Öğrenme Yolu Oluştur',
    continueLearning: 'Öğrenmeye Devam Et',
    
    // Course Detail
    courseNotFound: 'Kurs bulunamadı',
    courseNotFoundDescription: 'Aradığınız kurs mevcut değil.',
  }
};

// Type for the context value
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get initially saved language or use 'en' as default
  const getSavedLanguage = (): Language => {
    try {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'en';
    } catch (error) {
      // In case of error (e.g., SSR or localStorage not available)
      return 'en';
    }
  };
  
  const [language, setLanguage] = useState<Language>(getSavedLanguage());

  // Update localStorage when language changes
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Could not save language preference:', error);
    }
  }, [language]);

  // Translation function
  const t = (key: keyof typeof translations.en): string => {
    return (translations[language] as Record<string, string>)[key] || translations.en[key] || key;
  };

  const value = { language, setLanguage, t };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// Hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}