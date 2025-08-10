import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { ProgressCircle } from "./progress-circle";
import { Course, UserCourse } from "@shared/schema";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";

interface CourseCardProps {
  course: Course;
  userCourse?: Pick<UserCourse, "progress" | "currentModule" | "completed">;
  showEnroll?: boolean;
  showContinue?: boolean;
  onEnroll?: () => void;
  onContinue?: () => void;
}

export function CourseCard({
  course,
  userCourse,
  showEnroll = false,
  showContinue = false,
  onEnroll,
  onContinue
}: CourseCardProps) {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const {
    title,
    description,
    category,
    imageUrl,
    moduleCount,
    durationHours,
    rating
  } = course;

  // Language-aware course content translation
  const getTranslatedContent = () => {
    if (language === 'tr') {
      // Translate based on common course patterns
      if (title.includes('TYT Mathematics')) {
        return {
          title: 'TYT Matematik',
          description: 'TYT matematik konularını kapsayan kapsamlı kurs...'
        };
      }
      if (title.includes('TYT Basic Sciences')) {
        return {
          title: 'TYT Temel Bilimler', 
          description: 'TYT fen bölümlerini kapsayan tam hazırlık...'
        };
      }
      if (title.includes('AYT Turkish Literature')) {
        return {
          title: 'AYT Türk Edebiyatı',
          description: 'Türk edebiyatı üzerine önemli konuları kapsayan derinlemesine kurs...'
        };
      }
      if (title.includes('AYT Physics')) {
        return {
          title: 'AYT Fizik',
          description: 'Mekanik, elektrik ve diğer fizik konularını kapsayan kapsamlı fizik kursu...'
        };
      }
      if (title.includes('AYT History')) {
        return {
          title: 'AYT Tarih',
          description: 'Osmanlı İmparatorluğu ve diğer tarih konularını kapsayan kapsamlı tarih kursu...'
        };
      }
      if (title.includes('AYT Chemistry')) {
        return {
          title: 'AYT Kimya',
          description: 'AYT organik ve inorganik kimya konularını kapsayan uzman liderliğinde kurs...'
        };
      }
      if (title.includes('AYT Advanced Mathematics')) {
        return {
          title: 'AYT İleri Matematik',
          description: 'İleri matematik konularını kapsayan derinlemesine kurs...'
        };
      }
      if (title.includes('AYT Biology')) {
        return {
          title: 'AYT Biyoloji',
          description: 'Hücre, genetik, insan vücudu ve diğer biyoloji konularını kapsayan kapsamlı biyoloji kursu...'
        };
      }
    }
    
    return { title, description };
  };

  const translatedContent = getTranslatedContent();
  
  const progress = userCourse?.progress || 0;
  const currentModule = userCourse?.currentModule || 1;
  
  // Map category to color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'stem':
      case 'math':
        return 'primary';
      case 'programming':
        return 'accent-500';
      case 'business':
        return 'secondary-500';
      default:
        return 'primary';
    }
  };
  
  const categoryColor = getCategoryColor(category);
  
  // Handle clicking on the course card
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/courses/${course.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          src={imageUrl || `https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
          alt={title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium py-1 px-2 bg-${categoryColor} text-white rounded`}>
              {category}
            </span>
            {userCourse ? (
              <ProgressCircle 
                value={progress} 
                color={categoryColor === 'primary' ? 'primary' : categoryColor === 'accent-500' ? 'accent' : 'secondary'} 
              />
            ) : (
              rating && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-xs font-medium text-white">{rating / 10}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-neutral-900 line-clamp-1">{translatedContent.title}</h3>
        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{translatedContent.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-500">
            <Clock className="h-4 w-4 mr-1" />
            {userCourse ? (
              <span>{t('module')} {currentModule} / {moduleCount}</span>
            ) : (
              <span>{durationHours || 30} {t('hours')}</span>
            )}
          </div>
          
          {showContinue && (
            <Button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                if (onContinue) {
                  onContinue();
                } else {
                  navigate(`/courses/${course.id}`);
                }
              }}
              size="sm"
            >
              {t('continueButton')}
            </Button>
          )}
          
          {showEnroll && (
            <Button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                if (onEnroll) {
                  onEnroll();
                } else {
                  navigate(`/courses/${course.id}`);
                }
              }}
              size="sm"
            >
              {t('enrollNow')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
