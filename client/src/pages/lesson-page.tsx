import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Target, Brain, BookOpen, ChevronLeft, CheckCircle, Play, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { EnhancedAIAssistant } from "@/components/ui/enhanced-ai-assistant";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState<'next' | 'previous' | null>(null);

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

  const handleNextLesson = async () => {
    if (lesson && !isNavigating) {
      setIsNavigating(true);
      setNavigationDirection('next');
      
      // Add a slight delay for animation effect
      setTimeout(() => {
        const nextLessonId = parseInt(lessonId!) + 1;
        setLocation(`/lessons/${nextLessonId}`);
      }, 300);
    }
  };

  const handlePreviousLesson = async () => {
    if (lesson && !isNavigating) {
      const prevLessonId = parseInt(lessonId!) - 1;
      if (prevLessonId > 0) {
        setIsNavigating(true);
        setNavigationDirection('previous');
        
        // Add a slight delay for animation effect
        setTimeout(() => {
          setLocation(`/lessons/${prevLessonId}`);
        }, 300);
      }
    }
  };

  const handleCompleteLesson = () => {
    if (lesson) {
      setIsNavigating(true);
      setTimeout(() => {
        setLocation(`/courses/${lesson.courseId}`);
      }, 200);
    }
  };

  // Reset navigation state when lesson changes
  useEffect(() => {
    setIsNavigating(false);
    setNavigationDirection(null);
  }, [lessonId]);

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

        {/* Main Content with Animated Entry */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lessonId}
            initial={{ 
              opacity: 0, 
              x: navigationDirection === 'next' ? 50 : navigationDirection === 'previous' ? -50 : 0,
              y: navigationDirection ? 0 : 20
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ 
              opacity: 0, 
              x: navigationDirection === 'next' ? -50 : navigationDirection === 'previous' ? 50 : 0
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="space-y-6"
          >
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
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <Target className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                      <span>{objective}</span>
                    </motion.li>
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
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <span>{exercise}</span>
                    </motion.li>
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
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                      <span>{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons with Animation */}
            <motion.div 
              className="flex justify-between items-center pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button 
                variant="outline" 
                onClick={handlePreviousLesson}
                disabled={isNavigating}
                className="transition-all duration-200 hover:scale-105"
              >
                {isNavigating && navigationDirection === 'previous' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ChevronLeft className="h-4 w-4 mr-2" />
                )}
                {t('previousLesson')}
              </Button>
              
              <Button 
                onClick={handleCompleteLesson}
                disabled={isNavigating}
                className="transition-all duration-200 hover:scale-105"
              >
                {t('completeLesson')}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleNextLesson}
                disabled={isNavigating}
                className="transition-all duration-200 hover:scale-105"
              >
                {t('nextLesson')}
                {isNavigating && navigationDirection === 'next' ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 ml-2" />
                )}
              </Button>
            </motion.div>

            {/* Tags */}
            {lesson.tags && lesson.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {lesson.tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* AI Study Companion for this lesson */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <EnhancedAIAssistant 
                courseId={lesson.courseId}
                lessonId={lesson.id}
                className="max-w-4xl mx-auto"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}