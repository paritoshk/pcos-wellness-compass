import React, { useState, useRef } from 'react';
import { Button, Text, Group, Stack, Image, Center, Loader, Box } from '@mantine/core';
import { IconCamera, IconTrash, IconToolsKitchen2 } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useUser, FoodAnalysisItem } from '@/contexts/UserContext';
import { FireworksAIService } from '@/services/fireworksAI';

interface ChatFoodAnalyzerProps {
  onAnalysisComplete: (analysis: FoodAnalysisItem) => void;
}

const ChatFoodAnalyzer: React.FC<ChatFoodAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, addFoodAnalysis } = useUser();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeFood = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const fireworksService = new FireworksAIService();
      const result = await fireworksService.analyzeFoodImage(selectedImage, profile);
      
      if (result && result.foodName && result.foodName.toLowerCase() !== 'unknown') {
        const analysisItem: FoodAnalysisItem = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          imageUrl: selectedImage,
          ...result
        };
        
        addFoodAnalysis(analysisItem);
        onAnalysisComplete(analysisItem); // Pass the result to the parent
        clearImage();
        notifications.show({ title: "Analysis Complete", message: `Successfully analyzed ${result.foodName}.`, color: "green" });
      } else {
         throw new Error("Could not identify the food in the image. Please try a clearer picture.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      notifications.show({ title: "Analysis Failed", message: errorMessage, color: "red" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Take or upload a photo of your meal to get instant feedback.
      </Text>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {!selectedImage ? (
          <Center 
              p="xl"
              style={{border: '2px dashed var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)'}}
          >
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="light"
                color="pink"
                leftSection={<IconCamera size={16} />}
              >
                Take or Upload Photo
              </Button>
          </Center>
      ) : (
        <Stack align="center" gap="md">
          <Image 
            src={selectedImage} 
            alt="Food to analyze" 
            radius="md"
            maw={250}
          />
          <Group>
             <Button variant="default" onClick={clearImage} leftSection={<IconTrash size={14} />}>
                Clear
              </Button>
              <Button 
                onClick={analyzeFood} 
                loading={isAnalyzing}
                loaderProps={{type: 'dots'}}
                leftSection={<IconToolsKitchen2 size={14} />}
              >
                Analyze
              </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
};

export default ChatFoodAnalyzer;
