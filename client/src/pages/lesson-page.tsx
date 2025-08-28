import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Target, Brain, BookOpen, ChevronLeft, CheckCircle, Play } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Link } from "wouter";

interface LessonData {
  id: number;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  progress: number;
  moduleTitle: string;
  courseTitle: string;
  courseId: number;
  aiContext: {
    personalizedIntro: string;
    learningObjectives: string[];
    adaptedContent: string;
    practiceExercises: string[];
    nextSteps: string[];
    difficultyReason: string;
  };
  tags: string[];
}

export default function LessonPage() {
  const { lessonId } = useParams();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: lesson, isLoading, error } = useQuery<LessonData>({
    queryKey: ['/api/lessons', lessonId, language],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}?lang=${language}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Lesson not found');
        }
        throw new Error('Failed to fetch lesson');
      }
      return response.json();
    },
    enabled: !!lessonId,
  });

  const handleNextLesson = () => {
    if (lesson) {
      // Navigate to the next lesson (increment lesson ID by 1)
      const nextLessonId = parseInt(lessonId!) + 1;
      setLocation(`/lessons/${nextLessonId}`);
    }
  };

  const handlePreviousLesson = () => {
    if (lesson) {
      // Navigate to the previous lesson (decrement lesson ID by 1)
      const prevLessonId = parseInt(lessonId!) - 1;
      if (prevLessonId > 0) {
        setLocation(`/lessons/${prevLessonId}`);
      }
    }
  };

  const handleCompleteLesson = () => {
    if (lesson) {
      // Navigate back to the course page
      setLocation(`/courses/${lesson.courseId}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    if (language === 'tr') {
      switch (difficulty) {
        case 'beginner': return 'Başlangıç';
        case 'intermediate': return 'Orta';
        case 'advanced': return 'İleri';
        default: return 'Bilinmeyen';
      }
    }
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold mb-4">
            {t('lessonNotFound')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('lessonNotFoundDescription')}
          </p>
          <Link href="/courses">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('courses')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/courses/${lesson.courseId}`}>
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('backToCourse')}
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{lesson.moduleTitle}</Badge>
            <Badge className={getDifficultyColor(lesson.difficulty)}>
              {getDifficultyText(lesson.difficulty)}
            </Badge>
          </div>
        </div>

        {/* Lesson Title and Meta */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{lesson.description}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {lesson.estimatedTime} {t('minutes')}
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {lesson.courseTitle}
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              {lesson.progress}% {t('completed')}
            </div>
          </div>

          <div className="mt-4">
            <Progress value={lesson.progress} className="w-full" />
          </div>
        </div>

        {/* AI Personalized Introduction */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Brain className="h-5 w-5 mr-2" />
              {t('personalizedIntro')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">{lesson.aiContext.personalizedIntro}</p>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>{t('learningObjectives')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.aiContext.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>{t('lessonContent')}</CardTitle>
            <CardDescription>{lesson.aiContext.difficultyReason}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <p>{lesson.content}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3">
                {t('aiAdaptedContent')}
              </h4>
              <p className="text-gray-700">{lesson.aiContext.adaptedContent}</p>
            </div>
          </CardContent>
        </Card>

        {/* Practice Exercises */}
        <Card>
          <CardHeader>
            <CardTitle>{t('practiceExercises')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {lesson.aiContext.practiceExercises.map((exercise, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <span>{exercise}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{t('nextSteps')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.aiContext.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={handlePreviousLesson}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('previousLesson')}
          </Button>
          
          <Button onClick={handleCompleteLesson}>
            {t('completeLesson')}
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
          
          <Button variant="outline" onClick={handleNextLesson}>
            {t('nextLesson')}
            <Play className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Tags */}
        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {lesson.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}