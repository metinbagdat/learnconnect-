import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Star, 
  Clock, 
  Trophy, 
  Target,
  Lightbulb,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailNode {
  id: string;
  position: { x: number; y: number };
  type: 'lesson' | 'checkpoint' | 'bonus' | 'assessment';
  lessonId: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  prerequisites: string[];
  unlockConditions: {
    requiredNodes?: string[];
    minimumScore?: number;
    achievementRequired?: number;
  };
  hoverInfo: {
    summary: string;
    learningObjectives: string[];
    keyTopics: string[];
    tips: string[];
    resources: string[];
  };
  rewards: {
    xp: number;
    points: number;
    badges?: number[];
  };
  isOptional: boolean;
  isCompleted?: boolean;
  isUnlocked?: boolean;
  progress?: number;
}

interface Connection {
  from: string;
  to: string;
  type: 'prerequisite' | 'recommended' | 'optional';
}

interface LessonTrailMapProps {
  nodes: TrailNode[];
  connections: Connection[];
  userProgress: {
    completedNodes: string[];
    currentNode?: string;
    totalProgress: number;
  };
  onNodeClick: (node: TrailNode) => void;
  onNodeComplete: (nodeId: string) => void;
}

export function LessonTrailMap({ 
  nodes, 
  connections, 
  userProgress, 
  onNodeClick, 
  onNodeComplete 
}: LessonTrailMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate node states based on progress
  const enhancedNodes = nodes.map(node => ({
    ...node,
    isCompleted: userProgress.completedNodes.includes(node.id),
    isUnlocked: isNodeUnlocked(node, userProgress.completedNodes),
    progress: userProgress.currentNode === node.id ? 50 : 
              userProgress.completedNodes.includes(node.id) ? 100 : 0
  }));

  function isNodeUnlocked(node: TrailNode, completedNodes: string[]): boolean {
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every(prereq => completedNodes.includes(prereq));
  }

  function getNodeIcon(node: TrailNode) {
    if (node.isCompleted) return CheckCircle;
    if (!node.isUnlocked) return Lock;
    
    switch (node.type) {
      case 'lesson': return BookOpen;
      case 'checkpoint': return Target;
      case 'bonus': return Star;
      case 'assessment': return Trophy;
      default: return BookOpen;
    }
  }

  function getNodeColor(node: TrailNode) {
    if (node.isCompleted) return 'text-green-500 bg-green-50 border-green-200';
    if (!node.isUnlocked) return 'text-gray-400 bg-gray-50 border-gray-200';
    if (userProgress.currentNode === node.id) return 'text-blue-500 bg-blue-50 border-blue-200';
    
    switch (node.difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="w-full h-[800px] relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
      {/* SVG for connections */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
        </defs>
        {connections.map((connection, index) => {
          const fromNode = enhancedNodes.find(n => n.id === connection.from);
          const toNode = enhancedNodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;

          const strokeColor = connection.type === 'prerequisite' ? '#3b82f6' :
                            connection.type === 'recommended' ? '#10b981' : '#6b7280';
          const strokeWidth = connection.type === 'prerequisite' ? 3 : 2;
          const strokeDasharray = connection.type === 'optional' ? '5,5' : 'none';

          return (
            <line
              key={index}
              x1={fromNode.position.x + 60}
              y1={fromNode.position.y + 60}
              x2={toNode.position.x + 60}
              y2={toNode.position.y + 60}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              markerEnd="url(#arrowhead)"
              opacity={0.7}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div className="relative" style={{ zIndex: 2 }}>
        {enhancedNodes.map((node) => {
          const Icon = getNodeIcon(node);
          
          return (
            <TooltipProvider key={node.id}>
              <Tooltip open={hoveredNode === node.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute"
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setHoveredNode(node.id)}
                    onHoverEnd={() => setHoveredNode(null)}
                  >
                    <Card 
                      className={`w-32 h-32 cursor-pointer transition-all duration-200 ${getNodeColor(node)} ${
                        selectedNode === node.id ? 'ring-2 ring-blue-400' : ''
                      } ${!node.isUnlocked ? 'cursor-not-allowed opacity-60' : 'hover:shadow-lg'}`}
                      onClick={() => {
                        if (node.isUnlocked) {
                          setSelectedNode(node.id);
                          onNodeClick(node);
                        }
                      }}
                    >
                      <CardContent className="p-3 h-full flex flex-col items-center justify-center text-center">
                        <Icon className="h-8 w-8 mb-2" />
                        <h4 className="text-xs font-semibold mb-1 line-clamp-2">{node.title}</h4>
                        
                        {/* Progress indicator */}
                        {node.progress > 0 && (
                          <div className="w-full mt-1">
                            <Progress value={node.progress} className="h-1" />
                          </div>
                        )}

                        {/* Node type badge */}
                        <Badge 
                          variant="secondary" 
                          className={`text-xs mt-1 ${getDifficultyColor(node.difficulty)}`}
                        >
                          {node.type}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Floating rewards indicator */}
                    {node.rewards.xp > 0 && (
                      <motion.div
                        className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        +{node.rewards.xp} XP
                      </motion.div>
                    )}

                    {/* Optional indicator */}
                    {node.isOptional && (
                      <motion.div
                        className="absolute -top-1 -left-1 bg-purple-400 text-white rounded-full p-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Star className="h-3 w-3" />
                      </motion.div>
                    )}
                  </motion.div>
                </TooltipTrigger>

                <TooltipContent side="right" className="max-w-sm p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div>
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {node.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {node.hoverInfo.summary}
                      </p>
                    </div>

                    {/* Learning Objectives */}
                    <div>
                      <h4 className="font-medium text-xs flex items-center gap-1 mb-1">
                        <Target className="h-3 w-3" />
                        Learning Objectives
                      </h4>
                      <ul className="text-xs space-y-1">
                        {node.hoverInfo.learningObjectives.slice(0, 3).map((obj, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <ArrowRight className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Topics */}
                    <div>
                      <h4 className="font-medium text-xs flex items-center gap-1 mb-1">
                        <BookOpen className="h-3 w-3" />
                        Key Topics
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {node.hoverInfo.keyTopics.slice(0, 4).map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Learning Tips */}
                    <div>
                      <h4 className="font-medium text-xs flex items-center gap-1 mb-1">
                        <Lightbulb className="h-3 w-3" />
                        Tips
                      </h4>
                      <ul className="text-xs space-y-1">
                        {node.hoverInfo.tips.slice(0, 2).map((tip, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <Zap className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {node.estimatedTime}m
                      </span>
                      <Badge className={getDifficultyColor(node.difficulty)}>
                        {node.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        +{node.rewards.xp} XP
                      </span>
                    </div>

                    {/* Action Button */}
                    {node.isUnlocked && !node.isCompleted && (
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => onNodeClick(node)}
                      >
                        Start Learning
                      </Button>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="font-semibold text-sm mb-2">Trail Progress</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{userProgress.totalProgress}%</span>
          </div>
          <Progress value={userProgress.totalProgress} className="h-2" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{userProgress.completedNodes.length} completed</span>
            <span>{enhancedNodes.length - userProgress.completedNodes.length} remaining</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="font-medium text-xs mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Prerequisite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span>Recommended</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-400 border-dashed border-t"></div>
            <span>Optional</span>
          </div>
        </div>
      </div>
    </div>
  );
}