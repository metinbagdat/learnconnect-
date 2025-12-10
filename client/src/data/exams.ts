export type Locale = "en" | "tr";

export interface ExamUnit {
  id: string;
  title: Record<Locale, string>;
}

export interface ExamLesson {
  id: string;
  title: Record<Locale, string>;
  units: ExamUnit[];
}

export interface ExamCategory {
  id: "LGS" | "TYT" | "AYT";
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  lessons: ExamLesson[];
}

// Stubbed curriculum tree (placeholders) – sourced structure aligned to MEB (odsgm.meb.gov.tr, ogm.meb.gov.tr, meb.gov.tr)
export const examCategories: ExamCategory[] = [
  {
    id: "LGS",
    title: { en: "LGS (High School Entrance)", tr: "LGS (Lise Giriş)" },
    description: {
      en: "Middle school curriculum mapped to LGS objectives.",
      tr: "LGS hedeflerine uyumlu ortaokul müfredatı.",
    },
    lessons: [
      {
        id: "lgs-turkish",
        title: { en: "Turkish", tr: "Türkçe" },
        units: [
          { id: "lgs-turkish-reading", title: { en: "Reading & Comprehension", tr: "Okuma ve Anlama" } },
          { id: "lgs-turkish-grammar", title: { en: "Grammar Essentials", tr: "Dil Bilgisi" } },
        ],
      },
      {
        id: "lgs-math",
        title: { en: "Mathematics", tr: "Matematik" },
        units: [
          { id: "lgs-math-numbers", title: { en: "Numbers & Operations", tr: "Sayılar ve İşlemler" } },
          { id: "lgs-math-algebra", title: { en: "Algebra Basics", tr: "Cebire Giriş" } },
          { id: "lgs-math-geometry", title: { en: "Geometry Basics", tr: "Geometriye Giriş" } },
        ],
      },
      {
        id: "lgs-science",
        title: { en: "Science", tr: "Fen Bilimleri" },
        units: [
          { id: "lgs-science-physics", title: { en: "Physics Foundations", tr: "Fizik Temelleri" } },
          { id: "lgs-science-chemistry", title: { en: "Chemistry Basics", tr: "Kimya Temelleri" } },
          { id: "lgs-science-biology", title: { en: "Biology Basics", tr: "Biyoloji Temelleri" } },
        ],
      },
    ],
  },
  {
    id: "TYT",
    title: { en: "TYT (University Entrance)", tr: "TYT (YKS 1. Oturum)" },
    description: {
      en: "Core competencies for the first stage of university exams.",
      tr: "Üniversite sınavı birinci oturum temel yeterlilikleri.",
    },
    lessons: [
      {
        id: "tyt-turkish",
        title: { en: "Turkish", tr: "Türkçe" },
        units: [
          { id: "tyt-turkish-paragraph", title: { en: "Paragraph & Meaning", tr: "Paragraf ve Anlam" } },
          { id: "tyt-turkish-grammar", title: { en: "Grammar & Expression", tr: "Dil Bilgisi ve Anlatım" } },
        ],
      },
      {
        id: "tyt-math",
        title: { en: "Mathematics", tr: "Matematik" },
        units: [
          { id: "tyt-math-basics", title: { en: "Numbers & Fundamentals", tr: "Sayılar ve Temel Kavramlar" } },
          { id: "tyt-math-problems", title: { en: "Problem Solving", tr: "Problem Çözme" } },
          { id: "tyt-math-geometry", title: { en: "Geometry Essentials", tr: "Geometri Temelleri" } },
        ],
      },
      {
        id: "tyt-science",
        title: { en: "Science", tr: "Fen Bilimleri" },
        units: [
          { id: "tyt-science-physics", title: { en: "Physics Basics", tr: "Fizik Temelleri" } },
          { id: "tyt-science-chemistry", title: { en: "Chemistry Basics", tr: "Kimya Temelleri" } },
          { id: "tyt-science-biology", title: { en: "Biology Basics", tr: "Biyoloji Temelleri" } },
        ],
      },
      {
        id: "tyt-social",
        title: { en: "Social Sciences", tr: "Sosyal Bilimler" },
        units: [
          { id: "tyt-social-history", title: { en: "History Basics", tr: "Tarih Temelleri" } },
          { id: "tyt-social-geography", title: { en: "Geography Basics", tr: "Coğrafya Temelleri" } },
          { id: "tyt-social-philosophy", title: { en: "Philosophy Intro", tr: "Felsefeye Giriş" } },
        ],
      },
    ],
  },
  {
    id: "AYT",
    title: { en: "AYT (Advanced Placement)", tr: "AYT (YKS 2. Oturum)" },
    description: {
      en: "Advanced subject depth for the second stage of university exams.",
      tr: "Üniversite sınavı ikinci oturum için ileri seviye konular.",
    },
    lessons: [
      {
        id: "ayt-math",
        title: { en: "Mathematics", tr: "Matematik" },
        units: [
          { id: "ayt-math-advanced-algebra", title: { en: "Advanced Algebra", tr: "İleri Cebir" } },
          { id: "ayt-math-calculus", title: { en: "Calculus & Limits", tr: "Analiz / Limit ve Türev" } },
          { id: "ayt-math-geometry", title: { en: "Advanced Geometry", tr: "İleri Geometri" } },
        ],
      },
      {
        id: "ayt-physics",
        title: { en: "Physics", tr: "Fizik" },
        units: [
          { id: "ayt-physics-mechanics", title: { en: "Mechanics", tr: "Mekanik" } },
          { id: "ayt-physics-electromagnetism", title: { en: "Electromagnetism", tr: "Elektromanyetizma" } },
          { id: "ayt-physics-modern", title: { en: "Modern Physics", tr: "Modern Fizik" } },
        ],
      },
      {
        id: "ayt-chemistry",
        title: { en: "Chemistry", tr: "Kimya" },
        units: [
          { id: "ayt-chemistry-organic", title: { en: "Organic Chemistry", tr: "Organik Kimya" } },
          { id: "ayt-chemistry-thermo", title: { en: "Thermochemistry", tr: "Termokimya" } },
          { id: "ayt-chemistry-chemical-bonds", title: { en: "Chemical Bonds", tr: "Kimyasal Bağlar" } },
        ],
      },
      {
        id: "ayt-biology",
        title: { en: "Biology", tr: "Biyoloji" },
        units: [
          { id: "ayt-bio-genetics", title: { en: "Genetics", tr: "Genetik" } },
          { id: "ayt-bio-ecology", title: { en: "Ecology", tr: "Ekoloji" } },
          { id: "ayt-bio-systems", title: { en: "Human Systems", tr: "İnsan Sistemleri" } },
        ],
      },
    ],
  },
];

