import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { UserPlus, BarChart3, Zap, LineChart, Trophy } from 'lucide-react';

interface Step {
  id: number;
  titleEn: string;
  titleTr: string;
  descriptionEn: string;
  descriptionTr: string;
  icon: any;
  emoji: string;
  color: string;
}

const steps: Step[] = [
  {
    id: 1,
    titleEn: 'Sign Up',
    titleTr: 'Kayıt Ol',
    descriptionEn: 'Create a free account in seconds',
    descriptionTr: 'Saniyeler içinde ücretsiz hesap oluştur',
    emoji: '1️⃣',
    icon: UserPlus,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    titleEn: 'Assessment',
    titleTr: 'Seviye Tespiti',
    descriptionEn: 'Analyze your knowledge gaps and weaknesses',
    descriptionTr: 'Eksiklerini ve zayıf alanlarını analiz et',
    emoji: '2️⃣',
    icon: BarChart3,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    titleEn: 'Personal Plan',
    titleTr: 'Kişisel Program',
    descriptionEn: 'Get an AI-generated personalized study plan',
    descriptionTr: 'Otomatik yapay zeka çalışma planı oluştur',
    emoji: '3️⃣',
    icon: Zap,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 4,
    titleEn: 'Study & Track',
    titleTr: 'Çalış ve Takip Et',
    descriptionEn: 'Follow your plan and monitor your progress in real-time',
    descriptionTr: 'Planını takip et ve gelişimini izle',
    emoji: '4️⃣',
    icon: LineChart,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 5,
    titleEn: 'Achieve Success',
    titleTr: 'Başarıyı Yakala',
    descriptionEn: 'Reach your goals and transform your exam scores',
    descriptionTr: 'Hedeflerine ulaş ve sınav puanlarını dönüştür',
    emoji: '5️⃣',
    icon: Trophy,
    color: 'from-yellow-500 to-yellow-600'
  }
];

export default function HowItWorks() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const title = isEnglish ? 'How LearnConnect Works' : 'LearnConnect Nasıl Çalışıyor?';
  const subtitle = isEnglish
    ? 'A simple 5-step journey to exam success'
    : '5 adımda sınav başarısına giden yol';
  const ctaButton = isEnglish ? 'Get Started Now' : 'Şimdi Başla';
  const dailyUsers = isEnglish ? 'Every day, 1000+ students achieve their goals with our system!' : 'Her gün 1000+ öğrenci bu sistemle başarıya ulaşıyor!';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            {title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">{subtitle}</p>
        </div>

        {/* Steps Section */}
        <div className="mb-16">
          {/* Desktop: Horizontal flow */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 mb-8">
            {steps.map((step: Step, idx: number) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative">
                  <Card className="p-6 text-center h-full bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
                    <div className={`h-1 bg-gradient-to-r ${step.color} mb-4`} />
                    <div className="text-4xl mb-3">{step.emoji}</div>
                    <h3 className="text-lg font-bold mb-2">
                      {isEnglish ? step.titleEn : step.titleTr}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {isEnglish ? step.descriptionEn : step.descriptionTr}
                    </p>
                  </Card>
                  {idx < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: Vertical stack */}
          <div className="lg:hidden space-y-4">
            {steps.map((step: Step) => {
              const Icon = step.icon;
              return (
                <Card key={step.id} className="p-6 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="text-4xl flex-shrink-0">{step.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">
                        {isEnglish ? step.titleEn : step.titleTr}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {isEnglish ? step.descriptionEn : step.descriptionTr}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Daily Users Stats */}
        <Card className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 p-8 md:p-12 text-center mb-8 border-2 border-blue-300 dark:border-blue-700">
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-2">💫 {dailyUsers}</p>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {isEnglish ? 'Ready to Transform Your Exam Results?' : 'Sınav Sonuçlarınızı Dönüştürmeye Hazır mısınız?'}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {isEnglish
              ? 'Join thousands of students succeeding with LearnConnect. Start your free account today!'
              : 'LearnConnect ile başarıya giden binlerce öğrenciye katıl. Bugün ücretsiz başla!'}
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              {ctaButton}
            </Button>
          </Link>
        </Card>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/study-techniques">
            <Button variant="outline" className="w-full">
              {isEnglish ? '📚 Study Techniques' : '📚 Çalışma Teknikleri'}
            </Button>
          </Link>
          <Link href="/exam-anxiety">
            <Button variant="outline" className="w-full">
              {isEnglish ? '❤️ Manage Anxiety' : '❤️ Kaygıyı Yönet'}
            </Button>
          </Link>
          <Link href="/testimonials">
            <Button variant="outline" className="w-full">
              {isEnglish ? '⭐ Success Stories' : '⭐ Başarı Hikayeleri'}
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {isEnglish ? 'Follow us and join the community' : 'Bizi takip et ve topluluğa katıl'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 font-mono">
            #learnconnect #nasılçalışır #platform #dijitaleğitim #sınavhazırlık #tyt #ayt
          </p>
        </div>
      </div>
    </div>
  );
}
