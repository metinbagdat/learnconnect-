// src/data/seed-modules-lessons.ts
import { db } from '../services/firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

export interface SeedModule {
  module_id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  order: number;
  estimated_duration: number; // in minutes
  lessons: SeedLesson[];
}

export interface SeedLesson {
  lesson_id: string;
  title_tr: string;
  title_en: string;
  content_tr: string;
  content_en: string;
  content_type: 'text' | 'video' | 'quiz' | 'assignment';
  duration: number; // in minutes
  order: number;
  reading_time: number; // in minutes
  word_count: number;
  resources?: string[];
  is_free: boolean;
}

// Sample content for lessons (bilingual)
const SAMPLE_LESSON_CONTENT = {
  // Turkish sample content
  tr: {
    grammar_intro: `
# Dil Bilgisine Giriş

Dil bilgisi, bir dilin yapı taşlarını oluşturan kurallar bütünüdür. Türkçe dil bilgisi, kökleri Orta Asya'ya dayanan zengin ve sistematik bir yapıya sahiptir.

## Temel Kavramlar

### Sözcük Türleri
- **İsimler**: Varlıkları, kavramları karşılayan sözcükler
- **Fiiller**: Hareket, oluş, durum bildiren sözcükler
- **Sıfatlar**: İsimleri niteleyen sözcükler
- **Zarflar**: Fiilleri, sıfatları veya kendileri gibi zarfları niteleyen sözcükler

### Cümlenin Ögeleri
- Yüklem
- Özne
- Nesne
- Dolaylı Tümleç
- Zarf Tümleci
- Edat Tümleci

## Önemli Kurallar

1. **Büyük Ünlü Uyumu**: Türkçe sözcüklerde genellikle aranan bir uyum kuralıdır
2. **Küçük Ünlü Uyumu**: Sözcüklerin son hecesindeki ünlü harfe bağlı kural
3. **Ünsüz Benzeşmesi**: Sert ünsüzlerin etkisiyle gerçekleşen ses olayı
    `,

    math_basics: `
# Matematik Temel Kavramlar

Matematik, sayılar, şekiller ve yapılar üzerine çalışan bir bilim dalıdır. TYT matematik, temel kavramlar üzerine kuruludur.

## Sayı Kümeleri

### Doğal Sayılar (ℕ)
- 0, 1, 2, 3, ... şeklinde sonsuza kadar gider
- Toplama ve çarpma işlemine göre kapalıdır

### Tam Sayılar (ℤ)
- ... -3, -2, -1, 0, 1, 2, 3, ...
- Toplama, çarma ve çıkarma işlemine göre kapalıdır

### Rasyonel Sayılar (ℚ)
- a/b şeklinde yazılabilen sayılar (b ≠ 0)
- Ondalık gösterimleri sonlu veya devirlidir

## Temel İşlemler

### Toplama İşlemi Özellikleri
- Değişme özelliği: a + b = b + a
- Birleşme özelliği: (a + b) + c = a + (b + c)
- Etkisiz eleman: 0
- Ters eleman: a + (-a) = 0
    `,

    physics_intro: `
# Fizik Bilimine Giriş

Fizik, madde ve enerji arasındaki etkileşimi inceleyen temel bilim dalıdır.

## Fiziğin Alt Dalları

### Mekanik
- Hareket ve denge kurallarını inceler
- Kinematik, dinamik, statik

### Elektrik ve Manyetizma
- Elektrik yükleri ve manyetik alanlar
- Elektrostatik, elektrik akımı, manyetizma

### Dalgalar
- Mekanik ve elektromanyetik dalgalar
- Ses dalgaları, ışık dalgaları

## Bilimsel Yöntem
1. Gözlem
2. Hipotez
3. Deney
4. Teori
5. Kanun
    `
  },

  // English sample content
  en: {
    grammar_intro: `
# Introduction to Grammar

Grammar is the set of structural rules that constitute the building blocks of a language. Turkish grammar has a rich and systematic structure with roots in Central Asia.

## Basic Concepts

### Word Types
- **Nouns**: Words that represent entities and concepts
- **Verbs**: Words that indicate action, occurrence, or state
- **Adjectives**: Words that qualify nouns
- **Adverbs**: Words that modify verbs, adjectives, or other adverbs

### Sentence Elements
- Predicate
- Subject
- Object
- Indirect object
- Adverbial complement
- Prepositional complement

## Important Rules

1. **Major Vowel Harmony**: A harmony rule generally sought in Turkish words
2. **Minor Vowel Harmony**: A rule dependent on the vowel in the last syllable
3. **Consonant Assimilation**: A sound event that occurs under the influence of hard consonants
    `,

    math_basics: `
# Mathematics Basic Concepts

Mathematics is a science that studies numbers, shapes, and structures. TYT mathematics is built on fundamental concepts.

## Number Sets

### Natural Numbers (ℕ)
- Continue infinitely as 0, 1, 2, 3, ...
- Closed under addition and multiplication

### Integers (ℤ)
- ... -3, -2, -1, 0, 1, 2, 3, ...
- Closed under addition, multiplication, and subtraction

### Rational Numbers (ℚ)
- Numbers that can be written as a/b (b ≠ 0)
- Their decimal representations are finite or repeating

## Basic Operations

### Addition Properties
- Commutative property: a + b = b + a
- Associative property: (a + b) + c = a + (b + c)
- Identity element: 0
- Inverse element: a + (-a) = 0
    `,

    physics_intro: `
# Introduction to Physics

Physics is the fundamental science that studies the interaction between matter and energy.

## Subfields of Physics

### Mechanics
- Studies motion and equilibrium rules
- Kinematics, dynamics, statics

### Electricity and Magnetism
- Electric charges and magnetic fields
- Electrostatics, electric current, magnetism

### Waves
- Mechanical and electromagnetic waves
- Sound waves, light waves

## Scientific Method
1. Observation
2. Hypothesis
3. Experiment
4. Theory
5. Law
    `
  }
};

