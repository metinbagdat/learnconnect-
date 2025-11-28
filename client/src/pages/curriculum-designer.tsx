import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle2, AlertCircle, TrendingUp, BookOpen, Users, Target, 
  GraduationCap, Briefcase, ChevronRight, ChevronLeft, Sparkles,
  Brain, Clock, BarChart3, Lightbulb, Award, DollarSign
} from "lucide-react";

const WIZARD_STEPS = [
  { id: "learner", title: "Learner Profile", titleTr: "Öğrenci Profili", icon: Users },
  { id: "content", title: "Content Design", titleTr: "İçerik Tasarımı", icon: BookOpen },
  { id: "business", title: "Business Goals", titleTr: "İş Hedefleri", icon: Briefcase },
  { id: "metrics", title: "Success Metrics", titleTr: "Başarı Metrikleri", icon: BarChart3 },
  { id: "review", title: "Review & Create", titleTr: "İncele & Oluştur", icon: CheckCircle2 },
];

const LEARNING_STYLES = [
  { value: "visual", label: "Visual", labelTr: "Görsel" },
  { value: "auditory", label: "Auditory", labelTr: "İşitsel" },
  { value: "kinesthetic", label: "Kinesthetic", labelTr: "Dokunsal" },
  { value: "reading", label: "Reading/Writing", labelTr: "Okuma/Yazma" },
];

const ASSESSMENT_TYPES = [
  { value: "quiz", label: "Quizzes", labelTr: "Testler" },
  { value: "project", label: "Projects", labelTr: "Projeler" },
  { value: "discussion", label: "Discussions", labelTr: "Tartışmalar" },
  { value: "exam", label: "Exams", labelTr: "Sınavlar" },
  { value: "portfolio", label: "Portfolio", labelTr: "Portfolyo" },
];

const INSTRUCTIONAL_METHODS = [
  { value: "lecture", label: "Lecture-based", labelTr: "Ders Anlatımı" },
  { value: "project", label: "Project-based", labelTr: "Proje Tabanlı" },
  { value: "case-study", label: "Case Study", labelTr: "Vaka Çalışması" },
  { value: "mixed", label: "Mixed Methods", labelTr: "Karma Yöntem" },
  { value: "flipped", label: "Flipped Classroom", labelTr: "Ters Yüz Sınıf" },
];

