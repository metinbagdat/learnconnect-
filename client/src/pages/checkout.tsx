import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from "@/lib/queryClient";
import { useParams, useLocation } from "wouter";
import { Loader2, CreditCard, Lock, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from '@/contexts/consolidated-language-context';
import { useQuery } from '@tanstack/react-query';
import { Course } from '@shared/schema';

export default function Checkout() {
  const { courseId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'demo'>('demo');
  
  // Fetch course details
  const { data: course, isLoading: loading, error } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  const handleEnrollment = async () => {
    if (!courseId) return;
    
    setProcessing(true);
    try {
      const response = await apiRequest("POST", "/api/user/courses", {
        courseId: parseInt(courseId),
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

  const handleDemoPayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const response = await apiRequest("POST", "/api/user/courses", {
        courseId: parseInt(courseId!),
        paymentDemo: true,
      });
      
      if (response.ok) {
        toast({
          title: "Payment Successful!",
          description: "Demo payment completed. You've been enrolled in the course.",
        });
        setLocation(`/courses/${courseId}`);
      } else {
        throw new Error('Enrollment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Demo payment failed",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading course information...</span>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  if (error || !course) {
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
  const isFree = !course?.isPremium || !course?.price || parseFloat(course?.price?.toString() || "0") === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation(`/courses/${courseId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{course?.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course?.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Level:</span>
                  <span className="text-sm font-medium">{course?.level || 'Beginner'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="text-sm font-medium">{course?.durationHours || 'N/A'} hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Modules:</span>
                  <span className="text-sm font-medium">{course?.moduleCount} modules</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm font-medium">{course?.category}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="text-xl font-bold">
                    {isFree ? 'FREE' : `$${course?.price}`}
                  </span>
                </div>
              </div>

              {/* Course Features */}
              <div className="space-y-2 pt-4">
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
                      Premium support & resources
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isFree ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    Free Enrollment
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Complete Purchase
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isFree && (
                <>
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={paymentMethod === 'demo' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('demo')}
                        className="p-4 h-auto text-left flex flex-col items-center"
                      >
                        <div className="text-xs font-semibold">DEMO MODE</div>
                        <div className="text-xs text-gray-500">Test Payment</div>
                      </Button>
                      <Button
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('card')}
                        className="p-4 h-auto text-left flex flex-col items-center"
                      >
                        <CreditCard className="h-5 w-5" />
                        <div className="text-xs">Credit Card</div>
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-2">Stripe Integration</h4>
                        <p className="text-sm text-yellow-700">
                          Full Stripe payment processing is being set up. Use Demo Mode for testing the enrollment flow.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            disabled
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input 
                              id="expiry"
                              placeholder="MM/YY"
                              disabled
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input 
                              id="cvc"
                              placeholder="123"
                              disabled
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'demo' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Demo Payment</h4>
                      <p className="text-sm text-blue-700">
                        This will simulate a successful payment and enroll you in the course. 
                        No actual payment will be processed.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    Your information is secure and encrypted
                  </div>
                </>
              )}

              {/* Action Button */}
              {isFree ? (
                <Button 
                  onClick={handleEnrollment}
                  className="w-full" 
                  disabled={processing}
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Enroll for Free
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={paymentMethod === 'demo' ? handleDemoPayment : handleEnrollment}
                    className="w-full" 
                    disabled={processing || (paymentMethod === 'card')}
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {paymentMethod === 'demo' ? 'Processing Demo Payment...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {paymentMethod === 'demo' ? `Demo Payment $${course?.price}` : `Pay $${course?.price}`}
                      </>
                    )}
                  </Button>
                  
                  {paymentMethod === 'card' && (
                    <p className="text-xs text-gray-500 text-center">
                      Credit card payments are being set up. Please use Demo Mode for now.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}