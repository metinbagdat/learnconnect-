import { motion } from "framer-motion";
import { Loader2, BookOpen, Target, Users, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'default' | 'courses' | 'challenges' | 'users' | 'ai';
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  type = 'default',
  message,
  className 
}: LoadingSpinnerProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'courses':
        return {
          icon: BookOpen,
          message: message || t('loadingCourses', 'Loading courses...'),
          color: 'text-blue-600 dark:text-blue-400'
        };
      case 'challenges':
        return {
          icon: Target,
          message: message || t('loadingChallenges', 'Loading challenges...'),
          color: 'text-purple-600 dark:text-purple-400'
        };
      case 'users':
        return {
          icon: Users,
          message: message || t('loadingUsers', 'Loading users...'),
          color: 'text-green-600 dark:text-green-400'
        };
      case 'ai':
        return {
          icon: Brain,
          message: message || t('loadingAI', 'AI is thinking...'),
          color: 'text-orange-600 dark:text-orange-400'
        };
      default:
        return {
          icon: Loader2,
          message: message || t('loading', 'Loading...'),
          color: 'text-slate-600 dark:text-slate-400'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3 p-8", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Icon className={cn(sizeClasses[size], config.color)} />
      </motion.div>
      
      {config.message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-600 dark:text-slate-400 text-center"
        >
          {config.message}
        </motion.p>
      )}
    </div>
  );
}

export function PageLoadingSpinner({ 
  message,
  type = 'default' 
}: { 
  message?: string;
  type?: LoadingSpinnerProps['type'];
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border"
      >
        <LoadingSpinner size="xl" type={type} message={message} />
      </motion.div>
    </div>
  );
}

export function InlineLoadingSpinner({ 
  size = 'sm',
  message,
  type = 'default'
}: LoadingSpinnerProps) {
  const config = getTypeConfig();
  
  function getTypeConfig() {
    switch (type) {
      case 'courses':
        return { color: 'text-blue-600 dark:text-blue-400' };
      case 'challenges':
        return { color: 'text-purple-600 dark:text-purple-400' };
      case 'users':
        return { color: 'text-green-600 dark:text-green-400' };
      case 'ai':
        return { color: 'text-orange-600 dark:text-orange-400' };
      default:
        return { color: 'text-slate-600 dark:text-slate-400' };
    }
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Loader2 className={cn(sizeClasses[size], config.color)} />
      </motion.div>
      
      {message && (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {message}
        </span>
      )}
    </div>
  );
}