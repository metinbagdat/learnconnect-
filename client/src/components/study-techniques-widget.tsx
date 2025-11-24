import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { BookOpen, Clock, Brain, TrendingUp, Zap } from 'lucide-react';

const techniques = [
  { id: 1, emoji: '🎧', titleEn: 'Feynman', titleTr: 'Feynman' },
  { id: 2, emoji: '⏰', titleEn: 'Time Blocking', titleTr: 'Zaman Bloklama' },
  { id: 3, emoji: '📝', titleEn: 'Active Recall', titleTr: 'Aktif Hatırlama' },
  { id: 4, emoji: '🔄', titleEn: 'Backward', titleTr: 'Geri Çalışma' },
  { id: 5, emoji: '💫', titleEn: 'LearnConnect AI', titleTr: 'LearnConnect AI' }
];

export function StudyTechniquesWidget() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-bold mb-4">
        {isEnglish ? '📚 Master Study Techniques' : '📚 Çalışma Tekniklerinde Ustalaş'}
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {techniques.map((tech) => (
          <div key={tech.id} className="text-sm px-2 py-1 bg-white dark:bg-slate-800 rounded-lg flex items-center gap-1">
            <span>{tech.emoji}</span>
            <span className="font-medium">{isEnglish ? tech.titleEn : tech.titleTr}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {isEnglish
          ? 'Learn the 5 most efficient study techniques used by top performers'
          : 'En iyi performans gösterenlerin kullandığı 5 en verimli çalışma tekniğini öğren'}
      </p>

      <Link href="/study-techniques">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          {isEnglish ? 'Explore Techniques' : 'Teknikleri Keşfet'} →
        </Button>
      </Link>
    </Card>
  );
}
