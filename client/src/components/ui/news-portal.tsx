import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/consolidated-language-context";

export function NewsPortal() {
  const { language } = useLanguage();
  const isTr = language === "tr";

  return (
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
  );
}
