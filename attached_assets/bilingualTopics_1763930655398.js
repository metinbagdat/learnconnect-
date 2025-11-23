// data/bilingualTopics.js
export const BilingualTopics = {
  TYT: {
    turkish: {
      grammar: [
        {
          id: "turkish-grammar-1",
          name_en: "Word Meaning",
          name_tr: "Sözcükte Anlam",
          weight: 8,
          difficulty: "medium",
          prerequisites: [],
          learningObjectives: [
            "Understand word meanings in context",
            "Identify synonyms and antonyms",
            "Recognize word relationships"
          ]
        },
        {
          id: "turkish-grammar-2", 
          name_en: "Sentence Meaning",
          name_tr: "Cümlede Anlam",
          weight: 7,
          difficulty: "medium",
          prerequisites: ["turkish-grammar-1"],
          learningObjectives: [
            "Analyze sentence structures",
            "Understand implied meanings",
            "Identify sentence relationships"
          ]
        },
        {
          id: "turkish-grammar-3",
          name_en: "Paragraph Comprehension", 
          name_tr: "Paragraf",
          weight: 22,
          difficulty: "hard",
          prerequisites: ["turkish-grammar-1", "turkish-grammar-2"],
          learningObjectives: [
            "Extract main ideas from paragraphs",
            "Understand supporting details",
            "Make inferences from text"
          ]
        }
      ],
      vocabulary: [
        {
          id: "turkish-vocab-1",
          name_en: "Word Roots and Stems",
          name_tr: "Sözcükte Kök ve Ekler",
          weight: 4,
          difficulty: "easy",
          prerequisites: [],
          learningObjectives: [
            "Identify word roots",
            "Understand affix meanings",
            "Build vocabulary systematically"
          ]
        }
      ]
    },
    
    mathematics: {
      core: [
        {
          id: "math-core-1",
          name_en: "Basic Concepts",
          name_tr: "Temel Kavramlar",
          weight: 6,
          difficulty: "easy",
          prerequisites: [],
          learningObjectives: [
            "Understand number systems",
            "Master basic operations",
            "Solve fundamental problems"
          ]
        },
        {
          id: "math-core-2",
          name_en: "Number Digits",
          name_tr: "Sayı Basamakları", 
          weight: 3,
          difficulty: "medium",
          prerequisites: ["math-core-1"],
          learningObjectives: [
            "Understand place value",
            "Solve digit-based problems",
            "Apply digit concepts"
          ]
        }
      ],
      algebra: [
        {
          id: "math-algebra-1",
          name_en: "Rational Numbers",
          name_tr: "Rasyonel Sayılar",
          weight: 4,
          difficulty: "medium", 
          prerequisites: ["math-core-1"],
          learningObjectives: [
            "Understand rational numbers",
            "Perform operations with fractions",
            "Solve rational equations"
          ]
        }
      ]
    }
  },
  
  AYT: {
    mathematics_2: {
      advanced_algebra: [
        {
          id: "math2-algebra-1",
          name_en: "Complex Numbers",
          name_tr: "Karmaşık Sayılar",
          weight: 5,
          difficulty: "hard",
          prerequisites: ["math-algebra-1"],
          learningObjectives: [
            "Understand complex number system",
            "Perform complex operations",
            "Solve complex equations"
          ]
        }
      ],
      calculus: [
        {
          id: "math2-calculus-1",
          name_en: "Limits and Continuity",
          name_tr: "Limit ve Süreklilik",
          weight: 6,
          difficulty: "hard",
          prerequisites: ["math-algebra-1"],
          learningObjectives: [
            "Calculate limits",
            "Understand continuity",
            "Apply limit concepts"
          ]
        }
      ]
    },
    
    turkish_literature: {
      poetry: [
        {
          id: "literature-poetry-1",
          name_en: "Divan Poetry",
          name_tr: "Divan Edebiyatı",
          weight: 4,
          difficulty: "medium",
          prerequisites: [],
          learningObjectives: [
            "Understand Divan poetry structure",
            "Analyze classical poems",
            "Identify literary devices"
          ]
        }
      ]
    }
  }
};

// Helper function to get topic by ID
export const getTopicById = (topicId) => {
  const allTopics = { ...BilingualTopics.TYT, ...BilingualTopics.AYT };
  
  for (const subject in allTopics) {
    for (const category in allTopics[subject]) {
      const topic = allTopics[subject][category].find(t => t.id === topicId);
      if (topic) return topic;
    }
  }
  return null;
};

// Function to get topics by difficulty and subject
export const getTopicsByCriteria = (criteria) => {
  const { subject, difficulty, maxWeight, prerequisites } = criteria;
  const topics = [];
  
  const searchSubjects = subject ? [subject] : Object.keys(BilingualTopics.TYT).concat(Object.keys(BilingualTopics.AYT));
  
  searchSubjects.forEach(subj => {
    const subjectData = BilingualTopics.TYT[subj] || BilingualTopics.AYT[subj];
    if (!subjectData) return;
    
    Object.values(subjectData).forEach(category => {
      category.forEach(topic => {
        if (difficulty && topic.difficulty !== difficulty) return;
        if (maxWeight && topic.weight > maxWeight) return;
        if (prerequisites && !prerequisites.every(preq => topic.prerequisites.includes(preq))) return;
        
        topics.push(topic);
      });
    });
  });
  
  return topics;
};