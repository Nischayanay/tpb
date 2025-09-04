import { useState } from "react";
import { getCurrentSession, updateUserRole, completeOnboarding } from "../utils/auth";
import { toast } from "sonner@2.0.3";

type AppPage = 'login' | 'signup' | 'role-selection' | 'gift-of-entry' | 'temple';

export function useAppNavigation() {
  const [currentPage, setCurrentPage] = useState<AppPage>('login');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const navigateToSignup = () => setCurrentPage('signup');
  const navigateToLogin = () => setCurrentPage('login');
  const navigateToRoleSelection = () => setCurrentPage('role-selection');
  const navigateToPage = (page: AppPage) => setCurrentPage(page);
  
  const navigateToGiftOfEntry = async (role: string) => {
    setSelectedRole(role);
    
    // Store role in backend if user is authenticated
    try {
      const session = await getCurrentSession();
      if (session.success && session.access_token) {
        setAccessToken(session.access_token);
        const roleUpdate = await updateUserRole(session.access_token, role);
        if (roleUpdate.success) {
          console.log('Role stored successfully');
        } else {
          toast.error('Failed to save role preference');
        }
      }
    } catch (error) {
      console.log('Error storing role:', error);
    }
    
    setCurrentPage('gift-of-entry');
  };
  
  const navigateToTemple = async () => {
    // Complete onboarding and grant credits
    if (accessToken) {
      try {
        const result = await completeOnboarding(accessToken);
        if (result.success) {
          toast.success('Welcome to the Mind Temple! 10 Temple Keys granted.');
        } else {
          toast.error('Error completing onboarding');
        }
      } catch (error) {
        console.log('Error completing onboarding:', error);
      }
    }
    setCurrentPage('temple');
  };

  return {
    currentPage,
    selectedRole,
    navigateToSignup,
    navigateToLogin,
    navigateToRoleSelection,
    navigateToPage,
    navigateToGiftOfEntry,
    navigateToTemple,
  };
}