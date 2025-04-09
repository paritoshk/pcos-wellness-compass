
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Send, Camera, Trash2, X } from "lucide-react";
import { useUser, ChatMessage } from '@/contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ChatFoodAnalyzer from '@/components/ChatFoodAnalyzer';
import { FireworksAIService } from '@/services/fireworksAI';

// Using ChatMessage from UserContext instead of local interface

// Enhanced response generation based on user query and profile
const getDemoResponse = (message: string, profile: any): string => {
  const lowercaseMessage = message.toLowerCase();
  const userName = profile.name || 'there';
  const hasInsulinResistance = profile.insulinResistant === true;
  const weightGoal = profile.weightGoals || 'maintain';
  const symptoms = profile.symptoms || [];
  const dietaryPreferences = profile.dietaryPreferences || [];
  
  // Greeting patterns
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
    return `Hello ${userName}! I'm your PCOS Wellness assistant. How can I help you manage your PCOS today? You can ask me about diet recommendations, symptom management, exercise tips, or analyzing your food.`;
  }
  
  // Symptom management
  if (lowercaseMessage.includes('symptom') || lowercaseMessage.includes('symptoms') || lowercaseMessage.match(/manage (my )?pcos/i)) {
    if (symptoms.length > 0) {
      let symptomResponses = '';
      
      if (symptoms.includes('Irregular periods')) {
        symptomResponses += "• For irregular periods: Maintaining a consistent eating schedule, stress management, and certain supplements like inositol may help regulate your cycle.\n";
      }
      if (symptoms.includes('Acne')) {
        symptomResponses += "• For acne: Consider a low-glycemic diet, omega-3 supplements, and skincare products with ingredients like salicylic acid or benzoyl peroxide.\n";
      }
      if (symptoms.includes('Excess hair growth')) {
        symptomResponses += "• For excess hair growth: Managing insulin resistance and testosterone levels through diet and lifestyle can help reduce this over time.\n";
      }
      if (symptoms.includes('Hair loss/thinning')) {
        symptomResponses += "• For hair loss/thinning: Ensure adequate protein intake, consider supplements like vitamin D and iron (after testing), and manage stress levels.\n";
      }
      if (symptoms.includes('Weight gain')) {
        symptomResponses += "• For weight management: Focus on a balanced anti-inflammatory diet, regular exercise, and adequate sleep.\n";
      }
      if (symptoms.includes('Fatigue')) {
        symptomResponses += "• For fatigue: Check for vitamin deficiencies, particularly vitamin D, B12, and iron. Balanced blood sugar levels can also help maintain energy.\n";
      }
      if (symptoms.includes('Mood changes')) {
        symptomResponses += "• For mood changes: Regular exercise, omega-3 fatty acids, vitamin D, and stress management techniques like meditation can be helpful.\n";
      }
      if (symptoms.includes('Fertility issues')) {
        symptomResponses += "• For fertility concerns: Working with a reproductive endocrinologist alongside lifestyle modifications can improve ovulation and fertility.\n";
      }
      
      let response = "PCOS symptoms can vary widely from person to person. Based on your profile, you're experiencing " + symptoms.join(', ') + ". \n\nHere are some management strategies for your specific symptoms:\n\n" + symptomResponses + "\nWould you like more specific information about managing any particular symptom?";
      return response;
    } else {
      return "PCOS typically presents with symptoms like irregular periods, acne, excess hair growth, weight changes, and fatigue. Managing PCOS often involves a combination of:\n\n• Diet modifications: Focus on anti-inflammatory foods and balanced meals\n• Regular exercise: Both cardio and strength training\n• Stress management: Techniques like meditation and adequate sleep\n• Possible supplements: Based on your specific needs\n• Medical management: Working with healthcare providers\n\nWhich symptoms are you experiencing that you'd like help managing?";
    }
  }
  
  // Insulin resistance
  if (lowercaseMessage.includes('insulin') || lowercaseMessage.includes('resistance') || lowercaseMessage.includes('blood sugar')) {
    if (hasInsulinResistance) {
      return `Since you have insulin resistance, here are some evidence-based strategies that can help:

• Diet: Focus on a low-glycemic diet with complex carbohydrates paired with protein and healthy fats. Include foods like leafy greens, berries, nuts, seeds, and lean proteins.

• Meal timing: Consider eating smaller, more frequent meals to avoid blood sugar spikes and crashes.

• Exercise: Both cardio and strength training can improve insulin sensitivity. Even a 30-minute daily walk can make a significant difference.

• Supplements: Some research supports the use of inositol, chromium, and berberine for insulin resistance (consult with your healthcare provider).

• Sleep: Aim for 7-9 hours of quality sleep, as poor sleep can worsen insulin resistance.

• Stress management: Chronic stress can increase cortisol, which affects insulin sensitivity.

Would you like more specific guidance on any of these approaches?`;
    } else {
      return `While you haven't indicated insulin resistance in your profile, about 70-80% of women with PCOS have some degree of insulin resistance. 

Even without a diagnosis, following these principles can be beneficial:

• Balance your meals with protein, healthy fats, and complex carbohydrates
• Include fiber-rich foods to slow sugar absorption
• Stay physically active with both cardio and strength training
• Maintain consistent meal timing when possible
• Consider getting tested for insulin resistance if you experience symptoms like fatigue after meals, increased hunger, or difficulty losing weight

Would you like to learn more about how to eat to balance blood sugar?`;
    }
  }
  
  // Diet and nutrition
  if (lowercaseMessage.includes('diet') || lowercaseMessage.includes('eat') || lowercaseMessage.includes('food') || lowercaseMessage.includes('nutrition') || lowercaseMessage.includes('meal')) {
    let dietPrefix = '';
    if (dietaryPreferences.length > 0) {
      dietPrefix = "Based on your " + dietaryPreferences.join(', ') + " preferences, here are tailored PCOS-friendly dietary recommendations:\n\n";
    } else {
      dietPrefix = "Here are PCOS-friendly dietary recommendations:\n\n";
    }
    
    const weightGoalText = weightGoal === 'lose' 
      ? 'Since your goal is weight loss, focus on portion control and nutrient density while following these principles.' 
      : weightGoal === 'gain' 
        ? 'Since your goal is weight gain, focus on increasing portions of nutrient-dense foods while following these principles.' 
        : 'These principles support hormone balance and overall PCOS management.';
    
    const insulinText = hasInsulinResistance 
      ? 'With your insulin resistance, paying special attention to blood sugar balance is particularly important.' 
      : '';
    
    let response = dietPrefix;
    response += "• Prioritize anti-inflammatory foods: Berries, leafy greens, fatty fish, nuts, seeds, and olive oil\n\n";
    response += "• Balance your plate: Aim for 1/2 plate non-starchy vegetables, 1/4 plate protein, 1/4 plate complex carbs, plus healthy fats\n\n";
    response += "• Focus on fiber: Beans, lentils, vegetables, fruits with skin, and whole grains help balance blood sugar and improve gut health\n\n";
    response += "• Choose quality proteins: Eggs, fish, poultry, tofu, tempeh, and legumes support hormone production and satiety\n\n";
    response += "• Include healthy fats: Avocados, olive oil, nuts, seeds, and fatty fish support hormone production and reduce inflammation\n\n";
    response += "• Limit inflammatory foods: Processed foods, refined carbohydrates, added sugars, and industrial seed oils can worsen PCOS symptoms\n\n";
    response += weightGoalText + " " + insulinText + "\n\n";
    response += "Would you like some specific meal ideas or a sample meal plan?";
    return response;
  }
  
  // Exercise and physical activity
  if (lowercaseMessage.includes('exercise') || lowercaseMessage.includes('workout') || lowercaseMessage.includes('physical') || lowercaseMessage.includes('activity') || lowercaseMessage.includes('move')) {
    const exerciseForInsulin = hasInsulinResistance 
      ? 'Since you have insulin resistance, combining cardio with strength training can be particularly effective for improving insulin sensitivity.' 
      : '';
    
    const exerciseForWeight = weightGoal === 'lose' 
      ? 'For your weight loss goals, consistency is more important than intensity. Start with activities you enjoy and gradually increase duration and intensity.' 
      : '';
    
    let response = "Exercise is a powerful tool for managing PCOS. Here's an evidence-based approach:\n\n";
    response += "• Aim for 150 minutes of moderate activity per week (about 30 minutes, 5 days a week)\n\n";
    response += "• Include both cardio (walking, swimming, cycling, dancing) and strength training (bodyweight exercises, resistance bands, weights)\n\n";
    response += "• High-Intensity Interval Training (HIIT) can be particularly effective for PCOS - even just 10-20 minutes, 2-3 times per week\n\n";
    response += "• Mind-body exercises like yoga can help reduce stress and inflammation\n\n";
    response += "• Listen to your body and avoid overtraining, which can increase stress hormones\n\n";
    
    if (exerciseForInsulin) {
      response += exerciseForInsulin + " ";
    }
    
    if (exerciseForWeight) {
      response += exerciseForWeight;
    }
    
    response += "\n\nWhat type of exercise do you currently enjoy or would like to try?";
    return response;
  }
  
  // Stress management
  if (lowercaseMessage.includes('stress') || lowercaseMessage.includes('anxiety') || lowercaseMessage.includes('depress') || lowercaseMessage.includes('mood') || lowercaseMessage.includes('mental')) {
    return `Stress management is crucial for PCOS, as stress hormones can worsen insulin resistance and hormone imbalances. Here are evidence-based approaches:

• Mindfulness meditation: Even 5-10 minutes daily can reduce stress hormones

• Deep breathing: Try the 4-7-8 technique (inhale for 4, hold for 7, exhale for 8)

• Regular physical activity: Helps reduce stress and improves mood

• Adequate sleep: Aim for 7-9 hours of quality sleep

• Social connection: Spending time with supportive people reduces stress

• Limiting caffeine and alcohol: Both can increase anxiety and disrupt sleep

• Professional support: Consider working with a therapist who understands chronic health conditions

Which of these strategies would you like to explore further?`;
  }
  
  // Sleep
  if (lowercaseMessage.includes('sleep') || lowercaseMessage.includes('insomnia') || lowercaseMessage.includes('tired') || lowercaseMessage.includes('fatigue')) {
    return `Quality sleep is essential for PCOS management, as poor sleep can worsen insulin resistance and hormone imbalances. Here are evidence-based strategies:

• Consistent schedule: Go to bed and wake up at the same time daily

• Sleep environment: Keep your bedroom cool, dark, and quiet

• Screen time: Avoid screens 1-2 hours before bed (blue light blocks melatonin)

• Relaxation routine: Try gentle stretching, reading, or meditation before bed

• Limit caffeine: Avoid caffeine after noon

• Consider supplements: Magnesium, melatonin, or adaptogenic herbs may help (consult your healthcare provider)

• Rule out sleep apnea: Women with PCOS have higher rates of sleep apnea

Are you currently experiencing sleep difficulties?`;
  }
  
  // Supplements
  if (lowercaseMessage.includes('supplement') || lowercaseMessage.includes('vitamin') || lowercaseMessage.includes('mineral') || lowercaseMessage.includes('inositol')) {
    return `Several supplements have research supporting their use in PCOS management. Always consult with your healthcare provider before starting supplements, especially if you're taking medications.

• Inositol: Particularly myo-inositol and D-chiro-inositol in a 40:1 ratio, may improve insulin sensitivity, ovulation, and egg quality

• Vitamin D: Many women with PCOS are deficient; supplementation may improve insulin sensitivity and hormone balance

• Omega-3 fatty acids: May reduce inflammation and improve hormone sensitivity

• Magnesium: Can help with insulin resistance, PMS symptoms, and sleep

• N-Acetyl Cysteine (NAC): May improve insulin sensitivity and reduce inflammation

• Zinc: May help with hair loss, acne, and hirsutism

• Berberine: Similar effects to metformin for insulin resistance (don't combine with metformin)

Would you like more information about any specific supplement?`;
  }
  
  // Fertility and pregnancy
  if (lowercaseMessage.includes('pregnan') || lowercaseMessage.includes('fertil') || lowercaseMessage.includes('conceive') || lowercaseMessage.includes('baby') || lowercaseMessage.includes('ovulat')) {
    return `PCOS is a common cause of infertility, but many women with PCOS can conceive with the right support. Here are evidence-based approaches:

• Lifestyle modifications: Diet changes, regular exercise, and weight management (if needed) can improve ovulation

• Track your cycle: Apps, basal body temperature, or ovulation predictor kits can help identify fertile windows

• Supplements: Inositol, NAC, and certain vitamins may support ovulation and egg quality

• Medical support: Working with a reproductive endocrinologist who specializes in PCOS

• Medications: Letrozole, Clomid, or metformin may be prescribed to induce ovulation

• Advanced treatments: IUI or IVF if other methods aren't successful

Would you like more specific information about any of these approaches?`;
  }
  
  // Default response
  return `I'm your PCOS Wellness assistant, here to provide evidence-based guidance for managing your condition. I can help with:

• Diet and nutrition recommendations
• Exercise and physical activity guidance
• Symptom management strategies
• Stress reduction techniques
• Sleep optimization
• Supplement information
• Fertility support
• Food analysis and meal planning

What specific aspect of PCOS management would you like to explore today?`;
};

