// Step 2.1: Memory Technique Integration System
// Applies appropriate memory techniques to course content based on user profile

export interface ContentAnalysis {
  contentType: string; // formula, timeline, narrative, list, concept, definition
  complexity: number; // 1-10 scale
  memorizationLevel: "low" | "medium" | "high";
  keyTerms: string[];
  suggestedTechniques: string[];
}

export interface UserProfile {
  learningStyle: string;
  preferredTechniques: string[];
  techniqueEffectiveness: Record<string, number>;
  performanceLevel: number;
}

export class ContentAnalyzer {
  /**
   * Analyze content to determine optimal memory technique
   */
  analyzeContent(content: string): ContentAnalysis {
    const lines = content.split("\n");
    const keyTerms = this._extractKeyTerms(content);
    
    // Detect content type
    let contentType = "concept";
    if (content.includes("=") || content.match(/\d+\s*[+\-*/]/)) {
      contentType = "formula";
    } else if (content.match(/\d{4}|BC|AD|century|year/i)) {
      contentType = "timeline";
    } else if (content.match(/^-|^•|^1\.|^2\.|^3\./m)) {
      contentType = "list";
    } else if (content.length > 500) {
      contentType = "narrative";
    }

    const complexity = this._calculateComplexity(content);
    const memorizationLevel = complexity > 7 ? "high" : complexity > 4 ? "medium" : "low";

    const suggestedTechniques = this._suggestTechniques(contentType, complexity);

    return {
      contentType,
      complexity,
      memorizationLevel,
      keyTerms,
      suggestedTechniques,
    };
  }

  private _extractKeyTerms(content: string): string[] {
    // Extract capitalized terms and key phrases
    const matches = content.match(
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g
    ) || [];
    return Array.from(new Set(matches)).slice(0, 5);
  }

  private _calculateComplexity(content: string): number {
    let score = 0;
    
    // Length factor
    score += Math.min(content.length / 100, 3);
    
    // Technical terms
    score += (content.match(/[=+\-*/^]/g) || []).length;
    
    // Complex vocabulary
    score += (content.match(/[a-z]{8,}/g) || []).length * 0.1;
    
    return Math.min(10, score);
  }

  private _suggestTechniques(contentType: string, complexity: number): string[] {
    const techniques: Record<string, string[]> = {
      formula: ["chunking", "pattern_recognition", "visual_representation"],
      timeline: ["method_of_loci", "story_method", "chronological_linking"],
      list: ["acronym_creation", "chunking", "peg_system"],
      narrative: ["story_method", "active_recall", "elaboration"],
      concept: ["conceptual_mapping", "memory_palace", "association"],
      definition: ["acronym", "mnemonic", "visual_association"],
    };

    let suggested = techniques[contentType] || techniques.concept;
    
    if (complexity > 7) {
      suggested.push("spaced_repetition");
    }

    return suggested;
  }
}

export class TechniqueMapper {
  /**
   * Map techniques to specific implementations
   */
  mapTechnique(
    technique: string,
    content: string,
    keyTerms: string[]
  ): {
    enhancedContent: string;
    technique: string;
    implementation: string;
  } {
    let enhancedContent = content;
    let implementation = "";

    switch (technique) {
      case "acronym_creation":
        enhancedContent = this._createAcronym(keyTerms);
        implementation = "Created mnemonic acronym from key terms";
        break;

      case "method_of_loci":
        enhancedContent = this._buildMemoryPalace(keyTerms);
        implementation = "Organized content in memory palace chambers";
        break;

      case "story_method":
        enhancedContent = this._createStory(keyTerms);
        implementation = "Created narrative linking all key concepts";
        break;

      case "chunking":
        enhancedContent = this._chunkContent(content);
        implementation = "Chunked content into memorable segments";
        break;

      case "pattern_recognition":
        enhancedContent = this._identifyPatterns(content);
        implementation = "Highlighted repeating patterns and structures";
        break;

      case "peg_system":
        enhancedContent = this._createPegSystem(keyTerms);
        implementation = "Created peg system for memorization";
        break;

      case "active_recall":
        enhancedContent = this._generateRecallQuestions(content);
        implementation = "Generated recall questions for self-testing";
        break;

      case "visual_representation":
        enhancedContent = this._createVisualGuide(content);
        implementation = "Created visual representation structure";
        break;

      default:
        implementation = "Standard content - consider memory techniques";
    }

    return {
      enhancedContent,
      technique,
      implementation,
    };
  }

