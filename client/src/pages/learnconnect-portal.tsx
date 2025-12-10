import { LearnConnectLayout } from "@/components/layout/LearnConnectLayout";
import { useLanguage } from "@/contexts/consolidated-language-context";

export default function LearnConnectPortal() {
  const { language } = useLanguage();

  return (
    <LearnConnectLayout>
      <section className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-purple-100">
            {language === "tr" ? "Yapay Zeka Destekli Eğitim" : "AI-Powered Education"}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            {language === "tr"
              ? "TYT, AYT ve LGS için akıllı öğrenme deneyimi"
              : "Intelligent learning for TYT, AYT, and LGS"}
          </h1>
          <p className="text-purple-100">
            {language === "tr"
              ? "Kayıt ve giriş için üstteki butonları kullanın. Sınav kategorilerini inceleyin, AI önerilerini alın ve yönetici paneliyle her şeyi yönetin."
              : "Use the navbar to register or log in. Browse exam categories, get AI suggestions, and manage everything from the admin dashboard."}
          </p>
          <div className="flex gap-3">
            <a
              href="/learnconnect/exams"
              className="px-4 py-2 rounded bg-white text-purple-800 font-semibold text-sm hover:bg-gray-100 transition"
            >
              {language === "tr" ? "Sınavları İncele" : "Browse Exams"}
            </a>
            <a
              href="/learnconnect/ai"
              className="px-4 py-2 rounded border border-white/50 text-white font-semibold text-sm hover:bg-white/10 transition"
            >
              {language === "tr" ? "AI Portal" : "AI Portal"}
            </a>
          </div>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/5 p-4">
          <ul className="space-y-3 text-sm text-purple-100">
            <li>✓ {language === "tr" ? "TR/EN dil seçimi" : "TR/EN language toggle"}</li>
            <li>✓ {language === "tr" ? "TYT, AYT, LGS kategori ağacı" : "TYT, AYT, LGS category tree"}</li>
            <li>✓ {language === "tr" ? "AI portal giriş noktası" : "AI portal entry"}</li>
            <li>✓ {language === "tr" ? "Yönetici paneline hızlı erişim" : "Quick access to Admin dashboard"}</li>
          </ul>
        </div>
      </section>
    </LearnConnectLayout>
  );
}

