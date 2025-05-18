import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SuggestionSelect, SuggestionAutocomplete } from "./suggestion-select";

export function SuggestionDemoForm() {
  const [learningGoal, setLearningGoal] = useState("");
  const [careerField, setCareerField] = useState("");
  const [courseTopic, setCourseTopic] = useState("");
  const [timeframe, setTimeframe] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      learningGoal,
      careerField,
      courseTopic,
      timeframe
    });
    // In a real app, you would send this to your API
    alert("Learning path preferences submitted!");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Learning Path</CardTitle>
        <CardDescription>
          Select your preferences to generate a personalized learning path
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Learning Goal</label>
            <SuggestionSelect
              type="goals"
              label="Select a learning goal"
              placeholder="What do you want to achieve?"
              value={learningGoal}
              onChange={setLearningGoal}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Career Field</label>
            <SuggestionAutocomplete
              type="fields"
              label="Select or enter a career field"
              placeholder="Your field of interest"
              value={careerField}
              onChange={setCareerField}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Course Topic</label>
            <SuggestionSelect
              type="courseTopics"
              label="Select a topic"
              placeholder="What would you like to learn?"
              value={courseTopic}
              onChange={setCourseTopic}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Timeframe</label>
            <SuggestionSelect
              type="timeframes"
              label="Select a timeframe"
              placeholder="How long do you want to spend?"
              value={timeframe}
              onChange={setTimeframe}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Generate Learning Path
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}