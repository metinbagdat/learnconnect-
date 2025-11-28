import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface Suggestion {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
}

interface AISuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionSelect: (suggestion: Suggestion) => void;
  isLoading?: boolean;
}

export function AISuggestions({ suggestions, onSuggestionSelect, isLoading }: AISuggestionsProps) {
  return (
    <Card className="col-span-1" data-testid="widget-ai-suggestions">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Recommendations
        </CardTitle>
        <CardDescription>Personalized learning suggestions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading suggestions...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recommendations at this time</p>
        ) : (
          suggestions.slice(0, 3).map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 border rounded-lg hover:bg-accent transition-colors space-y-2"
              data-testid={`suggestion-${suggestion.id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
                <Badge
                  variant={suggestion.priority === "high" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {suggestion.priority}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSuggestionSelect(suggestion)}
                className="w-full text-xs"
              >
                {suggestion.action}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
