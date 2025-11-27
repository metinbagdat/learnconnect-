import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { GripVertical, Trash2, Plus, Save, RotateCcw, Zap } from 'lucide-react';

interface CurriculumPhase {
  id: string;
  title: string;
  courses: any[];
  duration: number;
  difficulty: string;
}

interface CustomizationState {
  phases: CurriculumPhase[];
  totalDuration: number;
  successProbability: number;
  difficultyScore: number;
}

export default function CurriculumCustomization() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const curriculumId = new URLSearchParams(location.split('?')[1]).get('id');

  const [customization, setCustomization] = useState<CustomizationState>({
    phases: [],
    totalDuration: 0,
    successProbability: 0,
    difficultyScore: 0
  });

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // Fetch curriculum data
  const { data: curriculum, isLoading } = useQuery<any>({
    queryKey: [`/api/curriculum/production/${curriculumId}`],
    enabled: !!curriculumId && !!user
  });

  // Initialize customization state when curriculum loads
  useEffect(() => {
    if (curriculum?.data) {
      const phases = curriculum.data.selectedCurriculum?.courses?.map((course: any, idx: number) => ({
        id: `phase_${idx}`,
        title: course.titleEn || course.title,
        courses: [course],
        duration: course.durationHours || 40,
        difficulty: course.level || 'intermediate'
      })) || [];

      setCustomization({
        phases,
        totalDuration: phases.reduce((sum: number, p: CurriculumPhase) => sum + p.duration, 0),
        successProbability: curriculum.data.aiConfidenceScore ? Math.round(curriculum.data.aiConfidenceScore * 100) : 0,
        difficultyScore: phases.length > 0 ? Math.round(phases.reduce((sum: number, p: CurriculumPhase) => {
          const diffMap = { beginner: 0.3, intermediate: 0.6, advanced: 0.9 };
          return sum + (diffMap[p.difficulty as keyof typeof diffMap] || 0.5);
        }, 0) / phases.length * 100) : 0
      });
    }
  }, [curriculum]);

  // Save customizations mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/curriculum/${curriculumId}/customize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization)
      });
      if (!response.ok) throw new Error('Failed to save customizations');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Customizations saved!' });
      queryClient.invalidateQueries({ queryKey: [`/api/curriculum/production/${curriculumId}`] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save customizations', variant: 'destructive' });
    }
  });

  // AI optimize mutation
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/curriculum/${curriculumId}/ai-optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization)
      });
      if (!response.ok) throw new Error('Failed to optimize');
      return response.json();
    },
    onSuccess: (data) => {
      setCustomization(data.data);
      toast({ title: 'Success', description: 'AI optimizations applied!' });
      setShowAISuggestions(true);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to apply AI optimizations', variant: 'destructive' });
    }
  });

  const handleSave = () => saveMutation.mutateAsync();
  const handleOptimize = () => optimizeMutation.mutateAsync();
  const handleReset = () => window.location.reload();

  const handlePhaseReorder = (draggedId: string, targetId: string) => {
    const draggedIdx = customization.phases.findIndex(p => p.id === draggedId);
    const targetIdx = customization.phases.findIndex(p => p.id === targetId);
    
    if (draggedIdx !== -1 && targetIdx !== -1) {
      const newPhases = [...customization.phases];
      [newPhases[draggedIdx], newPhases[targetIdx]] = [newPhases[targetIdx], newPhases[draggedIdx]];
      setCustomization({ ...customization, phases: newPhases });
    }
  };

  const handleRemovePhase = (phaseId: string) => {
    const newPhases = customization.phases.filter(p => p.id !== phaseId);
    const newDuration = newPhases.reduce((sum, p) => sum + p.duration, 0);
    setCustomization({
      ...customization,
      phases: newPhases,
      totalDuration: newDuration
    });
  };

  const handleDurationChange = (phaseId: string, newDuration: number) => {
    const newPhases = customization.phases.map(p =>
      p.id === phaseId ? { ...p, duration: newDuration } : p
    );
    const newTotalDuration = newPhases.reduce((sum, p) => sum + p.duration, 0);
    setCustomization({
      ...customization,
      phases: newPhases,
      totalDuration: newTotalDuration
    });
  };

  if (isLoading) return <div className="p-8 text-center">Loading curriculum...</div>;
  if (!curriculum) return <div className="p-8 text-center">Curriculum not found</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">🎨 Customize Your Curriculum</h1>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button onClick={handleOptimize} disabled={optimizeMutation.isPending} variant="secondary" className="gap-2">
            <Zap className="w-4 h-4" />
            AI Optimize
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Curriculum Structure */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">📐 Curriculum Structure</h2>
            <div className="space-y-3">
              {customization.phases.map((phase, idx) => (
                <div
                  key={phase.id}
                  draggable
                  onDragStart={() => setDraggedItem(phase.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => draggedItem && handlePhaseReorder(draggedItem, phase.id)}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-move transition"
                >
                  <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium">{phase.title}</h3>
                    <p className="text-sm text-gray-600">{phase.difficulty} • {phase.duration}h</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemovePhase(phase.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Duration Customization */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">⏱️ Adjust Durations</h2>
            <div className="space-y-4">
              {customization.phases.map(phase => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">{phase.title}</label>
                    <span className="text-sm text-gray-600">{phase.duration}h</span>
                  </div>
                  <Slider
                    min={10}
                    max={80}
                    step={5}
                    value={[phase.duration]}
                    onValueChange={(val) => handleDurationChange(phase.id, val[0])}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Metrics Panel */}
        <Card className="p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">📊 Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Total Duration</div>
              <div className="text-3xl font-bold">{customization.totalDuration}h</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Success Probability</div>
              <div className="text-3xl font-bold text-green-600">{customization.successProbability}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Difficulty Score</div>
              <div className="text-3xl font-bold text-orange-600">{customization.difficultyScore}/100</div>
            </div>
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">Phases</div>
              <div className="text-2xl font-bold">{customization.phases.length}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Suggestions */}
      {showAISuggestions && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            💡 AI Suggestions
          </h2>
          <p className="text-sm text-gray-700">
            The AI has optimized your curriculum based on your customizations. The recommended sequence follows progressive difficulty advancement and optimal spacing between similar topics for better retention.
          </p>
        </Card>
      )}
    </div>
  );
}
