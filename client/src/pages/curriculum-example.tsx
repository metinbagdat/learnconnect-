import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export function CurriculumExample() {
  const bootcamp = {
    name: "Data Science Bootcamp",
    cycles: [
      {
        cycle: 1,
        params: {
          learner: { audience: "Career changers", avgAge: 32, priorKnowledge: ["Python basics"], pace: "moderate" },
          content: { hours: 120, modules: 8, practical: 40, projects: 3 },
          business: { targetStudents: 50, revenue: "$15000", targetCompletion: 80 }
        },
        beforeMetrics: { completion: 65, satisfaction: 3.2, engagement: 65, mastery: 55 },
        changes: [
          "Added real-world projects earlier (week 2 vs week 4)",
          "Increased mentorship from 2x to 3x per week",
          "Simplified statistics intro, added visual explanations"
        ],
        afterMetrics: { completion: 78, satisfaction: 4.1, engagement: 82, mastery: 72 },
        improvement: "+18% completion, +28% satisfaction"
      },
      {
        cycle: 2,
        params: { learner: { audience: "Career changers", avgAge: 32, priorKnowledge: ["Python basics"], pace: "moderate" },
          content: { hours: 120, modules: 8, practical: 50, projects: 4 },
          business: { targetStudents: 65, revenue: "$19500", targetCompletion: 90 }
        },
        beforeMetrics: { completion: 78, satisfaction: 4.1, engagement: 82, mastery: 72 },
        changes: [
          "Added peer programming pairs",
          "Created ML project competition with prizes",
          "Extended office hours to include async Q&A"
        ],
        afterMetrics: { completion: 88, satisfaction: 4.6, engagement: 91, mastery: 84 },
        improvement: "+10% completion, +12% satisfaction"
      }
    ]
  };

  const chartData = [
    { metric: "Completion", cycle1: 65, cycle2: 78, cycle3: 88 },
    { metric: "Satisfaction", cycle1: 3.2, cycle2: 4.1, cycle3: 4.6 },
    { metric: "Engagement", cycle1: 65, cycle2: 82, cycle3: 91 },
    { metric: "Mastery", cycle1: 55, cycle2: 72, cycle3: 84 }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{bootcamp.name}</h1>
        <p className="text-muted-foreground">Concrete Example: Three-Part Framework with Feedback Loops</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cycle1">Cycle 1</TabsTrigger>
          <TabsTrigger value="cycle2">Cycle 2</TabsTrigger>
          <TabsTrigger value="comparison">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Design Framework: Three Dimensions</CardTitle>
              <CardDescription>How curriculum parameters interconnect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Learner Dimension */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Learner Dimension</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Target Audience:</strong> Career changers</p>
                    <p><strong>Avg Age:</strong> 32 years old</p>
                    <p><strong>Prior Knowledge:</strong> Python basics</p>
                    <p><strong>Learning Pace:</strong> Moderate (part-time + work)</p>
                    <p><strong>Key Need:</strong> Practical skills + job placement</p>
                  </CardContent>
                </Card>

                {/* Content Dimension */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Content Dimension</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Duration:</strong> 120 hours</p>
                    <p><strong>Modules:</strong> 8 core + 2 specialized</p>
                    <p><strong>Practical Work:</strong> 40-50%</p>
                    <p><strong>Projects:</strong> 3-4 capstone projects</p>
                    <p><strong>Key Skills:</strong> ML, Statistics, Python, SQL</p>
                  </CardContent>
                </Card>

                {/* Business Dimension */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Business Dimension</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Target Students:</strong> 50-65 per cohort</p>
                    <p><strong>Revenue/Student:</strong> $300</p>
                    <p><strong>Business Goal:</strong> 80-90% completion</p>
                    <p><strong>ROI Focus:</strong> Job placement rate</p>
                    <p><strong>Market Position:</strong> Premium bootcamp</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle1">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Cycle 1: Initial Launch</CardTitle>
              <CardDescription>Measuring and learning from the first cohort</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Before Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">65%</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-2xl font-bold">3.2/5</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">65%</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Mastery</p>
                    <p className="text-2xl font-bold">55%</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Changes Made</h3>
                <div className="space-y-2">
                  {bootcamp.cycles[0].changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">Change {i + 1}</Badge>
                      <p className="text-sm">{change}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">After Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">78%</p>
                    <p className="text-xs text-green-600">+13%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-2xl font-bold text-green-600">4.1/5</p>
                    <p className="text-xs text-green-600">+28%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold text-green-600">82%</p>
                    <p className="text-xs text-green-600">+17%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Mastery</p>
                    <p className="text-2xl font-bold text-green-600">72%</p>
                    <p className="text-xs text-green-600">+17%</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <p className="font-semibold text-sm mb-1">💡 AI Recommendation for Cycle 2:</p>
                <p className="text-sm">Early engagement wins (projects + mentorship) are highly effective. Expand to peer learning and create community competition to maintain momentum and hit 90% completion target.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle2">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Cycle 2: Scale & Optimize</CardTitle>
              <CardDescription>Building on cycle 1 learnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Before Metrics (From Cycle 1)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-2xl font-bold">4.1/5</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">82%</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm text-muted-foreground">Mastery</p>
                    <p className="text-2xl font-bold">72%</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Changes Made</h3>
                <div className="space-y-2">
                  {bootcamp.cycles[1].changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">Change {i + 1}</Badge>
                      <p className="text-sm">{change}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">After Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">88%</p>
                    <p className="text-xs text-green-600">+10%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-2xl font-bold text-green-600">4.6/5</p>
                    <p className="text-xs text-green-600">+12%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold text-green-600">91%</p>
                    <p className="text-xs text-green-600">+9%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="text-sm text-muted-foreground">Mastery</p>
                    <p className="text-2xl font-bold text-green-600">84%</p>
                    <p className="text-xs text-green-600">+12%</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                <p className="font-semibold text-sm mb-1">🎯 Business Impact:</p>
                <p className="text-sm">At 88% completion rate × 65 students = 57 graduates. With 80% job placement = 46 placed. Revenue: $19,500. On track for Series B metrics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Loop Results: Progressive Improvement</CardTitle>
              <CardDescription>How iterative cycles compound effectiveness</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cycle1" stroke="#3b82f6" name="Cycle 1 Before" />
                    <Line type="monotone" dataKey="cycle2" stroke="#10b981" name="Cycle 1-2 After" />
                    <Line type="monotone" dataKey="cycle3" stroke="#8b5cf6" name="Cycle 2 End" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">+23%</p>
                    <p className="text-xs text-muted-foreground">Average across all metrics</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Learner Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">4.6/5</p>
                    <p className="text-xs text-muted-foreground">+43% from cycle 1</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revenue Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">+30%</p>
                    <p className="text-xs text-muted-foreground">$15k → $19.5k per cohort</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Key Insights from Feedback Loops</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ <strong>Early engagement matters:</strong> Moving projects to week 2 had biggest single impact (+13% completion)</p>
                  <p>✓ <strong>Community drives completion:</strong> Peer programming + competition pushed us from 78% → 88%</p>
                  <p>✓ <strong>Balance quantitative + qualitative:</strong> 88% completion AND 4.6/5 satisfaction shows sustainable quality</p>
                  <p>✓ <strong>Iterate in cycles:</strong> Each 2-3 month cycle compounds improvements without major overhauls</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
