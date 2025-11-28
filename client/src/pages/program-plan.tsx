import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, CheckCircle2, Play, TrendingUp, Zap, Users } from "lucide-react";

export function ProgramPlan() {
  const [phase, setPhase] = useState("1");
  const [selectedModule, setSelectedModule] = useState("");
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState({ problem: "", investigation: "", hypothesis: "" });
  const [abTest, setAbTest] = useState({ name: "", controlGroup: 50, testGroup: 50, hypothesis: "" });

  const phases = [
    {
      id: "1",
      name: "Discovery & Design",
      icon: "🎯",
      description: "Before Building - Define success, analyze audience, map curriculum",
      tasks: [
        { id: "1.1", title: "Define Success", description: "Set target completion rate and career outcomes (70% completion, 50% career impact in 6 months)" },
        { id: "1.2", title: "Analyze Audience", description: "Create learner personas using demographics, psychographics, motivation factors" },
        { id: "1.3", title: "Map Curriculum", description: "Outline modules, choose learning modalities, design core project" },
        { id: "1.4", title: "Feasibility Check", description: "Review against development time, budget, team capacity" }
      ]
    },
    {
      id: "2",
      name: "Development & Launch",
      icon: "🛠️",
      description: "The Build - Create MVC, pilot, gather feedback",
      tasks: [
        { id: "2.1", title: "Build MVC", description: "Create first 2-3 core modules + prototype final project (not full 100-hour program)" },
        { id: "2.2", title: "Pilot with Beta Group", description: "Launch MVC to 20-50 controlled learners" },
        { id: "2.3", title: "Gather Beta Feedback", description: "Collect data on completion, satisfaction, identified blockers" },
        { id: "2.4", title: "Fix & Refine", description: "Address major issues before full launch" }
      ]
    },
    {
      id: "3",
      name: "Measure, Analyze & Iterate",
      icon: "📊",
      description: "Continuous Cycle - Monitor, diagnose, test, decide",
      tasks: [
        { id: "3.1", title: "Monitor Dashboards", description: "Track KPIs: completion rate, engagement, satisfaction in real-time" },
        { id: "3.2", title: "Root Cause Analysis", description: "When metrics drop, investigate: content difficulty, assessment rigor, format issues" },
        { id: "3.3", title: "A/B Test Changes", description: "Test hypotheses with control/test groups before rollout" },
        { id: "3.4", title: "Quarterly Reviews", description: "Review all metrics quarterly, retire/update modules based on trends" }
      ]
    }
  ];

  const rootCauseExamples = [
    {
      problem: "Completion rate drops at Module 4",
      investigation: "Module 4 introduces complex concept without practical example. No video explanations. Forum confusion posts spike.",
      hypothesis: "Learners drop because lack hands-on guidance",
      action: "Add guided exercise + video walkthrough",
      expectedResult: "Completion should increase 10-15%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Program Plan: Agile Implementation</h1>
          <p className="text-muted-foreground">Three-phase iterative process: Design → Build → Measure & Iterate</p>
        </div>

        {/* Phase Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phases.map((p) => (
            <Card 
              key={p.id}
              className={`cursor-pointer transition-all ${phase === p.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setPhase(p.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl mb-2">{p.icon}</div>
                    <CardTitle className="text-lg">Phase {p.id}</CardTitle>
                    <CardDescription className="text-xs">{p.name}</CardDescription>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Phase Details */}
        <Tabs value={phase} onValueChange={setPhase} className="space-y-4">
          {phases.map((p) => (
            <TabsContent key={p.id} value={p.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {p.icon} Phase {p.id}: {p.name}
                  </CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {p.tasks.map((task) => (
                    <div key={task.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Phase 3 Extra Tools */}
              {p.id === "3" && (
                <div className="space-y-4">
                  {/* Root Cause Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Root Cause Analysis Tool</CardTitle>
                      <CardDescription>Diagnose why metrics are dropping</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label>Select Problem Module</Label>
                          <Select value={selectedModule} onValueChange={setSelectedModule}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a module with issues" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="module1">Module 1 - Intro</SelectItem>
                              <SelectItem value="module2">Module 2 - Fundamentals</SelectItem>
                              <SelectItem value="module3">Module 3 - Advanced</SelectItem>
                              <SelectItem value="module4">Module 4 - Complex Concepts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Problem Description</Label>
                          <Textarea 
                            placeholder="E.g., Completion rate drops at this module. Identify what metric dropped and by how much."
                            value={rootCauseAnalysis.problem}
                            onChange={(e) => setRootCauseAnalysis({...rootCauseAnalysis, problem: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Investigation (Use Parameters & KPIs)</Label>
                          <Textarea 
                            placeholder="Look at: Content difficulty (B1)? Assessment rigor (B4)? Learning modalities (B2)? Forum confusion (B3)? What did you find?"
                            value={rootCauseAnalysis.investigation}
                            onChange={(e) => setRootCauseAnalysis({...rootCauseAnalysis, investigation: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Hypothesis</Label>
                          <Textarea 
                            placeholder="E.g., We think learners are dropping because [module] introduces complex concept without practical example."
                            value={rootCauseAnalysis.hypothesis}
                            onChange={(e) => setRootCauseAnalysis({...rootCauseAnalysis, hypothesis: e.target.value})}
                          />
                        </div>
                        <Button className="w-full">
                          <Zap className="w-4 h-4 mr-2" />
                          Generate Action Plan
                        </Button>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold mb-3">Example: Module 4 Drop-off</p>
                        {rootCauseExamples.map((example, idx) => (
                          <div key={idx} className="space-y-2 text-sm">
                            <div className="p-3 bg-red-50 dark:bg-red-950 rounded">
                              <p className="font-semibold text-red-900 dark:text-red-100">Problem: {example.problem}</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                              <p className="text-blue-900 dark:text-blue-100"><strong>Investigation:</strong> {example.investigation}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                              <p className="text-yellow-900 dark:text-yellow-100"><strong>Hypothesis:</strong> {example.hypothesis}</p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                              <p className="text-green-900 dark:text-green-100"><strong>Action:</strong> {example.action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* A/B Testing Framework */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">A/B Testing Framework</CardTitle>
                      <CardDescription>Validate hypotheses before full rollout</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label>Test Name</Label>
                          <Input 
                            placeholder="E.g., Module 4 Guided Exercise Test"
                            value={abTest.name}
                            onChange={(e) => setAbTest({...abTest, name: e.target.value})}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Control Group %</Label>
                            <Input 
                              type="number" 
                              value={abTest.controlGroup}
                              onChange={(e) => setAbTest({...abTest, controlGroup: parseInt(e.target.value)})}
                              min="1" max="99"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Old version (baseline)</p>
                          </div>
                          <div>
                            <Label>Test Group %</Label>
                            <Input 
                              type="number"
                              value={abTest.testGroup}
                              onChange={(e) => setAbTest({...abTest, testGroup: parseInt(e.target.value)})}
                              min="1" max="99"
                            />
                            <p className="text-xs text-muted-foreground mt-1">New version (variation)</p>
                          </div>
                        </div>
                        <div>
                          <Label>Hypothesis to Test</Label>
                          <Textarea 
                            placeholder="E.g., Adding a guided exercise will increase Module 4 completion rate from 65% to 82%"
                            value={abTest.hypothesis}
                            onChange={(e) => setAbTest({...abTest, hypothesis: e.target.value})}
                          />
                        </div>
                        <Button className="w-full" variant="outline">
                          <Play className="w-4 h-4 mr-2" />
                          Launch A/B Test
                        </Button>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <p className="text-sm font-semibold">Test Results (Example)</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                            <p className="text-xs text-muted-foreground">Control (Old)</p>
                            <p className="text-xl font-bold">65%</p>
                            <p className="text-xs">Completion Rate</p>
                          </div>
                          <div className="p-3 bg-green-100 dark:bg-green-900 rounded">
                            <p className="text-xs text-muted-foreground">Test (New)</p>
                            <p className="text-xl font-bold">82%</p>
                            <p className="text-xs">+26% improvement ✓</p>
                          </div>
                        </div>
                        <Button variant="default" className="w-full">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Roll Out Winning Variation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quarterly Review Checklist */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quarterly Review Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <label className="text-sm cursor-pointer">Review all course metrics (completion, satisfaction, engagement)</label>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                          <input type="checkbox" className="w-4 h-4" />
                          <label className="text-sm cursor-pointer">Check if content is still relevant to current market trends</label>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                          <input type="checkbox" className="w-4 h-4" />
                          <label className="text-sm cursor-pointer">Identify modules to retire, update, or expand</label>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                          <input type="checkbox" className="w-4 h-4" />
                          <label className="text-sm cursor-pointer">Plan next quarter's A/B tests and experiments</label>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                          <input type="checkbox" className="w-4 h-4" />
                          <label className="text-sm cursor-pointer">Review learner feedback and testimonials for patterns</label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Integration Diagram */}
        <Card>
          <CardHeader>
            <CardTitle>Program Plan Integration with Framework</CardTitle>
            <CardDescription>How the three phases connect to your curriculum design variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <p className="font-semibold text-sm">Phase 1 uses Part 1 (Parameters)</p>
                <p className="text-xs text-muted-foreground">Learner personas, content design, business feasibility</p>
              </div>
              <div className="flex justify-center text-2xl">↓</div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                <p className="font-semibold text-sm">Phase 2 builds the MVC</p>
                <p className="text-xs text-muted-foreground">First 2-3 modules with real learners in controlled pilot</p>
              </div>
              <div className="flex justify-center text-2xl">↓</div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                <p className="font-semibold text-sm">Phase 3 uses Part 2 (KPIs) to diagnose</p>
                <p className="text-xs text-muted-foreground">Monitor metrics, analyze root causes, A/B test, iterate continuously</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
