import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Target, Brain, TrendingUp, Users, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PageWrapper from "@/components/layout/page-wrapper";

interface StudyGoal {
  id?: number;
  userId: number;
  goalType: 'exam_prep' | 'skill_development' | 'course_completion' | 'general_learning';
  targetExam?: string;
  targetDate: string;
  studyHoursPerWeek: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  subjects: string[];
  currentProgress: number;
  createdAt?: string;
}

interface StudySchedule {
  id?: number;
  userId: number;
  goalId: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  subject: string;
  lessonId?: number;
  isCompleted: boolean;
  scheduledDate: string;
}

interface LearningRecommendation {
  type: 'schedule_optimization' | 'study_method' | 'goal_adjustment';
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function StudyPlannerPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'goals' | 'schedule' | 'progress'>('goals');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    goalType: 'exam_prep',
    studyHoursPerWeek: 10,
    priority: 'medium',
    subjects: [],
    currentProgress: 0
  });

  // Fetch user's study goals
  const { data: studyGoals, isLoading: goalsLoading } = useQuery<StudyGoal[]>({
    queryKey: ['/api/study-goals'],
    queryFn: async () => {
      const response = await fetch('/api/study-goals');
      if (!response.ok) throw new Error('Failed to fetch study goals');
      return response.json();
    }
  });

  // Fetch user's study schedule
  const { data: studySchedule, isLoading: scheduleLoading } = useQuery<StudySchedule[]>({
    queryKey: ['/api/study-schedule'],
    queryFn: async () => {
      const response = await fetch('/api/study-schedule');
      if (!response.ok) throw new Error('Failed to fetch study schedule');
      return response.json();
    }
  });

  // Fetch AI recommendations
  const { data: recommendations } = useQuery<LearningRecommendation[]>({
    queryKey: ['/api/learning-recommendations'],
    queryFn: async () => {
      const response = await fetch('/api/learning-recommendations');
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    }
  });

  // Create study goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goal: Partial<StudyGoal>) => {
      return apiRequest('POST', '/api/study-goals', goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/study-goals'] });
      setShowGoalForm(false);
      setNewGoal({
        goalType: 'exam_prep',
        studyHoursPerWeek: 10,
        priority: 'medium',
        subjects: [],
        currentProgress: 0
      });
      toast({
        title: t('goalCreated'),
        description: t('goalCreatedSuccessfully')
      });
    }
  });

  // Generate AI study plan
  const generatePlanMutation = useMutation({
    mutationFn: async (goalId: number) => {
      return apiRequest('POST', `/api/study-goals/${goalId}/generate-plan`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/study-schedule'] });
      toast({
        title: t('planGenerated'),
        description: t('aiStudyPlanGenerated')
      });
    }
  });

  const handleCreateGoal = () => {
    if (!newGoal.targetDate || !newGoal.subjects?.length) {
      toast({
        title: t('incompleteForm'),
        description: t('fillAllRequiredFields'),
        variant: 'destructive'
      });
      return;
    }
    createGoalMutation.mutate(newGoal);
  };

  const getGoalTypeText = (type: string) => {
    const types: Record<string, string> = {
      exam_prep: language === 'tr' ? 'Sınav Hazırlığı' : 'Exam Preparation',
      skill_development: language === 'tr' ? 'Beceri Geliştirme' : 'Skill Development',
      course_completion: language === 'tr' ? 'Kurs Tamamlama' : 'Course Completion',
      general_learning: language === 'tr' ? 'Genel Öğrenme' : 'General Learning'
    };
    return types[type] || type;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <PageWrapper 
      currentPage={language === 'tr' ? 'Öğrenme Planlayıcısı' : 'Study Planner'}
      pageTitle={language === 'tr' ? 'Kişisel Öğrenme Planlayıcısı' : 'Personal Learning Planner'}
      showBackButton={true}
      backUrl="/"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            {language === 'tr' ? 'Kişisel Öğrenme Planlayıcısı' : 'Personal Learning Planner'}
          </h1>
          <p className="text-gray-600">
            {language === 'tr' 
              ? 'Hedeflerinizi belirleyin, kişiselleştirilmiş program alın ve ilerlemenizi takip edin'
              : 'Set your goals, get personalized schedules, and track your progress'
            }
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{studyGoals?.length || 0}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Aktif Hedef' : 'Active Goals'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{studySchedule?.length || 0}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Planlı Oturum' : 'Scheduled Sessions'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {studyGoals?.reduce((sum, goal) => sum + goal.studyHoursPerWeek, 0) || 0}h
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Haftalık Hedef' : 'Weekly Target'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {studyGoals?.length ? Math.round(studyGoals.reduce((sum, goal) => sum + goal.currentProgress, 0) / studyGoals.length) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Ortalama İlerleme' : 'Average Progress'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { id: 'goals', label: language === 'tr' ? 'Hedeflerim' : 'My Goals', icon: Target },
            { id: 'schedule', label: language === 'tr' ? 'Program' : 'Schedule', icon: Calendar },
            { id: 'progress', label: language === 'tr' ? 'İlerleme' : 'Progress', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <div className="space-y-6">
                {/* Create Goal Button */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {language === 'tr' ? 'Öğrenme Hedefleriniz' : 'Your Learning Goals'}
                  </h2>
                  <Button onClick={() => setShowGoalForm(true)}>
                    <Target className="h-4 w-4 mr-2" />
                    {language === 'tr' ? 'Yeni Hedef' : 'New Goal'}
                  </Button>
                </div>

                {/* Goal Creation Form */}
                {showGoalForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'tr' ? 'Yeni Öğrenme Hedefi Oluştur' : 'Create New Learning Goal'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{language === 'tr' ? 'Hedef Türü' : 'Goal Type'}</Label>
                          <Select 
                            value={newGoal.goalType} 
                            onValueChange={(value) => setNewGoal({...newGoal, goalType: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exam_prep">
                                {language === 'tr' ? 'Sınav Hazırlığı' : 'Exam Preparation'}
                              </SelectItem>
                              <SelectItem value="skill_development">
                                {language === 'tr' ? 'Beceri Geliştirme' : 'Skill Development'}
                              </SelectItem>
                              <SelectItem value="course_completion">
                                {language === 'tr' ? 'Kurs Tamamlama' : 'Course Completion'}
                              </SelectItem>
                              <SelectItem value="general_learning">
                                {language === 'tr' ? 'Genel Öğrenme' : 'General Learning'}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>{language === 'tr' ? 'Öncelik' : 'Priority'}</Label>
                          <Select 
                            value={newGoal.priority} 
                            onValueChange={(value) => setNewGoal({...newGoal, priority: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">{language === 'tr' ? 'Yüksek' : 'High'}</SelectItem>
                              <SelectItem value="medium">{language === 'tr' ? 'Orta' : 'Medium'}</SelectItem>
                              <SelectItem value="low">{language === 'tr' ? 'Düşük' : 'Low'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>{language === 'tr' ? 'Hedef Tarih' : 'Target Date'}</Label>
                          <Input
                            type="date"
                            value={newGoal.targetDate}
                            onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label>{language === 'tr' ? 'Haftalık Çalışma Saati' : 'Weekly Study Hours'}</Label>
                          <Input
                            type="number"
                            min="1"
                            max="40"
                            value={newGoal.studyHoursPerWeek}
                            onChange={(e) => setNewGoal({...newGoal, studyHoursPerWeek: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>{language === 'tr' ? 'Hedef Sınav (opsiyonel)' : 'Target Exam (optional)'}</Label>
                        <Input
                          placeholder={language === 'tr' ? 'YKS, ALES, DGS vb.' : 'SAT, GMAT, GRE etc.'}
                          value={newGoal.targetExam || ''}
                          onChange={(e) => setNewGoal({...newGoal, targetExam: e.target.value})}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleCreateGoal} disabled={createGoalMutation.isPending}>
                          {createGoalMutation.isPending ? 
                            (language === 'tr' ? 'Oluşturuluyor...' : 'Creating...') :
                            (language === 'tr' ? 'Hedef Oluştur' : 'Create Goal')
                          }
                        </Button>
                        <Button variant="outline" onClick={() => setShowGoalForm(false)}>
                          {language === 'tr' ? 'İptal' : 'Cancel'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Goals List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studyGoals?.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{getGoalTypeText(goal.goalType)}</CardTitle>
                              {goal.targetExam && (
                                <CardDescription>{goal.targetExam}</CardDescription>
                              )}
                            </div>
                            <Badge className={getPriorityColor(goal.priority)}>
                              {language === 'tr' ? 
                                (goal.priority === 'high' ? 'Yüksek' : goal.priority === 'medium' ? 'Orta' : 'Düşük') :
                                goal.priority
                              }
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>{language === 'tr' ? 'İlerleme' : 'Progress'}</span>
                                <span>{goal.currentProgress}%</span>
                              </div>
                              <Progress value={goal.currentProgress} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">
                                  {language === 'tr' ? 'Hedef Tarih' : 'Target Date'}
                                </p>
                                <p className="font-medium">
                                  {new Date(goal.targetDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  {language === 'tr' ? 'Haftalık Saat' : 'Weekly Hours'}
                                </p>
                                <p className="font-medium">{goal.studyHoursPerWeek}h</p>
                              </div>
                            </div>

                            <Separator />

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => generatePlanMutation.mutate(goal.id!)}
                                disabled={generatePlanMutation.isPending}
                              >
                                <Brain className="h-4 w-4 mr-2" />
                                {language === 'tr' ? 'AI Plan Oluştur' : 'Generate AI Plan'}
                              </Button>
                              <Button size="sm" variant="outline">
                                {language === 'tr' ? 'Düzenle' : 'Edit'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {studyGoals?.length === 0 && !goalsLoading && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === 'tr' ? 'Henüz hedef oluşturmadınız' : 'No goals created yet'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {language === 'tr' 
                          ? 'İlk öğrenme hedefinizi oluşturun ve kişiselleştirilmiş program alın'
                          : 'Create your first learning goal and get a personalized study plan'
                        }
                      </p>
                      <Button onClick={() => setShowGoalForm(true)}>
                        {language === 'tr' ? 'İlk Hedefinizi Oluşturun' : 'Create Your First Goal'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  {language === 'tr' ? 'Çalışma Programınız' : 'Your Study Schedule'}
                </h2>
                
                {/* Weekly Schedule View */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'tr' ? 'Bu Hafta' : 'This Week'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day, index) => (
                        <div key={index} className="text-center">
                          <h4 className="font-medium text-sm mb-2">{day}</h4>
                          <div className="space-y-1">
                            {studySchedule?.filter(s => s.dayOfWeek === index).map((session, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded text-xs ${
                                  session.isCompleted 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                <div className="font-medium">{session.subject}</div>
                                <div>{session.startTime} - {session.endTime}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                {recommendations && recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-purple-600" />
                        {language === 'tr' ? 'AI Önerileri' : 'AI Recommendations'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-l-4 ${
                              rec.priority === 'high' 
                                ? 'border-red-500 bg-red-50'
                                : rec.priority === 'medium'
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-green-500 bg-green-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{rec.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                              </div>
                              {rec.actionRequired && (
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  {language === 'tr' ? 'İlerleme Analizi' : 'Progress Analysis'}
                </h2>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {studyGoals?.map((goal, index) => (
                    <Card key={goal.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{getGoalTypeText(goal.goalType)}</CardTitle>
                        {goal.targetExam && <CardDescription>{goal.targetExam}</CardDescription>}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>{language === 'tr' ? 'Genel İlerleme' : 'Overall Progress'}</span>
                              <span>{goal.currentProgress}%</span>
                            </div>
                            <Progress value={goal.currentProgress} className="h-3" />
                          </div>

                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>{language === 'tr' ? 'Kalan Gün' : 'Days Left'}</span>
                              <span className="font-medium">
                                {Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>{language === 'tr' ? 'Haftalık Hedef' : 'Weekly Target'}</span>
                              <span className="font-medium">{goal.studyHoursPerWeek}h</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                            {goal.currentProgress >= 75 ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                            ) : (
                              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                            )}
                            <span className="text-sm font-medium">
                              {language === 'tr' 
                                ? (goal.currentProgress >= 75 ? 'Hedefte' : 'İyi Gidiyor')
                                : (goal.currentProgress >= 75 ? 'On Track' : 'Good Progress')
                              }
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}