import { SuggestionDemoForm } from "@/components/suggestions/demo-form";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Globe } from "lucide-react";

export default function SuggestionsDemoPage() {
  const { language, setLanguage, t } = useLanguage();
  
  // Fetch trending suggestions from our API with language support
  const { data: trendingGoals = [] } = useQuery<string[]>({
    queryKey: [`/api/suggestions?type=goals&language=${language}`],
    enabled: true,
  });

  const { data: trendingFields = [] } = useQuery<string[]>({
    queryKey: [`/api/suggestions?type=fields&language=${language}`],
    enabled: true,
  });

  const { data: trendingTopics = [] } = useQuery<string[]>({
    queryKey: [`/api/suggestions?type=courseTopics&language=${language}`],
    enabled: true,
  });

  // Take just the first few items for trending display
  const topGoals = trendingGoals.slice(0, 3);
  const topFields = trendingFields.slice(0, 3); 
  const topTopics = trendingTopics.slice(0, 3);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('smartSuggestions', 'Smart Suggestions')}</h1>
            <p className="text-muted-foreground">
              {t('smartSuggestionsDesc', 'Get inspired with AI-powered suggestions! Discover trending goals, popular fields, and hot topics to guide your learning journey and make informed choices.')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === 'en' ? 'TR' : 'EN'}
          </Button>
        </div>
      </div>
      
      {/* Trending suggestions */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('trendingGoals', 'Trending Goals')}</CardTitle>
            <CardDescription>{t('popularLearningObjectives', 'Popular learning objectives')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topGoals.map(goal => (
                <Badge key={goal} variant="secondary" className="text-sm py-1">
                  {goal}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('popularFields', 'Popular Fields')}</CardTitle>
            <CardDescription>{t('inDemandCareerAreas', 'In-demand career areas')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topFields.map(field => (
                <Badge key={field} variant="secondary" className="text-sm py-1">
                  {field}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('hotTopics', 'Hot Topics')}</CardTitle>
            <CardDescription>{t('coursesGainingTraction', 'Courses gaining traction')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topTopics.map(topic => (
                <Badge key={topic} variant="secondary" className="text-sm py-1">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <SuggestionDemoForm />
      
      <div className="mt-10 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{t('howSmartSuggestionsWork', 'How Smart Suggestions Work')}</h2>
        <p className="mb-4">
          {t('smartSuggestionsSystemDesc', 'Our suggestion system uses a combination of popular choices, trending topics, and personalized recommendations to help you navigate your educational journey.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-4 rounded-md shadow">
            <h3 className="font-medium mb-2">{t('learningGoals', 'Learning Goals')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('learningGoalsDesc', 'Choose from popular learning paths or enter your own custom goal to tailor your experience.')}
            </p>
          </div>
          <div className="bg-card p-4 rounded-md shadow">
            <h3 className="font-medium mb-2">{t('careerFields', 'Career Fields')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('careerFieldsDesc', 'Select your industry or field of interest to get relevant course recommendations.')}
            </p>
          </div>
          <div className="bg-card p-4 rounded-md shadow">
            <h3 className="font-medium mb-2">{t('courseTopics', 'Course Topics')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('courseTopicsDesc', 'Browse trending topics or search for specific subjects you want to master.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}