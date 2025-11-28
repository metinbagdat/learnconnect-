import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Target, Zap, Award, Share2 } from "lucide-react";

const mockEngagementData = [
  { week: "W1", completionRate: 85, progressVelocity: 75, engagementDepth: 70 },
  { week: "W2", completionRate: 82, progressVelocity: 78, engagementDepth: 73 },
  { week: "W3", completionRate: 88, progressVelocity: 82, engagementDepth: 80 },
  { week: "W4", completionRate: 90, progressVelocity: 85, engagementDepth: 85 },
];

const mockOutcomeData = [
  { metric: "Skill Attainment", current: 82, target: 90 },
  { metric: "Satisfaction (NPS)", current: 72, target: 80 },
  { metric: "Career Impact", current: 68, target: 85 },
  { metric: "Cert Completion", current: 75, target: 95 },
];

const mockBusinessData = [
  { month: "M1", enrollment: 120, retention: 85, referral: 15 },
  { month: "M2", enrollment: 145, retention: 87, referral: 22 },
  { month: "M3", enrollment: 168, retention: 88, referral: 28 },
  { month: "M4", enrollment: 195, retention: 89, referral: 35 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export function KPIDashboard() {
  const { t } = useLanguage();

  const MetricCard = ({ icon: Icon, title, value, target, unit, trend }: any) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {title}
          </CardTitle>
          {trend && <Badge variant={trend > 0 ? "default" : "destructive"}>{trend > 0 ? "+" : ""}{trend}%</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}{unit}</div>
        <p className="text-xs text-muted-foreground">Target: {target}{unit}</p>
        <div className="mt-2 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min((value / target) * 100, 100)}%` }} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Curriculum Success Metrics</h1>
          <p className="text-muted-foreground">Track engagement, outcomes, and business impact in real-time</p>
        </div>

        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engagement">Engagement & Learning</TabsTrigger>
            <TabsTrigger value="outcome">Outcome & Impact</TabsTrigger>
            <TabsTrigger value="business">Business & Growth</TabsTrigger>
          </TabsList>

          {/* A. ENGAGEMENT & LEARNING METRICS */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <MetricCard icon={Users} title="Completion Rate" value={90} target={85} unit="%" trend={+5} />
              <MetricCard icon={TrendingUp} title="Progress Velocity" value={85} target={80} unit="%" trend={+8} />
              <MetricCard icon={Zap} title="Engagement Depth" value={85} target={75} unit="%" trend={+12} />
              <MetricCard icon={Target} title="Assessment Avg" value={82} target={80} unit="%" trend={+3} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Engagement Trend</CardTitle>
                <CardDescription>Track how engagement metrics evolve over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completionRate" stroke="#3b82f6" name="Completion %" />
                    <Line type="monotone" dataKey="progressVelocity" stroke="#8b5cf6" name="Progress Velocity %" />
                    <Line type="monotone" dataKey="engagementDepth" stroke="#ec4899" name="Engagement Depth %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 border-l-4 border-green-500 rounded">
                  <p className="font-semibold text-sm">✓ Completion Rate: 90%</p>
                  <p className="text-xs text-muted-foreground">Exceeds target by 5%, indicating strong course quality</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 rounded">
                  <p className="font-semibold text-sm">📊 Engagement Depth: 85%</p>
                  <p className="text-xs text-muted-foreground">High interaction rate in quizzes and forums (12% increase)</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-500 rounded">
                  <p className="font-semibold text-sm">⚠ Module 2 Performance</p>
                  <p className="text-xs text-muted-foreground">Assessment scores 15% below average - needs content review</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* B. OUTCOME & IMPACT METRICS */}
          <TabsContent value="outcome" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <MetricCard icon={Award} title="Skill Attainment" value={82} target={90} unit="%" trend={+5} />
              <MetricCard icon={Award} title="NPS Score" value={72} target={80} unit="pts" trend={+8} />
              <MetricCard icon={Share2} title="Career Impact" value={68} target={85} unit="%" trend={+12} />
              <MetricCard icon={Users} title="Cert Completion" value={75} target={95} unit="%" trend={-2} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Outcome vs Target</CardTitle>
                <CardDescription>How actual outcomes compare to success targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockOutcomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#3b82f6" name="Current" />
                    <Bar dataKey="target" fill="#10b981" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualitative Feedback Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-2">Top Testimonials:</p>
                  <div className="space-y-2">
                    <p className="text-sm italic">"This course transformed my career. Got a promotion within 3 months!" - Sarah M.</p>
                    <p className="text-sm italic">"Best structured learning experience I've had. Clear progression." - James L.</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">Common Feedback Themes:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">More live sessions</Badge>
                    <Badge variant="secondary">Faster feedback</Badge>
                    <Badge variant="secondary">Advanced projects</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* C. BUSINESS & GROWTH METRICS */}
          <TabsContent value="business" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <MetricCard icon={Users} title="Monthly Enrollment" value={195} target={150} unit=" users" trend={+15} />
              <MetricCard icon={TrendingUp} title="Retention Rate" value={89} target={85} unit="%" trend={+4} />
              <MetricCard icon={Share2} title="Referral Rate" value={35} target={25} unit="%" trend={+40} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>4-Month Growth Trend</CardTitle>
                <CardDescription>Enrollment, retention, and referral growth trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockBusinessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="enrollment" stroke="#3b82f6" name="New Enrollments" />
                    <Line type="monotone" dataKey="retention" stroke="#10b981" name="Retention %" />
                    <Line type="monotone" dataKey="referral" stroke="#f59e0b" name="Referrals" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                    <p className="text-2xl font-bold">$48.75K</p>
                    <p className="text-xs text-muted-foreground">Q4 Revenue (195 users × $250)</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-xs text-muted-foreground">Customer Lifetime Value retention</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                    <p className="text-2xl font-bold">3.2x</p>
                    <p className="text-xs text-muted-foreground">CAC payback via referrals</p>
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 border-l-4 border-green-500 rounded">
                  <p className="font-semibold text-sm">✓ Viral Growth Achieved</p>
                  <p className="text-xs text-muted-foreground">Referral rate (35%) exceeds target (25%) - word-of-mouth momentum building</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
