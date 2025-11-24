import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Star } from 'lucide-react';

const featured = [
  { emoji: '💫', name: 'Ahmet', story: '35 to 55 net improvement', storyTr: '35 netten 55 nete çıktı' },
  { emoji: '🔢', name: 'Ayşe', story: 'Overcame math fear', storyTr: 'Matematik korkunu yendi' },
  { emoji: '🎥', name: 'Mehmet', story: 'Live classes transformed learning', storyTr: 'Canlı dersler hayat kurtardı' },
  { emoji: '📊', name: 'Zeynep', story: 'Found weak areas with analytics', storyTr: 'Analizlerle eksikleri gördü' }
];

export function TestimonialsWidget() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-bold mb-4">
        {isEnglish ? '⭐ Success Stories' : '⭐ Başarı Hikayeleri'}
      </h3>
      
      <div className="space-y-3 mb-4">
        {featured.map((story, idx) => (
          <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-2xl">{story.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{story.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isEnglish ? story.story : story.storyTr}
                </p>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link href="/testimonials">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          {isEnglish ? 'Read All Stories' : 'Tüm Hikayeleri Oku'} →
        </Button>
      </Link>
    </Card>
  );
}
