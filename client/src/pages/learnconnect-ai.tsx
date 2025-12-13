import { LearnConnectLayout } from "@/components/layout/LearnConnectLayout";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, Cpu, Zap } from "lucide-react";

export default function LearnConnectAI() {
  const { language } = useLanguage();

  return (
    <LearnConnectLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative z-10 space-y-8 p-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-white">
                {language === "tr"
                  ? "AI Eğitim Asistanı"
                  : "AI Education Assistant"}
              </CardTitle>
              <CardDescription className="text-white/90">
                {language === "tr"
                  ? "Yapay zeka destekli kişiselleştirilmiş öğrenme deneyimi"
                  : "AI-powered personalized learning experience"}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* AI Features */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Brain,
                title: language === "tr" ? "Akıllı Öneriler" : "Smart Recommendations",
                description: language === "tr"
                  ? "Kişiselleştirilmiş içerik ve öğrenme yolu önerileri"
                  : "Personalized content and learning path recommendations",
              },
              {
                icon: Sparkles,
                title: language === "tr" ? "Uyarlanabilir Öğrenme" : "Adaptive Learning",
                description: language === "tr"
                  ? "Zorluk seviyesini otomatik olarak ayarlayan sistem"
                  : "System that automatically adjusts difficulty level",
              },
              {
                icon: Cpu,
                title: language === "tr" ? "Analitik İçgörüler" : "Analytics Insights",
                description: language === "tr"
                  ? "Performans analizi ve ilerleme takibi"
                  : "Performance analysis and progress tracking",
              },
              {
                icon: Zap,
                title: language === "tr" ? "Hızlı Yanıt" : "Quick Response",
                description: language === "tr"
                  ? "Anında geri bildirim ve destek"
                  : "Instant feedback and support",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white/5 border-white/20">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-blue-400 mb-2" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Message */}
          <Card className="bg-white/5 border-white/20">
            <CardContent className="pt-6">
              <p className="text-center text-white/90">
                {language === "tr"
                  ? "Bu sayfa yakında daha fazla AI özelliği ile güncellenecektir."
                  : "This page will be updated with more AI features soon."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LearnConnectLayout>
  );
}

