import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Users, BookOpen, Briefcase, BarChart3, 
  TrendingUp, RefreshCw, Zap, CheckCircle2, AlertCircle
} from "lucide-react";

export function CurriculumFrameworkDisplay() {
  const { t } = useLanguage();
  const [selectedDimension, setSelectedDimension] = useState("learner");
  const [animateFlow, setAnimateFlow] = useState(true);

  // Fetch curriculum examples
  const { data: examples = {} } = useQuery({
    queryKey: ["/api/curriculum-examples"],
  });

  const framework = examples.framework || {};
  const exampleCourses = examples.examples || [];

  const dimensions = {
    learner: {
      title: "Learner Parameters",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      items: ["Target Audience", "Prior Knowledge", "Learning Style", "Learning Pace", "Motivation Factors"],
      description: "Who is learning and their characteristics"
    },
    content: {
      title: "Content Dimension",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      items: ["Topics & Objectives", "Instructional Method", "Assessment Types", "Project-Based Learning", "Real-World Applications"],
      description: "What is being taught and how"
    },
    business: {
      title: "Business Dimension",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      items: ["Business Goals", "Target Completion %", "Revenue per Student", "Market Demand", "Competitive Advantage"],
      description: "Why the course exists and its metrics"
    }
  };

  const metrics = {
    quantitative: {
      title: "Quantitative Metrics",
      icon: BarChart3,
      items: ["Completion Rate", "Engagement Score", "Mastery Level", "Pass Rate", "Retention Rate"]
    },
    qualitative: {
      title: "Qualitative Metrics",
      icon: Zap,
      items: ["Satisfaction Rating", "Learner Testimonials", "Skill Acquisition", "Student Feedback", "Quality Score"]
    }
  };

  const feedbackCycle = [
    { step: 1, phase: "Establish Baseline", description: "Measure initial metrics", icon: "📊" },
    { step: 2, phase: "Form Hypothesis", description: "Analyze learner data and patterns", icon: "🧠" },
    { step: 3, phase: "Implement Change", description: "Adjust content, pedagogy, or sequence", icon: "🔧" },
    { step: 4, phase: "A/B Test", description: "Test with subset or rapid pilot", icon: "🧪" },
    { step: 5, phase: "Analyze Results", description: "Measure impact and effectiveness", icon: "📈" },
    { step: 6, phase: "Decide & Iterate", description: "Keep, improve, or pivot", icon: "✅" }
  ];

  const DimensionCard = ({ id, data }: any) => (
    <button
      onClick={() => setSelectedDimension(id)}
      className={`relative group cursor-pointer transition-all duration-300 ${
        selectedDimension === id ? "scale-105" : "hover:scale-102"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-0 group-hover:opacity-20 rounded-lg blur transition-opacity`} />
      <Card className={`relative border-2 transition-all ${selectedDimension === id ? "border-primary" : "border-transparent"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <data.icon className="w-5 h-5" />
            <CardTitle className="text-base">{data.title}</CardTitle>
          </div>
          <CardDescription className="text-xs">{data.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {data.items.slice(0, 3).map((item: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
            {data.items.length > 3 && <Badge variant="outline" className="text-xs">+{data.items.length - 3}</Badge>}
          </div>
        </CardContent>
      </Card>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Curriculum Design Framework
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three-dimensional system connecting learner parameters, success metrics, and iterative feedback loops
          </p>
        </div>

        {/* Part 1: Input Parameters */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">1️⃣</span>
              Input Parameters (3 Dimensions)
            </CardTitle>
            <CardDescription>Define WHO is learning, WHAT is being taught, and WHY</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(dimensions).map(([id, data]: any) => (
                <DimensionCard key={id} id={id} data={data} />
              ))}
            </div>

            {/* Detailed view of selected dimension */}
            {selectedDimension && (
              <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold mb-3">{dimensions[selectedDimension as keyof typeof dimensions]?.title} - All Factors</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {dimensions[selectedDimension as keyof typeof dimensions]?.items.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Arrow Flow */}
        <div className="flex justify-center">
          <div className={`flex items-center gap-2 text-primary text-lg font-semibold ${animateFlow ? "animate-bounce" : ""}`}>
            <ArrowRight className="w-6 h-6" />
            Parameters Feed Into
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        {/* Part 2: Success Metrics */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">2️⃣</span>
              Success Metrics (How to Measure Effectiveness)
            </CardTitle>
            <CardDescription>Quantitative and qualitative indicators of learning success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(metrics).map(([key, data]: any) => (
                <Card key={key} className="bg-slate-50 dark:bg-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <data.icon className="w-5 h-5" />
                      {data.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.items.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Formula */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 rounded">
              <p className="text-sm font-semibold mb-2">Effectiveness Score Formula:</p>
              <p className="text-xs text-muted-foreground">
                (Completion Rate × 0.25) + (Mastery Level × 0.35) + (Satisfaction Rating × 20) + (Engagement Score × 0.2) = Current Effectiveness %
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Arrow Flow */}
        <div className="flex justify-center">
          <div className={`flex items-center gap-2 text-primary text-lg font-semibold ${animateFlow ? "animate-bounce" : ""}`}>
            <ArrowRight className="w-6 h-6" />
            Metrics Enable
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        {/* Part 3: Feedback Loop */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">3️⃣</span>
              Iterative Feedback Loop (Self-Improving Cycle)
            </CardTitle>
            <CardDescription>Six-phase cycle for continuous curriculum optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Circular Flow Visualization */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {feedbackCycle.map((item, idx) => (
                  <div key={item.step} className="relative">
                    <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <p className="font-semibold text-sm">{item.phase}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <Badge className="mt-2" variant="outline">Step {item.step}</Badge>
                    </Card>
                    {idx < feedbackCycle.length - 1 && (
                      <ArrowRight className={`absolute -right-4 top-1/2 w-4 h-4 text-primary ${idx % 2 === 0 ? "hidden md:block" : ""}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Loop Connection */}
              <div className="text-center mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                <p className="text-sm font-semibold flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Then LOOP back to Step 1 with new learnings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-World Examples */}
        {exampleCourses.length > 0 && (
          <Card className="border-2 border-amber-500/20 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Real-World Examples
              </CardTitle>
              <CardDescription>How the framework applies to actual courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {exampleCourses.map((course: any, idx: number) => (
                  <Card key={idx} className="bg-white dark:bg-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{course.name}</CardTitle>
                      <CardDescription className="text-xs">{course.target}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Outcome:</strong> {course.keyOutcome || course.caseStudy}</div>
                      <div className="flex flex-wrap gap-1">
                        {course.keyMetrics && Object.entries(course.keyMetrics).map(([key, val]: any) => (
                          <Badge key={key} variant="secondary">{val}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Toggle */}
        <div className="flex justify-center gap-4 pb-8">
          <Button 
            onClick={() => setAnimateFlow(!animateFlow)}
            variant={animateFlow ? "default" : "outline"}
          >
            {animateFlow ? "⏸" : "▶"} {animateFlow ? "Pause" : "Play"} Flow Animation
          </Button>
        </div>
      </div>
    </div>
  );
}
