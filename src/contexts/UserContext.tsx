
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

export interface UserAuth {
  username: string;
  password: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'food-analysis';
  foodAnalysis?: FoodAnalysisItem;
}

interface UserContextType {
  profile: PCOSProfile;
  updateProfile: (data: Partial<PCOSProfile>) => void;
  isProfileComplete: boolean;
  foodAnalysisHistory: FoodAnalysisItem[];
  addFoodAnalysis: (analysis: FoodAnalysisItem) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  userAuth: UserAuth | null;
  setUserAuth: (auth: UserAuth) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
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
  apiKey: '',
  setApiKey: () => {},
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  userAuth: null,
  setUserAuth: () => {},
  chatHistory: [],
  addChatMessage: () => {},
  clearChatHistory: () => {}
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

  const [apiKey, setApiKey] = useState<string>(() => {
    const savedApiKey = localStorage.getItem('fireworksApiKey');
    // Use the environment variable with VITE_ prefix
    const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    console.log('API Key from env:', envApiKey);
    return savedApiKey || envApiKey || '';
  });

  // Add state for manual authentication
  const [userAuth, setUserAuth] = useState<UserAuth | null>(() => {
    const savedAuth = localStorage.getItem('userAuth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  // Load chat history from localStorage
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      // Parse the saved chat history and convert string timestamps back to Date objects
      const parsedHistory = JSON.parse(saved);
      return parsedHistory.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));
    }
    return [];
  });

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('fireworksApiKey', apiKey);
    }
  }, [apiKey]);

  const isProfileComplete = profile.completedSetup;

  const updateProfile = (data: Partial<PCOSProfile>) => {
    setProfile((prev) => {
      const updatedProfile = { ...prev, ...data };
      return updatedProfile;
    });
  };

  const addFoodAnalysis = (analysis: FoodAnalysisItem) => {
    // Ensure the analysis has all required fields
    const validAnalysis: FoodAnalysisItem = {
      id: analysis.id || Date.now().toString(),
      date: analysis.date || new Date().toISOString(),
      foodName: analysis.foodName || 'Unknown Food',
      imageUrl: analysis.imageUrl || '',
      pcosCompatibility: analysis.pcosCompatibility || 0,
      nutritionalInfo: {
        carbs: analysis.nutritionalInfo?.carbs || 0,
        protein: analysis.nutritionalInfo?.protein || 0,
        fats: analysis.nutritionalInfo?.fats || 0,
        glycemicLoad: analysis.nutritionalInfo?.glycemicLoad || 'Unknown',
        inflammatoryScore: analysis.nutritionalInfo?.inflammatoryScore || 'Unknown'
      },
      recommendation: analysis.recommendation || '',
      alternatives: Array.isArray(analysis.alternatives) ? analysis.alternatives : []
    };
    
    // Add to history and save to localStorage
    setFoodAnalysisHistory(prev => {
      // Check if this analysis already exists in history
      const exists = prev.some(item => item.id === validAnalysis.id);
      
      // If it exists, update it; otherwise add it to the beginning
      const updated = exists 
        ? prev.map(item => item.id === validAnalysis.id ? validAnalysis : item)
        : [validAnalysis, ...prev];
      
      console.log('Saving food analysis to history:', validAnalysis);
      localStorage.setItem('foodAnalysisHistory', JSON.stringify(updated));
      return updated;
    });
  };

  // Save user auth to localStorage
  useEffect(() => {
    if (userAuth) {
      localStorage.setItem('userAuth', JSON.stringify(userAuth));
    }
  }, [userAuth]);

  // Save authentication state to localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  // Save chat history to localStorage
  useEffect(() => {
    // Limit chat history to 100 messages to prevent localStorage from getting too large
    // Make sure we keep the most recent messages
    const limitedHistory = chatHistory.slice(-100);
    localStorage.setItem('chatHistory', JSON.stringify(limitedHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('pcosProfile', JSON.stringify(profile));
  }, [profile]);

  // Login function for manual authentication
  const login = (username: string, password: string): boolean => {
    // Simple authentication for demo purposes
    if (username && password) {
      setUserAuth({ username, password });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // Add chat message function
  const addChatMessage = (message: ChatMessage) => {
    // Ensure the message has all required fields
    const validMessage: ChatMessage = {
      id: message.id || Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      role: message.role || 'user',
      content: message.content || '',
      timestamp: message.timestamp || new Date(),
      type: message.type || 'text',
      foodAnalysis: message.foodAnalysis
    };
    
    console.log('Adding chat message to history:', validMessage);
    setChatHistory(prev => [...prev, validMessage]);
  };

  // Clear chat history function
  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <UserContext.Provider value={{ 
      profile, 
      updateProfile, 
      isProfileComplete, 
      foodAnalysisHistory, 
      addFoodAnalysis,
      apiKey,
      setApiKey,
      isAuthenticated,
      login,
      logout,
      userAuth,
      setUserAuth,
      chatHistory,
      addChatMessage,
      clearChatHistory
    }}>
      {children}
    </UserContext.Provider>
  );
};
