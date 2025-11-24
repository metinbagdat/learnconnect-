import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Heart, Wind, Calendar, Moon, Activity, Target } from 'lucide-react';

interface AnxietyTip {
  id: number;
  emoji: string;
  titleEn: string;
  titleTr: string;
  descriptionEn: string;
  descriptionTr: string;
  icon: any;
  color: string;
}

const anxietyTips: AnxietyTip[] = [
  {
    id: 1,
    emoji: '🎯',
    titleEn: 'Anxiety is Normal',
    titleTr: 'Kaygı Normaldir',
    descriptionEn: 'Every student feels nervous before exams. What matters is controlling this energy!',
    descriptionTr: 'Her öğrenci sınav öncesi heyecanlanır. Önemli olan bu enerjiyi kontrollü kullanmak!',
    icon: Heart,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 2,
    emoji: '🌬️',
    titleEn: 'Breathing Techniques',
    titleTr: 'Nefes Teknikleri',
    descriptionEn: '4-7-8 Rule: Breathe in for 4 seconds, hold for 7, exhale for 8. Calms instantly!',
    descriptionTr: '4-7-8 kuralı → 4 saniye nefes al, 7 saniye tut, 8 saniyede ver. Anında sakinleştirir!',
    icon: Wind,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 3,
    emoji: '📅',
    titleEn: 'Planned Study',
    titleTr: 'Planlı Çalışma',
    descriptionEn: 'Uncertainty increases anxiety. Create a clear study schedule with daily goals.',
    descriptionTr: 'Belirsizlik kaygıyı artırır. Net çalışma programı oluştur, günlük hedefler koy.',
    icon: Calendar,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 4,
    emoji: '💤',
    titleEn: 'Sleep Quality',
    titleTr: 'Uyku Düzeni',
    descriptionEn: '7-8 hours of quality sleep daily. A brain without sleep cannot learn or manage anxiety!',
    descriptionTr: 'Günde 7-8 saat kaliteli uyku. Uykusuz beyin öğrenemez ve kaygıyı yönetemez!',
    icon: Moon,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 5,
    emoji: '🏃',
    titleEn: 'Physical Exercise',
    titleTr: 'Hareket Et',
    descriptionEn: '30 minutes of walking daily. Endorphins reduce anxiety and boost focus!',
    descriptionTr: 'Günde 30 dakika yürüyüş. Endorfin kaygıyı azaltır, odaklanmayı artırır.',
    icon: Activity,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 6,
    emoji: '🎯',
    titleEn: 'LearnConnect AI',
    titleTr: 'LearnConnect Yapay Zeka',
    descriptionEn: 'Manage your anxiety with personalized plans and focus on success!',
    descriptionTr: 'Kişisel programınla kaygını yönet, başarıya odaklan!',
    icon: Target,
    color: 'from-yellow-500 to-yellow-600'
  }
];

export default function ExamAnxietyGuide() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const title = isEnglish ? 'Exam Anxiety Management Guide' : 'Sınav Kaygısıyla Başa Çıkma Rehberi';
  const subtitle = isEnglish 
    ? 'Master 6 proven techniques to manage exam anxiety and achieve success'
    : 'Sınav kaygısını yönetmek için 6 kanıtlanmış tekniği öğren';
  const tryButton = isEnglish ? 'Start Now' : 'Şimdi Başla';
  const hashtag = isEnglish ? '#examanxiety #success #mentalhealth #learnconnect' : '#sınavkaygısı #başarı #psikoloji #learnconnect';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{subtitle}</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
              #examanxiety
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              #mentalhealth
            </span>
            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm">
              #success
            </span>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {anxietyTips.slice(0, 5).map((tip: AnxietyTip) => (
            <Card key={tip.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className={`h-1 bg-gradient-to-r ${tip.color}`} />
              <div className="p-6">
                <div className="text-5xl mb-3">{tip.emoji}</div>
                <h3 className="text-xl font-bold mb-2">
                  {isEnglish ? tip.titleEn : tip.titleTr}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {isEnglish ? tip.descriptionEn : tip.descriptionTr}
                </p>
              </div>
            </Card>
          ))}

          {/* Featured: LearnConnect AI */}
          <Card className="overflow-hidden md:col-span-2 lg:col-span-1 border-2 border-yellow-500 dark:border-yellow-400">
            <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-600" />
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-50 dark:from-yellow-950 dark:to-yellow-950">
              <div className="text-6xl mb-3">{anxietyTips[5].emoji}</div>
              <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">
                {isEnglish ? anxietyTips[5].titleEn : anxietyTips[5].titleTr}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium mb-4">
                {isEnglish ? anxietyTips[5].descriptionEn : anxietyTips[5].descriptionTr}
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
        <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {isEnglish 
              ? 'Take Control of Your Exam Experience' 
              : 'Sınav Deneyiminizi Kontrol Altına Alın'}
          </h2>
          <p className="text-lg mb-6 opacity-90">
            {isEnglish
              ? 'LearnConnect combines these anxiety management techniques with personalized study plans to help you succeed.'
              : 'LearnConnect, bu kaygı yönetimi tekniklerini kişiselleştirilmiş çalışma planlarıyla birleştirerek başarınıza yardımcı olur.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {isEnglish ? 'Get Started Free' : 'Ücretsiz Başla'}
              </Button>
            </Link>
            <Link href="/study-techniques">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white/20">
                {isEnglish ? 'Learn Study Techniques' : 'Çalışma Tekniklerini Öğren'}
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
