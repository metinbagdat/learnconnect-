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
  onCheckout?: () => void;
}

export function CourseCard({
  course,
  userCourse,
  showEnroll = false,
  showContinue = false,
  onEnroll,
  onContinue,
  onCheckout
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
      // More comprehensive translation patterns
      const courseTranslations: { [key: string]: { title: string; description: string } } = {
        'TYT Mathematics': {
          title: 'TYT Matematik',
          description: 'TYT sınavı için temel matematik konularını kapsayan kapsamlı hazırlık kursu. Sayılar, fonksiyonlar, geometri ve trigonometri konularında uzman eğitim.'
        },
        'TYT Basic Sciences': {
          title: 'TYT Temel Bilimler',
          description: 'TYT fen bilimleri bölümü için tam hazırlık. Fizik, kimya ve biyoloji temel konularının detaylı anlatımı ve bol uygulama.'
        },
        'AYT Turkish Literature': {
          title: 'AYT Türk Edebiyatı',
          description: 'AYT Türk Dili ve Edebiyatı dersi için kapsamlı hazırlık. Klasik ve modern edebiyat dönemlerinin derinlemesine incelenmesi.'
        },
        'AYT Physics': {
          title: 'AYT Fizik',
          description: 'AYT fizik konularının tamamını kapsayan uzman eğitim. Mekanik, elektrik, optik ve modern fizik konularında detaylı anlatım.'
        },
        'AYT History': {
          title: 'AYT Tarih',
          description: 'AYT tarih dersi için kapsamlı hazırlık kursu. Osmanlı İmparatorluğu, Türkiye Cumhuriyeti tarihi ve dünya tarihinin detaylı incelenmesi.'
        },
        'AYT Chemistry': {
          title: 'AYT Kimya',
          description: 'AYT kimya konularında uzman liderliğinde eğitim. Organik kimya, inorganik kimya ve analitik kimya konularının kapsamlı anlatımı.'
        },
        'AYT Advanced Mathematics': {
          title: 'AYT İleri Matematik',
          description: 'AYT sayısal bölüm için ileri düzey matematik eğitimi. Türev, integral, analitik geometri ve limit konularında derinlemesine çalışma.'
        },
        'AYT Biology': {
          title: 'AYT Biyoloji',
          description: 'AYT biyoloji konularının tamamını kapsayan kapsamlı eğitim. Hücre biyolojisi, genetik, ekoloji ve insan anatomisinde uzman rehberliği.'
        }
      };

      // Check for exact matches first, then partial matches
      for (const [englishTitle, translation] of Object.entries(courseTranslations)) {
        if (title === englishTitle || title.includes(englishTitle)) {
          return translation;
        }
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
      className="group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90" 
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
          src={imageUrl || `https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
          alt={title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-${categoryColor}/80 to-${categoryColor} backdrop-blur-sm shadow-lg`}>
            {category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          {userCourse ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <ProgressCircle 
                value={progress} 
                color={categoryColor === 'primary' ? 'primary' : categoryColor === 'accent-500' ? 'accent' : 'secondary'} 
              />
            </div>
          ) : (
            rating && (
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-xs font-semibold text-white">{rating / 10}</span>
              </div>
            )
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">{translatedContent.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{translatedContent.description}</p>
        
        {/* Course metadata */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-full">
            <Clock className="h-4 w-4" />
            {userCourse ? (
              <span className="font-medium">{t('module')} {currentModule} / {moduleCount}</span>
            ) : (
              <span className="font-medium">{durationHours || 30} {t('hours')}</span>
            )}
          </div>
          
          {/* Show price for non-enrolled courses */}
          {!userCourse && (
            <div className="font-semibold text-lg">
              {course.isPremium && course.price && parseFloat(course.price) > 0 ? (
                <span className="text-primary">${course.price}</span>
              ) : (
                <span className="text-green-600">FREE</span>
              )}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
            >
              {t('continueButton')}
            </Button>
          )}
          
          {showEnroll && (
            <>
              {course.isPremium && course.price && parseFloat(course.price) > 0 ? (
                <>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCheckout) {
                        onCheckout();
                      } else {
                        navigate(`/checkout/${course.id}`);
                      }
                    }}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full px-4 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                  >
                    Buy ${course.price}
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.id}`);
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4 flex-1"
                  >
                    Preview
                  </Button>
                </>
              ) : (
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
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                >
                  {t('enrollNow')}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
