
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

const ChatInterface: React.FC = () => {
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hi ${profile.name}! I'm your PCOS Wellness assistant. How can I help you today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length, profile.name]);

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

  return (
    <div className="flex flex-col h-full p-4">
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