  private _createAcronym(terms: string[]): string {
    const acronym = terms.map((t) => t[0]).join("");
    return `Memory Aid - Acronym: ${acronym}\n\nKey Terms: ${terms.join(", ")}`;
  }

  private _buildMemoryPalace(terms: string[]): string {
    const rooms = Math.ceil(terms.length / 3);
    let palace = "Memory Palace Structure:\n";

    for (let i = 0; i < rooms; i++) {
      palace += `\nChamber ${i + 1}:\n`;
      const startIdx = i * 3;
      terms.slice(startIdx, startIdx + 3).forEach((term, idx) => {
        palace += `  Position ${idx + 1}: ${term}\n`;
      });
    }

    return palace;
  }

  private _createStory(terms: string[]): string {
    let story =
      "Narrative Connection:\nCreate a vivid story linking these concepts:\n";
    story += terms.map((t, i) => `${i + 1}. ${t}`).join(" → ");
    story +=
      "\n\nImagine a dramatic scenario connecting all these elements together.";
    return story;
  }

  private _chunkContent(content: string): string {
    const chunks = content.match(/.{1,100}(?:\s|$)/g) || [];
    return "Chunked Content:\n" + chunks.map((c, i) => `[Chunk ${i + 1}]: ${c.trim()}`).join("\n\n");
  }

  private _identifyPatterns(content: string): string {
    let patterns = "Pattern Recognition Guide:\n";
    patterns += "- Repetition: Words/concepts that appear multiple times\n";
    patterns += "- Similarity: Concepts that share characteristics\n";
    patterns += "- Sequence: Ideas that follow a logical progression\n";
    patterns += "- Contrast: Opposing or complementary concepts\n";
    patterns += "\nUse these patterns to build memory connections.";
    return patterns;
  }

  private _createPegSystem(terms: string[]): string {
    const numbers = ["One", "Two", "Three", "Four", "Five"];
    let pegs = "Peg System Memory Aid:\n";

    terms.forEach((term, idx) => {
      if (idx < 5) {
        pegs += `${numbers[idx]}: ${term}\n`;
      }
    });

    pegs +=
      "\nLink each number with the term using vivid mental images or associations.";
    return pegs;
  }

  private _generateRecallQuestions(content: string): string {
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    let questions = "Active Recall Questions:\n\n";

    sentences.slice(0, 3).forEach((sentence, idx) => {
      const keywords = sentence.match(/\b[A-Z][a-z]+\b/g) || [];
      if (keywords.length > 0) {
        questions += `Q${idx + 1}: What is the relationship between ${keywords[0]} and the concepts?`;
        questions += `\n(Answer: Review the original content)\n\n`;
      }
    });

    return questions;
  }

  private _createVisualGuide(content: string): string {
    return `Visual Representation Guide:\n\nMain Concept: [Central Hub]\n├─ Sub-concept 1: [Branch]\n├─ Sub-concept 2: [Branch]\n└─ Sub-concept 3: [Branch]\n\nConnect visual elements with relationships and hierarchy from the content.`;
  }
}

export class MemoryTechniqueIntegrator {
  private contentAnalyzer: ContentAnalyzer;
  private techniqueMapper: TechniqueMapper;

  constructor() {
    this.contentAnalyzer = new ContentAnalyzer();
    this.techniqueMapper = new TechniqueMapper();
  }

