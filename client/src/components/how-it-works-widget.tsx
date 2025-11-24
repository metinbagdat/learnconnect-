import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const steps = [
  { emoji: '1️⃣', stepEn: 'Sign Up', stepTr: 'Kayıt Ol' },
  { emoji: '2️⃣', stepEn: 'Assessment', stepTr: 'Seviye Tespiti' },
  { emoji: '3️⃣', stepEn: 'Plan', stepTr: 'Program' },
  { emoji: '4️⃣', stepEn: 'Study', stepTr: 'Çalış' },
  { emoji: '5️⃣', stepEn: 'Succeed', stepTr: 'Başarı' }
];

export function HowItWorksWidget() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-bold mb-4">
        {isEnglish ? '🚀 How It Works' : '🚀 Nasıl Çalışıyor'}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4 justify-between">
        {steps.map((step, idx) => (
          <div key={idx} className="text-center flex-1 min-w-max">
            <div className="text-2xl mb-1">{step.emoji}</div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {isEnglish ? step.stepEn : step.stepTr}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {isEnglish
          ? '5 simple steps to achieve your exam goals'
          : 'Sınav hedeflerinize 5 basit adımda ulaşın'}
      </p>

      <Link href="/how-it-works">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          {isEnglish ? 'Learn More' : 'Daha Fazla Bilgi'} →
        </Button>
      </Link>
    </Card>
  );
}
