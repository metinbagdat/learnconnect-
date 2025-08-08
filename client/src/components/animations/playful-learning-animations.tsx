import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Trophy,
  Target,
  Sparkles,
  Heart,
  Zap,
  Rocket,
  Crown,
  Gift,
  Flame as Fire,
  BookOpen,
  Brain,
  Lightbulb,
  PartyPopper,
  Wand2,
  Smile,
  ThumbsUp,
  Award,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

// Types for different animation systems
export interface LearningMascot {
  id: string;
  name: string;
  mood: 'happy' | 'excited' | 'focused' | 'celebrating' | 'encouraging';
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  animation: 'bounce' | 'dance' | 'float' | 'spin' | 'wave';
  message?: string;
}

export interface SkillNode {
  id: string;
  title: string;
  level: number;
  maxLevel: number;
  isUnlocked: boolean;
  isActive: boolean;
  icon: string;
  color: string;
  prerequisites: string[];
  position: { x: number; y: number };
  rewards: string[];
}

export interface PlayfulAnimationConfig {
  enableParticles: boolean;
  enableMascot: boolean;
  enableSoundEffects: boolean;
  animationSpeed: number;
  particleCount: number;
  celebrationDuration: number;
}

export interface AchievementCelebration {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'streak' | 'completion' | 'mastery' | 'breakthrough';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  effects: ('confetti' | 'fireworks' | 'sparkles' | 'glow' | 'shake')[];
}

