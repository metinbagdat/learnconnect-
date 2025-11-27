import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Brain, Lightbulb, Clock, Zap, Save, RotateCcw } from "lucide-react";

const preferenceSchema = z.object({
  learningStyle: z.enum(["visual", "auditory", "kinesthetic"]),
  memoryTechniques: z.array(z.string()).min(1, "Select at least one technique"),
  sessionLength: z.string(),
  breakLength: z.string(),
  dailyGoal: z.string(),
  enableCognitiveTesting: z.boolean(),
  enableMemoryAssessment: z.boolean(),
  enableFocusTraining: z.boolean(),
});

type PreferenceFormData = z.infer<typeof preferenceSchema>;

const memoryTechniques = [
  { id: "spaced_repetition", label: "Spaced Repetition", description: "Review at optimal intervals" },
  { id: "method_of_loci", label: "Method of Loci", description: "Memory palace technique" },
  { id: "mnemonic_generation", label: "Mnemonics", description: "Memory devices and associations" },
  { id: "active_recall", label: "Active Recall", description: "Retrieve from memory without notes" },
  { id: "chunking", label: "Chunking", description: "Break into manageable pieces" },
  { id: "visual_representation", label: "Visual Representation", description: "Diagrams and visual aids" },
];

export default function CognitivePreferenceForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const form = useForm<PreferenceFormData>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      learningStyle: "visual",
      memoryTechniques: ["spaced_repetition"],
      sessionLength: "45",
      breakLength: "10",
      dailyGoal: "3",
      enableCognitiveTesting: true,
      enableMemoryAssessment: true,
      enableFocusTraining: true,
    },
  });

  useEffect(() => {
    // AI recommendation based on learning style
    const style = form.watch("learningStyle");
    if (style === "visual") {
      setAiRecommendation(
        "🤖 AI Suggestion: For visual learners, we recommend Method of Loci (Memory Palace) and Visual Representation techniques."
      );
    } else if (style === "auditory") {
      setAiRecommendation(
        "🤖 AI Suggestion: For auditory learners, Mnemonics and Active Recall work well with verbal repetition."
      );
    } else {
      setAiRecommendation(
        "🤖 AI Suggestion: For kinesthetic learners, combine Chunking with hands-on practice and Active Recall."
      );
    }
  }, [form.watch("learningStyle")]);

  async function onSubmit(values: PreferenceFormData) {
    setIsSaving(true);
    try {
      // Save preferences (would call API endpoint)
      console.log("Saving preferences:", values);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const handleAIOptimize = () => {
    // AI optimization logic
    form.setValue("memoryTechniques", ["spaced_repetition", "method_of_loci", "active_recall"]);
    form.setValue("sessionLength", "45");
    form.setValue("breakLength", "10");
    setAiRecommendation("🤖 Preferences optimized based on your cognitive profile!");
  };

  const handleReset = () => {
    form.reset();
    setAiRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Cognitive Learning Preferences
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Customize how you learn based on your cognitive profile and optimize your study experience
          </p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              ✓ Your preferences have been saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Learning Style Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📚</span> Preferred Learning Style
                </CardTitle>
                <CardDescription>
                  How do you learn best?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="learningStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange}>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                              <RadioGroupItem value="visual" id="visual" />
                              <label htmlFor="visual" className="flex-1 cursor-pointer">
                                <span className="font-semibold text-slate-900 dark:text-white">👁️ Visual Learner</span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Learn best through images, diagrams, and spatial understanding
                                </p>
                              </label>
                            </div>

                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                              <RadioGroupItem value="auditory" id="auditory" />
                              <label htmlFor="auditory" className="flex-1 cursor-pointer">
                                <span className="font-semibold text-slate-900 dark:text-white">👂 Auditory Learner</span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Learn best through listening and verbal instruction
                                </p>
                              </label>
                            </div>

                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                              <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                              <label htmlFor="kinesthetic" className="flex-1 cursor-pointer">
                                <span className="font-semibold text-slate-900 dark:text-white">🖐️ Kinesthetic Learner</span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Learn best through hands-on activities and movement
                                </p>
                              </label>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Memory Techniques Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🧠</span> Preferred Memory Techniques
                </CardTitle>
                <CardDescription>
                  Select the techniques that work best for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="memoryTechniques"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-3">
                          {memoryTechniques.map((tech) => (
                            <div
                              key={tech.id}
                              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <Checkbox
                                checked={field.value.includes(tech.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, tech.id]
                                    : field.value.filter((v) => v !== tech.id);
                                  field.onChange(newValue);
                                }}
                                id={tech.id}
                              />
                              <label htmlFor={tech.id} className="flex-1 cursor-pointer">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {tech.label}
                                </span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {tech.description}
                                </p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {aiRecommendation && (
                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 mt-4">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300 ml-2">
                      {aiRecommendation}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Study Session Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Study Session Preferences
                </CardTitle>
                <CardDescription>
                  Configure your ideal study environment and schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sessionLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Session Length</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                          <SelectItem value="45">45 minutes (Standard)</SelectItem>
                          <SelectItem value="60">60 minutes (Extended)</SelectItem>
                          <SelectItem value="90">90 minutes (Deep Work)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How long you prefer to study without a break
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breakLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Break Length</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How long you prefer to rest between sessions
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Study Goal</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="3">3 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="5">5+ hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Your target daily study time
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Cognitive Training Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Cognitive Training Preferences
                </CardTitle>
                <CardDescription>
                  Enable features to enhance your cognitive abilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="enableCognitiveTesting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-semibold cursor-pointer">
                          Enable Daily Cognitive Training
                        </FormLabel>
                        <FormDescription>
                          Get personalized brain exercises to improve memory and focus
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableMemoryAssessment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-semibold cursor-pointer">
                          Enable Memory Assessment
                        </FormLabel>
                        <FormDescription>
                          Regular tests to track your memory capacity improvements
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableFocusTraining"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="font-semibold cursor-pointer">
                          Enable Focus Training
                        </FormLabel>
                        <FormDescription>
                          Exercises to improve your attention span and concentration
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-3 justify-between">
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAIOptimize}
                  className="gap-2"
                >
                  🤖 AI Optimize Preferences
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
