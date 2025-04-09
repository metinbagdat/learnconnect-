import { useLocation, Link } from "wouter";
import { Home, BookOpen, FileText, User } from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
      <div className="flex items-center justify-around py-2">
        <Link href="/">
          <a className={`inline-flex flex-col items-center justify-center px-3 py-1 ${
            location === "/" ? "text-primary" : "text-neutral-500"
          }`}>
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </a>
        </Link>
        
        <Link href="/courses">
          <a className={`inline-flex flex-col items-center justify-center px-3 py-1 ${
            location === "/courses" ? "text-primary" : "text-neutral-500"
          }`}>
            <BookOpen className="h-6 w-6" />
            <span className="text-xs">Courses</span>
          </a>
        </Link>
        
        <Link href="/assignments">
          <a className={`inline-flex flex-col items-center justify-center px-3 py-1 relative ${
            location === "/assignments" ? "text-primary" : "text-neutral-500"
          }`}>
            <FileText className="h-6 w-6" />
            <span className="text-xs">Assignments</span>
            <span className="absolute top-0 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
            </span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`inline-flex flex-col items-center justify-center px-3 py-1 ${
            location === "/profile" ? "text-primary" : "text-neutral-500"
          }`}>
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
