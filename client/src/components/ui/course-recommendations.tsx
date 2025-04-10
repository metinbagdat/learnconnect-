import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, BookOpen, BookMarked } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function CourseRecommendations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["/api/ai/course-recommendations"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/ai/course-recommendations");
      return res.json();
    },
    enabled: !!user,
  });

  // Query for AI-generated courses
  const { data: aiCourses = [], isLoading: aiCoursesLoading } = useQuery({
    queryKey: ["/api/ai/courses"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/ai/courses");
      return res.json();
    },
  });
  
  // Query for all courses 
  const { data: allCourses = [], isLoading: allCoursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/courses");
      return res.json();
    },
  });

  // Find matching courses for recommendations
  const getRecommendedCourses = () => {
    if (!Array.isArray(recommendations)) return [];
    
    const courses = [...aiCourses, ...allCourses];
    
    // Find courses that match the recommendations by title or keywords
    return recommendations.map(rec => {
      // Try to find exact title match first
      const matchedCourse = courses.find(c => 
        c.title.toLowerCase().includes(rec.toLowerCase())
      );
      
      if (matchedCourse) {
        return {
          recommendation: rec,
          course: matchedCourse
        };
      }
      
      // If no exact match, return just the recommendation
      return {
        recommendation: rec,
        course: null
      };
    });
  };

  const recommendedCourses = getRecommendedCourses();

  const handleEnroll = async (courseId: number) => {
    setIsEnrolling(true);
    try {
      await apiRequest("POST", "/api/user/courses", { courseId });
      toast({
        title: "Enrolled successfully",
        description: "You've been enrolled in this course",
      });
    } catch (error) {
      toast({
        title: "Failed to enroll",
        description: "There was an error enrolling you in this course",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading || aiCoursesLoading || allCoursesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!recommendedCourses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Recommendations</CardTitle>
          <CardDescription>
            Based on your interests and learning history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We'll recommend courses as you continue learning. Take a few courses to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended For You</CardTitle>
        <CardDescription>
          Personalized recommendations based on your interests and learning history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedCourses.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/4 bg-muted p-4 flex items-center justify-center">
                  {item.course?.imageUrl ? (
                    <img 
                      src={item.course.imageUrl} 
                      alt={item.course.title} 
                      className="h-20 w-20 object-cover rounded" 
                    />
                  ) : (
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="p-4 sm:w-3/4">
                  <h3 className="font-semibold text-md">
                    {item.course?.title || item.recommendation}
                  </h3>
                  
                  {item.course && (
                    <>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {item.course.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{item.course.category}</Badge>
                        {item.course.level && (
                          <Badge variant="secondary">{item.course.level}</Badge>
                        )}
                        {item.course.isAiGenerated && (
                          <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-blue-500">
                            AI-Generated
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                  
                  {item.course ? (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => handleEnroll(item.course.id)}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  ) : (
                    <p className="text-sm italic mt-2">Coming soon!</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => window.location.href = "/courses"}>
          View All Courses
        </Button>
      </CardFooter>
    </Card>
  );
}