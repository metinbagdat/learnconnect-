import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface InteractiveProgressBarProps {
  current: number;
  max: number;
  label?: string;
  onLevelUp?: () => void;
  showAnimation?: boolean;
  color?: string;
}

export function InteractiveProgressBar({
  current,
  max,
  label = "Progress",
  onLevelUp,
  showAnimation = true,
  color = "primary"
}: InteractiveProgressBarProps) {
  const [previousProgress, setPreviousProgress] = useState(current);
  const [showLevelUpEffect, setShowLevelUpEffect] = useState(false);
  
  const percentage = Math.min((current / max) * 100, 100);
  const previousPercentage = Math.min((previousProgress / max) * 100, 100);
  
  useEffect(() => {
    if (current > previousProgress) {
      setPreviousProgress(current);
      
      // Check if level up occurred
      if (current >= max && previousProgress < max) {
        setShowLevelUpEffect(true);
        onLevelUp?.();
        
        setTimeout(() => {
          setShowLevelUpEffect(false);
        }, 2000);
      }
    }
  }, [current, previousProgress, max, onLevelUp]);
  
  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return {
          bg: 'bg-primary',
          glow: 'shadow-primary/50',
          sparkle: 'text-primary'
        };
      case 'green':
        return {
          bg: 'bg-green-500',
          glow: 'shadow-green-500/50',
          sparkle: 'text-green-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-500',
          glow: 'shadow-blue-500/50',
          sparkle: 'text-blue-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          glow: 'shadow-purple-500/50',
          sparkle: 'text-purple-500'
        };
      default:
        return {
          bg: 'bg-primary',
          glow: 'shadow-primary/50',
          sparkle: 'text-primary'
        };
    }
  };
  
  const colorClasses = getColorClasses(color);
  
  return (
    <div className="space-y-2">
      {/* Label and Stats */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold">
          {current}/{max}
        </span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="relative">
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          {/* Background Progress */}
          <motion.div
            className={`h-full ${colorClasses.bg} relative overflow-hidden`}
            initial={{ width: `${previousPercentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: showAnimation ? 0.8 : 0,
              ease: "easeOut"
            }}
          >
            {/* Animated shine effect */}
            {showAnimation && current > previousProgress && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 1,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Glow effect when at 100% */}
            {percentage >= 100 && (
              <motion.div
                className={`absolute inset-0 ${colorClasses.bg} ${colorClasses.glow}`}
                animate={{ 
                  boxShadow: [
                    `0 0 0px ${colorClasses.glow}`,
                    `0 0 20px ${colorClasses.glow}`,
                    `0 0 0px ${colorClasses.glow}`
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        </div>
        
        {/* Percentage Display */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <motion.span
            key={percentage}
            initial={{ scale: 1 }}
            animate={{ scale: current > previousProgress ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-bold text-white mix-blend-difference"
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
        
        {/* Level Up Effect */}
        {showLevelUpEffect && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Sparkle particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: 360,
                  y: [-10, -20, -10]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              >
                <Sparkles className={`h-3 w-3 ${colorClasses.sparkle}`} />
              </motion.div>
            ))}
            
            {/* Level up text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
              transition={{ duration: 2 }}
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Level Up!
              </div>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Progress milestones */}
      {max > 50 && (
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          {[25, 50, 75].map((milestone) => (
            <div 
              key={milestone}
              className={`transition-colors ${
                percentage >= (milestone / max) * 100 
                  ? colorClasses.sparkle 
                  : 'text-muted-foreground'
              }`}
            >
              {milestone}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}