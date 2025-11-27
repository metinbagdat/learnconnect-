import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Zap, Brain, BookOpen, TrendingUp } from 'lucide-react';

export default function CurriculumGenerationDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [curriculumType, setCurriculumType] = useState('personalized');
  const [learningPace, setLearningPace] = useState('moderate');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch enrolled courses
  const { data: enrolledCourses = [] } = useQuery<any[]>({
    queryKey: ['/api/users/enrolled-courses'],
    enabled: !!user
  });

  // Fetch previous productions
  const { data: productions = [] } = useQuery<any[]>({
    queryKey: ['/api/production/list'],
    enabled: !!user
  });

  // Generate curriculum mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            difficulty: curriculumType,
            focusAreas,
            estimatedWeeklyHours: learningPace === 'slow' ? 10 : learningPace === 'moderate' ? 20 : 30
          }
        })
      });
      if (!response.ok) throw new Error('Failed to generate curriculum');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/curriculum/list'] });
      queryClient.invalidateQueries({ queryKey: ['/api/production/list'] });
      setIsGenerating(false);
      toast({ title: 'Success', description: 'Curriculum generated successfully!' });
    },
    onError: () => {
      setIsGenerating(false);
      toast({ title: 'Error', description: 'Failed to generate curriculum', variant: 'destructive' });
    }
  });

  const handleGenerateCurriculum = async () => {
    setIsGenerating(true);
    await generateMutation.mutateAsync();
  };

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleFocusAreaToggle = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold">🎯 AI Curriculum Generator</h1>
        </div>
        <p className="text-gray-600">Create personalized learning paths using advanced AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Selection Panel */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Your Courses
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {enrolledCourses.map(course => (
              <div key={course.id} className="flex items-start gap-3">
                <Checkbox
                  id={`course-${course.id}`}
                  checked={selectedCourses.includes(course.id)}
                  onCheckedChange={() => handleCourseToggle(course.id)}
                />
                <label htmlFor={`course-${course.id}`} className="cursor-pointer flex-1">
                  <div className="font-medium text-sm">{course.titleEn || course.title}</div>
                  <div className="text-xs text-gray-500">{course.level} • {course.durationHours}h</div>
                </label>
              </div>
            ))}
          </div>
          {enrolledCourses.length === 0 && (
            <p className="text-gray-500 text-sm">No enrolled courses yet</p>
          )}
        </Card>

        {/* Generation Options Panel */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Options
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Curriculum Type</label>
              <Select value={curriculumType} onValueChange={setCurriculumType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Path</SelectItem>
                  <SelectItem value="personalized">AI Personalized</SelectItem>
                  <SelectItem value="intensive">Intensive</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Learning Pace</label>
              <Select value={learningPace} onValueChange={setLearningPace}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow & Steady (10h/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (20h/week)</SelectItem>
                  <SelectItem value="fast">Fast Track (30h/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateCurriculum}
              disabled={isGenerating || enrolledCourses.length === 0}
              className="w-full"
            >
              {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              🚀 Generate
            </Button>
          </div>
        </Card>

        {/* Focus Areas Panel */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Focus Areas
          </h2>
          <div className="space-y-3">
            {['Mathematics', 'Science', 'English', 'Programming', 'History'].map(area => (
              <div key={area} className="flex items-center gap-3">
                <Checkbox
                  id={`area-${area}`}
                  checked={focusAreas.includes(area)}
                  onCheckedChange={() => handleFocusAreaToggle(area)}
                />
                <label htmlFor={`area-${area}`} className="text-sm cursor-pointer">
                  {area}
                </label>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Production History */}
      {productions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Previous Productions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productions.slice(0, 6).map((prod: any) => (
              <div key={prod.generationId} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                <h3 className="font-medium truncate">{prod.selectedCurriculum?.title}</h3>
                <p className="text-sm text-gray-600">
                  {prod.selectedCurriculum?.courses?.length || 0} courses
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(prod.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Courses</div>
          <div className="text-2xl font-bold">{enrolledCourses.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Generated</div>
          <div className="text-2xl font-bold">{productions.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Avg Confidence</div>
          <div className="text-2xl font-bold">
            {productions.length > 0 
              ? `${Math.round(productions.reduce((sum: number, p: any) => sum + (p.aiConfidenceScore || 0), 0) / productions.length * 100)}%`
              : '—'
            }
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">AI Status</div>
          <div className="text-2xl font-bold text-green-600">Active</div>
        </Card>
      </div>
    </div>
  );
}
