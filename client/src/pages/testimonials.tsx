import React from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Star, Users, TrendingUp, Award } from 'lucide-react';

interface Testimonial {
  id: number;
  nameEn: string;
  nameTr: string;
  storyEn: string;
  storyTr: string;
  emoji: string;
  rating: number;
  category: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    nameEn: 'Ahmet',
    nameTr: 'Ahmet',
    storyEn: 'Went from 35 to 55 net! The adaptive learning system helped me focus on my weaknesses.',
    storyTr: '35 netten 55 nete çıktım! Uyarlamalı öğrenme sistemi zayıf alanlarıma odaklanmamı sağladı.',
    emoji: '💫',
    rating: 5,
    category: 'Progress'
  },
  {
    id: 2,
    nameEn: 'Ayşe',
    nameTr: 'Ayşe',
    storyEn: 'Overcame my math fear! The step-by-step lessons and practice problems changed everything.',
    storyTr: 'Matematik korkumu yendim! Adım adım dersler ve pratik sorular her şeyi değiştirdi.',
    emoji: '🔢',
    rating: 5,
    category: 'Confidence'
  },
  {
    id: 3,
    nameEn: 'Mehmet',
    nameTr: 'Mehmet',
    storyEn: 'Live classes saved my life! Real-time interaction with instructors made concepts clear.',
    storyTr: 'Canlı dersler hayat kurtarıcı! Öğretmenlerle gerçek zamanlı etkileşim kavramları netleştirdi.',
    emoji: '🎥',
    rating: 5,
    category: 'Teaching'
  },
  {
    id: 4,
    nameEn: 'Zeynep',
    nameTr: 'Zeynep',
    storyEn: 'Analytics showed my gaps! Detailed performance tracking helped me identify and fix weak areas.',
    storyTr: 'Analizlerle eksiklerimi gördüm! Detaylı performans takibi zayıf alanları tanımlamama yardımcı oldu.',
    emoji: '📊',
    rating: 5,
    category: 'Analytics'
  },
  {
    id: 5,
    nameEn: 'Fatih',
    nameTr: 'Fatih',
    storyEn: 'Best investment for my exam prep! The AI daily plans saved me hours of planning.',
    storyTr: 'Sınav hazırlığım için en iyi yatırım! AI günlük planları bana saatler tasarruf ettirdi.',
    emoji: '⏰',
    rating: 5,
    category: 'Time-Saving'
  },
  {
    id: 6,
    nameEn: 'Selin',
    nameTr: 'Selin',
    storyEn: 'Community support is amazing! Study groups and forum helped me stay motivated.',
    storyTr: 'Topluluk desteği harika! Çalışma grupları ve forum beni motive etmeye yardımcı oldu.',
    emoji: '👥',
    rating: 5,
    category: 'Community'
  }
];

const stats = [
  { label: 'Students', value: '5000+', icon: Users },
  { label: 'Avg. Net Increase', value: '+20', icon: TrendingUp },
  { label: 'Success Rate', value: '95%', icon: Award },
  { label: 'Rating', value: '4.9/5', icon: Star }
];

export default function TestimonialsPage() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const title = isEnglish ? '🎉 LearnConnect Success Stories' : '🎉 LearnConnect Ailesinden Başarı Hikayeleri';
  const subtitle = isEnglish 
    ? 'Join thousands of students who transformed their exam scores and confidence'
    : 'Sınav puanlarını ve özgüvenlerini dönüştüren binlerce öğrenciye katıl';
  const ctaButton = isEnglish ? 'Start Your Journey' : 'Yolculuğunu Başlat';
  const statsTitle = isEnglish ? 'By The Numbers' : 'Rakamlarla';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            {title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6 text-center bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
                <Icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{isEnglish ? stat.label : 
                  stat.label === 'Students' ? 'Öğrenci' : 
                  stat.label === 'Avg. Net Increase' ? 'Ort. Net Artışı' :
                  stat.label === 'Success Rate' ? 'Başarı Oranı' : 'Derecelendirme'
                }</div>
              </Card>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial: Testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {isEnglish ? testimonial.nameEn : testimonial.nameTr}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {testimonial.category}
                  </p>
                </div>
                <div className="text-3xl">{testimonial.emoji}</div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 flex-1 mb-4">
                "{isEnglish ? testimonial.storyEn : testimonial.storyTr}"
              </p>

              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {isEnglish ? 'Ready to Transform Your Exam Results?' : 'Sınav Sonuçlarınızı Dönüştürmeye Hazır mısınız?'}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {isEnglish
              ? 'Join thousands of successful students using LearnConnect. Your success story could be next!'
              : 'LearnConnect kullanan binlerce başarılı öğrenciye katıl. Senin başarı hikayesi bir sonraki olabilir!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {ctaButton}
              </Button>
            </Link>
            <Link href="/study-techniques">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white/20">
                {isEnglish ? 'Learn More' : 'Daha Fazla Bilgi'}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {isEnglish ? 'Share your success story' : 'Başarı hikayeni paylaş'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 font-mono">
            #LearnConnect #SuccessStory #ExamPrep
          </p>
        </div>
      </div>
    </div>
  );
}
