
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

interface UserContextType {
  profile: PCOSProfile;
  updateProfile: (data: Partial<PCOSProfile>) => void;
  isProfileComplete: boolean;
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
  isProfileComplete: false
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PCOSProfile>(() => {
    const savedProfile = localStorage.getItem('pcosProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const isProfileComplete = profile.completedSetup;

  const updateProfile = (data: Partial<PCOSProfile>) => {
    setProfile((prev) => {
      const updatedProfile = { ...prev, ...data };
      return updatedProfile;
    });
  };

  useEffect(() => {
    localStorage.setItem('pcosProfile', JSON.stringify(profile));
  }, [profile]);

  return (
    <UserContext.Provider value={{ profile, updateProfile, isProfileComplete }}>
      {children}
    </UserContext.Provider>
  );
};
