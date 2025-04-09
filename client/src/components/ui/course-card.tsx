import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { ProgressCircle } from "./progress-circle";
import { Course, UserCourse } from "@shared/schema";

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
  const {
    title,
    description,
    category,
    imageUrl,
    moduleCount,
    durationHours,
    rating
  } = course;
  
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
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
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
        <h3 className="text-lg font-medium text-neutral-900 line-clamp-1">{title}</h3>
        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-500">
            <Clock className="h-4 w-4 mr-1" />
            {userCourse ? (
              <span>Module {currentModule} / {moduleCount}</span>
            ) : (
              <span>{durationHours || 30} hours</span>
            )}
          </div>
          
          {showContinue && (
            <Button 
              onClick={onContinue}
              size="sm"
            >
              Continue
            </Button>
          )}
          
          {showEnroll && (
            <Button 
              onClick={onEnroll}
              size="sm"
            >
              Enroll
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
