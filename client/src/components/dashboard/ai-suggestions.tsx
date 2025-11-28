import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Suggestion {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
  reasoning?: string;
}

interface AISuggestionsProps {
  suggestions?: Suggestion[];
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  isLoading?: boolean;
}

export function AISuggestions({ suggestions: propSuggestions, onSuggestionSelect, isLoading: propIsLoading }: AISuggestionsProps) {
  const { user } = useAuth();

  const { data: fetchedSuggestions = [] as Suggestion[], isLoading: fetchIsLoading } = useQuery<Suggestion[]>({
    queryKey: ["/api/ai/suggestions/smart", user?.id],
    enabled: !propSuggestions,
  });

  const suggestions = (propSuggestions || fetchedSuggestions) as Suggestion[];
  const isLoading = propIsLoading || fetchIsLoading;

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading suggestions...
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recommendations at this time</p>
        ) : (
          suggestions.slice(0, 3).map((suggestion, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg hover:bg-accent transition-colors space-y-2"
              data-testid={`suggestion-${idx}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  {suggestion.reasoning && (
                    <p className="text-xs text-muted-foreground italic mt-1">💡 {suggestion.reasoning}</p>
                  )}
                </div>
                <Badge
                  variant={suggestion.priority === "high" ? "default" : "secondary"}
                  className="text-xs shrink-0"
                >
                  {suggestion.priority}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSuggestionSelect(suggestion)}
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
