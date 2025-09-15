import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, Trophy, Star, Target } from 'lucide-react';

interface EnhancedLoadingProps {
  message?: string;
  type?: 'default' | 'course' | 'challenge' | 'progress' | 'analytics';
  size?: 'sm' | 'md' | 'lg';
}

const loadingIcons = {
  default: Loader2,
  course: BookOpen,
  challenge: Trophy,
  progress: Star,
  analytics: Target
};

const loadingMessages = {
  default: "Loading...",
  course: "Loading your courses...",
  challenge: "Preparing challenges...",
  progress: "Calculating progress...",
  analytics: "Analyzing your data..."
};

export function EnhancedLoading({ 
  message, 
  type = 'default', 
  size = 'md' 
}: EnhancedLoadingProps) {
  const Icon = loadingIcons[type];
  const defaultMessage = loadingMessages[type];
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const containerSizes = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-16'
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center ${containerSizes[size]}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated loading icon with glow effect */}
      <motion.div
        className="relative mb-4"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.div
          className={`${sizeClasses[size]} text-primary`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-full h-full" />
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} text-primary opacity-20 blur-sm`}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-full h-full" />
        </motion.div>
      </motion.div>

      {/* Animated loading message */}
      <motion.p
        className="text-sm text-muted-foreground text-center max-w-xs"
        animate={{
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {message || defaultMessage}
      </motion.p>

      {/* Animated dots */}
      <motion.div
        className="flex space-x-1 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Specialized loading components for different contexts
export function CourseLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-card rounded-lg p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
          <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded flex-1 animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-pulse" />
      </motion.div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-card rounded-lg p-6 space-y-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
          </motion.div>
        ))}
      </div>

      {/* Chart skeleton */}
      <motion.div
        className="bg-card rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/4 mb-4 animate-pulse" />
        <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
      </motion.div>
    </div>
  );
}

// Progress bar with animation
export function AnimatedProgressBar({ progress, className = "" }: { progress: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ width: '100%' }}
        />
      </motion.div>
    </div>
  );
}