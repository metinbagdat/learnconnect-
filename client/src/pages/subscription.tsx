import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Check, CreditCard, Loader2, ArrowLeft, Crown, Zap, Shield, BarChart3 } from "lucide-react";
import { useLanguage } from '@/contexts/language-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  isPopular?: boolean;
}

interface UserSubscription {
  id: number;
  planId: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface UsageStats {
  assessmentsUsed: number;
  coursesAccessed: number;
  analyticsViews: number;
  aiRecommendationsGenerated: number;
}

export default function SubscriptionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/subscription/plans'],
  });

  // Fetch user's current subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<UserSubscription>({
    queryKey: ['/api/user/subscription'],
  });

  // Get usage stats
  const { data: usage } = useQuery<UsageStats>({
    queryKey: ['/api/user/usage'],
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/subscription/upgrade", { planId });
      if (!response.ok) {
        throw new Error('Upgrade failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: t('subscriptionUpgraded'),
          description: t('paymentSuccessful'),
        });
        queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
      }
    },
    onError: () => {
      toast({
        title: t('paymentFailed'),
        description: 'An error occurred during upgrade',
        variant: "destructive",
      });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/cancel");
      if (!response.ok) {
        throw new Error('Cancellation failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('subscriptionCancelled'),
        description: 'Your subscription has been cancelled',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: "destructive",
      });
    }
  });

  const handleUpgrade = (planId: string) => {
    upgradeMutation.mutate(planId);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      cancelMutation.mutate();
    }
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading subscription information...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentPlan = subscription ? plans?.find(p => p.id === subscription.planId) : plans?.find(p => p.id === 'free');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('subscriptionManagement')}</h1>
          <p className="text-muted-foreground">
            {subscription ? t('manageSubscription') : t('upgradeToPremium')}
          </p>
        </div>

        {/* Current Plan Status */}
        {subscription && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                {t('currentPlan')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{currentPlan?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('subscriptionStatus')}: {subscription.status}
                  </p>
                </div>
                <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                  {subscription.status}
                </Badge>
              </div>
              
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  {t('nextBilling')}: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}

              {subscription.cancelAtPeriodEnd && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your subscription will cancel at the end of the current period.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {!subscription.cancelAtPeriodEnd && (
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {t('cancelSubscription')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Statistics */}
        {usage && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('usageStats')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{usage?.assessmentsUsed || 0}</div>
                  <div className="text-sm text-blue-800">{t('assessmentsUsed')}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{usage?.coursesAccessed || 0}</div>
                  <div className="text-sm text-green-800">Courses Accessed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{usage?.analyticsViews || 0}</div>
                  <div className="text-sm text-purple-800">Analytics Views</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans?.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const isFree = plan.id === 'free';
            
            return (
              <Card key={plan.id} className={`relative ${plan.isPopular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {isFree ? (
                        <Shield className="h-5 w-5" />
                      ) : (
                        <Crown className="h-5 w-5" />
                      )}
                      {plan.name}
                    </span>
                    {isCurrentPlan && (
                      <Badge variant="outline">Current</Badge>
                    )}
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.currency === 'TRY' ? '₺' : '$'}{plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isFree ? "outline" : "default"}
                    disabled={isCurrentPlan || processing || upgradeMutation.isPending}
                    onClick={() => !isFree && !isCurrentPlan && handleUpgrade(plan.id)}
                  >
                    {upgradeMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : !isFree ? (
                      <CreditCard className="h-4 w-4 mr-2" />
                    ) : null}
                    {isCurrentPlan 
                      ? t('currentPlan')
                      : isFree 
                        ? t('freePlan')
                        : t('upgradeNow')
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t('upgradeBenefits')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">{t('unlimitedAccess')}</h3>
                <p className="text-sm text-muted-foreground">No daily limits on assessments</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">{t('advancedAnalytics')}</h3>
                <p className="text-sm text-muted-foreground">Detailed progress insights</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">{t('prioritySupport')}</h3>
                <p className="text-sm text-muted-foreground">Get help when you need it</p>
              </div>
              <div className="text-center p-4">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Crown className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-1">Premium Features</h3>
                <p className="text-sm text-muted-foreground">Access to all premium content</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}