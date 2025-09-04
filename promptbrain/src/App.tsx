import { LoginCard } from "./components/LoginCard";
import { SignupCard } from "./components/SignupCard";
import { RoleSelection } from "./components/RoleSelection";
import { GiftOfEntry } from "./components/GiftOfEntry";
import { Dashboard } from "./components/Dashboard";
import { DesktopSplitLayout } from "./components/layouts/DesktopSplitLayout";
import { MobileLayout } from "./components/layouts/MobileLayout";
import { OnboardingLayout } from "./components/layouts/OnboardingLayout";
import { AppLayout } from "./components/layouts/AppLayout";
import { useAppNavigation } from "./hooks/useAppNavigation";

export default function App() {
  const {
    currentPage,
    selectedRole,
    navigateToSignup,
    navigateToLogin,
    navigateToRoleSelection,
    navigateToPage,
    navigateToGiftOfEntry,
    navigateToTemple,
  } = useAppNavigation();
  // Show onboarding flow (full screen)
  if (currentPage === 'role-selection' || currentPage === 'gift-of-entry') {
    return (
      <OnboardingLayout 
        currentPage={currentPage} 
        onNavigate={navigateToPage}
        selectedRole={selectedRole}
      >
        {currentPage === 'role-selection' && (
          <RoleSelection onRoleSelect={navigateToGiftOfEntry} />
        )}
        {currentPage === 'gift-of-entry' && selectedRole && (
          <GiftOfEntry role={selectedRole} onEnterTemple={navigateToTemple} />
        )}
      </OnboardingLayout>
    );
  }

  // Show Dashboard - The Mind Temple workspace
  if (currentPage === 'temple') {
    return (
      <AppLayout 
        currentPage={currentPage} 
        onNavigate={navigateToPage}
        selectedRole={selectedRole}
        className="min-h-screen bg-temple-black"
      >
        <Dashboard selectedRole={selectedRole} />
      </AppLayout>
    );
  }

  const isLogin = currentPage === 'login';
  const cardComponent = isLogin ? (
    <LoginCard onNavigateToSignup={navigateToSignup} />
  ) : (
    <SignupCard 
      onNavigateToLogin={navigateToLogin} 
      onSignupSuccess={navigateToRoleSelection}
    />
  );

  return (
    <AppLayout 
      currentPage={currentPage} 
      onNavigate={navigateToPage}
      selectedRole={selectedRole}
    >
      {/* Desktop 50/50 Split Layout */}
      <DesktopSplitLayout isLogin={isLogin}>
        {cardComponent}
      </DesktopSplitLayout>
      
      {/* Mobile/Tablet Stacked Layout */}
      <MobileLayout isLogin={isLogin}>
        {cardComponent}
      </MobileLayout>
    </AppLayout>
  );
}