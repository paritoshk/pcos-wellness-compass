
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Send, Camera } from "lucide-react";
import { useUser } from '@/contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ChatFoodAnalyzer from '@/components/ChatFoodAnalyzer';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'food-analysis';
  foodAnalysis?: any;
}

// Hardcoded demo responses for now
const getDemoResponse = (message: string, profile: any): string => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
    return `Hello ${profile.name}! How can I help you manage your PCOS today?`;
  }
  
  if (lowercaseMessage.includes('symptom') || lowercaseMessage.includes('symptoms')) {
    return 'PCOS symptoms can vary widely, but often include irregular periods, acne, excess hair growth, weight gain, and mood changes. Based on your profile, you mentioned experiencing ' + (profile.symptoms.join(', ')) + '. Would you like to learn about managing any of these specific symptoms?';
  }
  
  if (lowercaseMessage.includes('insulin') || lowercaseMessage.includes('resistance')) {
    return (profile.insulinResistant 
      ? 'Since you have insulin resistance, focusing on a low-glycemic diet can be helpful. This includes eating whole foods, good sources of protein, healthy fats, and complex carbohydrates. Regular physical activity is also important for improving insulin sensitivity.'
      : 'While you don\'t have confirmed insulin resistance, it\'s still beneficial to follow a balanced diet with steady blood sugar levels. This can help prevent developing insulin resistance in the future, which is common with PCOS.');
  }
  
  if (lowercaseMessage.includes('diet') || lowercaseMessage.includes('eat') || lowercaseMessage.includes('food')) {
    const dietaryPreferences = profile.dietaryPreferences.length > 0 
      ? `Based on your ${profile.dietaryPreferences.join(', ')} preferences, ` 
      : '';
    
    return `${dietaryPreferences}a PCOS-friendly diet typically includes anti-inflammatory foods, plenty of fiber, lean proteins, and healthy fats. It's generally advised to limit processed foods, refined carbohydrates, and added sugars. Would you like specific meal ideas?`;
  }
  
  if (lowercaseMessage.includes('exercise') || lowercaseMessage.includes('workout')) {
    return 'For PCOS, a combination of cardio and strength training is often recommended. Aim for 150 minutes of moderate exercise per week. Activities like walking, swimming, cycling, and yoga can be particularly beneficial. The key is finding something you enjoy and can maintain consistently.';
  }
  
  return "I'm your PCOS Wellness assistant. I can help with questions about managing symptoms, diet recommendations, exercise guidance, and understanding your condition better. How can I support you today?";
};

const getFoodAnalysisResponse = (foodAnalysis: any): string => {
  const compatibilityLevel = foodAnalysis.pcosCompatibility > 70 ? "good" : 
                            foodAnalysis.pcosCompatibility > 50 ? "moderate" : "poor";
  
  const baseResponse = `I've analyzed your ${foodAnalysis.foodName}. It has ${compatibilityLevel} compatibility (${foodAnalysis.pcosCompatibility}%) with your PCOS management plan.\n\n`;
  
  const nutritionInfo = `Nutritional breakdown: ${foodAnalysis.nutritionalInfo.carbs}g carbs, ${foodAnalysis.nutritionalInfo.protein}g protein, ${foodAnalysis.nutritionalInfo.fats}g fats. It has a ${foodAnalysis.nutritionalInfo.glycemicLoad.toLowerCase()} glycemic load and is ${foodAnalysis.nutritionalInfo.inflammatoryScore.toLowerCase()} in terms of inflammation.\n\n`;
  
  const recommendation = `${foodAnalysis.recommendation}\n\n`;
  
  let alternativesText = "";
  if (foodAnalysis.pcosCompatibility < 80 && foodAnalysis.alternatives && foodAnalysis.alternatives.length > 0) {
    alternativesText = `Here are some better alternatives you might consider:\n` + 
      foodAnalysis.alternatives.map((alt: string) => `• ${alt}`).join('\n');
  }
  
  return baseResponse + nutritionInfo + recommendation + alternativesText;
};

const ChatInterface: React.FC = () => {
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFoodAnalyzer, setShowFoodAnalyzer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial greeting message and handle food analysis from navigation
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hi ${profile.name}! I'm your PCOS Wellness assistant. How can I help you today? You can analyze your food by clicking the camera button.`,
          timestamp: new Date()
        }
      ]);
    }
    
    // Check if we have food analysis from navigation
    if (location.state?.foodAnalysis) {
      const foodAnalysis = location.state.foodAnalysis;
      
      // Add a system message about the food analysis
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `I want to share the analysis of my ${foodAnalysis.foodName} with you.`,
        timestamp: new Date(),
        type: 'food-analysis',
        foodAnalysis: foodAnalysis
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate AI response with delay
      setIsTyping(true);
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getFoodAnalysisResponse(foodAnalysis),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
      
      // Clear the state so it doesn't reappear on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, messages.length, profile.name]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    // Simulate AI response with delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getDemoResponse(userMessage.content, profile),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFoodAnalysis = (foodAnalysis: any) => {
    // Hide the food analyzer
    setShowFoodAnalyzer(false);
    
    // Add a user message with food analysis
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `I've analyzed my ${foodAnalysis.foodName}.`,
      timestamp: new Date(),
      type: 'food-analysis',
      foodAnalysis: foodAnalysis
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response with delay
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFoodAnalysisResponse(foodAnalysis),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const renderFoodAnalysisMessage = (message: Message) => {
    if (!message.foodAnalysis) return null;
    
    const foodAnalysis = message.foodAnalysis;
    
    return (
      <div className="mb-2 mt-1">
        <div className="flex gap-3">
          {foodAnalysis.imageUrl && (
            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={foodAnalysis.imageUrl} 
                alt={foodAnalysis.foodName} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="space-y-2">
            <div className="font-medium">{foodAnalysis.foodName}</div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span>PCOS Compatibility: {foodAnalysis.pcosCompatibility}%</span>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      foodAnalysis.pcosCompatibility > 70 ? "bg-green-500" : 
                      foodAnalysis.pcosCompatibility > 40 ? "bg-yellow-500" : 
                      "bg-red-500"
                    }`}
                    style={{ width: `${foodAnalysis.pcosCompatibility}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full p-4">
      {showFoodAnalyzer && (
        <ChatFoodAnalyzer onAnalysisComplete={handleFoodAnalysis} />
      )}
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card 
              className={`max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-pcos text-white' 
                  : 'bg-muted'
              }`}
            >
              <CardContent className="p-3">
                {message.type === 'food-analysis' && renderFoodAnalysisMessage(message)}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div 
                  className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-white/70' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <Card className="bg-muted max-w-[80%]">
              <CardContent className="p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-pcos animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-pcos animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-pcos animate-pulse delay-200"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2 sticky bottom-0">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => setShowFoodAnalyzer(!showFoodAnalyzer)}
          className="bg-white border-pcos text-pcos hover:bg-pcos/10"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 pcos-input-focus"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!currentMessage.trim() || isTyping}
          className="bg-pcos hover:bg-pcos-dark"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
