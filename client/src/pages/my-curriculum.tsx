import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import ModernNavigation from "@/components/layout/modern-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Award,
  Zap,
  Calendar,
  BarChart3
} from "lucide-react";

interface UserCurriculum {
  id: number;
  userId: number;
  courseCurriculumId: number;
  courseId: number;
  overallProgress: number;
  status: string;
  startDate: string;
  estimatedCompletionDate: string | null;
  actualCompletionDate: string | null;
  successRate: number | null;
  courseName: string;
  courseTitleEn?: string;
  courseTitleTr?: string;
}

interface CurriculumTask {
  id: number;
  userCurriculumId: number;
  taskTitleEn: string;
  taskTitleTr: string;
  taskDescriptionEn: string;
  taskDescriptionTr: string;
  type: string;
  priority: string;
  estimatedDuration: number;
  dueDate: string | null;
  status: string;
  completedAt: string | null;
}

interface SkillProgress {
  id: number;
  userCurriculumId: number;
  skillId: number;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  masteryScore: number | null;
  skillNameEn: string;
  skillNameTr: string;
}

interface CurriculumCheckpoint {
  id: number;
  courseCurriculumId: number;
  titleEn: string;
  titleTr: string;
  descriptionEn?: string;
  descriptionTr?: string;
  checkpointType: string;
  order: number;
  passingScore: number | null;
  estimatedDuration: number | null;
}

