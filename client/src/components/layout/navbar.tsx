import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isTr = language === "tr";

  const navItems = [
    { label: isTr ? "Anasayfa" : "Home", href: "/" },
    { label: isTr ? "Özellikler" : "Features", href: "#features" },
    { label: isTr ? "Fiyatlandırma" : "Pricing", href: "#pricing" },
    { label: isTr ? "Haberler" : "News", href: "#news" },
    { label: isTr ? "Testimonials" : "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-slate-950 to-slate-950/80 border-b border-slate-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer hover:opacity-80 transition">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                EduLearn
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:text-white"
                  onClick={() => navigate("/dashboard")}
                >
                  {isTr ? "Panoya Git" : "Dashboard"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white"
                  onClick={() => navigate("/auth")}
                >
                  {isTr ? "Giriş Yap" : "Login"}
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => navigate("/auth")}
                >
                  {isTr ? "Ücretsiz Başla" : "Get Started"}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-slate-300 hover:text-white px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 px-4 pt-2">
              {user ? (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  onClick={() => navigate("/dashboard")}
                >
                  {isTr ? "Panoya Git" : "Dashboard"}
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/auth")}
                  >
                    {isTr ? "Giriş Yap" : "Login"}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                    onClick={() => navigate("/auth")}
                  >
                    {isTr ? "Başla" : "Start"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
