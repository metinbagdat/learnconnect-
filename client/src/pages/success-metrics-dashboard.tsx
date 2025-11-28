import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Target, Clock,
  Award, Brain, CheckCircle2, AlertCircle, Activity, Zap,
  BookOpen, GraduationCap, DollarSign, RefreshCw
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  target?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: any;
  color: string;
}

function MetricCard({ title, value, target, trend, trendValue, icon: Icon, color }: MetricCardProps) {
  const progressValue = target ? (Number(value) / target) * 100 : 0;
  
  return (
    <Card data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {target && <span className="text-sm text-muted-foreground">/ {target}</span>}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 mt-1 text-sm ${
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
          }`}>
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : 
             trend === "down" ? <TrendingDown className="h-3 w-3" /> : 
             <Activity className="h-3 w-3" />}
            {trendValue}
          </div>
        )}
        {target && (
          <Progress value={Math.min(progressValue, 100)} className="h-1.5 mt-2" />
        )}
      </CardContent>
    </Card>
  );
}

export function SuccessMetricsDashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedDesign, setSelectedDesign] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("7d");

  const { data: designs = [] } = useQuery<any[]>({
    queryKey: ["/api/curriculum-designs"],
    enabled: !!user,
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/success-metrics", selectedDesign, timeRange],
    enabled: !!user,
  });

  const engagementMetrics = [
    { 
      title: language === "tr" ? "Tamamlama Oranı" : "Completion Rate", 
      value: "78%", 
      target: 85, 
      trend: "up" as const, 
      trendValue: "+5% vs last week",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
    },
    { 
      title: language === "tr" ? "Etkileşim Skoru" : "Engagement Score", 
      value: 72, 
      target: 80, 
      trend: "up" as const, 
      trendValue: "+8 points",
      icon: Zap,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
    },
    { 
      title: language === "tr" ? "Aktif Öğrenci" : "Active Students", 
      value: 156, 
      target: 200, 
      trend: "up" as const, 
      trendValue: "+12 this week",
      icon: Users,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
    },
    { 
      title: language === "tr" ? "Ort. Oturum Süresi" : "Avg Session Time", 
      value: "32 min", 
      trend: "neutral" as const, 
      trendValue: "stable",
      icon: Clock,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
    },
  ];

  const learningMetrics = [
    { 
      title: language === "tr" ? "Ustalık Seviyesi" : "Mastery Level", 
      value: "76%", 
      target: 85, 
      trend: "up" as const, 
      trendValue: "+3% improvement",
      icon: Brain,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
    },
    { 
      title: language === "tr" ? "Quiz Başarısı" : "Quiz Pass Rate", 
      value: "82%", 
      target: 80, 
      trend: "up" as const, 
      trendValue: "Above target!",
      icon: Target,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
    },
    { 
      title: language === "tr" ? "Tutma Oranı" : "Retention Rate", 
      value: "68%", 
      target: 75, 
      trend: "down" as const, 
      trendValue: "-2% vs target",
      icon: RefreshCw,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
    },
    { 
      title: language === "tr" ? "Sertifika Oranı" : "Certification Rate", 
      value: "45%", 
      target: 60, 
      trend: "up" as const, 
      trendValue: "+8% this month",
      icon: Award,
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400"
    },
  ];

  const businessMetrics = [
    { 
      title: language === "tr" ? "Toplam Kayıt" : "Total Enrollments", 
      value: 324, 
      target: 400, 
      trend: "up" as const, 
      trendValue: "+28 this week",
      icon: GraduationCap,
      color: "bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-400"
    },
    { 
      title: language === "tr" ? "Memnuniyet" : "Satisfaction", 
      value: "4.6/5", 
      trend: "up" as const, 
      trendValue: "+0.2 improvement",
      icon: Award,
      color: "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400"
    },
    { 
      title: language === "tr" ? "NPS Skoru" : "NPS Score", 
      value: 52, 
      target: 50, 
      trend: "up" as const, 
      trendValue: "Promoter zone!",
      icon: TrendingUp,
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400"
    },
    { 
      title: language === "tr" ? "Referans Oranı" : "Referral Rate", 
      value: "18%", 
      target: 25, 
      trend: "up" as const, 
      trendValue: "+3% growth",
      icon: Users,
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400"
    },
  ];

  const feedbackLoops = [
    {
      cycle: 1,
      date: "2025-11-15",
      problem: language === "tr" ? "Modül 3'te düşük tamamlama" : "Low completion in Module 3",
      action: language === "tr" ? "Video içerik eklendi" : "Added video content",
      before: "65%",
      after: "78%",
      impact: "+20%",
      status: "completed"
    },
    {
      cycle: 2,
      date: "2025-11-22",
      problem: language === "tr" ? "Quiz zorluğu şikayetleri" : "Quiz difficulty complaints",
      action: language === "tr" ? "Zorluk seviyesi ayarlandı" : "Adjusted difficulty levels",
      before: "3.2/5",
      after: "4.1/5",
      impact: "+28%",
      status: "completed"
    },
    {
      cycle: 3,
      date: "2025-11-28",
      problem: language === "tr" ? "Peer öğrenme eksikliği" : "Lack of peer learning",
      action: language === "tr" ? "Tartışma forumu ekleniyor" : "Adding discussion forum",
      before: "N/A",
      after: "TBD",
      impact: "Pending",
      status: "in_progress"
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6" data-testid="success-metrics-dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            {language === "tr" ? "Başarı Metrikleri Paneli" : "Success Metrics Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {language === "tr" 
              ? "Müfredat performansını izleyin ve sürekli iyileştirme yapın" 
              : "Track curriculum performance and drive continuous improvement"}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDesign} onValueChange={setSelectedDesign}>
            <SelectTrigger className="w-[200px]" data-testid="select-design">
              <SelectValue placeholder={language === "tr" ? "Müfredat Seçin" : "Select Curriculum"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === "tr" ? "Tüm Müfredatlar" : "All Curriculums"}</SelectItem>
              {designs.map((design: any) => (
                <SelectItem key={design.id} value={String(design.id)}>{design.designName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]" data-testid="select-timerange">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{language === "tr" ? "7 Gün" : "7 Days"}</SelectItem>
              <SelectItem value="30d">{language === "tr" ? "30 Gün" : "30 Days"}</SelectItem>
              <SelectItem value="90d">{language === "tr" ? "90 Gün" : "90 Days"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Tabs */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement" data-testid="tab-engagement">
            <Zap className="h-4 w-4 mr-2" />
            {language === "tr" ? "Etkileşim" : "Engagement"}
          </TabsTrigger>
          <TabsTrigger value="learning" data-testid="tab-learning">
            <Brain className="h-4 w-4 mr-2" />
            {language === "tr" ? "Öğrenme" : "Learning"}
          </TabsTrigger>
          <TabsTrigger value="business" data-testid="tab-business">
            <DollarSign className="h-4 w-4 mr-2" />
            {language === "tr" ? "İş" : "Business"}
          </TabsTrigger>
          <TabsTrigger value="feedback" data-testid="tab-feedback">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === "tr" ? "Geri Bildirim" : "Feedback"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementMetrics.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "tr" ? "Etkileşim Trendleri" : "Engagement Trends"}
              </CardTitle>
              <CardDescription>
                {language === "tr" ? "Son 7 günlük aktivite" : "Activity over the last 7 days"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mr-2 opacity-20" />
                {language === "tr" ? "Grafik verileri yükleniyor..." : "Chart data loading..."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningMetrics.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "tr" ? "Öğrenme İlerlemesi" : "Learning Progress"}
              </CardTitle>
              <CardDescription>
                {language === "tr" ? "Modül bazlı tamamlama oranları" : "Module-level completion rates"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Module 1: Fundamentals", "Module 2: Core Concepts", "Module 3: Advanced Topics", "Module 4: Projects"].map((module, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{module}</span>
                    <span className="font-medium">{85 - i * 10}%</span>
                  </div>
                  <Progress value={85 - i * 10} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessMetrics.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "tr" ? "Gelir Metrikleri" : "Revenue Metrics"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === "tr" ? "Toplam Gelir" : "Total Revenue"}</span>
                    <span className="font-bold">$48,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === "tr" ? "Öğrenci Başına" : "Per Student"}</span>
                    <span className="font-bold">$149.69</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === "tr" ? "Tamamlama Başına Maliyet" : "Cost Per Completion"}</span>
                    <span className="font-bold">$35.20</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "tr" ? "Büyüme Göstergeleri" : "Growth Indicators"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{language === "tr" ? "Aylık Büyüme" : "Monthly Growth"}</span>
                    <Badge variant="default" className="bg-green-600">+12%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{language === "tr" ? "Yeniden Kayıt" : "Re-enrollment"}</span>
                    <Badge variant="default" className="bg-blue-600">42%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{language === "tr" ? "Churn Oranı" : "Churn Rate"}</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                {language === "tr" ? "İterasyon Döngüleri" : "Iteration Cycles"}
              </CardTitle>
              <CardDescription>
                {language === "tr" 
                  ? "Sürekli iyileştirme: Ölç → Analiz Et → İyileştir → Tekrarla" 
                  : "Continuous improvement: Measure → Analyze → Improve → Repeat"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackLoops.map((loop, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3" data-testid={`feedback-loop-${loop.cycle}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={loop.status === "completed" ? "default" : "secondary"}>
                          {language === "tr" ? `Döngü ${loop.cycle}` : `Cycle ${loop.cycle}`}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{loop.date}</span>
                      </div>
                      <Badge variant={loop.status === "completed" ? "outline" : "default"} className={
                        loop.status === "completed" ? "text-green-600 border-green-600" : ""
                      }>
                        {loop.status === "completed" 
                          ? (language === "tr" ? "Tamamlandı" : "Completed")
                          : (language === "tr" ? "Devam Ediyor" : "In Progress")}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{language === "tr" ? "Problem" : "Problem"}</p>
                        <p className="font-medium">{loop.problem}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{language === "tr" ? "Aksiyon" : "Action"}</p>
                        <p className="font-medium">{loop.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{language === "tr" ? "Önce:" : "Before:"}</span>
                        <span className="font-medium">{loop.before}</span>
                      </div>
                      <span className="text-muted-foreground">→</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{language === "tr" ? "Sonra:" : "After:"}</span>
                        <span className="font-medium">{loop.after}</span>
                      </div>
                      <Badge variant="outline" className={
                        loop.impact.startsWith("+") ? "text-green-600 border-green-600" : ""
                      }>
                        {loop.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {language === "tr" ? "AI Önerileri" : "AI Recommendations"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  {language === "tr" 
                    ? "Modül 4'te video içerik oranını %40'tan %60'a çıkarın - öğrenci tercihi analizi"
                    : "Increase video content in Module 4 from 40% to 60% - student preference analysis"}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  {language === "tr" 
                    ? "Haftalık mentor check-in'leri ekleyin - tutma oranını artırma potansiyeli"
                    : "Add weekly mentor check-ins - potential to improve retention rate"}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  {language === "tr" 
                    ? "Spaced repetition hatırlatmalarını optimize edin - %15 daha iyi hatırlama"
                    : "Optimize spaced repetition reminders - 15% better recall potential"}
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
