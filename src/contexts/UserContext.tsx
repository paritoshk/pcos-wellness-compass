import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export interface PCOSProfile {
  name: string;
  age: number | null;
  symptoms: string[];
  insulinResistant: boolean | null;
  weightGoals: 'maintain' | 'lose' | 'gain' | null;
  dietaryPreferences: string[];
  completedSetup: boolean;
}

export interface FoodAnalysisItem {
  id: string;
  date: string;
  foodName: string;
  imageUrl: string;
  pcosCompatibility: number;
  nutritionalInfo: {
    carbs: number;
    protein: number;
    fats: number;
    glycemicLoad: string;
    inflammatoryScore: string;
  };
  recommendation: string;
  alternatives: string[];
}

interface UserContextType {
  profile: PCOSProfile;
  updateProfile: (data: Partial<PCOSProfile>) => void;
  isProfileComplete: boolean;
  foodAnalysisHistory: FoodAnalysisItem[];
  addFoodAnalysis: (analysis: FoodAnalysisItem) => void;
  logoutUser: () => void;
  authIsLoading: boolean;
  authIsAuthenticated: boolean;
}

const defaultProfile: PCOSProfile = {
  name: '',
  age: null,
  symptoms: [],
  insulinResistant: null,
  weightGoals: null,
  dietaryPreferences: [],
  completedSetup: false
};

const UserContext = createContext<UserContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
  isProfileComplete: false,
  foodAnalysisHistory: [],
  addFoodAnalysis: () => {},
  logoutUser: () => {},
  authIsLoading: true,
  authIsAuthenticated: false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ALL Hooks must be called at the top level, before any conditional returns.
  const { user, isAuthenticated, isLoading, logout: auth0Logout } = useAuth0();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<PCOSProfile>(() => {
    console.log('UserProvider: Initializing profile from localStorage or default');
    const savedProfile = localStorage.getItem('pcosProfile');
    return savedProfile ? JSON.parse(savedProfile) : { ...defaultProfile };
  });

  const [foodAnalysisHistory, setFoodAnalysisHistory] = useState<FoodAnalysisItem[]>(() => {
    const saved = localStorage.getItem('foodAnalysisHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    console.log('UserProvider: Auth0 useEffect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user name:', user?.name, 'profile.completedSetup:', profile.completedSetup);
    if (!isLoading && isAuthenticated && user && !profile.completedSetup && !profile.name) {
      console.log('UserProvider: Auth0 user identified, profile not complete, setting guest name from Auth0');
      setProfile(prev => ({
        ...prev,
        name: user.name || user.nickname || 'Auth0 User',
      }));
    }
  }, [isLoading, isAuthenticated, user, profile.completedSetup, profile.name]);

  const updateProfile = useCallback((data: Partial<PCOSProfile>) => {
    console.log('UserProvider: updateProfile called with:', data);
    setProfile((prev) => {
      const updatedProfile = { ...prev, ...data };
      localStorage.setItem('pcosProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []); 

  const addFoodAnalysis = useCallback((analysis: FoodAnalysisItem) => {
    setFoodAnalysisHistory(prev => {
      const updated = [analysis, ...prev];
      localStorage.setItem('foodAnalysisHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logoutUser = useCallback(() => {
    console.log('UserProvider: logoutUser called. Auth0 isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('UserProvider: Calling auth0Logout');
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
    setProfile({ ...defaultProfile });
    setFoodAnalysisHistory([]);
    localStorage.removeItem('pcosProfile');
    localStorage.removeItem('foodAnalysisHistory');
    console.log('UserProvider: Navigating to / after logout');
    navigate('/');
  }, [isAuthenticated, auth0Logout, navigate]);

  useEffect(() => {
    if(profile.name || profile.completedSetup) { 
      console.log('UserProvider: Persisting profile to localStorage:', profile);
      localStorage.setItem('pcosProfile', JSON.stringify(profile));
    }
  }, [profile]);

  // Now, the conditional return for isLoading is AFTER all hook calls.
  console.log('UserProvider: Auth0 state before isLoading check - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);
  if (isLoading) {
    console.log("UserProvider: Auth0 is loading. Returning null to prevent further rendering until auth is resolved.");
    return null; 
  }

  // This calculation must also be after the isLoading check, or if profile might not be fully initialized.
  const isProfileComplete = profile.completedSetup;
  console.log('UserProvider: isProfileComplete calculated as:', isProfileComplete, 'based on profile.completedSetup:', profile.completedSetup);
  console.log('UserProvider: Rendering context with profile:', profile, 'isProfileComplete:', isProfileComplete);

  return (
    <UserContext.Provider value={{ 
      profile, 
      updateProfile, 
      isProfileComplete, 
      foodAnalysisHistory, 
      addFoodAnalysis,
      logoutUser,
      authIsLoading: isLoading, // This will be false here due to the check above
      authIsAuthenticated: isAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  );
};
