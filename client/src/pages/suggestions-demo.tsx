import { SuggestionDemoForm } from "@/components/suggestions/demo-form";

export default function SuggestionsDemoPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Suggestions</h1>
        <p className="text-muted-foreground">
          Our platform provides intelligent suggestions for goals, fields, and course topics
          to help you make informed choices throughout your learning journey.
        </p>
      </div>
      
      <SuggestionDemoForm />
      
      <div className="mt-10 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <p className="mb-4">
          Our suggestion system uses a combination of popular choices, trending topics, and personalized 
          recommendations to help you navigate your educational journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-4 rounded-md shadow">
            <h3 className="font-medium mb-2">Learning Goals</h3>
            <p className="text-sm text-muted-foreground">
              Choose from popular learning paths or enter your own custom goal to tailor your experience.
            </p>
          </div>
          <div className="bg-card p-4 rounded-md shadow">
            <h3 className="font-medium mb-2">Career Fields</h3>
            <p className="text-sm text-muted-foreground">
              Select your industry or field of interest to get relevant course recommendations.
            </p>
          </div>
          <div className="bg-card p-4 rounded-md shadow">
            <h3 className="font-medium mb-2">Course Topics</h3>
            <p className="text-sm text-muted-foreground">
              Browse trending topics or search for specific subjects you want to master.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}