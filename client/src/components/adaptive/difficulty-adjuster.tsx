import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/consolidated-language-context';

interface DifficultyAdjustment {
  currentDifficulty: number;
  recommendedDifficulty: number;
  adjustmentReason: string;
  confidenceLevel: number;
  nextStepSuggestions: string[];
}

interface DifficultyAdjusterProps {
  adjustment: DifficultyAdjustment;
  onApplyAdjustment?: (newDifficulty: number) => void;
  isLoading?: boolean;
}

export function DifficultyAdjuster({ adjustment, onApplyAdjustment, isLoading }: DifficultyAdjusterProps) {
  const { t } = useLanguage();

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 0.3) return t('easy');
    if (difficulty < 0.7) return t('medium');
    return t('hard');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 0.3) return 'bg-green-100 text-green-800';
    if (difficulty < 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAdjustmentIcon = () => {
    const diff = adjustment.recommendedDifficulty - adjustment.currentDifficulty;
    if (diff > 0.1) return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (diff < -0.1) return <TrendingDown className="h-4 w-4 text-green-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getAdjustmentMessage = () => {
    const diff = adjustment.recommendedDifficulty - adjustment.currentDifficulty;
    if (diff > 0.1) return t('increaseDifficulty');
    if (diff < -0.1) return t('decreaseDifficulty');
    return t('maintainDifficulty');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getAdjustmentIcon()}
          {t('difficultyAdjustment')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current vs Recommended Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">{t('currentDifficulty')}</div>
            <Badge className={getDifficultyColor(adjustment.currentDifficulty)}>
              {getDifficultyLabel(adjustment.currentDifficulty)}
            </Badge>
            <Progress value={adjustment.currentDifficulty * 100} className="h-2 mt-2" />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">{t('recommendedDifficulty')}</div>
            <Badge className={getDifficultyColor(adjustment.recommendedDifficulty)}>
              {getDifficultyLabel(adjustment.recommendedDifficulty)}
            </Badge>
            <Progress value={adjustment.recommendedDifficulty * 100} className="h-2 mt-2" />
          </div>
        </div>

        {/* Adjustment Reason */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-blue-800 text-sm mb-1">
                {getAdjustmentMessage()}
              </div>
              <div className="text-blue-700 text-sm">
                {adjustment.adjustmentReason}
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Level */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">{t('confidence')}:</span>
            <span className="text-gray-600">{Math.round(adjustment.confidenceLevel * 100)}%</span>
          </div>
          <Progress value={adjustment.confidenceLevel * 100} className="h-2" />
        </div>

        {/* Next Step Suggestions */}
        <div>
          <div className="font-medium text-sm mb-2">{t('nextSteps')}:</div>
          <ul className="space-y-1">
            {adjustment.nextStepSuggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apply Adjustment Button */}
        {onApplyAdjustment && Math.abs(adjustment.recommendedDifficulty - adjustment.currentDifficulty) > 0.05 && (
          <Button 
            onClick={() => onApplyAdjustment(adjustment.recommendedDifficulty)}
            className="w-full"
            variant="outline"
          >
            {t('applyAdjustment')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}