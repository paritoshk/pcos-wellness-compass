import React, { useState, useRef, useEffect } from 'react';
import { Button, TextInput, Stack, Group, Box, Text, ScrollArea, Avatar, Paper, Modal, Container, Center, Loader, ActionIcon } from "@mantine/core";
import { IconSend, IconCamera, IconPlus } from "@tabler/icons-react";
import { useUser, PCOSProfile, FoodAnalysisItem, Message } from '@/contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatFoodAnalyzer from '@/components/ChatFoodAnalyzer';
import { FireworksAIService } from '@/services/fireworksAI';
import ExtendedPCOSQuiz from '@/pages/ExtendedPCOSQuiz';

const getFoodAnalysisResponse = (foodAnalysis: FoodAnalysisItem): string => {
  if (!foodAnalysis || !foodAnalysis.foodName) {
    return "I'm sorry, I couldn't analyze that food properly. Could you please try again?";
  }
  const compatibilityLevel = foodAnalysis.pcosCompatibility > 70 ? "good" : foodAnalysis.pcosCompatibility > 50 ? "moderate" : "poor";
  const baseResponse = `I've analyzed your ${foodAnalysis.foodName}. It has ${compatibilityLevel} compatibility (${foodAnalysis.pcosCompatibility}%) with your PCOS management plan.\n\n`;
  const nutritionInfo = `Nutritional breakdown: ${foodAnalysis.nutritionalInfo.carbs}g carbs, ${foodAnalysis.nutritionalInfo.protein}g protein, ${foodAnalysis.nutritionalInfo.fats}g fats. It has a ${foodAnalysis.nutritionalInfo.glycemicLoad.toLowerCase()} glycemic load and is ${foodAnalysis.nutritionalInfo.inflammatoryScore.toLowerCase()} in terms of inflammation.\n\n`;
  const recommendation = `${foodAnalysis.recommendation}\n\n`;
  let alternativesText = "";
  if (foodAnalysis.pcosCompatibility < 80 && foodAnalysis.alternatives && foodAnalysis.alternatives.length > 0) {
    alternativesText = `Here are some better alternatives you might consider:\n` + foodAnalysis.alternatives.map((alt: string) => `• ${alt}`).join('\n');
  }
  return baseResponse + nutritionInfo + recommendation + alternativesText;
};

const CHAT_MESSAGES_STORAGE_KEY = 'pcosChatMessages';
interface StoredMessage extends Omit<Message, 'timestamp'> { timestamp: string; }

