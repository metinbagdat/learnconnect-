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
          prerequisites: [],
          learningObjectives: [
            "Understand complex number system",
            "Perform complex operations",
            "Solve complex equations"
          ]
        }
      ]
    }
  }
};

export const getTopicById = (topicId: string) => {
  const allTopics = { ...BilingualTopics.TYT, ...BilingualTopics.AYT };
  
  for (const subject in allTopics) {
    for (const category in (allTopics as any)[subject]) {
      const topic = (allTopics as any)[subject][category].find((t: any) => t.id === topicId);
      if (topic) return topic;
    }
  }
  return null;
};

export const getTopicsByCriteria = (criteria: { subject?: string; difficulty?: string; maxWeight?: number; prerequisites?: string[] }) => {
  const topics: any[] = [];
  const { subject, difficulty, maxWeight, prerequisites } = criteria;
  
  const searchSubjects = subject ? [subject] : Object.keys(BilingualTopics.TYT).concat(Object.keys(BilingualTopics.AYT));
  
  searchSubjects.forEach(subj => {
    const subjectData = (BilingualTopics.TYT as any)[subj] || (BilingualTopics.AYT as any)[subj];
    if (!subjectData) return;
    
    Object.values(subjectData).forEach((category: any) => {
      category.forEach((topic: any) => {
        if (difficulty && topic.difficulty !== difficulty) return;
        if (maxWeight && topic.weight > maxWeight) return;
        if (prerequisites && !prerequisites.every((preq: string) => topic.prerequisites.includes(preq))) return;
        
        topics.push(topic);
      });
    });
  });
  
  return topics;
};
