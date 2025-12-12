import { LearnConnectLayout } from "@/components/layout/LearnConnectLayout";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { AnimatedCard } from "@/components/ui/animated-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Globe, Calendar, GraduationCap } from "lucide-react";

export default function LearnConnectPortal() {
  const { language } = useLanguage();

  return (
    <LearnConnectLayout>
      <GradientBackground>
        <div className="relative z-10 space-y-8 p-6">
          {/* Hero Section */}
          <AnimatedCard delay={0}>
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-white">
                {language === "tr"
                  ? "Küresel Eğitim Portalı"
                  : "Global Education Portal"}
              </CardTitle>
              <CardDescription className="text-white/90">
                {language === "tr"
                  ? "Türk milli eğitimi ile küresel fırsatları birleştiren AI destekli eğitim deneyimi"
                  : "AI-powered education experience bridging Turkish national education with global opportunities"}
              </CardDescription>
            </CardHeader>
          </AnimatedCard>

          {/* Main Features Tabs */}
          <Tabs defaultValue="exams" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="exams">
                <Calendar className="h-4 w-4 mr-2" />
                {language === "tr" ? "Sınavlar" : "Exams"}
              </TabsTrigger>
              <TabsTrigger value="global">
                <Globe className="h-4 w-4 mr-2" />
                {language === "tr" ? "Küresel Sistemler" : "Global Systems"}
              </TabsTrigger>
              <TabsTrigger value="international">
                <GraduationCap className="h-4 w-4 mr-2" />
                {language === "tr" ? "Uluslararası" : "International"}
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Brain className="h-4 w-4 mr-2" />
                AI Portal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exams" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "tr" ? "Sınavlar" : "Exams"}</CardTitle>
                  <CardDescription>{language === "tr" ? "Sınav takvimi yakında eklenecek" : "Exam timetable coming soon"}</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="global" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "tr" ? "Küresel Sistemler" : "Global Systems"}</CardTitle>
                  <CardDescription>{language === "tr" ? "Eğitim sistemleri karşılaştırması yakında eklenecek" : "Education systems comparison coming soon"}</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="international" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "tr" ? "Uluslararası" : "International"}</CardTitle>
                  <CardDescription>{language === "tr" ? "Uluslararası sınavlar portalı yakında eklenecek" : "International exams portal coming soon"}</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "tr" ? "AI Portal" : "AI Portal"}
                  </CardTitle>
                  <CardDescription>
                    {language === "tr"
                      ? "Kişiselleştirilmiş öneriler, öğrenme yolları ve günlük plan için giriş noktası."
                      : "Entry point for personalized recommendations, learning trails, and daily plans."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <a
                      href="/ai-recommendations"
                      className="p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <h3 className="font-semibold mb-2">
                        {language === "tr" ? "AI Önerileri" : "AI Recommendations"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "tr"
                          ? "Kişiselleştirilmiş kurs önerileri"
                          : "Personalized course recommendations"}
                      </p>
                    </a>
                    <a
                      href="/learning-trails"
                      className="p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <h3 className="font-semibold mb-2">
                        {language === "tr" ? "Öğrenme Yolları" : "Learning Trails"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "tr"
                          ? "Dinamik öğrenme yolları"
                          : "Dynamic learning paths"}
                      </p>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </GradientBackground>
    </LearnConnectLayout>
  );
}