export function CurriculumDesigner() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeDesign, setActiveDesign] = useState<number | null>(null);

  // Form state for all three dimensions
  const [formData, setFormData] = useState({
    // Design name
    designName: "",
    
    // LEARNER DIMENSION
    targetAudience: [] as string[],
    customAudience: "",
    averageAge: 25,
    priorKnowledge: [] as string[],
    learningStyle: ["visual"] as string[],
    learningPace: "moderate",
    motivationFactors: { intrinsic: [] as string[], extrinsic: [] as string[] },
    accessibilityNeeds: [] as string[],
    
    // CONTENT DIMENSION
    courseTitle: "",
    description: "",
    topics: [] as { name: string; priority: string }[],
    topicInput: "",
    prerequisites: [] as string[],
    prerequisiteInput: "",
    learningObjectives: [] as string[],
    objectiveInput: "",
    instructionalMethod: "mixed",
    assessmentType: ["quiz", "project"] as string[],
    practicalExercisesPercent: 40,
    projectBasedLearning: true,
    contentComplexity: "intermediate",
    
    // BUSINESS DIMENSION
    targetCompletion: 85,
    estimatedHours: 40,
    targetStudents: 100,
    costPerStudent: "",
    revenuePerStudent: "",
    marketDemand: "moderate",
    competitiveAdvantage: "",
    businessGoals: [] as string[],
    
    // SUCCESS METRICS TARGETS
    targetEngagement: 75,
    targetMastery: 80,
    targetSatisfaction: 4.5,
    targetRetention: 70,
  });

  const { data: designs = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/curriculum-designs"],
    enabled: !!user,
  });

  const createDesignMutation = useMutation({
    mutationFn: async (newDesign: any) => {
      const res = await apiRequest("POST", "/api/curriculum-designs", newDesign);
      return res.json();
    },
    onSuccess: () => {
      toast({ 
        title: language === "tr" ? "Müfredat oluşturuldu!" : "Curriculum created!",
        description: language === "tr" ? "Tasarımınız başarıyla kaydedildi" : "Your design has been saved successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum-designs"] });
      setCurrentStep(0);
      resetForm();
    },
    onError: () => {
      toast({ 
        title: language === "tr" ? "Hata" : "Error",
        description: language === "tr" ? "Müfredat oluşturulamadı" : "Failed to create curriculum",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      designName: "",
      targetAudience: [],
      customAudience: "",
      averageAge: 25,
      priorKnowledge: [],
      learningStyle: ["visual"],
      learningPace: "moderate",
      motivationFactors: { intrinsic: [], extrinsic: [] },
      accessibilityNeeds: [],
      courseTitle: "",
      description: "",
      topics: [],
      topicInput: "",
      prerequisites: [],
      prerequisiteInput: "",
      learningObjectives: [],
      objectiveInput: "",
      instructionalMethod: "mixed",
      assessmentType: ["quiz", "project"],
      practicalExercisesPercent: 40,
      projectBasedLearning: true,
      contentComplexity: "intermediate",
      targetCompletion: 85,
      estimatedHours: 40,
      targetStudents: 100,
      costPerStudent: "",
      revenuePerStudent: "",
      marketDemand: "moderate",
      competitiveAdvantage: "",
      businessGoals: [],
      targetEngagement: 75,
      targetMastery: 80,
      targetSatisfaction: 4.5,
      targetRetention: 70,
    });
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: string, inputField: string) => {
    const value = formData[inputField as keyof typeof formData] as string;
    if (value.trim()) {
      const currentArray = formData[field as keyof typeof formData] as any[];
      if (field === "topics") {
        updateFormData(field, [...currentArray, { name: value, priority: "medium" }]);
      } else {
        updateFormData(field, [...currentArray, value]);
      }
      updateFormData(inputField, "");
    }
  };

  const removeFromArray = (field: string, index: number) => {
    const currentArray = formData[field as keyof typeof formData] as any[];
    updateFormData(field, currentArray.filter((_, i) => i !== index));
  };

  const toggleArrayItem = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.includes(value)) {
      updateFormData(field, currentArray.filter(v => v !== value));
    } else {
      updateFormData(field, [...currentArray, value]);
    }
  };

  const handleCreateDesign = async () => {
    if (!formData.courseTitle || !formData.designName) {
      toast({ 
        title: language === "tr" ? "Eksik bilgi" : "Missing information",
        description: language === "tr" ? "Lütfen kurs adı ve tasarım adı girin" : "Please enter course title and design name",
        variant: "destructive"
      });
      return;
    }

    const payload = {
      designName: formData.designName,
      parameters: {
        // Learner dimension
        targetAudience: formData.targetAudience,
        averageAge: formData.averageAge,
        priorKnowledge: formData.priorKnowledge,
        learningStyle: formData.learningStyle,
        learningPace: formData.learningPace,
        motivationFactors: formData.motivationFactors,
        accessibilityNeeds: formData.accessibilityNeeds,
        // Content dimension
        courseTitle: formData.courseTitle,
        description: formData.description,
        topics: formData.topics,
        prerequisites: formData.prerequisites,
        learningObjectives: formData.learningObjectives,
        instructionalMethod: formData.instructionalMethod,
        assessmentType: formData.assessmentType,
        practicalExercisesPercent: formData.practicalExercisesPercent,
        projectBasedLearning: formData.projectBasedLearning,
        contentComplexity: formData.contentComplexity,
        // Business dimension
        estimatedHours: formData.estimatedHours,
        targetStudents: formData.targetStudents,
        costPerStudent: formData.costPerStudent ? parseFloat(formData.costPerStudent) : null,
        revenuePerStudent: formData.revenuePerStudent ? parseFloat(formData.revenuePerStudent) : null,
        marketDemand: formData.marketDemand,
        competitiveAdvantage: formData.competitiveAdvantage,
        businessGoals: formData.businessGoals,
      },
      successMetrics: {
        targetCompletion: formData.targetCompletion,
        targetEngagement: formData.targetEngagement,
        targetMastery: formData.targetMastery,
        targetSatisfaction: formData.targetSatisfaction,
        targetRetention: formData.targetRetention,
      },
      stage: "parameters",
      status: "draft",
    };

    createDesignMutation.mutate(payload);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderLearnerStep = () => (
    <div className="space-y-6" data-testid="learner-step">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            {language === "tr" ? "Öğrenci Profili" : "Learner Profile"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "tr" ? "Hedef kitlenizi ve öğrenme tercihlerini tanımlayın" : "Define your target audience and learning preferences"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label>{language === "tr" ? "Hedef Kitle" : "Target Audience"}</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {["beginners", "intermediate", "advanced", "professionals", "students", "career-changers"].map(audience => (
              <Badge
                key={audience}
                variant={formData.targetAudience.includes(audience) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem("targetAudience", audience)}
                data-testid={`audience-${audience}`}
              >
                {audience === "beginners" && (language === "tr" ? "Yeni Başlayanlar" : "Beginners")}
                {audience === "intermediate" && (language === "tr" ? "Orta Seviye" : "Intermediate")}
                {audience === "advanced" && (language === "tr" ? "İleri Seviye" : "Advanced")}
                {audience === "professionals" && (language === "tr" ? "Profesyoneller" : "Professionals")}
                {audience === "students" && (language === "tr" ? "Öğrenciler" : "Students")}
                {audience === "career-changers" && (language === "tr" ? "Kariyer Değiştirenler" : "Career Changers")}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{language === "tr" ? "Ortalama Yaş" : "Average Age"}</Label>
            <div className="flex items-center gap-4 mt-2">
              <Slider
                value={[formData.averageAge]}
                onValueChange={([value]) => updateFormData("averageAge", value)}
                min={10}
                max={65}
                step={1}
                className="flex-1"
                data-testid="slider-age"
              />
              <span className="w-12 text-center font-medium">{formData.averageAge}</span>
            </div>
          </div>
          <div>
            <Label>{language === "tr" ? "Öğrenme Hızı" : "Learning Pace"}</Label>
            <Select value={formData.learningPace} onValueChange={(v) => updateFormData("learningPace", v)}>
              <SelectTrigger className="mt-2" data-testid="select-pace">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">{language === "tr" ? "Yavaş" : "Slow"}</SelectItem>
                <SelectItem value="moderate">{language === "tr" ? "Orta" : "Moderate"}</SelectItem>
                <SelectItem value="fast">{language === "tr" ? "Hızlı" : "Fast"}</SelectItem>
                <SelectItem value="intensive">{language === "tr" ? "Yoğun" : "Intensive"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>{language === "tr" ? "Öğrenme Stilleri" : "Learning Styles"}</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {LEARNING_STYLES.map(style => (
              <div key={style.value} className="flex items-center space-x-2">
                <Checkbox
                  id={style.value}
                  checked={formData.learningStyle.includes(style.value)}
                  onCheckedChange={() => toggleArrayItem("learningStyle", style.value)}
                  data-testid={`checkbox-style-${style.value}`}
                />
                <label htmlFor={style.value} className="text-sm">
                  {language === "tr" ? style.labelTr : style.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>{language === "tr" ? "Ön Bilgi Gereksinimleri" : "Prior Knowledge Requirements"}</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder={language === "tr" ? "Örn: Temel matematik" : "E.g., Basic mathematics"}
              value={formData.prerequisiteInput}
              onChange={(e) => updateFormData("prerequisiteInput", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addToArray("priorKnowledge", "prerequisiteInput")}
              data-testid="input-prior-knowledge"
            />
            <Button type="button" onClick={() => addToArray("priorKnowledge", "prerequisiteInput")} data-testid="btn-add-knowledge">
              +
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.priorKnowledge.map((item, i) => (
              <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray("priorKnowledge", i)}>
                {item} ✕
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentStep = () => (
    <div className="space-y-6" data-testid="content-step">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            {language === "tr" ? "İçerik Tasarımı" : "Content Design"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "tr" ? "Kurs içeriği ve pedagojik yaklaşımı belirleyin" : "Define course content and pedagogical approach"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{language === "tr" ? "Tasarım Adı" : "Design Name"} *</Label>
            <Input
              placeholder={language === "tr" ? "Örn: TYT Matematik 2025" : "E.g., TYT Math 2025"}
              value={formData.designName}
              onChange={(e) => updateFormData("designName", e.target.value)}
              className="mt-2"
              data-testid="input-design-name"
            />
          </div>
          <div>
            <Label>{language === "tr" ? "Kurs Başlığı" : "Course Title"} *</Label>
            <Input
              placeholder={language === "tr" ? "Örn: İleri Seviye Web Geliştirme" : "E.g., Advanced Web Development"}
              value={formData.courseTitle}
              onChange={(e) => updateFormData("courseTitle", e.target.value)}
              className="mt-2"
              data-testid="input-course-title"
            />
          </div>
        </div>

        <div>
          <Label>{language === "tr" ? "Açıklama" : "Description"}</Label>
          <Textarea
            placeholder={language === "tr" ? "Kurs hakkında kısa açıklama..." : "Brief description about the course..."}
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            className="mt-2"
            rows={3}
            data-testid="textarea-description"
          />
        </div>

        <div>
          <Label>{language === "tr" ? "Konular" : "Topics"}</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder={language === "tr" ? "Konu ekle..." : "Add topic..."}
              value={formData.topicInput}
              onChange={(e) => updateFormData("topicInput", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addToArray("topics", "topicInput")}
              data-testid="input-topic"
            />
            <Button type="button" onClick={() => addToArray("topics", "topicInput")} data-testid="btn-add-topic">
              +
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.topics.map((topic, i) => (
              <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray("topics", i)}>
                {topic.name} ✕
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>{language === "tr" ? "Öğretim Yöntemi" : "Instructional Method"}</Label>
          <Select value={formData.instructionalMethod} onValueChange={(v) => updateFormData("instructionalMethod", v)}>
            <SelectTrigger className="mt-2" data-testid="select-method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INSTRUCTIONAL_METHODS.map(method => (
                <SelectItem key={method.value} value={method.value}>
                  {language === "tr" ? method.labelTr : method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{language === "tr" ? "Değerlendirme Türleri" : "Assessment Types"}</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {ASSESSMENT_TYPES.map(type => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`assessment-${type.value}`}
                  checked={formData.assessmentType.includes(type.value)}
                  onCheckedChange={() => toggleArrayItem("assessmentType", type.value)}
                  data-testid={`checkbox-assessment-${type.value}`}
                />
                <label htmlFor={`assessment-${type.value}`} className="text-sm">
                  {language === "tr" ? type.labelTr : type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{language === "tr" ? "Pratik Egzersiz Oranı" : "Practical Exercises %"}: {formData.practicalExercisesPercent}%</Label>
            <Slider
              value={[formData.practicalExercisesPercent]}
              onValueChange={([value]) => updateFormData("practicalExercisesPercent", value)}
              min={0}
              max={100}
              step={5}
              className="mt-2"
              data-testid="slider-practical"
            />
          </div>
          <div>
            <Label>{language === "tr" ? "İçerik Karmaşıklığı" : "Content Complexity"}</Label>
            <Select value={formData.contentComplexity} onValueChange={(v) => updateFormData("contentComplexity", v)}>
              <SelectTrigger className="mt-2" data-testid="select-complexity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{language === "tr" ? "Düşük" : "Low"}</SelectItem>
                <SelectItem value="intermediate">{language === "tr" ? "Orta" : "Intermediate"}</SelectItem>
                <SelectItem value="high">{language === "tr" ? "Yüksek" : "High"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="project-based"
            checked={formData.projectBasedLearning}
            onCheckedChange={(checked) => updateFormData("projectBasedLearning", checked)}
            data-testid="switch-project"
          />
          <Label htmlFor="project-based">
            {language === "tr" ? "Proje Tabanlı Öğrenme" : "Project-Based Learning"}
          </Label>
        </div>
      </div>
    </div>
  );

  const renderBusinessStep = () => (
    <div className="space-y-6" data-testid="business-step">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            {language === "tr" ? "İş Hedefleri" : "Business Goals"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "tr" ? "Operasyonel ve finansal hedefleri belirleyin" : "Define operational and financial targets"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{language === "tr" ? "Tahmini Süre (Saat)" : "Estimated Hours"}</Label>
            <Input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => updateFormData("estimatedHours", parseInt(e.target.value) || 0)}
              min={1}
              max={500}
              className="mt-2"
              data-testid="input-hours"
            />
          </div>
          <div>
            <Label>{language === "tr" ? "Hedef Öğrenci Sayısı" : "Target Students"}</Label>
            <Input
              type="number"
              value={formData.targetStudents}
              onChange={(e) => updateFormData("targetStudents", parseInt(e.target.value) || 0)}
              min={1}
              className="mt-2"
              data-testid="input-students"
            />
          </div>
        </div>

        <div>
          <Label>{language === "tr" ? "Hedef Tamamlama Oranı" : "Target Completion Rate"}: {formData.targetCompletion}%</Label>
          <Slider
            value={[formData.targetCompletion]}
            onValueChange={([value]) => updateFormData("targetCompletion", value)}
            min={50}
            max={100}
            step={5}
            className="mt-2"
            data-testid="slider-completion"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{language === "tr" ? "Öğrenci Başına Maliyet" : "Cost Per Student"}</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.costPerStudent}
              onChange={(e) => updateFormData("costPerStudent", e.target.value)}
              className="mt-2"
              data-testid="input-cost"
            />
          </div>
          <div>
            <Label>{language === "tr" ? "Öğrenci Başına Gelir" : "Revenue Per Student"}</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.revenuePerStudent}
              onChange={(e) => updateFormData("revenuePerStudent", e.target.value)}
              className="mt-2"
              data-testid="input-revenue"
            />
          </div>
        </div>

        <div>
          <Label>{language === "tr" ? "Pazar Talebi" : "Market Demand"}</Label>
          <Select value={formData.marketDemand} onValueChange={(v) => updateFormData("marketDemand", v)}>
            <SelectTrigger className="mt-2" data-testid="select-demand">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{language === "tr" ? "Düşük" : "Low"}</SelectItem>
              <SelectItem value="moderate">{language === "tr" ? "Orta" : "Moderate"}</SelectItem>
              <SelectItem value="high">{language === "tr" ? "Yüksek" : "High"}</SelectItem>
              <SelectItem value="very-high">{language === "tr" ? "Çok Yüksek" : "Very High"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{language === "tr" ? "Rekabet Avantajı" : "Competitive Advantage"}</Label>
          <Textarea
            placeholder={language === "tr" ? "Bu kursu rakiplerden ayıran özellikler..." : "What makes this course stand out from competitors..."}
            value={formData.competitiveAdvantage}
            onChange={(e) => updateFormData("competitiveAdvantage", e.target.value)}
            className="mt-2"
            rows={2}
            data-testid="textarea-advantage"
          />
        </div>
      </div>
    </div>
  );

  const renderMetricsStep = () => (
    <div className="space-y-6" data-testid="metrics-step">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            {language === "tr" ? "Başarı Metrikleri" : "Success Metrics"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "tr" ? "Kurumsal KPI hedeflerini belirleyin" : "Define KPI targets for your curriculum"}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                {language === "tr" ? "Etkileşim Skoru" : "Engagement Score"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.targetEngagement]}
                  onValueChange={([value]) => updateFormData("targetEngagement", value)}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                  data-testid="slider-engagement"
                />
                <span className="w-12 text-center font-bold text-lg">{formData.targetEngagement}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4" />
                {language === "tr" ? "Ustalık Seviyesi" : "Mastery Level"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.targetMastery]}
                  onValueChange={([value]) => updateFormData("targetMastery", value)}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                  data-testid="slider-mastery"
                />
                <span className="w-12 text-center font-bold text-lg">{formData.targetMastery}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-4 w-4" />
                {language === "tr" ? "Memnuniyet Puanı" : "Satisfaction Rating"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.targetSatisfaction * 20]}
                  onValueChange={([value]) => updateFormData("targetSatisfaction", value / 20)}
                  min={20}
                  max={100}
                  step={10}
                  className="flex-1"
                  data-testid="slider-satisfaction"
                />
                <span className="w-12 text-center font-bold text-lg">{formData.targetSatisfaction.toFixed(1)}/5</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {language === "tr" ? "Tutma Oranı" : "Retention Rate"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.targetRetention]}
                  onValueChange={([value]) => updateFormData("targetRetention", value)}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                  data-testid="slider-retention"
                />
                <span className="w-12 text-center font-bold text-lg">{formData.targetRetention}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {language === "tr" ? "AI Tavsiye Sistemi" : "AI Recommendation System"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === "tr" 
                ? "Müfredat oluşturulduktan sonra, AI sistemi otomatik olarak metrikleri izleyecek ve iyileştirme önerileri sunacaktır."
                : "After curriculum creation, the AI system will automatically track metrics and provide improvement recommendations."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6" data-testid="review-step">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            {language === "tr" ? "İncele & Oluştur" : "Review & Create"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "tr" ? "Müfredat tasarımınızı gözden geçirin" : "Review your curriculum design"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              {language === "tr" ? "Öğrenci Profili" : "Learner Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>{language === "tr" ? "Hedef Kitle:" : "Target:"}</strong> {formData.targetAudience.join(", ") || "Not specified"}</p>
            <p><strong>{language === "tr" ? "Yaş:" : "Age:"}</strong> ~{formData.averageAge}</p>
            <p><strong>{language === "tr" ? "Hız:" : "Pace:"}</strong> {formData.learningPace}</p>
            <p><strong>{language === "tr" ? "Stil:" : "Styles:"}</strong> {formData.learningStyle.join(", ")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              {language === "tr" ? "İçerik Tasarımı" : "Content Design"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>{language === "tr" ? "Tasarım:" : "Design:"}</strong> {formData.designName || "Not specified"}</p>
            <p><strong>{language === "tr" ? "Kurs:" : "Course:"}</strong> {formData.courseTitle || "Not specified"}</p>
            <p><strong>{language === "tr" ? "Yöntem:" : "Method:"}</strong> {formData.instructionalMethod}</p>
            <p><strong>{language === "tr" ? "Konular:" : "Topics:"}</strong> {formData.topics.length} topics</p>
            <p><strong>{language === "tr" ? "Pratik:" : "Practical:"}</strong> {formData.practicalExercisesPercent}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-500" />
              {language === "tr" ? "İş Hedefleri" : "Business Goals"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>{language === "tr" ? "Süre:" : "Duration:"}</strong> {formData.estimatedHours} hours</p>
            <p><strong>{language === "tr" ? "Hedef:" : "Target:"}</strong> {formData.targetStudents} students</p>
            <p><strong>{language === "tr" ? "Tamamlama:" : "Completion:"}</strong> {formData.targetCompletion}%</p>
            <p><strong>{language === "tr" ? "Talep:" : "Demand:"}</strong> {formData.marketDemand}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              {language === "tr" ? "Başarı Metrikleri" : "Success Metrics"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{formData.targetEngagement}%</div>
                <div className="text-xs text-muted-foreground">{language === "tr" ? "Etkileşim" : "Engagement"}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formData.targetMastery}%</div>
                <div className="text-xs text-muted-foreground">{language === "tr" ? "Ustalık" : "Mastery"}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{formData.targetSatisfaction}/5</div>
                <div className="text-xs text-muted-foreground">{language === "tr" ? "Memnuniyet" : "Satisfaction"}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{formData.targetRetention}%</div>
                <div className="text-xs text-muted-foreground">{language === "tr" ? "Tutma" : "Retention"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderLearnerStep();
      case 1: return renderContentStep();
      case 2: return renderBusinessStep();
      case 3: return renderMetricsStep();
      case 4: return renderReviewStep();
      default: return null;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            {language === "tr" ? "Müfredat Tasarım Sihirbazı" : "Curriculum Design Wizard"}
          </CardTitle>
          <CardDescription>
            {language === "tr" 
              ? "Üç boyutlu müfredat tasarımı: Öğrenci, İçerik ve İş parametreleri"
              : "Three-dimensional curriculum design: Learner, Content, and Business parameters"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                  data-testid={`step-${step.id}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`w-12 md:w-24 h-0.5 mx-2 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              data-testid="btn-prev"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === "tr" ? "Geri" : "Back"}
            </Button>
            
            {currentStep < WIZARD_STEPS.length - 1 ? (
              <Button onClick={nextStep} data-testid="btn-next">
                {language === "tr" ? "İleri" : "Next"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateDesign}
                disabled={createDesignMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                data-testid="btn-create"
              >
                {createDesignMutation.isPending ? (
                  <>{language === "tr" ? "Oluşturuluyor..." : "Creating..."}</>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {language === "tr" ? "Müfredat Oluştur" : "Create Curriculum"}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Existing Designs */}
      {designs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === "tr" ? "Mevcut Tasarımlar" : "Existing Designs"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {designs.map((design: any) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => setActiveDesign(design.id)}
                  data-testid={`design-${design.id}`}
                >
                  <div>
                    <p className="font-medium">{design.designName}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === "tr" ? "Aşama:" : "Stage:"} {design.stage} | {language === "tr" ? "Durum:" : "Status:"} {design.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={design.progressPercent || 0} className="w-20 h-2" />
                    <Badge variant={design.status === "active" ? "default" : "secondary"}>
                      {design.progressPercent || 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
