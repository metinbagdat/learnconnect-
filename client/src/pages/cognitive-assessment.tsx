import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, BookOpen, CheckCircle, Clock } from "lucide-react";

interface AssessmentCard {
  id: string;
  type: string;
  title: string;
  description: string;
  lastScore?: number;
  duration: number;
  icon: React.ReactNode;
}

interface TestQuestion {
  id: number;
  question: string;
  options?: string[];
  type: "memory" | "focus" | "learning_style";
}

export default function CognitiveAssessment() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const [completionPercentage, setCompletionPercentage] = useState(65);

  const assessments: AssessmentCard[] = [
    {
      id: "memory",
      type: "memory",
      title: "🧩 Memory Capacity",
      description: "Test your short-term and long-term memory capacity",
      lastScore: 85,
      duration: 10,
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: "focus",
      type: "focus",
      title: "🎯 Attention Span",
      description: "Measure your focus duration and distraction resistance",
      lastScore: 78,
      duration: 8,
      icon: <Target className="w-6 h-6" />,
    },
    {
      id: "learning_style",
      type: "learning_style",
      title: "📚 Learning Style",
      description: "Discover your optimal learning style (Visual, Auditory, Kinesthetic)",
      lastScore: undefined,
      duration: 5,
      icon: <BookOpen className="w-6 h-6" />,
    },
  ];

  const memoryQuestions: TestQuestion[] = [
    {
      id: 1,
      question: "Remember these 5 items: Apple, Book, Cloud, Diamond, Elephant",
      type: "memory",
    },
    {
      id: 2,
      question: "How many of the items do you remember?",
      type: "memory",
      options: ["1", "2", "3", "4", "5"],
    },
    {
      id: 3,
      question: "Can you recall the third item?",
      type: "memory",
      options: ["Apple", "Cloud", "Diamond", "Elephant"],
    },
  ];

  const focusQuestions: TestQuestion[] = [
    {
      id: 1,
      question: "Concentrate on the following sequence for 30 seconds",
      type: "focus",
    },
    {
      id: 2,
      question: "How many times did the letter 'A' appear?",
      type: "focus",
      options: ["3", "5", "7", "9"],
    },
  ];

  const learningStyleQuestions: TestQuestion[] = [
    {
      id: 1,
      question: "When learning something new, I prefer to:",
      type: "learning_style",
      options: [
        "See diagrams and visual representations (Visual)",
        "Listen to explanations and discussions (Auditory)",
        "Hands-on practice and experiments (Kinesthetic)",
      ],
    },
    {
      id: 2,
      question: "I learn best when I can:",
      type: "learning_style",
      options: [
        "Read and see information (Visual)",
        "Hear and discuss ideas (Auditory)",
        "Move, touch, and experience (Kinesthetic)",
      ],
    },
  ];

  const handleStartTest = (testType: string) => {
    setActiveTest(testType);
    setTestProgress(0);
  };

  const handleCompleteTest = (testType: string, score: number) => {
    setResults({ ...results, [testType]: score });
    setActiveTest(null);
    setCompletionPercentage(Math.min(100, completionPercentage + 20));
  };

  const renderTestInterface = () => {
    if (activeTest === "memory") {
      return <MemoryTest onComplete={() => handleCompleteTest("memory", 85)} />;
    } else if (activeTest === "focus") {
      return <FocusTest onComplete={() => handleCompleteTest("focus", 78)} />;
    } else if (activeTest === "learning_style") {
      return <LearningStyleTest onComplete={() => handleCompleteTest("learning_style", 90)} />;
    }
  };

  if (activeTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setActiveTest(null)}
            className="mb-4"
          >
            ← Back to Assessments
          </Button>
          {renderTestInterface()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Cognitive Performance Assessment
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Complete these assessments to personalize your learning experience and optimize your memory techniques
          </p>
        </div>

        {/* Assessment Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500 dark:hover:border-purple-400"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-purple-600 dark:text-purple-400">
                      {assessment.icon}
                    </div>
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  </div>
                  {results[assessment.id] && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <CardDescription className="mt-2">{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  {assessment.lastScore && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Last Score:</span>
                      <span className="font-bold text-slate-900 dark:text-white ml-2">
                        {assessment.lastScore}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    {assessment.duration} min
                  </div>
                </div>

                <Button
                  onClick={() => handleStartTest(assessment.id)}
                  className="w-full"
                  disabled={activeTest !== null}
                >
                  {results[assessment.id] ? "Retake Assessment" : "Start Assessment"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Profile */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Overall Cognitive Profile</CardTitle>
            <CardDescription>
              Complete assessments to build your personalized cognitive profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Profile Completion
                </span>
                <Badge variant="secondary">{completionPercentage}%</Badge>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>

            {completionPercentage >= 100 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✅ Cognitive Profile Complete!
                </h3>
                <p className="text-sm text-green-800 dark:text-green-300">
                  Your personalized learning configuration is ready. Your memory techniques and study plan are now optimized based on your cognitive profile.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assessment Results */}
        {Object.keys(results).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📈 Assessment Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(results).map(([testType, score]) => {
                  const assessment = assessments.find((a) => a.id === testType);
                  return (
                    <div
                      key={testType}
                      className="border rounded-lg p-4 text-center space-y-2"
                    >
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {assessment?.title}
                      </p>
                      <div className="text-3xl font-bold text-green-600">{score}%</div>
                      <Progress value={score} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>💡 AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Optimize Your Learning Style
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                Complete the Learning Style assessment to get personalized technique recommendations.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border-l-4 border-purple-500">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                Memory Enhancement
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-300 mt-1">
                Based on your memory capacity, we recommend spaced repetition and memory palace techniques.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Memory Test Component
function MemoryTest({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [remembered, setRemembered] = useState<string[]>([]);
  const items = ["Apple", "Book", "Cloud", "Diamond", "Elephant"];

  if (step === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memory Capacity Test - Phase 1</CardTitle>
          <CardDescription>
            Remember these 5 items for the next phase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 text-center font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
          <Button
            onClick={() => setStep(1)}
            className="w-full"
            size="lg"
          >
            I've Memorized These
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memory Capacity Test - Phase 2</CardTitle>
          <CardDescription>
            Select the items you remember
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            {items.map((item, idx) => (
              <Button
                key={idx}
                variant={remembered.includes(item) ? "default" : "outline"}
                onClick={() =>
                  setRemembered(
                    remembered.includes(item)
                      ? remembered.filter((i) => i !== item)
                      : [...remembered, item]
                  )
                }
                className="w-full justify-start"
              >
                {remembered.includes(item) && "✓ "}{item}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => {
              setStep(2);
              onComplete();
            }}
            className="w-full"
            size="lg"
          >
            Complete Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}

// Focus Test Component
function FocusTest({ onComplete }: { onComplete: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attention Span Test</CardTitle>
        <CardDescription>
          Count how many times the letter 'A' appears in the following text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 text-center font-mono text-lg leading-relaxed">
          <p>
            The quick brown fox jumps over the lazy dog. A fast algorithm analyzes data accurately.
            Amazing patterns appear across datasets. Analytics and A.I. always advance.
          </p>
        </div>
        <div className="space-y-2">
          {["3", "5", "7", "9"].map((option) => (
            <Button
              key={option}
              variant="outline"
              onClick={onComplete}
              className="w-full"
            >
              {option} occurrences
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Learning Style Test Component
function LearningStyleTest({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const questions = [
    {
      q: "When learning something new, I prefer to:",
      options: ["See diagrams and visual representations (Visual)", "Listen to explanations (Auditory)", "Hands-on practice (Kinesthetic)"],
    },
    {
      q: "I learn best when I can:",
      options: ["Read and see information (Visual)", "Hear and discuss ideas (Auditory)", "Move and experience (Kinesthetic)"],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Style Assessment</CardTitle>
        <CardDescription>
          Answer these questions to discover your optimal learning style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="space-y-3">
            <p className="font-semibold text-slate-900 dark:text-white">{q.q}</p>
            <div className="space-y-2">
              {q.options.map((option, optIdx) => (
                <Button
                  key={optIdx}
                  variant={answers[idx] === option ? "default" : "outline"}
                  onClick={() => {
                    const newAnswers = [...answers];
                    newAnswers[idx] = option;
                    setAnswers(newAnswers);
                  }}
                  className="w-full justify-start"
                >
                  {answers[idx] === option && "✓ "}{option}
                </Button>
              ))}
            </div>
          </div>
        ))}
        <Button
          onClick={onComplete}
          disabled={answers.length < questions.length}
          className="w-full"
          size="lg"
        >
          Complete Assessment
        </Button>
      </CardContent>
    </Card>
  );
}
