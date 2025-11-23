import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface StudyTimerProps {
  duration?: number;
  onComplete?: () => void;
}

export default function StudyTimer({ duration = 25, onComplete }: StudyTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (mode === 'study') {
            setMode('break');
            setTimeLeft(5 * 60);
          } else {
            setMode('study');
            setTimeLeft(duration * 60);
            onComplete?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, duration, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 text-center">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">
          {mode === 'study' ? '🎯 Study Time' : '☕ Break Time'}
        </h3>
        <div className="text-4xl font-bold font-mono">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? 'destructive' : 'default'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(duration * 60);
            setMode('study');
          }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