  /**
   * Apply memory techniques to course content
   */
  applyMemoryTechniquesToCourse(
    courseContent: {
      modules: Array<{
        lessons: Array<{ id: number; title: string; content: string }>;
      }>;
    },
    userProfile: UserProfile
  ): Record<
    number,
    {
      technique: string;
      originalContent: string;
      enhancedContent: string;
      expectedImprovement: number;
      implementation: string;
    }
  > {
    const techniquesApplied: Record<
      number,
      {
        technique: string;
        originalContent: string;
        enhancedContent: string;
        expectedImprovement: number;
        implementation: string;
      }
    > = {};

    courseContent.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        const contentAnalysis = this.contentAnalyzer.analyzeContent(
          lesson.content
        );
        const bestTechnique = this._selectBestTechnique(
          contentAnalysis,
          userProfile
        );
        const mapped = this.techniqueMapper.mapTechnique(
          bestTechnique,
          lesson.content,
          contentAnalysis.keyTerms
        );

        techniquesApplied[lesson.id] = {
          technique: bestTechnique,
          originalContent: lesson.content,
          enhancedContent: mapped.enhancedContent,
          expectedImprovement: this._predictImprovement(
            bestTechnique,
            contentAnalysis,
            userProfile
          ),
          implementation: mapped.implementation,
        };
      });
    });

    return techniquesApplied;
  }

  /**
   * Apply technique to specific content
   */
  applyTechniqueToContent(
    content: string,
    technique: string,
    userProfile: UserProfile
  ): {
    enhancedContent: string;
    expectedImprovement: number;
    technique: string;
  } {
    const analysis = this.contentAnalyzer.analyzeContent(content);
    const mapped = this.techniqueMapper.mapTechnique(
      technique,
      content,
      analysis.keyTerms
    );

    return {
      enhancedContent: mapped.enhancedContent,
      expectedImprovement: this._predictImprovement(
        technique,
        analysis,
        userProfile
      ),
      technique,
    };
  }

  /**
   * Select best technique for content and user
   */
  private _selectBestTechnique(
    contentAnalysis: ContentAnalysis,
    userProfile: UserProfile
  ): string {
    const techniqueScores: Record<string, number> = {};

    // Consider user's preferred techniques
    const candidateTechniques = [
      ...userProfile.preferredTechniques,
      ...contentAnalysis.suggestedTechniques,
    ];

    const uniqueTechniques = Array.from(new Set(candidateTechniques));

    uniqueTechniques.forEach((technique) => {
      const userEffectiveness =
        userProfile.techniqueEffectiveness[technique] || 0.5;
      const contentSuitability = this._calculateContentSuitability(
        technique,
        contentAnalysis
      );

      // Weighted score: 60% user effectiveness, 40% content suitability
      techniqueScores[technique] =
        userEffectiveness * 0.6 + contentSuitability * 0.4;
    });

    const bestTechnique = Object.entries(techniqueScores).reduce((prev, curr) =>
      curr[1] > prev[1] ? curr : prev
    );

    return bestTechnique[0] || "active_recall";
  }

  /**
   * Calculate how suitable a technique is for content
   */
  private _calculateContentSuitability(
    technique: string,
    analysis: ContentAnalysis
  ): number {
    const suitabilityMap: Record<string, Record<string, number>> = {
      formula: {
        pattern_recognition: 0.9,
        chunking: 0.8,
        visual_representation: 0.85,
        acronym_creation: 0.5,
      },
      timeline: {
        method_of_loci: 0.9,
        story_method: 0.85,
        chronological_linking: 0.95,
        acronym_creation: 0.6,
      },
      list: {
        acronym_creation: 0.95,
        chunking: 0.8,
        peg_system: 0.9,
        memory_palace: 0.75,
      },
      narrative: {
        story_method: 0.95,
        active_recall: 0.85,
        elaboration: 0.8,
        memory_palace: 0.7,
      },
      concept: {
        memory_palace: 0.9,
        conceptual_mapping: 0.85,
        pattern_recognition: 0.8,
        active_recall: 0.75,
      },
      definition: {
        acronym_creation: 0.9,
        mnemonic: 0.95,
        visual_association: 0.8,
        active_recall: 0.75,
      },
    };

    return (
      suitabilityMap[analysis.contentType]?.[technique] ||
      suitabilityMap.concept[technique] ||
      0.5
    );
  }

  /**
   * Predict improvement with technique
   */
  private _predictImprovement(
    technique: string,
    analysis: ContentAnalysis,
    userProfile: UserProfile
  ): number {
    let baseImprovement = 0.2; // 20% base improvement

    // Factor 1: Content complexity (more complex = more improvement potential)
    baseImprovement += (analysis.complexity / 10) * 0.3;

    // Factor 2: User's effectiveness with technique
    const userEffectiveness =
      userProfile.techniqueEffectiveness[technique] || 0.5;
    baseImprovement += userEffectiveness * 0.25;

    // Factor 3: Content suitability
    const suitability = this._calculateContentSuitability(technique, analysis);
    baseImprovement += suitability * 0.25;

    return Math.min(0.8, baseImprovement); // Cap at 80% improvement
  }
}
