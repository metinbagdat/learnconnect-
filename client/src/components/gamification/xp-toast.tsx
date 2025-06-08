import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus } from "lucide-react";

interface XpToastProps {
  amount: number;
  isVisible: boolean;
  onComplete: () => void;
}

export function XpToast({ amount, isVisible, onComplete }: XpToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="fixed bottom-20 right-6 z-50"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              >
                <Star className="h-5 w-5 text-yellow-300 fill-current" />
              </motion.div>
              
              <div className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-lg"
                >
                  {amount}
                </motion.span>
                <span className="text-sm font-medium">XP</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}