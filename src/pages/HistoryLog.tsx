import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageCircle, Camera, ChevronDown, ChevronUp, Edit3 } from "lucide-react";
import { useUser, FoodAnalysisItem } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

// Get real chat history from localStorage
const getChatHistory = () => {
  try {
    const stored = localStorage.getItem('nari-chat-messages');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

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
  const { foodAnalysisHistory } = useUser();
  const navigate = useNavigate();
  const chatHistory = getChatHistory();

  const handleShareInChat = (analysis: FoodAnalysisItem) => {
    navigate('/chat', { 
      state: { 
        foodAnalysis: analysis
      }
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-poppins font-semibold text-foreground mb-2">Your Wellness History</h1>
        <p className="text-muted-foreground">Track your food analyses and chat conversations</p>
      </div>
      
      <Tabs defaultValue="analyses" className="w-full">
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
          {chatHistory.length > 0 ? (
            <div className="space-y-4">
              {chatHistory.map((message: any, index: number) => (
                <HistoryItem key={index} date={message.timestamp}>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <div className="font-medium">
                        {message.role === 'user' ? 'You' : 'Nari'}:
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {message.content}
                      </div>
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
                  onClick={() => navigate('/chat')}
                >
                  Start a Chat
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analyses">
          {foodAnalysisHistory.length > 0 ? (
            <div className="space-y-4">
              {foodAnalysisHistory.map(analysis => (
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
                      
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-nari-accent text-nari-accent hover:bg-nari-accent/10"
                          onClick={() => handleShareInChat(analysis)}
                        >
                          <Edit3 className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-pcos text-pcos hover:bg-pcos/10"
                          onClick={() => navigate('/analyze')}
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
                  onClick={() => navigate('/analyze')}
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
