import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import ModernNavigation from "@/components/layout/modern-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PersonalizedCurriculum {
  title: string;
  description: string;
  courses: any[];
  skills: any[];
  estimatedDuration: number;
  milestones: any[];
  aiConfidence: number;
  generationMethod: string;
  difficulty?: string;
}

export default function CurriculumGenerationPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    difficulty: 'progressive',
    focusAreas: [] as string[],
    estimatedWeeklyHours: 20
  });

  // Fetch user's generated curricula
  const { data: curricula = [], isLoading: isLoadingCurricula } = useQuery<any[]>({
    queryKey: ['/api/curriculum/list'],
    enabled: !!user
  });

  // Fetch current production details
  const { data: productionDetails } = useQuery<any>({
    queryKey: selectedGenerationId ? [`/api/curriculum/production/${selectedGenerationId}`] : [],
    enabled: !!selectedGenerationId
  });

  // Generate curriculum mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences })
      });
      if (!response.ok) throw new Error('Failed to generate curriculum');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/curriculum/list'] });
      setIsGenerating(false);
      toast({ title: 'Success', description: 'Curriculum generated successfully' });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({ title: 'Error', description: 'Failed to generate curriculum', variant: 'destructive' });
    }
  });

  // Export curriculum mutation
  const exportMutation = useMutation({
    mutationFn: async (generationId: string) => {
      const response = await fetch(`/api/curriculum/${generationId}/export`, {
        method: 'GET'
      });
      if (!response.ok) throw new Error('Failed to export curriculum');
      const data = await response.json();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `curriculum_${generationId}.json`;
      link.click();
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateMutation.mutateAsync();
  };

  const toggleFocusArea = (area: string) => {
    setPreferences(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const selectedCurriculum = curricula.find(c => c.generationId === selectedGenerationId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <ModernNavigation />
      
      <div className="container py-8 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {language === 'tr' ? 'Kişiselleştirilmiş Müfredat Oluştur' : 'AI Curriculum Generator'}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {language === 'tr'
              ? 'Kayıtlı kurslarınıza göre kişiselleştirilmiş bir öğrenme yolu oluşturun'
              : 'Generate a personalized learning path based on your enrolled courses'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generation Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {language === 'tr' ? 'Müfredat Oluştur' : 'Generate'}
                </CardTitle>
                <CardDescription>
                  {language === 'tr' ? 'Tercihlerinizi ayarlayın' : 'Configure your preferences'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Difficulty Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    {language === 'tr' ? 'Zorluk Seviyesi' : 'Difficulty Level'}
                  </label>
                  <div className="space-y-2">
                    {['progressive', 'focused', 'accelerated'].map(level => (
                      <button
                        key={level}
                        onClick={() => setPreferences(p => ({ ...p, difficulty: level }))}
                        className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                          preferences.difficulty === level
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekly Hours */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    {language === 'tr' ? 'Haftalık Saat' : 'Weekly Hours'}: {preferences.estimatedWeeklyHours}h
                  </label>
                  <Slider
                    value={[preferences.estimatedWeeklyHours]}
                    onValueChange={(value) => 
                      setPreferences(p => ({ ...p, estimatedWeeklyHours: value[0] }))
                    }
                    min={5}
                    max={40}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Focus Areas */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    {language === 'tr' ? 'Odak Alanları' : 'Focus Areas'}
                  </label>
                  <div className="space-y-2">
                    {['Mathematics', 'Programming', 'Science', 'Language'].map(area => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={preferences.focusAreas.includes(area)}
                          onCheckedChange={() => toggleFocusArea(area)}
                        />
                        <label htmlFor={area} className="text-sm cursor-pointer">
                          {area}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || generateMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating || generateMutation.isPending ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      {language === 'tr' ? 'Oluşturuluyor...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {language === 'tr' ? 'Müfredat Oluştur' : 'Generate Curriculum'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Tabs defaultValue="generated" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generated">
                  {language === 'tr' ? 'Oluşturulanlar' : 'Generated'} ({curricula.length})
                </TabsTrigger>
                <TabsTrigger value="details">
                  {language === 'tr' ? 'Detaylar' : 'Details'}
                </TabsTrigger>
              </TabsList>

              {/* Generated Curricula Tab */}
              <TabsContent value="generated" className="space-y-4">
                {isLoadingCurricula ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                  </div>
                ) : curricula.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground text-center">
                        {language === 'tr'
                          ? 'Henüz müfredat oluşturulmadı. Başlamak için düğmeyi tıklayın.'
                          : 'No curricula generated yet. Click the button to get started.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  curricula.map((curriculum) => (
                    <Card
                      key={curriculum.generationId}
                      className={`cursor-pointer transition-all ${
                        selectedGenerationId === curriculum.generationId
                          ? 'ring-2 ring-primary'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedGenerationId(curriculum.generationId)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {curriculum.curriculum?.title || 'Personalized Curriculum'}
                            </CardTitle>
                            <CardDescription>
                              {new Date(curriculum.createdAt).toLocaleDateString(language)}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {(curriculum.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'tr' ? 'Kurslar' : 'Courses'}
                              </p>
                              <p className="font-semibold">
                                {curriculum.curriculum?.courses.length || 0}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'tr' ? 'Saat' : 'Hours'}
                              </p>
                              <p className="font-semibold">
                                {curriculum.curriculum?.estimatedDuration || 0}h
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'tr' ? 'Beceriler' : 'Skills'}
                              </p>
                              <p className="font-semibold">
                                {curriculum.curriculum?.skills.length || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {curriculum.curriculum?.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                {selectedCurriculum ? (
                  <>
                    {/* Curriculum Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {language === 'tr' ? 'Müfredat Özeti' : 'Curriculum Overview'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'tr' ? 'Başlık' : 'Title'}
                            </p>
                            <p className="font-semibold">{selectedCurriculum.curriculum?.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'tr' ? 'Oluşturma Yöntemi' : 'Generation Method'}
                            </p>
                            <p className="font-semibold">
                              {selectedCurriculum.curriculum?.generationMethod}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {language === 'tr' ? 'Açıklama' : 'Description'}
                          </p>
                          <p className="text-sm">
                            {selectedCurriculum.curriculum?.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Courses */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {language === 'tr' ? 'Dersler' : 'Courses'} (
                          {selectedCurriculum.curriculum?.courses.length || 0})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {selectedCurriculum.curriculum?.courses.map((course: any) => (
                            <div
                              key={course.id}
                              className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {course.titleEn || course.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {course.level} • {course.durationHours || 40}h
                                </p>
                              </div>
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => exportMutation.mutate(selectedGenerationId!)}
                        disabled={exportMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {language === 'tr' ? 'İndir' : 'Export'}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setPreferences(p => ({
                            ...p,
                            difficulty: selectedCurriculum.curriculum?.difficulty || 'progressive'
                          }));
                          handleGenerate();
                        }}
                        disabled={isGenerating}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {language === 'tr' ? 'Yeniden Oluştur' : 'Regenerate'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground text-center">
                        {language === 'tr'
                          ? 'Ayrıntıları görmek için bir müfredat seçin'
                          : 'Select a curriculum to view details'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