// Calculate reading time and word count
const calculateReadingStats = (content: string) => {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  
  return { wordCount, readingTime };
};

// Generate sample modules and lessons for each course
export const generateSampleModules = (courseId: string, courseTitle: string): SeedModule[] => {
  const courseType = courseTitle.toLowerCase();
  
  if (courseType.includes('türkçe') || courseType.includes('turkish')) {
    return [
      {
        module_id: `${courseId}_module_1`,
        title_tr: 'Dil Bilgisi Temelleri',
        title_en: 'Grammar Fundamentals',
        description_tr: 'Türkçe dil bilgisinin temel kuralları ve uygulamaları',
        description_en: 'Basic rules and applications of Turkish grammar',
        order: 1,
        estimated_duration: 180,
        lessons: [
          {
            lesson_id: `${courseId}_lesson_1`,
            title_tr: 'Sözcük Türleri ve Özellikleri',
            title_en: 'Word Types and Properties',
            content_tr: SAMPLE_LESSON_CONTENT.tr.grammar_intro,
            content_en: SAMPLE_LESSON_CONTENT.en.grammar_intro,
            content_type: 'text',
            duration: 45,
            order: 1,
            ...calculateReadingStats(SAMPLE_LESSON_CONTENT.tr.grammar_intro),
            resources: ['Grammar_Handbook.pdf', 'Practice_Exercises.docx'],
            is_free: true
          },
          {
            lesson_id: `${courseId}_lesson_2`,
            title_tr: 'Cümle Çeşitleri ve Yapıları',
            title_en: 'Sentence Types and Structures',
            content_tr: 'Cümle türleri, ögeleri ve analiz yöntemleri...',
            content_en: 'Sentence types, elements and analysis methods...',
            content_type: 'text',
            duration: 60,
            order: 2,
            word_count: 1200,
            reading_time: 6,
            is_free: false
          }
        ]
      },
      {
        module_id: `${courseId}_module_2`,
        title_tr: 'Paragraf ve Anlam Bilgisi',
        title_en: 'Paragraph and Meaning Knowledge',
        description_tr: 'Paragraf analizi ve anlama teknikleri',
        description_en: 'Paragraph analysis and comprehension techniques',
        order: 2,
        estimated_duration: 240,
        lessons: [
          {
            lesson_id: `${courseId}_lesson_3`,
            title_tr: 'Paragraf Yapısı ve Türleri',
            title_en: 'Paragraph Structure and Types',
            content_tr: 'Paragrafın temel yapısı, giriş-gelişme-sonuç bölümleri...',
            content_en: 'Basic structure of paragraphs, introduction-development-conclusion sections...',
            content_type: 'text',
            duration: 50,
            order: 1,
            word_count: 1500,
            reading_time: 8,
            is_free: true
          }
        ]
      }
    ];
  }
  
  if (courseType.includes('matematik') || courseType.includes('mathematics')) {
    return [
      {
        module_id: `${courseId}_module_1`,
        title_tr: 'Temel Matematik Kavramları',
        title_en: 'Basic Mathematics Concepts',
        description_tr: 'Matematiğin temel kavramları ve sayı sistemleri',
        description_en: 'Basic concepts of mathematics and number systems',
        order: 1,
        estimated_duration: 200,
        lessons: [
          {
            lesson_id: `${courseId}_lesson_1`,
            title_tr: 'Sayı Kümeleri ve İşlemler',
            title_en: 'Number Sets and Operations',
            content_tr: SAMPLE_LESSON_CONTENT.tr.math_basics,
            content_en: SAMPLE_LESSON_CONTENT.en.math_basics,
            content_type: 'text',
            duration: 60,
            order: 1,
            ...calculateReadingStats(SAMPLE_LESSON_CONTENT.tr.math_basics),
            resources: ['Number_Systems.pdf', 'Practice_Problems.docx'],
            is_free: true
          },
          {
            lesson_id: `${courseId}_lesson_2`,
            title_tr: 'Problem Çözme Stratejileri',
            title_en: 'Problem Solving Strategies',
            content_tr: 'Matematik problemlerini çözme teknikleri ve stratejiler...',
            content_en: 'Techniques and strategies for solving math problems...',
            content_type: 'text',
            duration: 70,
            order: 2,
            word_count: 1800,
            reading_time: 9,
            is_free: false
          }
        ]
      }
    ];
  }
  
  if (courseType.includes('fizik') || courseType.includes('physics')) {
    return [
      {
        module_id: `${courseId}_module_1`,
        title_tr: 'Fizik Bilimine Giriş',
        title_en: 'Introduction to Physics',
        description_tr: 'Fiziğin temel kavramları ve bilimsel yöntem',
        description_en: 'Basic concepts of physics and scientific method',
        order: 1,
        estimated_duration: 150,
        lessons: [
          {
            lesson_id: `${courseId}_lesson_1`,
            title_tr: 'Fiziğin Doğası ve Alt Dalları',
            title_en: 'Nature of Physics and Subfields',
            content_tr: SAMPLE_LESSON_CONTENT.tr.physics_intro,
            content_en: SAMPLE_LESSON_CONTENT.en.physics_intro,
            content_type: 'text',
            duration: 40,
            order: 1,
            ...calculateReadingStats(SAMPLE_LESSON_CONTENT.tr.physics_intro),
            resources: ['Physics_Introduction.pdf'],
            is_free: true
          }
        ]
      }
    ];
  }
  
  // Default modules for other courses
  return [
    {
      module_id: `${courseId}_module_1`,
      title_tr: 'Temel Kavramlar',
      title_en: 'Basic Concepts',
      description_tr: 'Kursun temel kavramlarına giriş',
      description_en: 'Introduction to basic concepts of the course',
      order: 1,
      estimated_duration: 120,
      lessons: [
        {
          lesson_id: `${courseId}_lesson_1`,
          title_tr: 'Giriş ve Temel Bilgiler',
          title_en: 'Introduction and Basic Information',
          content_tr: 'Bu dersin temel kavramlarına giriş...',
          content_en: 'Introduction to basic concepts of this course...',
          content_type: 'text',
          duration: 30,
          order: 1,
          word_count: 800,
          reading_time: 4,
          is_free: true
        }
      ]
    }
  ];
};

