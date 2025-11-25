import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/consolidated-language-context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'tr' as const, name: 'Türkçe', flag: '🇹🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLang: Language) => {
    if (newLang !== language) {
      setLanguage(newLang);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {languages.map((lang) => (
        <Button 
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm" 
          className="h-10 px-2.5 flex items-center justify-center gap-1.5 rounded-md border border-transparent hover:border-gray-300 transition-all"
          onClick={() => handleLanguageChange(lang.code)}
          data-testid={`button-lang-${lang.code}`}
          title={`Switch to ${lang.name}`}
        >
          <span className="text-base" role="img" aria-label={lang.name}>{lang.flag}</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline">{lang.code.toUpperCase()}</span>
        </Button>
      ))}
    </div>
  );
}