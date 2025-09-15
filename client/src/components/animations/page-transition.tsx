import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey?: string;
  className?: string;
}

// Page transition variants for different animation styles
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

// Stagger animation for page content
const containerVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  out: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const itemVariants = {
  initial: {
    opacity: 0,
    y: 30,
    rotateX: -10
  },
  in: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  out: {
    opacity: 0,
    y: -20,
    rotateX: 10,
    transition: {
      duration: 0.3
    }
  }
};

export function PageTransition({ children, pageKey, className = "" }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`min-h-screen ${className}`}
      >
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Reusable animated card component
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({ children, className = "", delay = 0, hover = true }: AnimatedCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
      whileHover={hover ? { 
        y: -4, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      style={{ 
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center'
      }}
    >
      {children}
    </motion.div>
  );
}

// Loading animation component
export function LoadingAnimation() {
  return (
    <motion.div
      className="flex items-center justify-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-primary rounded-full"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
}

// Enhanced skeleton loader
export function SkeletonLoader({ className = "", animate = true }: { className?: string; animate?: boolean }) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
      animate={animate ? {
        backgroundPosition: ['200% 0', '-200% 0']
      } : undefined}
      transition={animate ? {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      } : undefined}
      style={{
        backgroundSize: '200% 100%'
      }}
    />
  );
}

// Floating action button animation
interface FloatingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FloatingButton({ children, onClick, className = "" }: FloatingButtonProps) {
  return (
    <motion.button
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-primary text-primary-foreground ${className}`}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -5, 0],
        boxShadow: [
          "0 10px 20px rgba(0,0,0,0.1)",
          "0 15px 30px rgba(0,0,0,0.15)",
          "0 10px 20px rgba(0,0,0,0.1)"
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

// Success celebration animation
export function SuccessAnimation({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        if (onComplete) {
          setTimeout(onComplete, 2000);
        }
      }}
    >
      {/* Celebration particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${50 + (Math.random() - 0.5) * 80}%`,
            top: `${50 + (Math.random() - 0.5) * 80}%`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            rotate: Math.random() * 360,
            y: [0, -100, -200],
            x: [(Math.random() - 0.5) * 100]
          }}
          transition={{ 
            duration: 3,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
        >
          {['🎉', '🌟', '✨', '🎊', '💫', '⭐'][Math.floor(Math.random() * 6)]}
        </motion.div>
      ))}
      
      {/* Success message */}
      <motion.div
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl"
        initial={{ scale: 0, y: 50 }}
        animate={{ 
          scale: [0, 1.2, 1],
          y: [50, 0, -10],
          rotateZ: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 1,
          ease: "easeOut"
        }}
      >
        🎉 Awesome! Well done! 🎉
      </motion.div>
    </motion.div>
  );
}