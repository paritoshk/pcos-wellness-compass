import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useUser, FoodAnalysisItem } from '@/contexts/UserContext';
import { FireworksAIService } from '@/services/fireworksAI';
import { useNavigate } from 'react-router-dom';

interface ChatFoodAnalyzerProps {
  onAnalysisComplete: (analysis: FoodAnalysisItem) => void;
}

const ChatFoodAnalyzer: React.FC<ChatFoodAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, addFoodAnalysis } = useUser();
  const navigate = useNavigate();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
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
      
      if (result) {
        // Create food analysis item
        const analysisItem: FoodAnalysisItem = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          imageUrl: selectedImage,
          ...result
        };
        
        // Add to history
        addFoodAnalysis(analysisItem);
        
        // Call the callback to display results in chat
        onAnalysisComplete(analysisItem);
        
        // Clear the image
        clearImage();
        
        toast.success("Food analysis complete!");
      }
    } catch (error: unknown) {
      console.error('Analysis failed:', error);
      let errorMessage = "Failed to analyze food";
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          <p className="text-nari-text-main/80 text-sm">
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
            
            {!selectedImage ? (
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-nari-primary hover:bg-nari-primary/90 flex items-center gap-2"
                size="sm"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            ) : (
              <div className="w-full space-y-3">
                <div className="relative w-full max-w-xs mx-auto">
                  <img 
                    src={selectedImage} 
                    alt="Food to analyze" 
                    className="w-full rounded-md shadow-sm" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 bg-background/90 backdrop-blur-sm"
                    onClick={clearImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={analyzeFood} 
                    className="bg-nari-primary hover:bg-nari-primary/90 flex-1 max-w-32"
                    size="sm"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Food
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    disabled={isAnalyzing}
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatFoodAnalyzer;
