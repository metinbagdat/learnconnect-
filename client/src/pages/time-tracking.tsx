import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Play, Pause, StopCircle, Coffee, SmilePlus, Meh, Frown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes

interface DailyGoal {
  id: number;
  userId: number;
  date: string;
  targetMinutes: number;
  completedMinutes: number;
  pomodoroSessions: number;
  subjectFocus: string | null;
}

export default function TimeTracking() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [seconds, setSeconds] = useState(POMODORO_DURATION);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Fetch today's goal
  const { data: dailyGoal } = useQuery<DailyGoal>({
    queryKey: ["/api/daily-study-goals", today],
    enabled: !!user,
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      // Timer finished
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (isBreak) {
      toast({
        title: t("dashboard.breakComplete") || "Break complete!",
        description: t("dashboard.readyForNextSession") || "Ready for your next session",
      });
      setSeconds(POMODORO_DURATION);
      setIsBreak(false);
    } else {
      setPomodoroCount(c => c + 1);
      toast({
        title: t("dashboard.pomodoroComplete") || "Pomodoro completed!",
        description: t("dashboard.timeForBreak") || "Time for a break",
      });
      setSeconds(BREAK_DURATION);
      setIsBreak(true);
    }
  };

  const startTimer = () => {
    if (!selectedSubject) {
      toast({
        title: t("dashboard.selectSubject") || "Select a subject",
        description: t("dashboard.selectSubjectFirst") || "Please select a subject before starting",
        variant: "destructive",
      });
      return;
    }
    setIsActive(true);
  };

  const pauseTimer = () => setIsActive(false);

  const stopTimer = () => {
    setIsActive(false);
    setSeconds(POMODORO_DURATION);
    setIsBreak(false);
  };

  // Save study session mutation
  const saveSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/study-habits", data);
    },
    onSuccess: () => {
      toast({
        title: t("dashboard.sessionSaved") || "Session saved!",
        description: t("dashboard.sessionRecorded") || "Your study session has been recorded",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/study-habits"] });
      setNotes("");
      setMood(null);
      setSelectedSubject("");
      setPomodoroCount(0);
      stopTimer();
    },
  });

  const saveSession = () => {
    if (!selectedSubject || pomodoroCount === 0) {
      toast({
        title: t("dashboard.completeSession") || "Complete a session",
        description: t("dashboard.completeSessionFirst") || "Complete at least one Pomodoro session before saving",
        variant: "destructive",
      });
      return;
    }

    saveSessionMutation.mutate({
      date: today,
      totalStudyMinutes: pomodoroCount * 25,
      subjectsStudied: [selectedSubject],
      pomodoroCount,
      mood,
      productivityRating: mood === "happy" ? 5 : mood === "neutral" ? 3 : 2,
      notes,
    });
  };

  // Format time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = isBreak
    ? ((BREAK_DURATION - seconds) / BREAK_DURATION) * 100
    : ((POMODORO_DURATION - seconds) / POMODORO_DURATION) * 100;

  const todayProgress = dailyGoal
    ? (dailyGoal.completedMinutes / dailyGoal.targetMinutes) * 100
    : 0;

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t("navigation.timeTracking") || "Time Tracking"}
        </h1>
      </div>

      {/* Today's Goal */}
      {dailyGoal && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <h2 className="text-lg font-semibold mb-3">
            {t("dashboard.todaysGoal") || "Today's Goal"}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{dailyGoal.completedMinutes} / {dailyGoal.targetMinutes} {t("dashboard.minutes") || "minutes"}</span>
              <span>{Math.round(todayProgress)}%</span>
            </div>
            <Progress value={todayProgress} className="h-3" data-testid="progress-today-goal" />
          </div>
        </Card>
      )}

      {/* Main Timer Card */}
      <Card className="p-8">
        <div className="text-center space-y-6">
          {/* Timer Display */}
          <div className="relative">
            <div className="text-7xl font-mono font-bold text-center mb-4" data-testid="timer-display">
              {formatTime(seconds)}
            </div>
            <div className="text-lg text-muted-foreground">
              {isBreak ? (t("dashboard.breakTime") || "Break Time") : (t("dashboard.focusTime") || "Focus Time")}
            </div>
            <Progress value={progressPercentage} className="h-2 mt-4" data-testid="progress-timer" />
          </div>

          {/* Timer Controls */}
          <div className="flex gap-3 justify-center">
            {!isActive ? (
              <Button onClick={startTimer} size="lg" className="gap-2" data-testid="button-start-timer">
                <Play className="w-5 h-5" />
                {t("dashboard.start") || "Start"}
              </Button>
            ) : (
              <Button onClick={pauseTimer} size="lg" variant="secondary" className="gap-2" data-testid="button-pause-timer">
                <Pause className="w-5 h-5" />
                {t("dashboard.pause") || "Pause"}
              </Button>
            )}
            <Button onClick={stopTimer} size="lg" variant="outline" className="gap-2" data-testid="button-stop-timer">
              <StopCircle className="w-5 h-5" />
              {t("dashboard.stop") || "Stop"}
            </Button>
          </div>

          {/* Pomodoro Counter */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <Coffee className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold" data-testid="text-pomodoro-count">
              {pomodoroCount} {t("dashboard.pomodorosCompleted") || "Pomodoros completed"}
            </span>
          </div>
        </div>
      </Card>

      {/* Session Details */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          {t("dashboard.sessionDetails") || "Session Details"}
        </h2>

        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("dashboard.subject") || "Subject"}
          </label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger data-testid="select-subject">
              <SelectValue placeholder={t("dashboard.selectSubject") || "Select a subject"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Matematik" data-testid="select-option-matematik">Matematik</SelectItem>
              <SelectItem value="Türkçe" data-testid="select-option-turkce">Türkçe</SelectItem>
              <SelectItem value="Fizik" data-testid="select-option-fizik">Fizik</SelectItem>
              <SelectItem value="Kimya" data-testid="select-option-kimya">Kimya</SelectItem>
              <SelectItem value="Biyoloji" data-testid="select-option-biyoloji">Biyoloji</SelectItem>
              <SelectItem value="Tarih" data-testid="select-option-tarih">Tarih</SelectItem>
              <SelectItem value="Coğrafya" data-testid="select-option-cografya">Coğrafya</SelectItem>
              <SelectItem value="Geometri" data-testid="select-option-geometri">Geometri</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mood Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("dashboard.howDoYouFeel") || "How do you feel?"}
          </label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={mood === "happy" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setMood("happy")}
              data-testid="button-mood-happy"
            >
              <SmilePlus className="w-5 h-5" />
              {t("dashboard.great") || "Great"}
            </Button>
            <Button
              type="button"
              variant={mood === "neutral" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setMood("neutral")}
              data-testid="button-mood-neutral"
            >
              <Meh className="w-5 h-5" />
              {t("dashboard.okay") || "Okay"}
            </Button>
            <Button
              type="button"
              variant={mood === "tired" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setMood("tired")}
              data-testid="button-mood-tired"
            >
              <Frown className="w-5 h-5" />
              {t("dashboard.tired") || "Tired"}
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("dashboard.notes") || "Notes (Optional)"}
          </label>
          <Textarea
            placeholder={t("dashboard.addNotes") || "Add any notes about your study session..."}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            data-testid="textarea-notes"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={saveSession}
          className="w-full"
          size="lg"
          disabled={saveSessionMutation.isPending}
          data-testid="button-save-session"
        >
          {saveSessionMutation.isPending
            ? (t("dashboard.saving") || "Saving...")
            : (t("dashboard.saveSession") || "Save Session")}
        </Button>
      </Card>
    </div>
  );
}
