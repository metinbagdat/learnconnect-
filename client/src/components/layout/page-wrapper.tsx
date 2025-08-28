import ModernNavigation from "./modern-navigation";

interface PageWrapperProps {
  children: React.ReactNode;
  currentPage?: string;
  showBackButton?: boolean;
  backUrl?: string;
  pageTitle?: string;
  className?: string;
}

export default function PageWrapper({ 
  children, 
  currentPage,
  showBackButton = false,
  backUrl = "/",
  pageTitle,
  className = ""
}: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ModernNavigation 
        currentPage={currentPage}
        showBackButton={showBackButton}
        backUrl={backUrl}
        pageTitle={pageTitle}
      />
      <main className={`container mx-auto px-4 py-6 ${className}`}>
        {children}
      </main>
    </div>
  );
}