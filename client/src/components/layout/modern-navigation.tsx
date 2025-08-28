import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  Target, 
  TrendingUp, 
  User, 
  Menu,
  X,
  Brain,
  Trophy,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

interface ModernNavigationProps {
  currentPage?: string;
  showBackButton?: boolean;
  backUrl?: string;
  pageTitle?: string;
}

export default function ModernNavigation({ 
  currentPage = "Dashboard", 
  showBackButton = false, 
  backUrl = "/",
  pageTitle 
}: ModernNavigationProps) {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: language === 'tr' ? 'Ana Sayfa' : 'Dashboard',
      icon: Home,
      url: '/',
      badge: null
    },
    {
      id: 'study-planner',
      label: language === 'tr' ? 'Öğrenme Planlayıcısı' : 'Study Planner',
      icon: Target,
      url: '/study-planner',
      badge: language === 'tr' ? 'Yeni' : 'New'
    },
    {
      id: 'courses',
      label: language === 'tr' ? 'Kurslar' : 'Courses',
      icon: BookOpen,
      url: '/courses',
      badge: null
    },
    {
      id: 'calendar',
      label: language === 'tr' ? 'Takvim' : 'Calendar',
      icon: Calendar,
      url: '/calendar',
      badge: null
    },
    {
      id: 'analytics',
      label: language === 'tr' ? 'İlerleme' : 'Progress',
      icon: TrendingUp,
      url: '/analytics',
      badge: null
    },
    {
      id: 'challenges',
      label: language === 'tr' ? 'Meydan Okumalar' : 'Challenges',
      icon: Trophy,
      url: '/challenges',
      badge: null
    },
    {
      id: 'ai-features',
      label: language === 'tr' ? 'AI Özellikleri' : 'AI Features',
      icon: Brain,
      url: '/adaptive-learning',
      badge: 'AI'
    },
    {
      id: 'social',
      label: language === 'tr' ? 'Sosyal' : 'Social',
      icon: Users,
      url: '/social',
      badge: null
    }
  ];

  const handleNavigation = (url: string) => {
    setLocation(url);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    logoutMutation.mutate();
    setLocation('/auth');
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Back button and page title */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation(backUrl)}
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === 'tr' ? 'Geri' : 'Back'}
                </span>
              </Button>
            )}
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {pageTitle || currentPage}
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                {language === 'tr' ? 'EduLearn Platform' : 'EduLearn Platform'}
              </p>
            </div>
          </div>

          {/* Center section - Quick navigation (desktop) */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 5).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.url)}
                className="flex items-center space-x-2 relative"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Right section - User menu and mobile toggle */}
          <div className="flex items-center space-x-2">
            {/* User info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || user?.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/profile')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm"
            >
              <div className="py-4 space-y-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(item.url)}
                    className="w-full justify-start flex items-center space-x-3"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}

                <Separator className="my-2" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/profile')}
                  className="w-full justify-start flex items-center space-x-3"
                >
                  <User className="h-4 w-4" />
                  <span>{language === 'tr' ? 'Profil' : 'Profile'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/settings')}
                  className="w-full justify-start flex items-center space-x-3"
                >
                  <Settings className="h-4 w-4" />
                  <span>{language === 'tr' ? 'Ayarlar' : 'Settings'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{language === 'tr' ? 'Çıkış Yap' : 'Logout'}</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}