import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, Brain, BarChart3, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { apiRequest } from "@/lib/queryClient";
import UpgradePrompt from "@/components/subscription/upgrade-prompt";

interface Question {
  id: number;
  questionNumber: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'open_ended';
  options: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skillArea: string;
  correctAnswer?: string;
  explanation?: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

interface Assessment {
  id: number;
  subject: string;
  subCategory?: string;
  totalQuestions: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  language: string;
  createdAt: string;
}

interface AssessmentResult {
  finalLevel: 'beginner' | 'intermediate' | 'advanced';
  confidenceScore: number;
  recommendedNextSteps: string[];
  strongAreas: string[];
  weakAreas: string[];
}

interface LevelAssessmentProps {
  subject: string;
  subCategory?: string;
  onComplete?: (result: AssessmentResult) => void;
  onCancel?: () => void;
}

export default function LevelAssessment({ subject, subCategory, onComplete, onCancel }: LevelAssessmentProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [limitError, setLimitError] = useState<{message: string; limit: number; used: number} | null>(null);

  // Create assessment on component mount
  useEffect(() => {
    createAssessment();
  }, []);

  // Track time spent on current question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const createAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/assessments', {
        subject,
        subCategory,
        language
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 429) {
          // Daily limit reached
          setLimitError(data);
          setShowUpgradePrompt(true);
          return;
        }
        throw new Error(data.message || 'Failed to create assessment');
      }
      
      const { assessmentId } = await response.json();
      await loadAssessment(assessmentId);
    } catch (error: any) {
      console.error('Error creating assessment:', error);
      
      // Check if it's a limit error
      if (error.response?.status === 429 || error.status === 429) {
        const errorData = error.response?.data || error;
        setLimitError(errorData);
        setShowUpgradePrompt(true);
        return;
      }
      
      toast({
        title: t('error'),
        description: language === 'tr' 
          ? 'Değerlendirme oluşturulamadı. Lütfen tekrar deneyin.'
          : 'Failed to create assessment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssessment = async (assessmentId: number) => {
    try {
      const response = await apiRequest('GET', `/api/assessments/${assessmentId}`);
      const data = await response.json();
      setAssessment(data.assessment);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error loading assessment:', error);
      toast({
        title: t('error'),
        description: language === 'tr'
          ? 'Değerlendirme yüklenemedi.'
          : 'Failed to load assessment.',
        variant: 'destructive'
      });
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Record time spent on this question
    const timeSpentOnQuestion = Date.now() - questionStartTime;
    setTimeSpent(prev => ({
      ...prev,
      [questionId]: timeSpentOnQuestion
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeAssessment = async () => {
    if (!assessment) return;

    try {
      setIsSubmitting(true);
      
      // Prepare answers for submission
      const submissionAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer,
        timeSpent: Math.round((timeSpent[parseInt(questionId)] || 0) / 1000) // Convert to seconds
      }));

      const response = await apiRequest('POST', `/api/assessments/${assessment.id}/complete`, {
        answers: submissionAnswers,
        language
      });

      const result = await response.json();
      setResults(result);
      setShowResults(true);
      
      toast({
        title: language === 'tr' ? 'Değerlendirme Tamamlandı!' : 'Assessment Completed!',
        description: language === 'tr'
          ? 'Seviye değerlendirmeniz başarıyla tamamlandı.'
          : 'Your level assessment has been completed successfully.'
      });

      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: t('error'),
        description: language === 'tr'
          ? 'Değerlendirme tamamlanamadı. Lütfen tekrar deneyin.'
          : 'Failed to complete assessment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">
              {language === 'tr' ? 'Değerlendirme hazırlanıyor...' : 'Preparing assessment...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults && results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">
              {language === 'tr' ? 'Değerlendirme Tamamlandı!' : 'Assessment Completed!'}
            </CardTitle>
            <CardDescription>
              {language === 'tr' ? 'İşte seviye değerlendirme sonuçlarınız' : 'Here are your level assessment results'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Level Result */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 text-lg font-semibold ${getLevelBadgeColor(results.finalLevel)}`}>
                <Brain className="w-5 h-5 mr-2" />
                {language === 'tr' 
                  ? `${results.finalLevel === 'beginner' ? 'Başlangıç' : results.finalLevel === 'intermediate' ? 'Orta' : 'İleri'} Seviye`
                  : `${results.finalLevel.charAt(0).toUpperCase() + results.finalLevel.slice(1)} Level`
                }
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {language === 'tr' ? 'Güven Skoru' : 'Confidence Score'}: {results.confidenceScore}%
              </p>
            </div>

            {/* Strong Areas */}
            {results.strongAreas.length > 0 && (
              <div>
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {language === 'tr' ? 'Güçlü Alanlarınız' : 'Your Strong Areas'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.strongAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Areas */}
            {results.weakAreas.length > 0 && (
              <div>
                <h3 className="font-semibold text-orange-700 mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {language === 'tr' ? 'Gelişim Alanları' : 'Areas for Improvement'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.weakAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendedNextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">
                  {language === 'tr' ? 'Öneriler' : 'Recommendations'}
                </h3>
                <ul className="space-y-2">
                  {results.recommendedNextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => window.location.href = '/study-planner'}
                className="flex-1"
              >
                {language === 'tr' ? 'Öğrenme Planlayıcısına Git' : 'Go to Study Planner'}
              </Button>
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  {language === 'tr' ? 'Kapat' : 'Close'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">
            {language === 'tr' ? 'Değerlendirme bulunamadı.' : 'Assessment not found.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;
  const allQuestionsAnswered = answeredQuestions === questions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                {language === 'tr' ? 'Seviye Değerlendirmesi' : 'Level Assessment'}
              </CardTitle>
              <CardDescription>
                {subject} {subCategory && `- ${subCategory}`}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {language === 'tr' ? 'Soru' : 'Question'} {currentQuestionIndex + 1} / {questions.length}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'tr' ? 'Yanıtlanan' : 'Answered'}: {answeredQuestions}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{currentQuestion.questionText}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {language === 'tr' 
                        ? currentQuestion.difficulty === 'beginner' ? 'Başlangıç' : currentQuestion.difficulty === 'intermediate' ? 'Orta' : 'İleri'
                        : currentQuestion.difficulty
                      }
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {currentQuestion.skillArea}
                    </span>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {currentQuestion.questionType === 'multiple_choice' && (
                <RadioGroup 
                  value={answers[currentQuestion.id] || ""} 
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'tr' ? 'Önceki' : 'Previous'}
            </Button>

            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  {language === 'tr' ? 'İptal' : 'Cancel'}
                </Button>
              )}
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={completeAssessment}
                  disabled={!allQuestionsAnswered || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting 
                    ? (language === 'tr' ? 'Tamamlanıyor...' : 'Completing...')
                    : (language === 'tr' ? 'Değerlendirmeyi Tamamla' : 'Complete Assessment')
                  }
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                  disabled={!answers[currentQuestion.id]}
                >
                  {language === 'tr' ? 'Sonraki' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      <UpgradePrompt
        open={showUpgradePrompt}
        onOpenChange={setShowUpgradePrompt}
        title={limitError?.message || t('limitReached')}
        description={
          limitError
            ? `${t('assessmentsUsed')}: ${limitError.used}/${limitError.limit}. ${t('limitReachedDesc')}`
            : t('limitReachedDesc')
        }
      />
    </div>
  );
}