const ChatInterface: React.FC = () => {
  const { profile } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
    return saved ? JSON.parse(saved).map((msg: StoredMessage) => ({...msg, timestamp: new Date(msg.timestamp)})) : [];
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analyzerOpened, setAnalyzerOpened] = useState(false);
  const [extendedQuizOpened, setExtendedQuizOpened] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const fireworksAIService = useRef(new FireworksAIService()).current;

  const scrollToBottom = () => viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    if (messages.length === 0 && profile.name) {
      setMessages([{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Hi ${profile.name}! I'm Nari, your PCOS Wellness assistant. How can I help you today? You can analyze your food by clicking the camera button, or take a more detailed quiz to personalize your experience.`,
        timestamp: new Date()
      }]);
    }
  }, [profile.name, messages.length]);

  useEffect(() => {
    const foodAnalysis = location.state?.foodAnalysis as FoodAnalysisItem | undefined;
    if (foodAnalysis) {
      navigate(location.pathname, { replace: true, state: {} });
      const userFoodMessage: Message = { id: crypto.randomUUID(), role: 'user', content: `I've analyzed my ${foodAnalysis.foodName}. Can you give me feedback?`, timestamp: new Date(), foodAnalysis };
      const assistantFoodMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: getFoodAnalysisResponse(foodAnalysis), timestamp: new Date() };
      setMessages(prev => [...prev, userFoodMessage, assistantFoodMessage]);
    }
  }, [location.state, navigate, location.pathname]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: currentMessage, timestamp: new Date() };
    const newMessagesState = [...messages, userMessage];
    setMessages(newMessagesState);
    setCurrentMessage('');
    setIsTyping(true);

    const conversationHistory = newMessagesState.map(msg => ({ role: msg.role, content: msg.content }));
    try {
      const aiResponseContent = await fireworksAIService.getChatResponse(conversationHistory, profile as PCOSProfile);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: aiResponseContent || "I'm having a little trouble thinking. Please try again.", timestamp: new Date() }]);
    } catch (error) {
       console.error("Error fetching AI response:", error);
       setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: "Sorry, I encountered an error and couldn't process your message.", timestamp: new Date() }]);
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
  
  return (
    <Container size="md" h="calc(100vh - 6rem - 2 * var(--mantine-spacing-md))">
      <Modal opened={analyzerOpened} onClose={() => setAnalyzerOpened(false)} title="Analyze Food" centered>
        <ChatFoodAnalyzer onAnalysisComplete={(analysis) => {
          setAnalyzerOpened(false);
          const userFoodMessage: Message = { id: crypto.randomUUID(), role: 'user', content: `I've analyzed my ${analysis.foodName}. Can you give me feedback?`, timestamp: new Date(), foodAnalysis: analysis };
          const assistantFoodMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: getFoodAnalysisResponse(analysis), timestamp: new Date() };
          setMessages(prev => [...prev, userFoodMessage, assistantFoodMessage]);
        }} />
      </Modal>

      {/* Placeholder for the new Extended Quiz Modal */}
      <Modal opened={extendedQuizOpened} onClose={() => setExtendedQuizOpened(false)} title="Detailed Wellness Quiz" size="xl" centered>
        <ExtendedPCOSQuiz onComplete={() => setExtendedQuizOpened(false)} />
      </Modal>

      <Stack h="100%" gap="md">
        <Box>
            <Text component="h1" size="xl" fw={700}>Chat with Nari</Text>
            <Text c="dimmed">Your personal PCOS wellness assistant</Text>
        </Box>
        <ScrollArea.Autosize mah="calc(100vh - 220px)" viewportRef={viewport} p="md">
          <Stack gap="lg">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                 <Group key={message.id} gap="sm" wrap="nowrap" justify={isUser ? "flex-end" : "flex-start"}>
                    {!isUser && (
                        <Avatar color="pink" radius="xl">
                            N
                        </Avatar>
                    )}
                    <Paper
                        shadow="sm"
                        p="md"
                        radius="lg"
                        withBorder={!isUser}
                        style={{
                            maxWidth: '85%',
                            backgroundColor: isUser ? 'var(--mantine-color-pink-6)' : 'white',
                            color: isUser ? 'white' : 'black',
                        }}
                    >
                        {message.foodAnalysis && <Text fw={500} mb="xs">Analysis of {message.foodAnalysis.foodName}</Text>}
                        <Text component="div" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</Text>
                        {message.id === messages.find(m => m.role === 'assistant')?.id && !profile.completedExtendedQuiz && (
                          <Button mt="md" variant="light" color="pink" onClick={() => setExtendedQuizOpened(true) }>
                            Take Detailed Wellness Quiz
                          </Button>
                        )}
                        <Text size="xs" ta="right" c={isUser ? 'gray.4' : 'gray.6'} mt={4}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </Paper>
                     {isUser && (
                        <Avatar color="pink" radius="xl">
                            {profile.name?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                    )}
                </Group>
              );
            })}
            {isTyping && (
              <Group gap="sm" wrap="nowrap" justify="flex-start">
                 <Avatar color="pink" radius="xl">N</Avatar>
                 <Paper shadow="sm" p="md" radius="lg" withBorder>
                    <Loader type="dots" color="pink" />
                 </Paper>
              </Group>
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>

      <Paper withBorder p="sm" radius="md" shadow="xs" style={{ position: 'sticky', bottom: 0 }}>
        <Group>
           <ActionIcon variant="light" color="pink" size="xl" radius="md" onClick={() => setAnalyzerOpened(true)}>
             <IconPlus size="1.2rem" />
           </ActionIcon>
           <TextInput
              variant="filled"
              radius="md"
              size="md"
              style={{ flex: 1 }}
              placeholder="Ask Nari anything..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rightSectionWidth={42}
              rightSection={
                <ActionIcon 
                  size={32} 
                  radius="xl" 
                  color="pink" 
                  variant="filled" 
                  onClick={handleSendMessage} 
                  disabled={!currentMessage.trim() || isTyping}
                  aria-label="Send message"
                >
                  <IconSend style={{ width: '1rem', height: '1rem' }} />
                </ActionIcon>
              }
            />
        </Group>
      </Paper>
    </Container>
  );
};

export default ChatInterface;
