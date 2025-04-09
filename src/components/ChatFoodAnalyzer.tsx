
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { useUser, FoodAnalysisItem } from '@/contexts/UserContext';
import { FireworksAIService } from '@/services/fireworksAI';

interface ChatFoodAnalyzerProps {
  onAnalysisComplete: (analysis: FoodAnalysisItem) => void;
}

const ChatFoodAnalyzer: React.FC<ChatFoodAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, addFoodAnalysis } = useUser();
  
  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image under 5MB");
      return;
    }

    if (!file.type.includes('image/')) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      const fireworksService = new FireworksAIService();

      const result = await fireworksService.analyzeFoodImage(image, profile);
      
      if (result) {
        const newAnalysisItem: FoodAnalysisItem = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          foodName: result.foodName,
          imageUrl: image,
          pcosCompatibility: result.pcosCompatibility,
          nutritionalInfo: { ...result.nutritionalInfo },
          recommendation: result.recommendation,
          alternatives: [...result.alternatives]
        };
        
        addFoodAnalysis(newAnalysisItem);
        
        // Call the callback function with the analysis result
        onAnalysisComplete(newAnalysisItem);
        
        // Clear the image after analysis is complete and sent to chat
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        toast.success("Food analyzed successfully!");
      } else {
        toast.error("Failed to analyze the image");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("An error occurred during analysis");
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Take a photo of your meal to analyze its PCOS compatibility
          </p>
          
          <div className="flex justify-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {!image ? (
              <Button 
                onClick={handleCapture} 
                className="bg-pcos hover:bg-pcos-dark flex items-center gap-2"
                disabled={isAnalyzing}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            ) : (
              <div className="relative w-full max-w-sm">
                <img 
                  src={image} 
                  alt="Food to analyze" 
                  className="w-full rounded-md shadow-md" 
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={clearImage}
                  disabled={isAnalyzing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {image && !isAnalyzing && (
            <Button 
              onClick={analyzeImage} 
              className="w-full bg-pcos hover:bg-pcos-dark" 
              disabled={isAnalyzing}
            >
              Analyze Food
            </Button>
          )}
          
          {isAnalyzing && (
            <div className="space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                Analyzing your food...
              </p>
              <Progress 
                value={progress} 
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatFoodAnalyzer;
