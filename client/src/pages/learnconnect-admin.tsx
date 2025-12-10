import { LearnConnectLayout } from "@/components/layout/LearnConnectLayout";
import { useLanguage } from "@/contexts/consolidated-language-context";

export default function LearnConnectAdmin() {
  const { language } = useLanguage();

  return (
    <LearnConnectLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {language === "tr" ? "Yönetici Paneli" : "Admin Dashboard"}
        </h1>
        <p className="text-purple-100">
          {language === "tr"
            ? "Kullanıcılar, içerik ve AI ayarları için kontrol noktası (yer tutucu)."
            : "Control center for users, content, and AI settings (placeholder)."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { key: "users", tr: "Kullanıcı Yönetimi", en: "User Management" },
          { key: "content", tr: "İçerik / Müfredat", en: "Content / Curriculum" },
          { key: "ai", tr: "AI & Öneriler", en: "AI & Recommendations" },
          { key: "payments", tr: "Ödeme / Lisans", en: "Payments / Licensing" },
        ].map((card) => (
          <div key={card.key} className="rounded-xl border border-white/20 bg-white/5 p-4">
            <div className="text-lg font-semibold mb-2">
              {language === "tr" ? card.tr : card.en}
            </div>
            <p className="text-sm text-purple-100">
              {language === "tr"
                ? "Bu bölüm yönetim aksiyonları için yer tutucudur."
                : "This section is a placeholder for admin actions."}
            </p>
            <div className="mt-3 text-xs text-purple-100">
              {language === "tr"
                ? "Örnek aksiyonlar: kullanıcı ekle, sınav ağacı düzenle, AI model seçimi."
                : "Sample actions: add user, edit exam tree, choose AI model."}
            </div>
          </div>
        ))}
      </div>
    </LearnConnectLayout>
  );
}

