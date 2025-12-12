import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/consolidated-language-context";

interface LearnConnectLayoutProps {
  children: ReactNode;
}

const navLinks = [
  { href: "/learnconnect", label: { en: "Home", tr: "Ana Sayfa" } },
  { href: "/learnconnect/exams", label: { en: "Exams", tr: "Sınavlar" } },
  { href: "/learnconnect/ai", label: { en: "AI Portal", tr: "Yapay Zeka Portalı" } },
  { href: "/learnconnect/admin", label: { en: "Admin", tr: "Yönetim" } },
];

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-2 py-1 rounded text-xs border ${language === "tr" ? "bg-purple-100 border-purple-500" : "border-gray-300"}`}
        onClick={() => setLanguage("tr")}
        aria-label="Türkçe"
      >
        🇹🇷 TR
      </button>
      <button
        className={`px-2 py-1 rounded text-xs border ${language === "en" ? "bg-purple-100 border-purple-500" : "border-gray-300"}`}
        onClick={() => setLanguage("en")}
        aria-label="English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
}

export function LearnConnectLayout({ children }: LearnConnectLayoutProps) {
  const { language } = useLanguage();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 text-white">
      <header className="bg-white/10 backdrop-blur border-b border-white/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">LearnConnect</span>
            <span className="text-xs rounded-full bg-white/15 px-2 py-1 border border-white/20">
              AI-Powered Education Portal
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`px-3 py-2 rounded transition ${
                    location === item.href ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  {item.label[language]}
                </a>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/auth">
              <a className="px-3 py-2 rounded bg-white text-purple-800 font-semibold text-sm hover:bg-gray-100 transition">
                Login
              </a>
            </Link>
            <Link href="/auth">
              <a className="px-3 py-2 rounded border border-white/50 text-white font-semibold text-sm hover:bg-white/10 transition">
                Register
              </a>
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

