// firestore.schema.js
export const FIRESTORE_SCHEMA = {
  // Student Profiles
  students: {
    fields: {
      personalInfo: {
        name: 'string',
        email: 'string', 
        phone: 'string',
        school: 'string',
        grade: 'string',
        city: 'string'
      },
      examPreferences: {
        targetUniversities: 'array',
        targetPrograms: 'array',
        examYear: 'string',
        examTypes: 'array', // ['TYT', 'AYT', 'YDT']
        prioritySubjects: 'array'
      },
      studySettings: {
        dailyStudyHours: 'number',
        preferredStudyTimes: 'array',
        studyDays: 'array', // ['monday', 'tuesday', ...]
        breakIntervals: 'number',
        focusMode: 'boolean'
      },
      performanceGoals: {
        tytTargetScore: 'number',
        aytTargetScore: 'number',
        subjectTargets: 'map',
        weeklyStudyHours: 'number'
      },
      subscription: {
        plan: 'string', // 'free', 'premium', 'elite'
        expiresAt: 'timestamp',
        features: 'array'
      }
    }
  },

  // TYT Subject Structure
  tyt_subjects: {
    turkish: {
      topics: [
        { id: 'turkish-grammar-1', name: 'Sözcükte Anlam', weight: 8, difficulty: 'medium' },
        { id: 'turkish-grammar-2', name: 'Cümlede Anlam', weight: 7, difficulty: 'medium' },
        { id: 'turkish-grammar-3', name: 'Paragraf', weight: 22, difficulty: 'hard' },
        { id: 'turkish-grammar-4', name: 'Ses Bilgisi', weight: 3, difficulty: 'easy' },
        { id: 'turkish-grammar-5', name: 'Yazım Kuralları', weight: 4, difficulty: 'medium' },
        { id: 'turkish-grammar-6', name: 'Noktalama İşaretleri', weight: 3, difficulty: 'easy' },
        { id: 'turkish-grammar-7', name: 'Anlatım Bozuklukları', weight: 3, difficulty: 'hard' }
      ],
      totalQuestions: 40,
      timeAllocation: 60 // minutes
    },
    mathematics: {
      topics: [
        { id: 'math-core-1', name: 'Temel Kavramlar', weight: 6, difficulty: 'easy' },
        { id: 'math-core-2', name: 'Sayı Basamakları', weight: 3, difficulty: 'medium' },
        { id: 'math-core-3', name: 'Bölme ve Bölünebilme', weight: 4, difficulty: 'medium' },
        { id: 'math-algebra-1', name: 'Rasyonel Sayılar', weight: 4, difficulty: 'medium' },
        { id: 'math-algebra-2', name: 'Basit Eşitsizlikler', weight: 4, difficulty: 'hard' },
        { id: 'math-geometry-1', name: 'Doğruda Açılar', weight: 3, difficulty: 'easy' },
        { id: 'math-geometry-2', name: 'Üçgenler', weight: 6, difficulty: 'hard' },
        { id: 'math-problems-1', name: 'Sayı Problemleri', weight: 7, difficulty: 'hard' },
        { id: 'math-problems-2', name: 'Kesir Problemleri', weight: 5, difficulty: 'medium' }
      ],
      totalQuestions: 40,
      timeAllocation: 75
    },
    science: {
      physics: [
        { id: 'physics-1', name: 'Fizik Bilimine Giriş', weight: 2, difficulty: 'easy' },
        { id: 'physics-2', name: 'Madde ve Özellikleri', weight: 3, difficulty: 'medium' },
        { id: 'physics-3', name: 'Hareket ve Kuvvet', weight: 4, difficulty: 'hard' }
      ],
      chemistry: [
        { id: 'chemistry-1', name: 'Kimya Bilimi', weight: 3, difficulty: 'easy' },
        { id: 'chemistry-2', name: 'Atom ve Periyodik Sistem', weight: 4, difficulty: 'medium' },
        { id: 'chemistry-3', name: 'Kimyasal Türler Arası Etkileşimler', weight: 3, difficulty: 'medium' }
      ],
      biology: [
        { id: 'biology-1', name: 'Biyoloji Bilimi', weight: 3, difficulty: 'easy' },
        { id: 'biology-2', name: 'Canlıların Ortak Özellikleri', weight: 3, difficulty: 'easy' },
        { id: 'biology-3', name: 'Canlıların Temel Bileşenleri', weight: 4, difficulty: 'medium' }
      ],
      totalQuestions: 20,
      timeAllocation: 30
    },
    social_sciences: {
      history: [
        { id: 'history-1', name: 'Tarih Bilimi', weight: 2, difficulty: 'easy' },
        { id: 'history-2', name: 'İlk Türk Devletleri', weight: 3, difficulty: 'medium' }
      ],
      geography: [
        { id: 'geography-1', name: 'Doğal Sistemler', weight: 3, difficulty: 'medium' },
        { id: 'geography-2', name: 'Beşeri Sistemler', weight: 3, difficulty: 'medium' }
      ],
      philosophy: [
        { id: 'philosophy-1', name: 'Felsefeyle Tanışma', weight: 2, difficulty: 'easy' },
        { id: 'philosophy-2', name: 'Bilgi Felsefesi', weight: 2, difficulty: 'hard' }
      ],
      religious_culture: [
        { id: 'religion-1', name: 'İnanç', weight: 3, difficulty: 'easy' },
        { id: 'religion-2', name: 'İbadet', weight: 3, difficulty: 'medium' }
      ],
      totalQuestions: 20,
      timeAllocation: 25
    }
  }
};