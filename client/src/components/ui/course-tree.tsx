import { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { getLocalizedField } from '@/lib/language-utils';

interface CourseTreeNode {
  id: number;
  title: string;
  description: string;
  titleEn?: string;
  titleTr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  category: string;
  imageUrl?: string;
  depth: number;
  order: number;
  parentCourseId?: number | null;
  isEnrolled?: boolean;
  progress?: number;
  completed?: boolean;
  userCourseId?: number;
  children?: CourseTreeNode[];
}

interface CourseTreeProps {
  courses: CourseTreeNode[];
  showEnrollButton?: boolean;
  onEnroll?: (courseId: number) => void;
}

interface CourseNodeProps {
  course: CourseTreeNode;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: number) => void;
}

function CourseNode({ course, showEnrollButton = false, onEnroll }: CourseNodeProps) {
  const [isExpanded, setIsExpanded] = useState(course.depth === 0); // Root courses expanded by default
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const hasChildren = course.children && course.children.length > 0;

  const localizedTitle = getLocalizedField(course, 'title', language);
  const localizedDescription = getLocalizedField(course, 'description', language);

  const getDepthColor = (depth: number) => {
    const colors = [
      'bg-blue-50 border-blue-200',
      'bg-purple-50 border-purple-200',
      'bg-green-50 border-green-200',
      'bg-orange-50 border-orange-200',
      'bg-pink-50 border-pink-200'
    ];
    return colors[depth % colors.length];
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="space-y-2" data-testid={`course-node-${course.id}`}>
      <Card className={`transition-all duration-200 hover:shadow-md ${getDepthColor(course.depth)}`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-gray-600 hover:text-gray-900 transition-colors"
                data-testid={`toggle-expand-${course.id}`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}

            {/* Course Icon */}
            <div className={`mt-1 p-2 rounded-lg ${course.isEnrolled ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <BookOpen className={`h-5 w-5 ${course.isEnrolled ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>

            {/* Course Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {localizedTitle}
                    </h3>
                    {course.completed && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" data-testid={`completed-${course.id}`} />
                    )}
                    {course.isEnrolled && !course.completed && (
                      <Circle className="h-5 w-5 text-blue-600 flex-shrink-0" data-testid={`enrolled-${course.id}`} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {localizedDescription}
                  </p>
                  
                  {/* Progress Bar for Enrolled Courses */}
                  {course.isEnrolled && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs font-semibold text-gray-900">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress || 0} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {course.isEnrolled ? (
                    <Button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      size="sm"
                      className="whitespace-nowrap"
                      data-testid={`continue-${course.id}`}
                    >
                      Continue
                    </Button>
                  ) : showEnrollButton ? (
                    <Button
                      onClick={() => onEnroll?.(course.id)}
                      size="sm"
                      variant="outline"
                      className="whitespace-nowrap"
                      data-testid={`enroll-${course.id}`}
                    >
                      Enroll
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-8 space-y-2" data-testid={`children-${course.id}`}>
          {course.children!.map((child) => (
            <CourseNode
              key={child.id}
              course={child}
              showEnrollButton={showEnrollButton}
              onEnroll={onEnroll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseTree({ courses, showEnrollButton = false, onEnroll }: CourseTreeProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No courses available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="course-tree">
      {courses.map((course) => (
        <CourseNode
          key={course.id}
          course={course}
          showEnrollButton={showEnrollButton}
          onEnroll={onEnroll}
        />
      ))}
    </div>
  );
}