const getFoodAnalysisResponse = (foodAnalysis: any): string => {
  const compatibilityLevel = foodAnalysis.pcosCompatibility > 70 ? "good" : 
                            foodAnalysis.pcosCompatibility > 50 ? "moderate" : "poor";
  
  let response = "I've analyzed your " + foodAnalysis.foodName + ". It has " + compatibilityLevel + " compatibility (" + 
                foodAnalysis.pcosCompatibility + "%) with your PCOS management plan.\n\n";
  
  response += "Nutritional breakdown: " + foodAnalysis.nutritionalInfo.carbs + "g carbs, " + 
             foodAnalysis.nutritionalInfo.protein + "g protein, " + foodAnalysis.nutritionalInfo.fats + "g fats. " + 
             "It has a " + foodAnalysis.nutritionalInfo.glycemicLoad.toLowerCase() + " glycemic load and is " + 
             foodAnalysis.nutritionalInfo.inflammatoryScore.toLowerCase() + " in terms of inflammation.\n\n";
  
  // Add PCOS-specific insights
  response += "PCOS Impact: ";
  if (foodAnalysis.nutritionalInfo.glycemicLoad.toLowerCase() === "high") {
    response += "This food has a high glycemic load which may cause blood sugar spikes. For PCOS management, " + 
               "it's generally better to choose foods with a lower glycemic load to help manage insulin levels.\n";
  } else if (foodAnalysis.nutritionalInfo.glycemicLoad.toLowerCase() === "medium") {
    response += "This food has a moderate glycemic load. Pairing it with protein or healthy fats can help " + 
               "slow down digestion and reduce blood sugar impact.\n";
  } else {
    response += "This food has a low glycemic load, which is ideal for PCOS management as it helps " + 
               "maintain stable blood sugar levels.\n";
  }
  
  if (foodAnalysis.nutritionalInfo.inflammatoryScore.toLowerCase() === "high") {
    response += "The high inflammatory score may worsen PCOS symptoms like acne and irregular cycles. " + 
               "Consider anti-inflammatory alternatives when possible.\n";
  } else if (foodAnalysis.nutritionalInfo.inflammatoryScore.toLowerCase() === "low") {
    response += "The low inflammatory score is beneficial for PCOS as it may help reduce symptoms " + 
               "and improve hormone balance.\n";
  }
  
  response += "\n" + foodAnalysis.recommendation + "\n\n";
  
  if (foodAnalysis.pcosCompatibility < 80 && foodAnalysis.alternatives && foodAnalysis.alternatives.length > 0) {
    response += "Here are some better alternatives you might consider:\n";
    foodAnalysis.alternatives.forEach((alt: string) => {
      response += "• " + alt + "\n";
    });
  }
  
  return response;
};

