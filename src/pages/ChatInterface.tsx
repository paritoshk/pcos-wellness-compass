import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Send, Camera } from "lucide-react";
import { useUser, PCOSProfile, FoodAnalysisItem } from '@/contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ChatFoodAnalyzer from '@/components/ChatFoodAnalyzer';
import { FireworksAIService } from '@/services/fireworksAI';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'food-analysis';
  foodAnalysis?: FoodAnalysisItem;
}

const getFoodAnalysisResponse = (foodAnalysis: FoodAnalysisItem): string => {
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

const CHAT_MESSAGES_STORAGE_KEY = 'pcosChatMessages';

interface StoredMessage extends Omit<Message, 'timestamp'> {
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
    if (savedMessages) {
      return JSON.parse(savedMessages).map((msg: StoredMessage) => ({...msg, timestamp: new Date(msg.timestamp)}));
    }
    return [];
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFoodAnalyzer, setShowFoodAnalyzer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();
  const fireworksAIService = useRef(new FireworksAIService()).current;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
        localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } else {
        localStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && profile.name) {
      const initialGreeting: Message = {
          id: '1',
          role: 'assistant',
          content: `Hi ${profile.name}! I'm Ama, your PCOS Wellness assistant. How can I help you today? You can analyze your food by clicking the camera button.`,
          timestamp: new Date()
        };
      setMessages([initialGreeting]);
    }

    const foodAnalysisFromState = location.state?.foodAnalysis as FoodAnalysisItem | undefined;
    if (foodAnalysisFromState) {
      const foodAnalysis = foodAnalysisFromState;
      const userFoodMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `I want to share the analysis of my ${foodAnalysis.foodName} with you.`,
        timestamp: new Date(),
        type: 'food-analysis',
        foodAnalysis: foodAnalysis
      };
      setMessages(prev => [...prev, userFoodMessage]); 
      setIsTyping(true);
      setTimeout(() => {
        const assistantFoodMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getFoodAnalysisResponse(foodAnalysis),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantFoodMessage]);
        setIsTyping(false);
      }, 1500);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.foodAnalysis, profile.name, messages.length, location.state]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    const newMessagesState = [...messages, userMessage];
    setMessages(newMessagesState);
    setCurrentMessage('');
    setIsTyping(true);

    const conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = newMessagesState
      .filter(msg => msg.role === 'user' || msg.role === 'assistant') 
      .map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));

    const aiResponseContent = await fireworksAIService.getChatResponse(conversationHistory, profile as PCOSProfile);

    if (aiResponseContent) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } else {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having a little trouble thinking right now. Could you try asking again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFoodAnalysis = (foodAnalysis: FoodAnalysisItem) => {
    setShowFoodAnalyzer(false);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `I've analyzed my ${foodAnalysis.foodName}.`,
      timestamp: new Date(),
      type: 'food-analysis',
      foodAnalysis: foodAnalysis
    };
    
    setMessages(prev => [...prev, userMessage]);
    
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
                  ? 'bg-nari-primary text-white'
                  : 'bg-white text-nari-text-main'
              }`}
            >
              <CardContent className="p-3">
                {message.type === 'food-analysis' && renderFoodAnalysisMessage(message)}
                <p className={`whitespace-pre-wrap ${
                  message.role === 'assistant' ? 'text-nari-text-main' : ''
                }`}>{message.content}</p>
                <div 
                  className={`text-xs mt-1 ${ 
                    message.role === 'user' 
                      ? 'text-white/70' 
                      : 'text-nari-text-muted'
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
                  <div className="w-2 h-2 rounded-full bg-nari-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-nari-primary animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-nari-primary animate-pulse delay-200"></div>
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
          className="bg-white border-nari-accent text-nari-accent hover:bg-nari-accent/10"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 pcos-input-focus bg-white text-nari-text-main placeholder:text-nari-text-muted/70 border-nari-accent/50"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!currentMessage.trim() || isTyping}
          className="bg-nari-primary hover:bg-nari-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