export default function MyCurriculumPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number | null>(null);

  // Fetch user's curricula
  const { data: curricula = [], isLoading: isLoadingCurricula } = useQuery<UserCurriculum[]>({
    queryKey: ['/api/user/curriculums'],
    enabled: !!user,
  });

  // Fetch tasks for selected curriculum
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<CurriculumTask[]>({
    queryKey: [`/api/user/curriculum/${selectedCurriculumId}/tasks`],
    enabled: !!selectedCurriculumId,
  });

  // Fetch skill progress for selected curriculum
  const { data: skillProgress = [], isLoading: isLoadingSkills } = useQuery<SkillProgress[]>({
    queryKey: [`/api/user/curriculum/${selectedCurriculumId}/skill-progress`],
    enabled: !!selectedCurriculumId,
  });

  // Fetch checkpoints for selected curriculum
  const { data: checkpoints = [], isLoading: isLoadingCheckpoints } = useQuery<CurriculumCheckpoint[]>({
    queryKey: [`/api/user/curriculum/${selectedCurriculumId}/checkpoints`],
    enabled: !!selectedCurriculumId,
  });

  const selectedCurriculum = curricula.find(c => c.id === selectedCurriculumId);

  const getLocalizedText = (enText?: string, trText?: string) => {
    return language === 'tr' ? (trText || enText || '') : (enText || trText || '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">{t('high')}</Badge>;
      case 'medium': return <Badge variant="default">{t('medium')}</Badge>;
      case 'low': return <Badge variant="secondary">{t('low')}</Badge>;
      default: return null;
    }
  };

  if (isLoadingCurricula) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ModernNavigation pageTitle={t('myCurriculum')} currentPage="myCurriculum" />
      <div className="flex-1 container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          {t('myCurriculum')}
        </h1>
        <p className="text-muted-foreground">
          {t('trackYourPersonalizedLearningJourney')}
        </p>
      </div>

      {curricula.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('noCurriculaYet')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('enrollInCourseToGenerateCurriculum')}
              </p>
              <Button onClick={() => window.location.href = '/courses'}>
                {t('browseCourses')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Curriculum List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold">{t('yourCurricula')}</h2>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {curricula.map((curriculum) => (
                  <Card
                    key={curriculum.id}
                    className={`cursor-pointer transition-all ${
                      selectedCurriculumId === curriculum.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCurriculumId(curriculum.id)}
                    data-testid={`curriculum-card-${curriculum.id}`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {getLocalizedText(curriculum.courseTitleEn, curriculum.courseTitleTr)}
                      </CardTitle>
                      <CardDescription>
                        <Badge className={getStatusColor(curriculum.status)}>
                          {t(curriculum.status)}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('progress')}</span>
                          <span className="font-medium">{curriculum.overallProgress}%</span>
                        </div>
                        <Progress value={curriculum.overallProgress} />
                        {curriculum.successRate !== null && (
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span>{t('successRate')}: {curriculum.successRate}%</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Curriculum Details */}
          <div className="lg:col-span-2">
            {!selectedCurriculum ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('selectCurriculumToViewDetails')}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" data-testid="tab-overview">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t('overview')}
                  </TabsTrigger>
                  <TabsTrigger value="tasks" data-testid="tab-tasks">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {t('tasks')}
                  </TabsTrigger>
                  <TabsTrigger value="skills" data-testid="tab-skills">
                    <Zap className="h-4 w-4 mr-2" />
                    {t('skills')}
                  </TabsTrigger>
                  <TabsTrigger value="checkpoints" data-testid="tab-checkpoints">
                    <Award className="h-4 w-4 mr-2" />
                    {t('checkpoints')}
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">{t('overallProgress')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{selectedCurriculum.overallProgress}%</div>
                        <Progress value={selectedCurriculum.overallProgress} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">{t('status')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className={`${getStatusColor(selectedCurriculum.status)} text-lg px-4 py-2`}>
                          {t(selectedCurriculum.status)}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {t('startDate')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-semibold">
                          {new Date(selectedCurriculum.startDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                        </div>
                      </CardContent>
                    </Card>

                    {selectedCurriculum.estimatedCompletionDate && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {t('estimatedCompletion')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-semibold">
                            {new Date(selectedCurriculum.estimatedCompletionDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedCurriculum.successRate !== null && (
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            {t('successRate')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-600">
                            {selectedCurriculum.successRate}%
                          </div>
                          <Progress value={selectedCurriculum.successRate} className="mt-2" />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Tasks Tab */}
                <TabsContent value="tasks" className="space-y-4">
                  {isLoadingTasks ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
                    </div>
                  ) : tasks.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('noCurriculumTasksYet')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <Card key={task.id} data-testid={`task-card-${task.id}`}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-base">
                                    {getLocalizedText(task.taskTitleEn, task.taskTitleTr)}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {getLocalizedText(task.taskDescriptionEn, task.taskDescriptionTr)}
                                  </CardDescription>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                  {getPriorityBadge(task.priority)}
                                  <Badge className={getStatusColor(task.status)}>
                                    {t(task.status)}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {task.estimatedDuration} {t('minutes')}
                                </div>
                                {task.dueDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(task.dueDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-4">
                  {isLoadingSkills ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
                    </div>
                  ) : skillProgress.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8 text-muted-foreground">
                          <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('noCurriculumSkillsYet')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {skillProgress.map((skill) => (
                        <Card key={skill.id} data-testid={`skill-card-${skill.id}`}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              {getLocalizedText(skill.skillNameEn, skill.skillNameTr)}
                            </CardTitle>
                            <CardDescription>
                              {t('level')} {skill.currentLevel} → {skill.targetLevel}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('progress')}</span>
                                <span className="font-medium">{skill.progress}%</span>
                              </div>
                              <Progress value={skill.progress} />
                              {skill.masteryScore !== null && (
                                <div className="text-sm text-muted-foreground">
                                  {t('masteryScore')}: <span className="font-medium">{skill.masteryScore}%</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Checkpoints Tab */}
                <TabsContent value="checkpoints" className="space-y-4">
                  {isLoadingCheckpoints ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
                    </div>
                  ) : checkpoints.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8 text-muted-foreground">
                          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('noCurriculumCheckpointsYet')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {/* Timeline visualization */}
                      <div className="relative">
                        {checkpoints.sort((a, b) => a.order - b.order).map((checkpoint, index) => (
                          <div key={checkpoint.id} className="flex gap-4 pb-8 last:pb-0" data-testid={`checkpoint-${checkpoint.id}`}>
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                {index + 1}
                              </div>
                              {index < checkpoints.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-2"></div>
                              )}
                            </div>
                            <Card className="flex-1">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base">
                                      {getLocalizedText(checkpoint.titleEn, checkpoint.titleTr)}
                                    </CardTitle>
                                    {(checkpoint.descriptionEn || checkpoint.descriptionTr) && (
                                      <CardDescription className="mt-1">
                                        {getLocalizedText(checkpoint.descriptionEn, checkpoint.descriptionTr)}
                                      </CardDescription>
                                    )}
                                  </div>
                                  <Badge variant="outline">{t(checkpoint.checkpointType)}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                  {checkpoint.passingScore !== null && (
                                    <div className="flex items-center gap-1">
                                      <Target className="h-4 w-4" />
                                      {t('passingScore')}: {checkpoint.passingScore}%
                                    </div>
                                  )}
                                  {checkpoint.estimatedDuration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {checkpoint.estimatedDuration} {t('minutes')}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
