import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Sparkles, Trophy, Zap } from "lucide-react";
import { Achievement } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementUnlockModal({
  achievement,
  isOpen,
  onClose
}: AchievementUnlockModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (isOpen && achievement) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, achievement]);
  
  if (!achievement) return null;
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'uncommon': return 'from-green-400 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };
  
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 'epic': return <Star className="h-8 w-8 text-purple-500" />;
      case 'rare': return <Award className="h-8 w-8 text-blue-500" />;
      case 'uncommon': return <Zap className="h-8 w-8 text-green-500" />;
      default: return <Award className="h-8 w-8 text-gray-500" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="relative overflow-hidden">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  initial={{ 
                    x: Math.random() * 400,
                    y: -10,
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{ 
                    y: 400,
                    rotate: 360,
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2 + Math.random(),
                    delay: Math.random() * 0.5
                  }}
                />
              ))}
            </div>
          )}
          
          <DialogHeader>
            <DialogTitle className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
                className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
              >
                Achievement Unlocked!
              </motion.div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-6 py-6">
            {/* Achievement Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3
              }}
              className={`relative p-6 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-2xl`}
            >
              <div className="bg-white/90 rounded-full p-4">
                {achievement.imageUrl ? (
                  <img 
                    src={achievement.imageUrl} 
                    alt={achievement.title}
                    className="h-12 w-12"
                  />
                ) : (
                  getRarityIcon(achievement.rarity)
                )}
              </div>
              
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-50"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: `conic-gradient(from 0deg, transparent, ${achievement.rarity === 'legendary' ? '#fbbf24' : '#8b5cf6'}, transparent)`
                }}
              />
            </motion.div>
            
            {/* Achievement Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-3"
            >
              <h3 className="text-xl font-bold">{achievement.title}</h3>
              <p className="text-muted-foreground">{achievement.description}</p>
              
              <div className="flex justify-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    achievement.rarity === 'legendary' ? 'border-yellow-500 text-yellow-700' :
                    achievement.rarity === 'epic' ? 'border-purple-500 text-purple-700' :
                    achievement.rarity === 'rare' ? 'border-blue-500 text-blue-700' :
                    achievement.rarity === 'uncommon' ? 'border-green-500 text-green-700' :
                    'border-gray-500 text-gray-700'
                  }`}
                >
                  {achievement.rarity}
                </Badge>
                <Badge variant="secondary">
                  +{achievement.pointsReward} points
                </Badge>
                <Badge variant="secondary">
                  +{achievement.xpReward} XP
                </Badge>
              </div>
            </motion.div>
            
            {/* Sparkles */}
            <div className="absolute top-4 left-4">
              <motion.div
                animate={{ 
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </div>
            
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ 
                  rotate: [360, 180, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Sparkles className="h-4 w-4 text-purple-400" />
              </motion.div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={onClose} className="px-8">
              Awesome!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}