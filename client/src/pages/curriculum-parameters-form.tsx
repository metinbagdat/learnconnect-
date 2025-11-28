import { useState } from "react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Users, BookOpen, Briefcase, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

export function CurriculumParametersForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>("learner");
  const [formData, setFormData] = useState({
    // A. LEARNER-CENTRIC PARAMETERS
    targetAudience: [] as string[],
    demographics: { age: 25, profession: "", background: "" },
    psychographics: { goals: [] as string[], preferences: [] as string[], motivation: "high" },
    skillGap: "",
    bloomsLevel: "apply",
    specificObjectives: [] as string[],
    prerequisites: [] as string[],
    
    // B. CONTENT & PEDAGOGY PARAMETERS
    modularity: "medium", // short (5-10min), medium (10-15min), long (15-30min)
    contentSequence: "",
    learningModalities: [] as string[],
    pedagogicalApproach: [] as string[],
    formativeAssessment: [] as string[],
    summativeAssessment: [] as string[],
    feedbackMechanism: "ai-tutor",
    
    // C. BUSINESS & OPERATIONAL PARAMETERS
    instructorCredentials: "",
    contentVetting: "industry-expert",
    developmentTime: 8, // weeks
    budget: 5000,
    updateCadence: "monthly",
  });

  const bloomsLevels = [
    { value: "remember", label: "Remember - Recall facts" },
    { value: "understand", label: "Understand - Explain concepts" },
    { value: "apply", label: "Apply - Use in new situations" },
    { value: "analyze", label: "Analyze - Break down information" },
    { value: "evaluate", label: "Evaluate - Make judgments" },
    { value: "create", label: "Create - Produce new work" }
  ];

  const learningModalities = [
    { id: "video-lecture", label: "Video Lectures" },
    { id: "screencasts", label: "Screencasts" },
    { id: "text-articles", label: "Text Articles" },
    { id: "interactive-quizzes", label: "Interactive Quizzes" },
    { id: "coding-exercises", label: "Coding Exercises" },
    { id: "podcasts", label: "Podcasts" }
  ];

  const pedagogicalMethods = [
    { id: "project-based", label: "Project-Based Learning" },
    { id: "microlearning", label: "Microlearning" },
    { id: "social-learning", label: "Social Learning" },
    { id: "mastery-based", label: "Mastery-Based" },
    { id: "case-study", label: "Case Study" },
    { id: "flipped-classroom", label: "Flipped Classroom" }
  ];

  const SectionHeader = ({ icon: Icon, title, id }: any) => (
    <button
      onClick={() => setExpanded(expanded === id ? null : id)}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {expanded === id ? <ChevronUp /> : <ChevronDown />}
    </button>
  );

  const ArrayInput = ({ label, items, onAdd, onRemove }: any) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {items.map((item: string, idx: number) => (
          <Badge key={idx} variant="secondary" className="gap-1">
            {item}
            <button onClick={() => onRemove(idx)} className="ml-1 hover:bg-red-500">✕</button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input placeholder={`Add ${label.toLowerCase()}`} id={`add-${label}`} />
        <Button 
          size="sm" 
          onClick={() => {
            const input = document.getElementById(`add-${label}`) as HTMLInputElement;
            if (input?.value) {
              onAdd(input.value);
              input.value = "";
            }
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Curriculum Parameters</h1>
        <p className="text-muted-foreground">Define the foundational inputs for course design</p>
      </div>

      <Card>
        {/* A. LEARNER-CENTRIC PARAMETERS */}
        <div className="border-b">
          <SectionHeader icon={Users} title="A. Learner-Centric Parameters (The 'Who')" id="learner" />
          {expanded === "learner" && (
            <CardContent className="pt-6 space-y-6">
              {/* Target Audience & Personas */}
              <div className="space-y-3">
                <h4 className="font-semibold">Target Audience & Personas</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Demographics - Age Range</Label>
                    <Input type="number" placeholder="25" value={formData.demographics.age} onChange={(e) => setFormData({...formData, demographics: {...formData.demographics, age: parseInt(e.target.value)}})} />
                  </div>
                  <div>
                    <Label>Profession/Role</Label>
                    <Input placeholder="e.g., Marketing Manager" value={formData.demographics.profession} onChange={(e) => setFormData({...formData, demographics: {...formData.demographics, profession: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Educational Background</Label>
                    <Input placeholder="e.g., Bachelor's in Business" value={formData.demographics.background} onChange={(e) => setFormData({...formData, demographics: {...formData.demographics, background: e.target.value}})} />
                  </div>
                </div>
              </div>

              {/* Skill Gap */}
              <div>
                <Label>Skill Gap (What they know vs. need to know)</Label>
                <Textarea placeholder="e.g., Marketing manager needs to learn data analysis basics" value={formData.skillGap} onChange={(e) => setFormData({...formData, skillGap: e.target.value})} />
              </div>

              {/* Learning Objectives */}
              <div className="space-y-3">
                <h4 className="font-semibold">Learning Objectives (Bloom's Taxonomy)</h4>
                <Select value={formData.bloomsLevel} onValueChange={(val) => setFormData({...formData, bloomsLevel: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bloomsLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ArrayInput 
                  label="Specific Learning Objectives"
                  items={formData.specificObjectives}
                  onAdd={(val: string) => setFormData({...formData, specificObjectives: [...formData.specificObjectives, val]})}
                  onRemove={(idx: number) => setFormData({...formData, specificObjectives: formData.specificObjectives.filter((_, i) => i !== idx)})}
                />
              </div>

              {/* Prerequisites */}
              <ArrayInput 
                label="Prerequisites"
                items={formData.prerequisites}
                onAdd={(val: string) => setFormData({...formData, prerequisites: [...formData.prerequisites, val]})}
                onRemove={(idx: number) => setFormData({...formData, prerequisites: formData.prerequisites.filter((_, i) => i !== idx)})}
              />
            </CardContent>
          )}
        </div>

        {/* B. CONTENT & PEDAGOGY PARAMETERS */}
        <div className="border-b">
          <SectionHeader icon={BookOpen} title="B. Content & Pedagogy Parameters (The 'What' and 'How')" id="content" />
          {expanded === "content" && (
            <CardContent className="pt-6 space-y-6">
              {/* Modularity */}
              <div>
                <Label>Module Length (Modularity)</Label>
                <Select value={formData.modularity} onValueChange={(val) => setFormData({...formData, modularity: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (5-10 minutes)</SelectItem>
                    <SelectItem value="medium">Medium (10-15 minutes)</SelectItem>
                    <SelectItem value="long">Long (15-30 minutes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Sequence */}
              <div>
                <Label>Content Sequence & Logical Flow</Label>
                <Textarea placeholder="Describe how topics build progressively. E.g., Concept A → Concept B → Project combining A&B" value={formData.contentSequence} onChange={(e) => setFormData({...formData, contentSequence: e.target.value})} />
              </div>

              {/* Learning Modalities */}
              <div className="space-y-3">
                <Label>Learning Modalities (Select all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {learningModalities.map(mod => (
                    <div key={mod.id} className="flex items-center gap-2">
                      <Checkbox 
                        checked={formData.learningModalities.includes(mod.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, learningModalities: [...formData.learningModalities, mod.id]});
                          } else {
                            setFormData({...formData, learningModalities: formData.learningModalities.filter(m => m !== mod.id)});
                          }
                        }}
                      />
                      <Label className="cursor-pointer">{mod.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pedagogical Approach */}
              <div className="space-y-3">
                <Label>Pedagogical Approach</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {pedagogicalMethods.map(method => (
                    <div key={method.id} className="flex items-center gap-2">
                      <Checkbox 
                        checked={formData.pedagogicalApproach.includes(method.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, pedagogicalApproach: [...formData.pedagogicalApproach, method.id]});
                          } else {
                            setFormData({...formData, pedagogicalApproach: formData.pedagogicalApproach.filter(m => m !== method.id)});
                          }
                        }}
                      />
                      <Label className="cursor-pointer">{method.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment */}
              <div className="space-y-3">
                <h4 className="font-semibold">Assessment & Feedback</h4>
                <ArrayInput 
                  label="Formative Assessment (In-progress)"
                  items={formData.formativeAssessment}
                  onAdd={(val: string) => setFormData({...formData, formativeAssessment: [...formData.formativeAssessment, val]})}
                  onRemove={(idx: number) => setFormData({...formData, formativeAssessment: formData.formativeAssessment.filter((_, i) => i !== idx)})}
                />
                <ArrayInput 
                  label="Summative Assessment (End-goal)"
                  items={formData.summativeAssessment}
                  onAdd={(val: string) => setFormData({...formData, summativeAssessment: [...formData.summativeAssessment, val]})}
                  onRemove={(idx: number) => setFormData({...formData, summativeAssessment: formData.summativeAssessment.filter((_, i) => i !== idx)})}
                />
                <div>
                  <Label>Feedback Mechanism</Label>
                  <Select value={formData.feedbackMechanism} onValueChange={(val) => setFormData({...formData, feedbackMechanism: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instructor-qa">Instructor Q&A</SelectItem>
                      <SelectItem value="ai-tutor">AI Tutor</SelectItem>
                      <SelectItem value="community-forums">Community Forums</SelectItem>
                      <SelectItem value="peer-review">Peer Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </div>

        {/* C. BUSINESS & OPERATIONAL PARAMETERS */}
        <div>
          <SectionHeader icon={Briefcase} title="C. Business & Operational Parameters (The 'Reality')" id="business" />
          {expanded === "business" && (
            <CardContent className="pt-6 space-y-6">
              {/* Expertise & Credibility */}
              <div>
                <Label>Instructor Credentials & Teaching Experience</Label>
                <Textarea placeholder="E.g., 10 years in industry, certified instructor, published author" value={formData.instructorCredentials} onChange={(e) => setFormData({...formData, instructorCredentials: e.target.value})} />
              </div>

              {/* Platform Capabilities */}
              <div>
                <Label>Content Vetting</Label>
                <Select value={formData.contentVetting} onValueChange={(val) => setFormData({...formData, contentVetting: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="industry-expert">Industry Expert Vetted</SelectItem>
                    <SelectItem value="academic">Academic Institution</SelectItem>
                    <SelectItem value="peer-review">Peer Reviewed</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resource Constraints */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Development Time (weeks)</Label>
                  <Slider 
                    value={[formData.developmentTime]} 
                    onValueChange={(val) => setFormData({...formData, developmentTime: val[0]})}
                    min={1}
                    max={52}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">{formData.developmentTime} weeks</p>
                </div>
                <div>
                  <Label>Budget ($)</Label>
                  <Input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})} />
                </div>
              </div>

              {/* Update Cadence */}
              <div>
                <Label>Update Cadence</Label>
                <Select value={formData.updateCadence} onValueChange={(val) => setFormData({...formData, updateCadence: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </div>
      </Card>

      <Button onClick={() => onSubmit?.(formData)} size="lg" className="w-full">
        Save Parameters & Continue
      </Button>
    </div>
  );
}
