import { ReactNode } from "react";
import { DemoNavigation } from "../DemoNavigation";
import { FlowShowcase } from "../FlowShowcase";
import { Toaster } from "../ui/sonner";

type AppPage = 'login' | 'signup' | 'role-selection' | 'gift-of-entry' | 'temple';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  selectedRole?: string | null;
  className?: string;
}

export function AppLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  selectedRole, 
  className = "min-h-screen bg-temple-black overflow-hidden" 
}: AppLayoutProps) {
  return (
    <div className={className}>
      {children}
      
      {/* Demo Navigation */}
      <DemoNavigation 
        currentPage={currentPage} 
        onNavigate={onNavigate}
        selectedRole={selectedRole}
      />
      
      {/* Flow Showcase */}
      <FlowShowcase 
        currentPage={currentPage}
        selectedRole={selectedRole}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}