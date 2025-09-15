import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import { useLanguage } from "@/contexts/consolidated-language-context";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  type?: 'default' | 'courses' | 'challenges' | 'users' | 'ai';
  blur?: boolean;
}

export function LoadingOverlay({ 
  isVisible, 
  message, 
  type = 'default',
  blur = true 
}: LoadingOverlayProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            fixed inset-0 z-50 flex items-center justify-center 
            bg-black/20 dark:bg-black/40
            ${blur ? 'backdrop-blur-sm' : ''}
          `}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-xl border p-8 max-w-sm mx-4"
          >
            <LoadingSpinner 
              size="lg" 
              type={type} 
              message={message || t('pleaseWait', 'Please wait...')} 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LoadingCardProps {
  isVisible: boolean;
  message?: string;
  type?: 'default' | 'courses' | 'challenges' | 'users' | 'ai';
  className?: string;
}

export function LoadingCard({ 
  isVisible, 
  message, 
  type = 'default',
  className = ""
}: LoadingCardProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`
            bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm 
            rounded-lg border shadow-lg p-6 ${className}
          `}
        >
          <LoadingSpinner size="md" type={type} message={message} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function LoadingButton({ 
  isLoading, 
  children, 
  onClick, 
  disabled,
  className = "",
  variant = 'default'
}: LoadingButtonProps) {
  const { t } = useLanguage();

  const variantClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
    outline: 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative px-4 py-2 rounded-md border font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            />
            <span>{t('loading', 'Loading...')}</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}