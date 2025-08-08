import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import Dashboard from "@/pages/dashboard";
import DashboardStandalone from "@/pages/dashboard-standalone";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import LessonPage from "@/pages/lesson-page";
import Assignments from "@/pages/assignments";
import Calendar from "@/pages/calendar";
import Resources from "@/pages/resources";
import Profile from "@/pages/profile";
import CourseGenerator from "@/pages/course-generator";
import AdminPanel from "@/pages/admin-panel";
import AuthPage from "@/pages/auth-page";
import LearningPathPage from "@/pages/learning-path-page";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ChallengesPage from "@/pages/challenges";
import SuggestionsDemoPage from "@/pages/suggestions-demo";
import GamificationDashboard from "@/pages/gamification-dashboard";
import SocialPage from "@/pages/social-page";
import LearningTrailsPage from "@/pages/learning-trails";
import ChallengePathsPage from "@/pages/challenge-paths";
import ChallengeAnalyticsDashboard from "@/pages/challenge-analytics-dashboard";
import EntranceExamPrep from "@/pages/entrance-exam-prep";
import AdaptiveLearningDemo from "@/pages/adaptive-learning-demo";
import AdvancedAdaptiveLearning from "@/pages/advanced-adaptive-learning";
import EmojiMilestonesDemo from "@/pages/emoji-milestones-demo";
import AnimatedProgressDemo from "@/pages/animated-progress-demo";
import PlayfulAnimationsDemo from "@/pages/playful-animations-demo";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard-standalone" component={DashboardStandalone} />
      <ProtectedRoute path="/courses" component={Courses} />
      <ProtectedRoute path="/courses/:courseId" component={CourseDetail} />
      <ProtectedRoute path="/lesson/:lessonId" component={LessonPage} />
      <ProtectedRoute path="/assignments" component={Assignments} />
      <ProtectedRoute path="/calendar" component={Calendar} />
      <ProtectedRoute path="/resources" component={Resources} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/course-generator" component={CourseGenerator} />
      <ProtectedRoute path="/learning-paths" component={LearningPathPage} />
      <ProtectedRoute path="/learning-paths/:id" component={LearningPathPage} />
      <ProtectedRoute path="/challenges" component={ChallengesPage} />
      <ProtectedRoute path="/challenge-paths" component={ChallengePathsPage} />
      <ProtectedRoute path="/challenge-analytics" component={ChallengeAnalyticsDashboard} />
      <ProtectedRoute path="/entrance-exam-prep" component={EntranceExamPrep} />
      <ProtectedRoute path="/analytics" component={AnalyticsDashboard} />
      <ProtectedRoute path="/gamification" component={GamificationDashboard} />
      <ProtectedRoute path="/social" component={SocialPage} />
      <ProtectedRoute path="/learning-trails" component={LearningTrailsPage} />
      <ProtectedRoute path="/admin" component={AdminPanel} />
      <ProtectedRoute path="/suggestions" component={SuggestionsDemoPage} />
      <ProtectedRoute path="/adaptive-learning" component={AdaptiveLearningDemo} />
      <ProtectedRoute path="/advanced-adaptive" component={AdvancedAdaptiveLearning} />
      <ProtectedRoute path="/emoji-milestones" component={EmojiMilestonesDemo} />
      <ProtectedRoute path="/animated-progress" component={AnimatedProgressDemo} />
      <ProtectedRoute path="/playful-animations" component={PlayfulAnimationsDemo} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { LanguageProvider } from "./hooks/use-language";
import { AuthProvider } from "./hooks/use-auth";
import { SkillChallengeProvider } from "./hooks/use-skill-challenge";
import { GamificationProvider } from "./hooks/use-gamification-tracker";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <GamificationProvider>
            <SkillChallengeProvider>
              <Router />
              <Toaster />
            </SkillChallengeProvider>
          </GamificationProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
