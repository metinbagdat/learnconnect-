import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { CheckCircle2, Circle, Plus, Clock, AlertCircle, Calendar, Trash2, Target, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface CurriculumContext {
  curriculumTaskId: number;
  curriculumId: number;
  curriculumTitleEn: string;
  curriculumTitleTr: string;
  skillName?: string;
  taskTitleEn: string;
  taskTitleTr: string;
}

interface DailyTask {
  id: number;
  userId: number;
  title: string;
  description?: string;
  taskType: string;
  priority: string;
  estimatedDuration?: number;
  scheduledDate: string;
  scheduledTime?: string;
  isCompleted: boolean;
  completedAt?: Date;
  curriculumContext?: CurriculumContext | null;
}

interface TodoListProps {
  compact?: boolean;
  showAddButton?: boolean;
  maxHeight?: string;
  date?: string;
}

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  taskType: z.enum(['study', 'practice', 'review', 'trial_exam', 'homework']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  estimatedDuration: z.number().min(5).default(60),
  scheduledTime: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TodoList({ compact = false, showAddButton = true, maxHeight = "500px", date }: TodoListProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date || format(new Date(), 'yyyy-MM-dd'));

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      taskType: 'study',
      priority: 'medium',
      estimatedDuration: 60,
      scheduledTime: '',
    },
  });

  const translations = {
    title: language === 'tr' ? 'Yapılacaklar Listesi' : 'To-Do List',
    addTask: language === 'tr' ? 'Görev Ekle' : 'Add Task',
    noTasks: language === 'tr' ? 'Bugün için görev yok' : 'No tasks for today',
    createTask: language === 'tr' ? 'Görev Oluştur' : 'Create Task',
    taskTitle: language === 'tr' ? 'Görev Başlığı' : 'Task Title',
    description: language === 'tr' ? 'Açıklama' : 'Description',
    taskType: language === 'tr' ? 'Görev Tipi' : 'Task Type',
    priority: language === 'tr' ? 'Öncelik' : 'Priority',
    duration: language === 'tr' ? 'Tahmini Süre (dakika)' : 'Estimated Duration (minutes)',
    time: language === 'tr' ? 'Saat' : 'Time',
    cancel: language === 'tr' ? 'İptal' : 'Cancel',
    completed: language === 'tr' ? 'Tamamlandı' : 'Completed',
    pending: language === 'tr' ? 'Bekliyor' : 'Pending',
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };

  const taskTypeLabels = {
    study: language === 'tr' ? 'Çalışma' : 'Study',
    practice: language === 'tr' ? 'Pratik' : 'Practice',
    review: language === 'tr' ? 'Gözden Geçirme' : 'Review',
    trial_exam: language === 'tr' ? 'Deneme Sınavı' : 'Trial Exam',
    homework: language === 'tr' ? 'Ödev' : 'Homework',
  };

  const priorityLabels = {
    low: language === 'tr' ? 'Düşük' : 'Low',
    medium: language === 'tr' ? 'Orta' : 'Medium',
    high: language === 'tr' ? 'Yüksek' : 'High',
    urgent: language === 'tr' ? 'Acil' : 'Urgent',
  };

  const { data: tasks = [], isLoading } = useQuery<DailyTask[]>({
    queryKey: ['/api/user/daily-tasks', { date: selectedDate }],
    enabled: !!user,
  });

  const completeMutation = useMutation({
    mutationFn: async ({ taskId, actualDuration }: { taskId: number; actualDuration?: number }) => {
      const response = await apiRequest('POST', `/api/user/daily-tasks/${taskId}/complete`, { actualDuration });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/daily-tasks', { date: selectedDate }] });
      toast({
        title: language === 'tr' ? 'Tebrikler!' : 'Congratulations!',
        description: language === 'tr' ? 'Görev tamamlandı!' : 'Task completed!',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiRequest('DELETE', `/api/user/daily-tasks/${taskId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/daily-tasks', { date: selectedDate }] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (taskData: any) => {
      console.log('Creating task with data:', taskData);
      
      try {
        const response = await apiRequest('POST', '/api/user/daily-tasks', taskData);
        const jsonData = await response.json();
        console.log('Task creation response:', jsonData);
        return jsonData;
      } catch (error) {
        console.error('Task creation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/daily-tasks', { date: selectedDate }] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: language === 'tr' ? 'Başarılı!' : 'Success!',
        description: language === 'tr' ? 'Görev oluşturuldu' : 'Task created',
      });
    },
    onError: (error: any) => {
      console.error('Mutation error details:', error);
      
      // Try to extract error message from response
      let errorMessage = language === 'tr' 
        ? 'Görev oluşturulamadı' 
        : 'Failed to create task';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response) {
        try {
          const errorData = typeof error.response === 'string' 
            ? JSON.parse(error.response) 
            : error.response;
          if (errorData?.errors) {
            // Show first field error
            const firstError = errorData.errors[0];
            if (firstError?.message) {
              errorMessage = `${firstError.path || 'Field'}: ${firstError.message}`;
            }
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
      }
      
      toast({
        title: language === 'tr' ? 'Hata!' : 'Error!',
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = (task: DailyTask) => {
    if (!task.isCompleted) {
      completeMutation.mutate({ taskId: task.id, actualDuration: task.estimatedDuration });
    }
  };

  const handleCreateTask = (values: TaskFormValues) => {
    // Ensure scheduledDate is properly formatted as YYYY-MM-DD
    const dateObj = new Date(selectedDate);
    const formattedDate = isNaN(dateObj.getTime()) 
      ? selectedDate 
      : dateObj.toISOString().split('T')[0];
    
    const taskData = {
      title: values.title,
      description: values.description || null,
      taskType: values.taskType,
      priority: values.priority,
      estimatedDuration: values.estimatedDuration,
      scheduledTime: values.scheduledTime || null,
      scheduledDate: formattedDate,
    };
    
    console.log('Task data being sent:', taskData);
    createMutation.mutate(taskData);
  };

  const completedTasks = tasks.filter(t => t.isCompleted);
  const pendingTasks = tasks.filter(t => !t.isCompleted);

  if (!user) return null;

  return (
    <Card className="shadow-lg border-2 border-primary/20" data-testid="todo-list">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">{translations.title}</CardTitle>
            {pendingTasks.length > 0 && (
              <Badge variant="default" className="bg-primary">
                {pendingTasks.length}
              </Badge>
            )}
          </div>
          {showAddButton && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" data-testid="add-task-button">
                  <Plus className="h-4 w-4" />
                  {!compact && translations.addTask}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{translations.createTask}</DialogTitle>
                  <DialogDescription>
                    {language === 'tr' 
                      ? 'Günlük çalışma planınıza yeni bir görev ekleyin'
                      : 'Add a new task to your daily study plan'
                    }
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateTask)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.taskTitle}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="task-title-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.description}</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="task-description-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="taskType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{translations.taskType}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="task-type-select">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="study">{taskTypeLabels.study}</SelectItem>
                                <SelectItem value="practice">{taskTypeLabels.practice}</SelectItem>
                                <SelectItem value="review">{taskTypeLabels.review}</SelectItem>
                                <SelectItem value="trial_exam">{taskTypeLabels.trial_exam}</SelectItem>
                                <SelectItem value="homework">{taskTypeLabels.homework}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{translations.priority}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="task-priority-select">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">{priorityLabels.low}</SelectItem>
                                <SelectItem value="medium">{priorityLabels.medium}</SelectItem>
                                <SelectItem value="high">{priorityLabels.high}</SelectItem>
                                <SelectItem value="urgent">{priorityLabels.urgent}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="estimatedDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{translations.duration}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                type="number"
                                min={5}
                                step={5}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="task-duration-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="scheduledTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{translations.time}</FormLabel>
                            <FormControl>
                              <Input {...field} type="time" data-testid="task-time-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        {translations.cancel}
                      </Button>
                      <Button 
                        type="submit" 
                        data-testid="create-task-submit"
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending 
                          ? (language === 'tr' ? 'Oluşturuluyor...' : 'Creating...')
                          : translations.createTask
                        }
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4" style={{ maxHeight, overflowY: 'auto' }}>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{translations.noTasks}</p>
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/courses')}
                variant="default"
                size="sm"
                className="gap-2"
                data-testid="enroll-lesson-button"
              >
                <BookOpen className="h-4 w-4" />
                {language === 'tr' ? 'Ders Kaydol' : 'Enroll a Lesson'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors bg-white"
                data-testid={`task-${task.id}`}
              >
                <Checkbox
                  checked={task.isCompleted}
                  onCheckedChange={() => handleToggleComplete(task)}
                  className="mt-1"
                  data-testid={`task-checkbox-${task.id}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => deleteMutation.mutate(task.id)}
                      data-testid={`delete-task-${task.id}`}
                    >
                      <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                      {priorityLabels[task.priority as keyof typeof priorityLabels]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {taskTypeLabels[task.taskType as keyof typeof taskTypeLabels]}
                    </Badge>
                    {task.curriculumContext && (
                      <Link href="/my-curriculum">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 cursor-pointer transition-colors flex items-center gap-1 max-w-[200px]"
                          data-testid={`curriculum-badge-${task.id}`}
                          title={`${language === 'tr' ? task.curriculumContext.curriculumTitleTr : task.curriculumContext.curriculumTitleEn}${task.curriculumContext.skillName ? ` • ${task.curriculumContext.skillName}` : ''}`}
                        >
                          <Target className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {language === 'tr' ? task.curriculumContext.curriculumTitleTr : task.curriculumContext.curriculumTitleEn}
                            {task.curriculumContext.skillName && (
                              <span className="ml-1 opacity-70">• {task.curriculumContext.skillName}</span>
                            )}
                          </span>
                        </Badge>
                      </Link>
                    )}
                    {task.estimatedDuration && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimatedDuration} {language === 'tr' ? 'dk' : 'min'}
                      </span>
                    )}
                    {task.scheduledTime && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.scheduledTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {completedTasks.length > 0 && (
              <>
                <div className="pt-2 pb-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {translations.completed} ({completedTasks.length})
                  </p>
                </div>
                {completedTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 opacity-60"
                    data-testid={`task-${task.id}`}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-through text-gray-600">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 line-through">{task.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