// Main seed function
export const seedModulesAndLessons = async (): Promise<void> => {
  try {
    console.log('🌱 Starting modules and lessons seeding...');
    
    // Check if modules already exist to avoid duplicates
    const modulesSnapshot = await getDocs(collection(db, 'Modules'));
    if (!modulesSnapshot.empty) {
      console.log('✅ Modules already exist, skipping seed...');
      return;
    }
    
    // Get all courses
    const coursesSnapshot = await getDocs(collection(db, 'Courses'));
    const courses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📚 Found ${courses.length} courses to seed modules for...`);
    
    // Create modules and lessons for each course
    for (const course of courses) {
      const modules = generateSampleModules(course.id, course.title);
      
      for (const module of modules) {
        // Add course_id to module
        const moduleWithCourse = {
          ...module,
          course_id: course.id,
          created_at: new Date(),
          updated_at: new Date()
        };
        
        // Save module to Firestore
        await setDoc(doc(db, 'Modules', module.module_id), moduleWithCourse);
        console.log(`✅ Created module: ${module.title_tr}`);
        
        // Save lessons to Firestore
        for (const lesson of module.lessons) {
          const lessonWithMetadata = {
            ...lesson,
            module_id: module.module_id,
            course_id: course.id,
            created_at: new Date(),
            updated_at: new Date()
          };
          
          await setDoc(doc(db, 'Lessons', lesson.lesson_id), lessonWithMetadata);
          console.log(`   📖 Created lesson: ${lesson.title_tr}`);
        }
      }
    }
    
    console.log('🎉 Successfully seeded all modules and lessons!');
    
  } catch (error) {
    console.error('❌ Error seeding modules and lessons:', error);
    throw error;
  }
};

// Function to check and seed if needed (call this on app startup)
export const initializeModulesAndLessons = async (): Promise<void> => {
  try {
    const modulesSnapshot = await getDocs(collection(db, 'Modules'));
    
    if (modulesSnapshot.empty) {
      console.log('📦 No modules found, running seed...');
      await seedModulesAndLessons();
    } else {
      console.log('✅ Modules already exist in database');
    }
  } catch (error) {
    console.error('❌ Error initializing modules and lessons:', error);
  }
};