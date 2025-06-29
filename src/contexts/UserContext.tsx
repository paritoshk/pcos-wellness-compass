import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export interface PCOSProfile {
  name: string;
  age: number | null;
  periodRegularity: 'regular' | 'irregular' | 'absent' | null;
  primaryGoal: string | null;
  weightManagementGoal: 'lose' | 'gain' | 'maintain' | 'not_focused' | null;
  pcosProbability: 'low' | 'medium' | 'high' | null;
  symptoms: string[];
  insulinResistant: boolean | null;
  dietaryPreferences: string[];
  completedQuiz: boolean;
  hasBeenDiagnosed: 'yes' | 'no' | null;
  height: {
    feet: number | null;
    inches: number | null;
  };
  weight: number | null;
  completedExtendedQuiz: boolean;
  // AI-Engineered Features
  PCOS_Phenotype?: 'Insulin-Resistant' | 'Inflammatory' | 'Adrenal' | 'Hidden-Cause' | null;
  MetabolicRiskScore?: number | null; // e.g., 1-10
  HormonalImbalanceIndicators?: string[];
  PersonalizedFocusAreas?: string[];
  // Extended Quiz Data
  diagnosedConditions?: string[];
  familyHistory?: string[];
  medications?: string[];
  stressLevel?: 'low' | 'moderate' | 'high' | null;
  isTryingToConceive?: 'yes' | 'no' | 'not_sure' | null;
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

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  foodAnalysis?: FoodAnalysisItem;
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
  periodRegularity: null,
  primaryGoal: null,
  weightManagementGoal: null,
  pcosProbability: null,
  symptoms: [],
  insulinResistant: null,
  dietaryPreferences: [],
  completedQuiz: false,
  hasBeenDiagnosed: null,
  height: { feet: null, inches: null },
  weight: null,
  completedExtendedQuiz: false,
  PCOS_Phenotype: null,
  MetabolicRiskScore: null,
  HormonalImbalanceIndicators: [],
  PersonalizedFocusAreas: [],
  diagnosedConditions: [],
  familyHistory: [],
  medications: [],
  stressLevel: null,
  isTryingToConceive: null,
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
  const { user, isAuthenticated, isLoading, logout: auth0Logout } = useAuth0();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<PCOSProfile>(() => {
    const savedProfile = localStorage.getItem('pcosProfile');
    return savedProfile ? JSON.parse(savedProfile) : { ...defaultProfile };
  });

  const [foodAnalysisHistory, setFoodAnalysisHistory] = useState<FoodAnalysisItem[]>(() => {
    const saved = localStorage.getItem('foodAnalysisHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const updateProfile = useCallback((data: Partial<PCOSProfile>) => {
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
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  }, [auth0Logout]);

  useEffect(() => {
    if (isAuthenticated && user && !profile.name) {
      updateProfile({ name: user.name || user.nickname || 'Wellness Warrior' });
    }
  }, [isAuthenticated, user, profile.name, updateProfile]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setProfile(defaultProfile);
      setFoodAnalysisHistory([]);
      localStorage.removeItem('pcosProfile');
      localStorage.removeItem('foodAnalysisHistory');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return null; 
  }

  const isProfileComplete = profile.completedQuiz;

  return (
    <UserContext.Provider value={{ 
      profile, 
      updateProfile, 
      isProfileComplete, 
      foodAnalysisHistory, 
      addFoodAnalysis,
      logoutUser,
      authIsLoading: isLoading,
      authIsAuthenticated: isAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  );
};
