import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { useLocation } from 'wouter';

interface UpgradePromptProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  showInline?: boolean;
}

export function UpgradePrompt({ 
  open = false, 
  onOpenChange, 
  title, 
  description,
  showInline = false 
}: UpgradePromptProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const handleUpgrade = () => {
    setLocation('/subscription');
    onOpenChange?.(false);
  };

  const promptContent = (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
          <Crown className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            {title || t('limitReached')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description || t('limitReachedDesc')}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-sm">{t('unlimitedAccess')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-500" />
          <span className="text-sm">{t('advancedAnalytics')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-500" />
          <span className="text-sm">{t('prioritySupport')}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-600">{t('premiumPlan')}</div>
            <div className="text-2xl font-bold text-gray-900">₺149<span className="text-sm font-normal">/ay</span></div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Most Popular
          </Badge>
        </div>
      </div>

      <Button 
        onClick={handleUpgrade}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        size="lg"
      >
        <Crown className="h-4 w-4 mr-2" />
        {t('upgradeToPremium')}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  );

  if (showInline) {
    return (
      <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6">
          {promptContent}
        </CardContent>
      </Card>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">Upgrade to Premium</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{promptContent}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2">
          <AlertDialogCancel className="w-full">Maybe Later</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpgradePrompt;