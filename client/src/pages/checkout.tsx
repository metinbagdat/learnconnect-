import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from "@/lib/queryClient";
import { useParams, useLocation } from "wouter";
import { Loader2, CreditCard, Lock, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from '@/contexts/language-context';

export default function Checkout() {
  const { courseId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [processing, setProcessing] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (courseResponse.ok) {
          const courseData = await courseResponse.json();
          setCourse(courseData);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Error",
          description: "Failed to load course information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, toast]);

  const handleEnrollment = async () => {
    setProcessing(true);
    try {
      // For now, directly enroll the user without payment processing
      const response = await apiRequest("POST", "/api/user/courses", {
        courseId: parseInt(courseId!),
      });
      
      if (response.ok) {
        toast({
          title: "Enrollment Successful!",
          description: "You've been enrolled in the course.",
        });
        setLocation(`/courses/${courseId}`);
      } else {
        const errorData = await response.json();
        toast({
          title: "Enrollment Failed",
          description: errorData.message || "Failed to enroll in course",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading course information...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
              <p className="text-gray-600 mb-4">The course you're trying to access doesn't exist.</p>
              <Button onClick={() => setLocation('/courses')}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if course is free or premium
  const isFree = !course.isPremium || !course.price || parseFloat(course.price) === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation(`/courses/${courseId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isFree ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  Free Course Enrollment
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Course Purchase
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Level:</span>
                  <span className="text-sm font-medium">{course.level || 'Beginner'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="text-sm font-medium">{course.durationHours || 'N/A'} hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Modules:</span>
                  <span className="text-sm font-medium">{course.moduleCount} modules</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="text-lg font-bold">
                    {isFree ? 'FREE' : `$${course.price}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Features */}
            <div className="space-y-2">
              <h4 className="font-medium">What's included:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Full course access
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Certificate of completion
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  AI-powered learning assistance
                </li>
                {!isFree && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Premium support
                  </li>
                )}
              </ul>
            </div>

            {/* Payment/Enrollment Section */}
            {!isFree && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Payment Processing</h4>
                <p className="text-sm text-yellow-700">
                  Payment processing is currently being set up. For now, you can enroll in this course for free 
                  to explore the content. Premium features will be activated once payment is completed.
                </p>
              </div>
            )}

            {isFree && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                Your enrollment is secure and instant
              </div>
            )}

            <Button 
              onClick={handleEnrollment}
              className="w-full" 
              disabled={processing}
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {isFree ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Enroll for Free
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Enroll Now (Free Preview)
                    </>
                  )}
                </>
              )}
            </Button>

            {!isFree && (
              <p className="text-xs text-gray-500 text-center">
                * Currently enrolling as free preview. Payment processing will be enabled soon.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}