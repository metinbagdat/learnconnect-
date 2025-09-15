import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { motion } from "framer-motion";

export interface ApiErrorProps {
  error?: Error | string;
  onRetry?: () => void;
  retryLoading?: boolean;
  type?: 'network' | 'server' | 'permission' | 'notFound' | 'generic';
  title?: string;
  description?: string;
  showRetry?: boolean;
}

export function ApiError({ 
  error, 
  onRetry, 
  retryLoading = false,
  type = 'generic',
  title,
  description,
  showRetry = true
}: ApiErrorProps) {
  const { t } = useLanguage();

  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: WifiOff,
          title: title || t('networkError', 'Network Error'),
          description: description || t('networkErrorDesc', 'Please check your internet connection and try again.'),
          iconColor: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30'
        };
      case 'server':
        return {
          icon: AlertCircle,
          title: title || t('serverError', 'Server Error'),
          description: description || t('serverErrorDesc', 'Our servers are experiencing issues. Please try again in a moment.'),
          iconColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30'
        };
      case 'permission':
        return {
          icon: AlertCircle,
          title: title || t('permissionError', 'Access Denied'),
          description: description || t('permissionErrorDesc', 'You do not have permission to access this resource.'),
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
        };
      case 'notFound':
        return {
          icon: AlertCircle,
          title: title || t('notFoundError', 'Not Found'),
          description: description || t('notFoundErrorDesc', 'The requested resource could not be found.'),
          iconColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30'
        };
      default:
        return {
          icon: AlertCircle,
          title: title || t('unexpectedError', 'Something Went Wrong'),
          description: description || t('genericErrorDesc', 'An unexpected error occurred. Please try again.'),
          iconColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30'
        };
    }
  };

  const errorConfig = getErrorConfig();
  const Icon = errorConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <motion.div 
            className={`mx-auto w-16 h-16 ${errorConfig.bgColor} rounded-full flex items-center justify-center mb-4`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <Icon className={`h-8 w-8 ${errorConfig.iconColor}`} />
          </motion.div>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {errorConfig.title}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {errorConfig.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && typeof error === 'string' && (
            <div className="text-sm bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <code className="text-xs text-slate-600 dark:text-slate-400 break-all">
                {error}
              </code>
            </div>
          )}
          
          {error && typeof error === 'object' && error.message && (
            <div className="text-sm bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <code className="text-xs text-slate-600 dark:text-slate-400 break-all">
                {error.message}
              </code>
            </div>
          )}
          
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry} 
              disabled={retryLoading}
              className="w-full"
              data-testid="button-retry-api"
            >
              {retryLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                </motion.div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {retryLoading ? t('retrying', 'Retrying...') : t('tryAgain', 'Try Again')}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}