import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import Dashboard from "@/pages/dashboard";
import DashboardStandalone from "@/pages/dashboard-standalone";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Assignments from "@/pages/assignments";
import Calendar from "@/pages/calendar";
import Resources from "@/pages/resources";
import Profile from "@/pages/profile";
import CourseGenerator from "@/pages/course-generator";
import AdminPanel from "@/pages/admin-panel";
import AuthPage from "@/pages/auth-page";
import LearningPathPage from "@/pages/learning-path-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard-standalone" component={DashboardStandalone} />
      <ProtectedRoute path="/courses" component={Courses} />
      <ProtectedRoute path="/courses/:courseId" component={CourseDetail} />
      <ProtectedRoute path="/assignments" component={Assignments} />
      <ProtectedRoute path="/calendar" component={Calendar} />
      <ProtectedRoute path="/resources" component={Resources} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/course-generator" component={CourseGenerator} />
      <ProtectedRoute path="/learning-paths" component={LearningPathPage} />
      <ProtectedRoute path="/learning-paths/:id" component={LearningPathPage} />
      <ProtectedRoute path="/admin" component={AdminPanel} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { LanguageProvider } from "./hooks/use-language";
import { AuthProvider } from "./hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router />
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
