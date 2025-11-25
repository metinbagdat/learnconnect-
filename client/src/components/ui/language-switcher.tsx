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
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button 
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm" 
          className="h-9 px-3 flex items-center gap-1"
          onClick={() => handleLanguageChange(lang.code)}
          data-testid={`button-lang-${lang.code}`}
        >
          <span className="text-lg leading-none">{lang.flag}</span>
          <span className="text-xs font-medium hidden sm:inline">{lang.name}</span>
        </Button>
      ))}
    </div>
  );
}