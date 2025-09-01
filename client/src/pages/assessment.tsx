import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, BookOpen, Target, ArrowRight, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useLocation } from "wouter";
import PageWrapper from "@/components/layout/page-wrapper";
import LevelAssessment from "@/components/assessment/level-assessment";

export default function AssessmentPage() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentConfig, setAssessmentConfig] = useState({
    subject: '',
    subCategory: '',
    purpose: 'goal_setting' // goal_setting, course_selection, skill_evaluation
  });

  const subjects = [
    { value: 'mathematics', label: language === 'tr' ? 'Matematik' : 'Mathematics' },
    { value: 'physics', label: language === 'tr' ? 'Fizik' : 'Physics' },
    { value: 'chemistry', label: language === 'tr' ? 'Kimya' : 'Chemistry' },
    { value: 'biology', label: language === 'tr' ? 'Biyoloji' : 'Biology' },
    { value: 'english', label: language === 'tr' ? 'İngilizce' : 'English' },
    { value: 'turkish', label: language === 'tr' ? 'Türkçe' : 'Turkish' },
    { value: 'history', label: language === 'tr' ? 'Tarih' : 'History' },
    { value: 'geography', label: language === 'tr' ? 'Coğrafya' : 'Geography' },
    { value: 'programming', label: language === 'tr' ? 'Programlama' : 'Programming' },
    { value: 'data_science', label: language === 'tr' ? 'Veri Bilimi' : 'Data Science' },
  ];

  const purposes = [
    { 
      value: 'goal_setting', 
      label: language === 'tr' ? 'Hedef Belirleme' : 'Goal Setting',
      description: language === 'tr' ? 'Öğrenme hedefleri belirlemek için seviyemi öğrenmek istiyorum' : 'I want to know my level to set learning goals'
    },
    { 
      value: 'course_selection', 
      label: language === 'tr' ? 'Kurs Seçimi' : 'Course Selection',
      description: language === 'tr' ? 'Uygun kurs seviyesi seçmek için değerlendirme yapmak istiyorum' : 'I want assessment to select appropriate course level'
    },
    { 
      value: 'skill_evaluation', 
      label: language === 'tr' ? 'Beceri Değerlendirmesi' : 'Skill Evaluation',
      description: language === 'tr' ? 'Mevcut bilgi seviyemi ve gelişim alanlarımı öğrenmek istiyorum' : 'I want to know my current knowledge level and areas for improvement'
    }
  ];

  const startAssessment = () => {
    if (!assessmentConfig.subject) {
      return;
    }
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (result: any) => {
    setShowAssessment(false);
    
    // Navigate based on purpose
    switch (assessmentConfig.purpose) {
      case 'goal_setting':
        navigate('/study-planner');
        break;
      case 'course_selection':
        navigate('/courses');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  if (showAssessment) {
    return (
      <PageWrapper 
        title={language === 'tr' ? 'Seviye Değerlendirmesi' : 'Level Assessment'}
        showBackButton
      >
        <LevelAssessment
          subject={assessmentConfig.subject}
          subCategory={assessmentConfig.subCategory}
          onComplete={handleAssessmentComplete}
          onCancel={() => setShowAssessment(false)}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title={language === 'tr' ? 'Seviye Değerlendirmesi' : 'Level Assessment'}
      showBackButton
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'tr' ? 'AI Destekli Seviye Değerlendirmesi' : 'AI-Powered Level Assessment'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'tr' 
              ? 'Yapay zeka ile kişiselleştirilmiş sorular çözerek mevcut seviyenizi keşfedin ve size özel öğrenme planı oluşturun.'
              : 'Discover your current level with AI-personalized questions and create a customized learning plan just for you.'
            }
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {language === 'tr' ? 'Akıllı Sorular' : 'Smart Questions'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'tr' 
                  ? 'AI tarafından seviyenize uygun oluşturulan sorular'
                  : 'AI-generated questions tailored to your level'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {language === 'tr' ? 'Detaylı Analiz' : 'Detailed Analysis'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'tr' 
                  ? 'Güçlü ve zayıf yönlerinizin ayrıntılı analizi'
                  : 'Comprehensive analysis of your strengths and weaknesses'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {language === 'tr' ? 'Kişisel Plan' : 'Personal Plan'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'tr' 
                  ? 'Sonuçlarınıza göre özelleştirilmiş öğrenme önerileri'
                  : 'Customized learning recommendations based on your results'
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessment Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'tr' ? 'Değerlendirme Ayarları' : 'Assessment Configuration'}
              </CardTitle>
              <CardDescription>
                {language === 'tr' 
                  ? 'Değerlendirme yapmak istediğiniz konuyu ve amacınızı seçin'
                  : 'Select the subject you want to assess and your purpose'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <div>
                <Label className="text-base font-medium">
                  {language === 'tr' ? 'Konu Seçimi' : 'Subject Selection'}
                </Label>
                <Select 
                  value={assessmentConfig.subject} 
                  onValueChange={(value) => setAssessmentConfig(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={language === 'tr' ? 'Bir konu seçin...' : 'Select a subject...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-category (optional) */}
              <div>
                <Label className="text-base font-medium">
                  {language === 'tr' ? 'Alt Kategori (Opsiyonel)' : 'Sub-category (Optional)'}
                </Label>
                <Input
                  className="mt-2"
                  placeholder={language === 'tr' ? 'Örn: Cebir, Geometri, Limit...' : 'e.g., Algebra, Geometry, Calculus...'}
                  value={assessmentConfig.subCategory}
                  onChange={(e) => setAssessmentConfig(prev => ({ ...prev, subCategory: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'tr' 
                    ? 'Daha spesifik değerlendirme için alt konu belirtebilirsiniz'
                    : 'You can specify a sub-topic for more specific assessment'
                  }
                </p>
              </div>

              {/* Purpose Selection */}
              <div>
                <Label className="text-base font-medium">
                  {language === 'tr' ? 'Değerlendirme Amacı' : 'Assessment Purpose'}
                </Label>
                <div className="grid gap-3 mt-2">
                  {purposes.map((purpose) => (
                    <div
                      key={purpose.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        assessmentConfig.purpose === purpose.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setAssessmentConfig(prev => ({ ...prev, purpose: purpose.value }))}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          assessmentConfig.purpose === purpose.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`} />
                        <div>
                          <h4 className="font-medium">{purpose.label}</h4>
                          <p className="text-sm text-gray-600">{purpose.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Assessment Button */}
              <div className="pt-4">
                <Button
                  onClick={startAssessment}
                  disabled={!assessmentConfig.subject}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {language === 'tr' ? 'Değerlendirmeyi Başlat' : 'Start Assessment'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {!assessmentConfig.subject && (
                  <p className="text-sm text-red-500 text-center mt-2">
                    {language === 'tr' ? 'Lütfen bir konu seçin' : 'Please select a subject'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                {language === 'tr' ? 'Değerlendirme Hakkında' : 'About the Assessment'}
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• {language === 'tr' ? '10-15 AI destekli soru ile yaklaşık 15 dakika sürer' : 'Takes about 15 minutes with 10-15 AI-powered questions'}</p>
                <p>• {language === 'tr' ? 'Seviyenize göre adaptif sorular sorulur' : 'Adaptive questions based on your level'}</p>
                <p>• {language === 'tr' ? 'Güçlü ve zayıf yönleriniz analiz edilir' : 'Your strengths and weaknesses are analyzed'}</p>
                <p>• {language === 'tr' ? 'Kişiselleştirilmiş öğrenme önerileri alırsınız' : 'You receive personalized learning recommendations'}</p>
                <p>• {language === 'tr' ? 'Sonuçlar otomatik olarak profilinize kaydedilir' : 'Results are automatically saved to your profile'}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}