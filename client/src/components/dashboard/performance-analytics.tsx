import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, Zap } from "lucide-react";

interface PerformanceAnalyticsProps {
  metrics: {
    averageScore: number;
    completionRate: number;
    totalHoursLearned: number;
  };
  strengths: string[];
  areasToImprove: string[];
}

export function PerformanceAnalytics({ metrics, strengths, areasToImprove }: PerformanceAnalyticsProps) {
  return (
    <Card className="col-span-1" data-testid="widget-performance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Performance Analytics
        </CardTitle>
        <CardDescription>Your learning insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.averageScore}%</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-center">
            <p className="text-2xl font-bold text-green-600">{metrics.completionRate}%</p>
            <p className="text-xs text-muted-foreground">Completion</p>
          </div>
          <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded text-center">
            <p className="text-2xl font-bold text-purple-600">{metrics.totalHoursLearned}h</p>
            <p className="text-xs text-muted-foreground">Hours</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold">Strengths</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.length === 0 ? (
              <p className="text-xs text-muted-foreground">Keep learning to unlock insights</p>
            ) : (
              strengths.slice(0, 3).map((strength, idx) => (
                <Badge key={idx} variant="outline" className="bg-emerald-50 dark:bg-emerald-900">
                  {strength}
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <p className="text-sm font-semibold">Areas to Improve</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {areasToImprove.length === 0 ? (
              <p className="text-xs text-muted-foreground">Great work! Keep it up!</p>
            ) : (
              areasToImprove.slice(0, 3).map((area, idx) => (
                <Badge key={idx} variant="outline" className="bg-orange-50 dark:bg-orange-900">
                  {area}
                </Badge>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
