import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the available languages
export type Language = 'en' | 'tr';

// Create the translations object for both languages
const translations = {
  en: {
    // Common
    appName: 'EduLearn Platform',
    loading: 'Loading...',
    
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
  },
  tr: {
    // Common
    appName: 'EduLearn Platformu',
    loading: 'Yükleniyor...',
    
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