const ChatInterface: React.FC = () => {
  const { profile, chatHistory, addChatMessage, clearChatHistory, apiKey } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  // Initialize messages from chat history or add greeting message if empty
  useEffect(() => {
    if (chatHistory.length > 0) {
      // Use chat history from UserContext
      setMessages(chatHistory);
    } else if (messages.length === 0) {
      // Add initial greeting message with user's name
      const greeting: ChatMessage = {
        id: 'greeting-' + Date.now(),
        role: 'assistant',
        content: `Hi ${profile.name || 'there'}! I'm your PCOS Wellness assistant. How can I help you today? You can analyze your food by clicking the camera button.`,
        timestamp: new Date()
      };
      setMessages([greeting]);
      addChatMessage(greeting);
    }
    
    // Check if we have food analysis from navigation
    if (location.state?.foodAnalysis) {
      const foodAnalysis = location.state.foodAnalysis;
      
      // Add a system message about the food analysis
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `I want to share the analysis of my ${foodAnalysis.foodName} with you.`,
        timestamp: new Date(),
        type: 'food-analysis',
        foodAnalysis: foodAnalysis
      };
      
      setMessages(prev => [...prev, userMessage]);
      addChatMessage(userMessage);
      
      // Get AI response
      setIsTyping(true);
      
      // Use an async function inside the effect
      const getAIResponse = async () => {
        try {
          const fireworksService = new FireworksAIService({ apiKey });
          
          // Create a detailed message about the food analysis
          const detailedMessage = `I've analyzed my ${foodAnalysis.foodName}. 

PCOS Compatibility: ${foodAnalysis.pcosCompatibility}/100
Nutritional Info: Carbs ${foodAnalysis.nutritionalInfo.carbs}g, Protein ${foodAnalysis.nutritionalInfo.protein}g, Fats ${foodAnalysis.nutritionalInfo.fats}g
Glycemic Load: ${foodAnalysis.nutritionalInfo.glycemicLoad}
Inflammatory Score: ${foodAnalysis.nutritionalInfo.inflammatoryScore}

Can you give me advice about this food for my PCOS?`;
          
          // Get real LLM response
          const response = await fireworksService.sendChatMessage(detailedMessage, profile);
          
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          addChatMessage(assistantMessage);
        } catch (error) {
          console.error('Error getting LLM response for food analysis:', error);
          // Fallback to demo response in case of error
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: getFoodAnalysisResponse(foodAnalysis),
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          addChatMessage(assistantMessage);
        } finally {
          setIsTyping(false);
        }
      };
      
      getAIResponse();
      
      // Clear the state so it doesn't reappear on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, messages.length, profile.name]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    // Add user message with unique ID using timestamp + random string
    const userMessage: ChatMessage = {
      id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    addChatMessage(userMessage);
    setCurrentMessage('');
    setIsTyping(true);
    
    try {
      // Use the apiKey from the context that was already destructured at the component level
      console.log('Using API key in chat:', apiKey);
      const fireworksService = new FireworksAIService({ apiKey });
      
      // Get real LLM response
      const response = await fireworksService.sendChatMessage(userMessage.content, profile);
      
      const assistantMessage: ChatMessage = {
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      addChatMessage(assistantMessage);
    } catch (error) {
      console.error('Error getting LLM response:', error);
      // Fallback to demo response in case of error
      const assistantMessage: ChatMessage = {
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: getDemoResponse(userMessage.content, profile),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      addChatMessage(assistantMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFoodAnalysis = async (foodAnalysis: any) => {
    // Hide the food analyzer
    setShowFoodAnalyzer(false);
    
    // Add a user message with food analysis and unique ID
    const userMessage: ChatMessage = {
      id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: `I've analyzed my ${foodAnalysis.foodName}.`,
      timestamp: new Date(),
      type: 'food-analysis',
      foodAnalysis: foodAnalysis
    };
    
    setMessages(prev => [...prev, userMessage]);
    addChatMessage(userMessage);
    
    // Get AI response
    setIsTyping(true);
    
    try {
      const fireworksService = new FireworksAIService({ apiKey });
      
      // Create a detailed message about the food analysis
      const detailedMessage = `I've analyzed my ${foodAnalysis.foodName}. 

PCOS Compatibility: ${foodAnalysis.pcosCompatibility}/100
Nutritional Info: Carbs ${foodAnalysis.nutritionalInfo.carbs}g, Protein ${foodAnalysis.nutritionalInfo.protein}g, Fats ${foodAnalysis.nutritionalInfo.fats}g
Glycemic Load: ${foodAnalysis.nutritionalInfo.glycemicLoad}
Inflammatory Score: ${foodAnalysis.nutritionalInfo.inflammatoryScore}

Can you give me advice about this food for my PCOS?`;
      
      // Get real LLM response
      const response = await fireworksService.sendChatMessage(detailedMessage, profile);
      
      const assistantMessage: ChatMessage = {
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      addChatMessage(assistantMessage);
    } catch (error) {
      console.error('Error getting LLM response for food analysis:', error);
      // Fallback to demo response in case of error
      const assistantMessage: ChatMessage = {
        id: Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: getFoodAnalysisResponse(foodAnalysis),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      addChatMessage(assistantMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const renderFoodAnalysisMessage = (message: ChatMessage) => {
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-pcos">PCOS Wellness Assistant</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearChatHistory();
            setMessages([]);
            // Add initial greeting after clearing
            setTimeout(() => {
              const greeting: ChatMessage = {
                id: 'greeting-' + Date.now(),
                role: 'assistant',
                content: `Hi ${profile.name || 'there'}! I'm your PCOS Wellness assistant. How can I help you today?`,
                timestamp: new Date()
              };
              setMessages([greeting]);
              addChatMessage(greeting);
            }, 100);
          }}
          className="text-xs border-pcos text-pcos hover:bg-pcos/10"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear Chat
        </Button>
      </div>
      
      {showFoodAnalyzer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowFoodAnalyzer(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <ChatFoodAnalyzer onAnalysisComplete={handleFoodAnalysis} />
          </div>
        </div>
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
