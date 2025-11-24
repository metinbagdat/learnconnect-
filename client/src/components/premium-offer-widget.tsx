import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Zap } from 'lucide-react';

export function PremiumOfferWidget() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-2 border-red-500 dark:border-red-600 relative overflow-hidden">
      <div className="absolute top-2 right-2 animate-bounce">
        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          {isEnglish ? 'LAST 3 DAYS' : 'SON 3 GÜN'}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h3 className="text-lg font-bold">
          {isEnglish ? '⚡ Premium 50% OFF' : '⚡ Premium %50 İNDİRİM'}
        </h3>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">99₺</span>
          <span className="text-sm line-through text-slate-500">199₺</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {isEnglish ? '1 month premium membership' : '1 aylık premium üyelik'}
        </p>
      </div>

      <div className="space-y-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span>✓</span>
          <span>{isEnglish ? 'Unlimited live lessons' : 'Sınırsız canlı ders'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>✓</span>
          <span>{isEnglish ? 'Personal consulting' : 'Kişisel danışmanlık'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>✓</span>
          <span>{isEnglish ? 'Detailed analytics' : 'Detaylı analizler'}</span>
        </div>
      </div>

      <Link href="/premium">
        <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
          {isEnglish ? 'Claim Offer' : 'Teklifi Al'} →
        </Button>
      </Link>

      <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-3">
        {isEnglish ? 'Code: LC50' : 'Kod: LC50'}
      </p>
    </Card>
  );
}
