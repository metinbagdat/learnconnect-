import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Headphones, Hand, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/consolidated-language-context';

interface LearningStyleProfile {
  visual: number;
  auditory: number;
  kinesthetic: number;
  readingWriting: number;
  dominant: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  confidence: number;
}

interface LearningStyleDetectorProps {
  profile: LearningStyleProfile;
  isLoading?: boolean;
}

export function LearningStyleDetector({ profile, isLoading }: LearningStyleDetectorProps) {
  const { t } = useLanguage();

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return <Eye className="h-5 w-5" />;
      case 'auditory': return <Headphones className="h-5 w-5" />;
      case 'kinesthetic': return <Hand className="h-5 w-5" />;
      case 'reading-writing': return <BookOpen className="h-5 w-5" />;
      default: return <Eye className="h-5 w-5" />;
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'visual': return 'text-blue-600 bg-blue-100';
      case 'auditory': return 'text-green-600 bg-green-100';
      case 'kinesthetic': return 'text-purple-600 bg-purple-100';
      case 'reading-writing': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStyleName = (style: string) => {
    switch (style) {
      case 'visual': return t('visualLearning');
      case 'auditory': return t('auditoryLearning');
      case 'kinesthetic': return t('kinestheticLearning');
      case 'reading-writing': return t('readingWritingLearning');
      default: return style;
    }
  };

  const styles = [
    { key: 'visual', value: profile.visual },
    { key: 'auditory', value: profile.auditory },
    { key: 'kinesthetic', value: profile.kinesthetic },
    { key: 'readingWriting', value: profile.readingWriting }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStyleIcon(profile.dominant)}
            {t('detectedLearningStyle')}
          </div>
          <Badge 
            className={getStyleColor(profile.dominant)}
            variant="secondary"
          >
            {getStyleName(profile.dominant)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {styles.map(({ key, value }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${getStyleColor(key)}`}>
                    {getStyleIcon(key)}
                  </div>
                  <span className="font-medium">{getStyleName(key)}</span>
                </div>
                <span className="text-gray-500">{Math.round(value * 100)}%</span>
              </div>
              <Progress value={value * 100} className="h-2" />
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{t('confidence')}:</span>
              <span className="text-gray-600">{Math.round(profile.confidence * 100)}%</span>
            </div>
            <Progress value={profile.confidence * 100} className="h-1 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}