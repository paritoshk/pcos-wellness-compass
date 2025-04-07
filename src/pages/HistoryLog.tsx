
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageCircle, Camera, Calendar, ChevronDown, ChevronUp } from "lucide-react";

// Mock data for demonstration
const mockChatHistory = [
  {
    id: '1',
    date: '2025-04-07T14:30:00',
    topic: 'Diet Recommendations',
    preview: 'What foods should I avoid with PCOS?',
    messages: [
      { role: 'user', content: 'What foods should I avoid with PCOS?' },
      { role: 'assistant', content: 'With PCOS, it\'s generally recommended to limit foods that can spike insulin levels or promote inflammation. This includes refined carbohydrates, sugary foods and beverages, processed foods high in trans fats, and for some people, dairy products. Everyone\'s body responds differently though, so it\'s important to pay attention to how different foods affect your symptoms.' }
    ]
  },
  {
    id: '2',
    date: '2025-04-05T11:15:00',
    topic: 'Exercise Advice',
    preview: 'What type of exercise is best for PCOS?',
    messages: [
      { role: 'user', content: 'What type of exercise is best for PCOS?' },
      { role: 'assistant', content: 'For PCOS, a combination of both cardio and strength training is generally most effective. Strength training helps build muscle, which improves insulin sensitivity, while moderate cardio helps with weight management and stress reduction. Activities like HIIT (High-Intensity Interval Training) can be particularly beneficial as they improve insulin sensitivity. Aim for about 150 minutes of moderate exercise each week, spread across several days.' }
    ]
  }
];

const mockFoodAnalyses = [
  {
    id: '1',
    date: '2025-04-06T19:20:00',
    foodName: 'Greek Salad with Feta',
    imageUrl: '/placeholder.svg',
    pcosCompatibility: 85,
    note: 'Lunch at Mediterranean restaurant'
  },
  {
    id: '2',
    date: '2025-04-06T08:45:00',
    foodName: 'Blueberry Oatmeal',
    imageUrl: '/placeholder.svg',
    pcosCompatibility: 78,
    note: 'Breakfast'
  },
  {
    id: '3',
    date: '2025-04-05T13:10:00',
    foodName: 'Chicken Caesar Wrap',
    imageUrl: '/placeholder.svg',
    pcosCompatibility: 65,
    note: 'Lunch on the go'
  }
];

interface HistoryItemProps {
  date: string;
  children: React.ReactNode;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ date, children }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  
  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium">{formattedDate}</div>
            <div className="text-xs text-muted-foreground">{formattedTime}</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && <CardContent className="py-3 px-4">{children}</CardContent>}
    </Card>
  );
};

const HistoryLog: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">History Log</h1>
      
      <Tabs defaultValue="chats" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chats</span>
          </TabsTrigger>
          <TabsTrigger value="analyses" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Food Analyses</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats">
          {mockChatHistory.length > 0 ? (
            <div className="space-y-4">
              {mockChatHistory.map(chat => (
                <HistoryItem key={chat.id} date={chat.date}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{chat.topic}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {chat.messages.map((message, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">
                            {message.role === 'user' ? 'You' : 'Assistant'}:
                          </div>
                          <div className="text-muted-foreground">
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-pcos text-pcos hover:bg-pcos/10"
                      >
                        Continue Chat
                      </Button>
                    </div>
                  </div>
                </HistoryItem>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No chat history yet</p>
                <Button 
                  className="mt-4 bg-pcos hover:bg-pcos-dark"
                  onClick={() => window.location.href = '/chat'}
                >
                  Start a Chat
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analyses">
          {mockFoodAnalyses.length > 0 ? (
            <div className="space-y-4">
              {mockFoodAnalyses.map(analysis => (
                <HistoryItem key={analysis.id} date={analysis.date}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={analysis.imageUrl} 
                        alt={analysis.foodName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{analysis.foodName}</h3>
                      <p className="text-sm text-muted-foreground">{analysis.note}</p>
                      
                      <div className="mt-2 flex items-center">
                        <div className="text-sm mr-2">PCOS Compatibility:</div>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              analysis.pcosCompatibility > 70 ? "bg-green-500" : 
                              analysis.pcosCompatibility > 40 ? "bg-yellow-500" : 
                              "bg-red-500"
                            }`}
                            style={{ width: `${analysis.pcosCompatibility}%` }}
                          ></div>
                        </div>
                        <div className="text-sm ml-2 font-semibold">
                          {analysis.pcosCompatibility}%
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-pcos text-pcos hover:bg-pcos/10"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </HistoryItem>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No food analyses yet</p>
                <Button 
                  className="mt-4 bg-pcos hover:bg-pcos-dark"
                  onClick={() => window.location.href = '/analyze'}
                >
                  Analyze Food
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryLog;
