import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Users, Zap, Award, TrendingUp, BookOpen, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Navbar } from "@/components/layout/navbar";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const isTr = language === "tr";

  // Content in multiple languages
  const content = {
    hero: {
      title: isTr ? "Gelecekti Kur, Şimdi Öğren" : "Build Your Future, Learn Today",
      subtitle: isTr
        ? "YKS, TYT, AYT ve daha fazlası için kişiselleştirilmiş AI destekli öğrenme"
        : "Personalized AI-powered learning for YKS, TYT, AYT and beyond",
      cta: isTr ? "Ücretsiz Başlayın" : "Get Started Free",
    },
    features: {
      title: isTr ? "Neden EduLearn?" : "Why EduLearn?",
      items: [
        {
          icon: "sparkles",
          title: isTr ? "AI Yardımcısı" : "AI Assistant",
          desc: isTr ? "Kişiselleştirilmiş öğrenme yolları ve günlük planlar" : "Personalized learning paths & daily plans",
        },
        {
          icon: "zap",
          title: isTr ? "Hızlı Öğrenme" : "Fast Learning",
          desc: isTr ? "Etkili çalışma teknikleri ve odaklı oturumlar" : "Effective study techniques & focused sessions",
        },
        {
          icon: "award",
          title: isTr ? "Başarı Takibi" : "Achievement Tracking",
          desc: isTr ? "Ilerlemenizi görün, başarıları kazanın" : "See progress, earn achievements",
        },
        {
          icon: "users",
          title: isTr ? "Topluluk" : "Community",
          desc: isTr ? "Diğer öğrenenlerle bağlanın ve paylaşın" : "Connect & learn with peers",
        },
      ],
    },
    pricing: {
      title: isTr ? "Fiyatlandırma Planları" : "Pricing Plans",
      subtitle: isTr ? "Bütçenize uygun paket seçin" : "Choose the perfect plan for you",
    },
    testimonials: {
      title: isTr ? "Başarı Hikayeleri" : "Success Stories",
      items: [
        {
          name: "Elif Yılmaz",
          role: isTr ? "YKS Başarı 2024" : "YKS Achiever 2024",
          text: isTr
            ? "EduLearn ile YKS için hazırlandım ve hedeflediğim üniversiteye gittim. AI destekli planlar gerçekten yardımcı oldu!"
            : "Prepared for YKS with EduLearn and got into my dream university. The AI-powered plans were incredibly helpful!",
          rating: 5,
        },
        {
          name: "Ahmet Demir",
          role: isTr ? "İleri Matematik" : "Advanced Math",
          text: isTr
            ? "Her bölüm için kişiselleştirilmiş pratik sorular ve açıklamalar. Bir öğretmene sahip olmak gibi!"
            : "Personalized practice questions for every topic. Like having a personal tutor!",
          rating: 5,
        },
        {
          name: "Zeynep Kaya",
          role: isTr ? "STEM Tutkunun" : "STEM Enthusiast",
          text: isTr
            ? "Gamifikasyon sistemi öğrenmeyi eğlenceli hale getirdi. Motivasyonum hiç bu kadar yüksek olmamıştı."
            : "The gamification made learning fun. Never been more motivated!",
          rating: 5,
        },
      ],
    },
    cta: {
      title: isTr ? "Şimdi Başla" : "Start Your Learning Journey",
      subtitle: isTr ? "Binlerce öğrenci zaten EduLearn'de başarı elde ediyor" : "Thousands of students are already succeeding with EduLearn",
      button: isTr ? "Hesap Oluştur" : "Create Account",
    },
  };

  const pricingPlans: PricingTier[] = [
    {
      name: isTr ? "Başlangıç" : "Starter",
      price: isTr ? "Ücretsiz" : "Free",
      description: isTr ? "Öğrenmeye başlayın" : "Get started learning",
      features: [
        isTr ? "Ücretsiz 5 kurs" : "5 free courses",
        isTr ? "Temel ilerlemelı takibi" : "Basic progress tracking",
        isTr ? "Topluluk forumu" : "Community forum",
        isTr ? "Sınırlanmış AI yardımı" : "Limited AI assistance",
      ],
      cta: isTr ? "Ücretsiz Başla" : "Start Free",
    },
    {
      name: isTr ? "Pro" : "Pro",
      price: "$9.99",
      description: isTr ? "Tüm premium içeriğe erişin" : "Access all premium content",
      features: [
        isTr ? "Sınırlanmayan kurslar" : "Unlimited courses",
        isTr ? "Gelişmiş AI yardımı" : "Advanced AI assistance",
        isTr ? "Günlük öğrenme planları" : "Daily learning plans",
        isTr ? "Sertifikatlar" : "Certificates",
        isTr ? "Kişisel mentorluk" : "Personal mentoring",
      ],
      cta: isTr ? "Pro Olun" : "Go Pro",
      highlighted: true,
    },
    {
      name: isTr ? "Kurumsal" : "Enterprise",
      price: isTr ? "Özel" : "Custom",
      description: isTr ? "Okullar ve kurumlar için" : "For schools & institutions",
      features: [
        isTr ? "Sınırlanmayan kullanıcılar" : "Unlimited users",
        isTr ? "Özel kurulum ve destek" : "Custom setup & support",
        isTr ? "İleri analitiği" : "Advanced analytics",
        isTr ? "API erişimi" : "API access",
        isTr ? "Adanmış hesap yöneticisi" : "Dedicated account manager",
      ],
      cta: isTr ? "Teklif Al" : "Get Quote",
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            EduLearn
          </div>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white"
              onClick={() => navigate("/auth")}
            >
              {isTr ? "Giriş Yap" : "Sign In"}
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              onClick={() => navigate("/auth")}
            >
              {isTr ? "Başlayın" : "Get Started"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32 lg:py-40 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">{isTr ? "AI Destekli Öğrenme" : "AI-Powered Learning"}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white space-y-2">
            <div>{content.hero.title}</div>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">{content.hero.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              onClick={() => navigate("/auth")}
            >
              {content.hero.cta}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              {isTr ? "Fiyatlandırmaya Bak" : "View Pricing"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-md mx-auto text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">42+</div>
              <div className="text-slate-400">{isTr ? "Kurslar" : "Courses"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">1000+</div>
              <div className="text-slate-400">{isTr ? "Öğrenci" : "Students"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">95%</div>
              <div className="text-slate-400">{isTr ? "Başarı Oranı" : "Success Rate"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-white">{content.features.title}</h2>
            <p className="text-xl text-slate-400">{isTr ? "Eğitim deneyimini dönüştüren özellikler" : "Features transforming education"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.items.map((feature, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon === "sparkles" && <Sparkles className="w-6 h-6 text-blue-400" />}
                    {feature.icon === "zap" && <Zap className="w-6 h-6 text-cyan-400" />}
                    {feature.icon === "award" && <Award className="w-6 h-6 text-yellow-400" />}
                    {feature.icon === "users" && <Users className="w-6 h-6 text-green-400" />}
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-white">{content.pricing.title}</h2>
            <p className="text-xl text-slate-400">{content.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <Card
                key={i}
                className={`transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-blue-600/30 to-cyan-600/30 border-blue-500/50 scale-105"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-white">{plan.price}</div>
                    {!["Ücretsiz", "Free", isTr ? "Özel" : "Custom"].includes(plan.price) && (
                      <div className="text-sm text-slate-400">{isTr ? "/ay" : "/month"}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                  <div className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI News Portal */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-800/30 to-slate-900/50 border-y border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-white">{isTr ? "🎓 Eğitim Haberleri" : "🎓 Education News"}</h2>
            <p className="text-xl text-slate-400">{isTr ? "AI tarafından seçilen en son eğitim haberleri" : "AI-curated latest education news"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: isTr ? "YKS 2025 Değişiklikleri" : "YKS 2025 Changes",
                excerpt: isTr ? "ÖSYM tarafından açıklanan yeni YKS formatı ve tarihler" : "New YKS format and dates announced by OSYM",
                date: "22 Nov 2025",
                category: isTr ? "Resmi Haber" : "Official News",
              },
              {
                title: isTr ? "Yapay Zeka Eğitimde" : "AI in Education",
                excerpt: isTr ? "Kişiselleştirilmiş öğrenme teknolojileri nasıl başarıyı artırıyor" : "How personalized learning tech boosts success",
                date: "20 Nov 2025",
                category: isTr ? "Teknoloji" : "Tech",
              },
              {
                title: isTr ? "Başarı Hikayeleri" : "Success Stories",
                excerpt: isTr ? "EduLearn öğrencileri 95% başarı oranıyla hedeflerine ulaştı" : "EduLearn students achieve 95% success rate",
                date: "18 Nov 2025",
                category: isTr ? "Başarı" : "Success",
              },
            ].map((news, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer hover:scale-105">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">{news.category}</span>
                    <span className="text-xs text-slate-500">{news.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{news.title}</h3>
                  <p className="text-slate-400 text-sm">{news.excerpt}</p>
                  <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 justify-start p-0">
                    {isTr ? "Oku →" : "Read →"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-white">{content.testimonials.title}</h2>
            <p className="text-xl text-slate-400">{isTr ? "Öğrencilerimizin söyledikleri" : "What our students say"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.items.map((testimonial, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <span key={j} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-8 md:p-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              {isTr ? "En Son Güncellemeleri Al" : "Stay Updated"}
            </h2>
            <p className="text-slate-400">
              {isTr
                ? "Yeni özellikler ve ipuçları için bültenimize abone olun"
                : "Subscribe to our newsletter for tips and new features"}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 mt-6">
              <Input
                type="email"
                placeholder={isTr ? "E-posta adresinizi girin" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {isTr ? "Abone Ol" : "Subscribe"}
              </Button>
            </form>

            {subscribed && (
              <p className="text-green-400 text-sm">{isTr ? "Teşekkürler! Aboneliğiniz onaylandı." : "Thanks! Check your email."}</p>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">{content.cta.title}</h2>
          <p className="text-xl text-slate-400">{content.cta.subtitle}</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            onClick={() => navigate("/auth")}
          >
            {content.cta.button}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">{isTr ? "Ürün" : "Product"}</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">{isTr ? "Özellikler" : "Features"}</li>
                <li className="hover:text-white cursor-pointer">{isTr ? "Fiyatlandırma" : "Pricing"}</li>
                <li className="hover:text-white cursor-pointer">{isTr ? "Güvenlik" : "Security"}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">{isTr ? "Şirket" : "Company"}</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">{isTr ? "Hakkında" : "About"}</li>
                <li className="hover:text-white cursor-pointer">{isTr ? "Blog" : "Blog"}</li>
                <li className="hover:text-white cursor-pointer">{isTr ? "İletişim" : "Contact"}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">{isTr ? "Yasal" : "Legal"}</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">{isTr ? "Gizlilik" : "Privacy"}</li>
                <li className="hover:text-white cursor-pointer">{isTr ? "Şartlar" : "Terms"}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">{isTr ? "Sosyal" : "Social"}</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">Twitter</li>
                <li className="hover:text-white cursor-pointer">LinkedIn</li>
                <li className="hover:text-white cursor-pointer">Instagram</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
            <p>© 2025 EduLearn. {isTr ? "Tüm hakları saklıdır." : "All rights reserved."}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
