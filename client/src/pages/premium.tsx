import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Check, Clock, Zap } from 'lucide-react';

interface Feature {
  titleEn: string;
  titleTr: string;
  emoji: string;
}

const features: Feature[] = [
  { titleEn: 'Unlimited Live Lessons', titleTr: 'Sınırsız Canlı Ders', emoji: '🎥' },
  { titleEn: 'Personal Consulting', titleTr: 'Kişisel Danışmanlık', emoji: '👨‍🏫' },
  { titleEn: 'Exclusive Question Bank', titleTr: 'Özel Soru Bankası', emoji: '📚' },
  { titleEn: 'Detailed Analysis Reports', titleTr: 'Detaylı Analiz Raporları', emoji: '📊' },
  { titleEn: 'Priority Support', titleTr: 'Öncelik Desteği', emoji: '⭐' },
  { titleEn: 'Custom Study Plans', titleTr: 'Özel Çalışma Planları', emoji: '📝' },
  { titleEn: 'Performance Analytics', titleTr: 'Performans Analitikleri', emoji: '📈' },
  { titleEn: 'Certificate Upon Completion', titleTr: 'Tamamlama Sertifikası', emoji: '🏆' }
];

export default function PremiumPage() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 23, 59, 59);
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const discountCode = 'LC50';
  const normalPrice = isEnglish ? '199₺' : '199₺';
  const discountedPrice = isEnglish ? '99₺' : '99₺';
  const savings = isEnglish ? '50% OFF' : '%50 İNDİRİM';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Urgent Banner */}
        <div className="mb-8 animate-pulse">
          <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {isEnglish ? '⚡ LAST 3 DAYS! ⚡' : '⚡ SON 3 GÜN! ⚡'}
              </span>
            </div>
            {timeLeft && <p className="text-lg font-mono">{timeLeft}</p>}
            <p className="text-sm mt-2">{isEnglish ? 'Limited to first 100 students only!' : 'Sadece ilk 100 öğrenci için!'}</p>
          </Card>
        </div>

        {/* Pricing Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Original Price (Strikethrough) */}
          <Card className="p-8 opacity-75 relative">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary">{isEnglish ? 'Was' : 'Eski Fiyat'}</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-4 line-through text-slate-500">
              {normalPrice}/
              <span className="text-lg">{isEnglish ? 'month' : 'ay'}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {isEnglish ? 'Standard pricing' : 'Normal fiyatlandırma'}
            </p>
          </Card>

          {/* Discounted Price (Highlighted) */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-500 dark:border-blue-400 relative">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
                {savings}
              </Badge>
            </div>
            <h3 className="text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
              {discountedPrice}/
              <span className="text-lg">{isEnglish ? 'month' : 'ay'}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {isEnglish ? 'Premium membership' : 'Premium üyelik'}
            </p>
            <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-blue-300 dark:border-blue-600">
              <p className="text-sm font-medium mb-1">{isEnglish ? 'Discount Code:' : 'İndirim Kodu:'}</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">{discountCode}</p>
            </div>
            <Link href="/checkout">
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {isEnglish ? 'Get Premium Now' : 'Şimdi Premium Al'}
              </Button>
            </Link>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {isEnglish ? "What's Included in Premium?" : 'Premium\'a Neler Dahil?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-2xl mb-1">{feature.emoji}</div>
                    <p className="font-medium text-sm">
                      {isEnglish ? feature.titleEn : feature.titleTr}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <Card className="p-8 mb-12 overflow-x-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">
            {isEnglish ? 'Feature Comparison' : 'Özellik Karşılaştırması'}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                <th className="text-left py-3">{isEnglish ? 'Feature' : 'Özellik'}</th>
                <th className="text-center py-3">{isEnglish ? 'Free' : 'Ücretsiz'}</th>
                <th className="text-center py-3 text-blue-600 dark:text-blue-400 font-bold">{isEnglish ? 'Premium' : 'Premium'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Live Lessons', nameTr: 'Canlı Dersler', free: '2/month', premium: '∞' },
                { name: 'Personal Consulting', nameTr: 'Kişisel Danışmanlık', free: '✗', premium: '✓' },
                { name: 'Question Bank', nameTr: 'Soru Bankası', free: 'Limited', premium: 'Full' },
                { name: 'Analysis Reports', nameTr: 'Analiz Raporları', free: 'Basic', premium: 'Detailed' },
                { name: 'Priority Support', nameTr: 'Öncelik Desteği', free: '✗', premium: '✓' }
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-4">{isEnglish ? item.name : item.nameTr}</td>
                  <td className="text-center py-4 text-slate-600 dark:text-slate-400">{item.free}</td>
                  <td className="text-center py-4 text-green-600 dark:text-green-400 font-bold">{item.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {isEnglish ? 'Transform Your Exam Preparation Today' : 'Sınav Hazırlığınızı Bugün Dönüştürün'}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {isEnglish
              ? 'Join thousands of students benefiting from premium features. Only 99₺ for 1 month!'
              : 'Premium özellikleri kullanan binlerce öğrenciye katıl. Sadece 1 ay için 99₺!'}
          </p>
          <Link href="/checkout">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              {isEnglish ? 'Get Premium Access' : 'Premium Erişim Sağla'}
            </Button>
          </Link>
        </Card>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {isEnglish ? 'Share this offer with friends' : 'Bu teklifi arkadaşlarınla paylaş'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 font-mono">
            #indirim #fırsat #premium #learnconnect #sınavhazırlık #tyt #ayt
          </p>
        </div>
      </div>
    </div>
  );
}