// Floating Learning Mascot Component
export const FloatingMascot: React.FC<{
  mascot: LearningMascot;
  onInteract?: () => void;
}> = ({ mascot, onInteract }) => {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const animations = {
      bounce: {
        y: [0, -10, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      },
      dance: {
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      },
      float: {
        y: [0, -8, 0],
        x: [0, 2, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      },
      spin: {
        rotate: [0, 360],
        transition: { duration: 4, repeat: Infinity, ease: "linear" }
      },
      wave: {
        rotate: [0, 10, -10, 0],
        transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
      }
    };

    controls.start(animations[mascot.animation]);
  }, [mascot.animation, controls]);

  const getMascotEmoji = () => {
    const moodEmojis = {
      happy: '😊',
      excited: '🤩',
      focused: '🤓',
      celebrating: '🥳',
      encouraging: '💪'
    };
    return moodEmojis[mascot.mood];
  };

  const getSizeClass = () => {
    const sizes = {
      small: 'w-12 h-12 text-2xl',
      medium: 'w-16 h-16 text-3xl',
      large: 'w-20 h-20 text-4xl'
    };
    return sizes[mascot.size];
  };

  return (
    <motion.div
      animate={controls}
      className={`fixed z-50 cursor-pointer select-none ${getSizeClass()}`}
      style={{ left: mascot.position.x, top: mascot.position.y }}
      onClick={onInteract}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        {/* Mascot Character */}
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <span className="text-white">{getMascotEmoji()}</span>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-30 blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Speech bubble */}
        <AnimatePresence>
          {(isHovered || mascot.message) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-3 shadow-lg border-2 border-purple-200 min-w-max"
            >
              <div className="text-sm font-medium text-gray-800">
                {mascot.message || `Hi! I'm ${mascot.name}!`}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-purple-200 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating hearts when celebrating */}
        {mascot.mood === 'celebrating' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-red-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -30],
                  x: [0, Math.random() * 20 - 10]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              >
                ❤️
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Achievement Celebration Component
export const AchievementCelebration: React.FC<{
  achievement: AchievementCelebration;
  isVisible: boolean;
  onComplete?: () => void;
}> = ({ achievement, isVisible, onComplete }) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getRarityColors = () => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-500'
    };
    return colors[achievement.rarity];
  };

  const getIconComponent = () => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Trophy, Star, Target, Crown, Award, Rocket, Fire, Gift
    };
    return icons[achievement.icon] || Trophy;
  };

  const IconComponent = getIconComponent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          {/* Main achievement card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <Card className={`w-96 bg-gradient-to-br ${getRarityColors()} border-4 border-white shadow-2xl`}>
              <CardHeader className="text-center pb-4">
                <motion.div
                  animate={achievement.effects.includes('shake') ? {
                    rotate: [0, 1, -1, 0],
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="mx-auto mb-4"
                >
                  <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center ${achievement.effects.includes('glow') ? 'shadow-2xl' : ''}`}>
                    <IconComponent className="w-10 h-10 text-gray-800" />
                  </div>
                </motion.div>
                
                <CardTitle className="text-2xl font-bold text-white">
                  {achievement.title}
                </CardTitle>
                
                <Badge 
                  variant="outline" 
                  className={`mt-2 border-white text-white bg-white/20 capitalize`}
                >
                  {achievement.rarity} {achievement.type}
                </Badge>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="text-white/90 text-lg">
                  {achievement.description}
                </p>
              </CardContent>
            </Card>

            {/* Particle effects */}
            {showParticles && achievement.effects.includes('confetti') && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][i % 5],
                      left: '50%',
                      top: '50%'
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                      x: [0, (Math.random() - 0.5) * 200],
                      y: [0, (Math.random() - 0.5) * 200],
                      rotate: [0, Math.random() * 360]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}

            {/* Sparkles effect */}
            {showParticles && achievement.effects.includes('sparkles') && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: Math.random() * 100 + '%',
                      top: Math.random() * 100 + '%'
                    }}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Fireworks effect */}
            {showParticles && achievement.effects.includes('fireworks') && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                      y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 1.2,
                      delay: 0.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Interactive Skill Tree Component
export const InteractiveSkillTree: React.FC<{
  skills: SkillNode[];
  onSkillClick?: (skill: SkillNode) => void;
  onSkillUnlock?: (skill: SkillNode) => void;
}> = ({ skills, onSkillClick, onSkillUnlock }) => {
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      BookOpen, Brain, Target, Star, Trophy, Rocket, Lightbulb, Fire
    };
    return icons[iconName] || BookOpen;
  };

  const handleSkillClick = (skill: SkillNode) => {
    if (skill.isUnlocked || canUnlockSkill(skill)) {
      setSelectedSkill(skill);
      onSkillClick?.(skill);
      
      if (!skill.isUnlocked && canUnlockSkill(skill)) {
        setUnlockedSkills(prev => [...prev, skill.id]);
        onSkillUnlock?.(skill);
      }
    }
  };

  const canUnlockSkill = (skill: SkillNode) => {
    return skill.prerequisites.every(preReq => 
      skills.find(s => s.id === preReq)?.isUnlocked || unlockedSkills.includes(preReq)
    );
  };

  const isSkillUnlocked = (skill: SkillNode) => {
    return skill.isUnlocked || unlockedSkills.includes(skill.id);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Skill nodes */}
      {skills.map((skill, index) => {
        const IconComponent = getIconComponent(skill.icon);
        const unlocked = isSkillUnlocked(skill);
        const canUnlock = canUnlockSkill(skill);
        
        return (
          <motion.div
            key={skill.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${skill.position.x}%`,
              top: `${skill.position.y}%`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSkillClick(skill)}
          >
            {/* Connection lines */}
            {skill.prerequisites.map(preReqId => {
              const preReqSkill = skills.find(s => s.id === preReqId);
              if (!preReqSkill) return null;
              
              return (
                <svg
                  key={preReqId}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: Math.abs(skill.position.x - preReqSkill.position.x) * 4,
                    height: Math.abs(skill.position.y - preReqSkill.position.y) * 4,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${((preReqSkill.position.x - skill.position.x) / Math.abs(skill.position.x - preReqSkill.position.x)) * 50 + 50}%`}
                    y2={`${((preReqSkill.position.y - skill.position.y) / Math.abs(skill.position.y - preReqSkill.position.y)) * 50 + 50}%`}
                    stroke={unlocked ? '#10b981' : '#d1d5db'}
                    strokeWidth="2"
                    strokeDasharray={unlocked ? 'none' : '5,5'}
                  />
                </svg>
              );
            })}
            
            {/* Skill node */}
            <div className="relative">
              {/* Unlock animation ring */}
              {unlockedSkills.includes(skill.id) && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-green-400"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              )}
              
              {/* Main skill circle */}
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg ${
                  unlocked 
                    ? `bg-gradient-to-br ${skill.color} border-white` 
                    : canUnlock
                    ? 'bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-600'
                    : 'bg-gray-300 border-gray-400'
                }`}
                animate={skill.isActive && unlocked ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 4px 6px rgba(0, 0, 0, 0.1)',
                    '0 8px 25px rgba(59, 130, 246, 0.5)',
                    '0 4px 6px rgba(0, 0, 0, 0.1)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconComponent 
                  className={`w-8 h-8 ${
                    unlocked ? 'text-white' : canUnlock ? 'text-yellow-800' : 'text-gray-500'
                  }`} 
                />
              </motion.div>
              
              {/* Skill level indicator */}
              {unlocked && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {skill.level}/{skill.maxLevel}
                  </div>
                </div>
              )}
              
              {/* Lock icon for locked skills */}
              {!unlocked && !canUnlock && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
              )}
              
              {/* Ready to unlock indicator */}
              {!unlocked && canUnlock && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-white text-xs">!</span>
                </motion.div>
              )}
            </div>
            
            {/* Skill title */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
              <div className={`text-sm font-medium ${
                unlocked ? 'text-gray-800' : canUnlock ? 'text-yellow-700' : 'text-gray-500'
              }`}>
                {skill.title}
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {/* Skill details panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-64 bg-white rounded-lg border-2 border-blue-300 shadow-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{selectedSkill.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSkill(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Level:</span>
                <span className="font-medium">{selectedSkill.level}/{selectedSkill.maxLevel}</span>
              </div>
              
              <Progress 
                value={(selectedSkill.level / selectedSkill.maxLevel) * 100} 
                className="h-2"
              />
              
              {selectedSkill.rewards.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Rewards:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSkill.rewards.map((reward, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Playful Learning Animations Component
export const PlayfulLearningAnimations: React.FC<{
  config?: Partial<PlayfulAnimationConfig>;
  children?: React.ReactNode;
}> = ({ config = {}, children }) => {
  const defaultConfig: PlayfulAnimationConfig = {
    enableParticles: true,
    enableMascot: true,
    enableSoundEffects: false,
    animationSpeed: 1,
    particleCount: 20,
    celebrationDuration: 3000,
    ...config
  };

  const [mascot, setMascot] = useState<LearningMascot>({
    id: 'buddy',
    name: 'Learning Buddy',
    mood: 'happy',
    position: { x: 100, y: 100 },
    size: 'medium',
    animation: 'float'
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<AchievementCelebration | null>(null);

  const triggerCelebration = (achievement: AchievementCelebration) => {
    setCurrentAchievement(achievement);
    setShowCelebration(true);
    setMascot(prev => ({ ...prev, mood: 'celebrating', animation: 'dance' }));
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setCurrentAchievement(null);
    setMascot(prev => ({ ...prev, mood: 'happy', animation: 'float' }));
  };

  const handleMascotInteract = () => {
    const messages = [
      "Keep up the great work! 🌟",
      "You're doing amazing! 💪",
      "Learning is fun! 🎉",
      "Ready for the next challenge? 🚀",
      "You've got this! 👍"
    ];
    
    setMascot(prev => ({
      ...prev,
      message: messages[Math.floor(Math.random() * messages.length)],
      mood: 'encouraging',
      animation: 'bounce'
    }));
    
    setTimeout(() => {
      setMascot(prev => ({ ...prev, message: undefined, mood: 'happy', animation: 'float' }));
    }, 3000);
  };

  return (
    <div className="relative">
      {children}
      
      {/* Floating Mascot */}
      {defaultConfig.enableMascot && (
        <FloatingMascot 
          mascot={mascot} 
          onInteract={handleMascotInteract}
        />
      )}
      
      {/* Achievement Celebrations */}
      {currentAchievement && (
        <AchievementCelebration
          achievement={currentAchievement}
          isVisible={showCelebration}
          onComplete={handleCelebrationComplete}
        />
      )}
    </div>
  );
};

export default PlayfulLearningAnimations;