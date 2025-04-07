
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  apiKey: string | null;
  setApiKey: (key: string) => void;
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
  apiKey: null,
  setApiKey: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PCOSProfile>(() => {
    const savedProfile = localStorage.getItem('pcosProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const [foodAnalysisHistory, setFoodAnalysisHistory] = useState<FoodAnalysisItem[]>(() => {
    const saved = localStorage.getItem('foodAnalysisHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    return localStorage.getItem('fireworks_api_key');
  });

  const isProfileComplete = profile.completedSetup;

  const updateProfile = (data: Partial<PCOSProfile>) => {
    setProfile((prev) => {
      const updatedProfile = { ...prev, ...data };
      return updatedProfile;
    });
  };

  const addFoodAnalysis = (analysis: FoodAnalysisItem) => {
    setFoodAnalysisHistory(prev => {
      const updated = [analysis, ...prev];
      localStorage.setItem('foodAnalysisHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const setApiKey = (key: string) => {
    localStorage.setItem('fireworks_api_key', key);
    setApiKeyState(key);
  };

  useEffect(() => {
    localStorage.setItem('pcosProfile', JSON.stringify(profile));
  }, [profile]);

  return (
    <UserContext.Provider value={{ 
      profile, 
      updateProfile, 
      isProfileComplete, 
      foodAnalysisHistory, 
      addFoodAnalysis,
      apiKey,
      setApiKey
    }}>
      {children}
    </UserContext.Provider>
  );
};
