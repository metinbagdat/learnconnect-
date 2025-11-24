import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const tips = [
  { id: 1, emoji: '🎯', titleEn: 'Anxiety is Normal', titleTr: 'Kaygı Normaldir' },
  { id: 2, emoji: '🌬️', titleEn: 'Breathing Techniques', titleTr: 'Nefes Teknikleri' },
  { id: 3, emoji: '📅', titleEn: 'Planned Study', titleTr: 'Planlı Çalışma' },
  { id: 4, emoji: '💤', titleEn: 'Sleep Quality', titleTr: 'Uyku Düzeni' },
  { id: 5, emoji: '🏃', titleEn: 'Exercise', titleTr: 'Hareket' }
];

export function AnxietyManagementWidget() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-2 border-red-200 dark:border-red-800">
      <h3 className="text-lg font-bold mb-4">
        {isEnglish ? '❤️ Manage Exam Anxiety' : '❤️ Sınav Kaygısını Yönet'}
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tips.map((tip) => (
          <div key={tip.id} className="text-sm px-2 py-1 bg-white dark:bg-slate-800 rounded-lg flex items-center gap-1">
            <span>{tip.emoji}</span>
            <span className="font-medium">{isEnglish ? tip.titleEn : tip.titleTr}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {isEnglish
          ? 'Learn 6 proven techniques to overcome exam anxiety and perform at your best'
          : 'Sınav kaygısını yenmek için 6 kanıtlanmış tekniği öğren'}
      </p>

      <Link href="/exam-anxiety">
        <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
          {isEnglish ? 'Learn Techniques' : 'Teknikleri Öğren'} →
        </Button>
      </Link>
    </Card>
  );
}
