import { CoursesControlPanel } from "@/components/courses-control-panel";

export function CoursesControlPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <CoursesControlPanel />
      </div>
    </div>
  );
}
