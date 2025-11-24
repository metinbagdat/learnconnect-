import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { BookOpen, Clock, Brain, TrendingUp, Zap } from 'lucide-react';

interface Technique {
  id: number;
  emoji: string;
  titleEn: string;
  titleTr: string;
  descriptionEn: string;
  descriptionTr: string;
  icon: any;
  color: string;
}

const techniques: Technique[] = [
  {
    id: 1,
    emoji: '🎧',
    titleEn: 'Feynman Technique',
    titleTr: 'Feynman Tekniği',
    descriptionEn: 'Simplify the topic as if explaining to a 12-year-old. If you cannot explain it, you have not learned it!',
    descriptionTr: 'Bir konuyu 12 yaşındaki birine anlatacak kadar basitleştir. Anlatamıyorsan, öğrenmemişsindir!',
    icon: Brain,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    emoji: '⏰',
    titleEn: 'Time Blocking',
    titleTr: 'Zaman Bloklama',
    descriptionEn: 'Divide your day into 2-hour blocks. Focus on 1 topic per block. Multitasking reduces efficiency!',
    descriptionTr: 'Günü 2 saatlik bloklara böl. Her blokta 1 konuya odaklan. Çoklu görev verimi düşürür!',
    icon: Clock,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    emoji: '📝',
    titleEn: 'Active Recall',
    titleTr: 'Aktif Hatırlama',
    descriptionEn: 'Instead of passive reading, close and recall. Challenge your brain, ensure lasting learning!',
    descriptionTr: 'Pasif okuma yerine, kapat ve hatırla. Beyni zorla, kalıcı öğrenme sağla!',
    icon: BookOpen,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    emoji: '🔄',
    titleEn: 'Backward Study',
    titleTr: 'Geriye Doğru Çalışma',
    descriptionEn: 'Start with difficult topics. Tackle the hardest with your freshest mind!',
    descriptionTr: 'Zor konulardan başla. Zihnin en tazeyken en zoru hallet!',
    icon: TrendingUp,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 5,
    emoji: '💫',
    titleEn: 'Smart Automation',
    titleTr: 'Akıllı Otomasyon',
    descriptionEn: 'All these techniques automatically applied by LearnConnect\'s intelligent system!',
    descriptionTr: 'Tüm bu teknikleri otomatik uygulayan akıllı sistem LearnConnect\'te!',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600'
  }
];

export default function StudyTechniques() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const title = isEnglish ? '5 Most Efficient Study Techniques' : 'En Verimli 5 Ders Çalışma Tekniği';
  const subtitle = isEnglish 
    ? 'Master these proven techniques to maximize your learning efficiency'
    : 'Bu kanıtlanmış teknikleri kullanarak öğrenme verimliliğinizi artırın';
  const tryButton = isEnglish ? 'Try Now' : 'Şimdi Dene';
  const hashtag = isEnglish ? '#efficientlearning #studytechniques #learnconnect' : '#verimliders #çalışmateknikleri #learnconnect';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{subtitle}</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
              #efficientlearning
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              #studytechniques
            </span>
            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm">
              #learnconnect
            </span>
          </div>
        </div>

        {/* Techniques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {techniques.slice(0, 4).map((tech: Technique) => (
              <Card key={tech.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className={`h-1 bg-gradient-to-r ${tech.color}`} />
                <div className="p-6">
                  <div className="text-5xl mb-3">{tech.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">
                    {isEnglish ? tech.titleEn : tech.titleTr}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {isEnglish ? tech.descriptionEn : tech.descriptionTr}
                  </p>
                </div>
              </Card>
            ))}

          {/* Featured: Smart Automation */}
          <Card className="overflow-hidden md:col-span-2 lg:col-span-1 border-2 border-yellow-500 dark:border-yellow-400 lg:row-span-1">
            <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-600" />
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-50 dark:from-yellow-950 dark:to-yellow-950">
              <div className="text-6xl mb-3">{techniques[4].emoji}</div>
              <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">
                {isEnglish ? techniques[4].titleEn : techniques[4].titleTr}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium mb-4">
                {isEnglish ? techniques[4].descriptionEn : techniques[4].descriptionTr}
              </p>
              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                  {tryButton}
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {isEnglish 
              ? 'Transform Your Learning Today' 
              : 'Bugün Öğrenişinizi Dönüştürün'}
          </h2>
          <p className="text-lg mb-6 opacity-90">
            {isEnglish
              ? 'LearnConnect combines all these proven techniques into an intelligent, personalized learning system.'
              : 'LearnConnect, tüm bu kanıtlanmış teknikleri akıllı, kişiselleştirilmiş bir öğrenme sistemine birleştirir.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {isEnglish ? 'Get Started Free' : 'Ücretsiz Başla'}
              </Button>
            </Link>
            <Link href="/landing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white/20">
                {isEnglish ? 'Learn More' : 'Daha Fazla Bilgi'}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {isEnglish ? 'Share these techniques with your friends' : 'Bu teknikleri arkadaşlarınla paylaş'}
          </p>
          <div className="text-sm text-slate-500 dark:text-slate-500 font-mono">
            {hashtag}
          </div>
        </div>
      </div>
    </div>
  );
}
