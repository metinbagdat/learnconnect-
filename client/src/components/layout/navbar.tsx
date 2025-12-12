import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isTr = language === "tr";

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close menu when viewport is desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background scroll and allow Esc to close
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

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
            {navItems.map((item) => {
              // Use Link for internal routes, anchor for hash links
              if (item.href.startsWith("#")) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
              );
            })}
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
            type="button"
            className="md:hidden text-slate-300 hover:text-white inline-flex items-center justify-center rounded-md p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? (isTr ? "Menüyü kapat" : "Close menu") : (isTr ? "Menüyü aç" : "Open menu")}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <button
            type="button"
            aria-label={isTr ? "Menüyü kapat" : "Close menu"}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-slate-800 py-4 space-y-3 relative z-50 bg-slate-950/95 backdrop-blur-xl shadow-xl rounded-b-xl"
          >
            {navItems.map((item) => {
              // Use Link for internal routes, anchor for hash links
              if (item.href.startsWith("#")) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
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
