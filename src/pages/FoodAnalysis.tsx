import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, X, Share2, Utensils, Loader2, MessageSquareText } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";
import { useUser, FoodAnalysisItem } from '@/contexts/UserContext';
import { FireworksAIService } from '@/services/fireworksAI';
import { useNavigate } from 'react-router-dom';

interface FoodAnalysisResult {
  foodName: string;
  pcosCompatibility: number;
  nutritionalInfo: {
    carbs: number;
    protein: number;
    fats: number;
    glycemicLoad: string;
    inflammatoryScore: string;
  };
  recommendation: string;
  alternatives: string[];
}

const FoodAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast: hookToast } = useToast();
  const { profile, addFoodAnalysis } = useUser();
  const navigate = useNavigate();

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      hookToast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.includes('image/')) {
      hookToast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
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
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeFood = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    try {
      const fireworksService = new FireworksAIService();
      const result = await fireworksService.analyzeFoodImage(image, profile);
      
      if (result) {
        // Create food analysis item
        const analysisItem: FoodAnalysisItem = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          imageUrl: image,
          ...result
        };
        
        // Add to history
        addFoodAnalysis(analysisItem);
        setAnalysisResult(result);
      }
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast.error(error.message || "Failed to analyze food");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveToHistory = () => {
    if (!analysisResult || !image) return;
    
    const newAnalysisItem: FoodAnalysisItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      foodName: analysisResult.foodName,
      imageUrl: image,
      pcosCompatibility: analysisResult.pcosCompatibility,
      nutritionalInfo: { ...analysisResult.nutritionalInfo },
      recommendation: analysisResult.recommendation,
      alternatives: [...analysisResult.alternatives]
    };
    
    addFoodAnalysis(newAnalysisItem);
    toast.success("Analysis saved to history");
    
    navigate('/history');
  };

  const shareWithChat = () => {
    if (!analysisResult) return;
    
    if (image) {
      const newAnalysisItem: FoodAnalysisItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        foodName: analysisResult.foodName,
        imageUrl: image,
        pcosCompatibility: analysisResult.pcosCompatibility,
        nutritionalInfo: { ...analysisResult.nutritionalInfo },
        recommendation: analysisResult.recommendation,
        alternatives: [...analysisResult.alternatives]
      };
      
      addFoodAnalysis(newAnalysisItem);
    }
    
    navigate('/chat', { 
      state: { 
        foodAnalysis: {
          ...analysisResult,
          imageUrl: image
        } 
      }
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Food Analysis</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
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
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-nari-primary hover:bg-nari-primary/90 w-full sm:w-auto"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            
            {image && (
              <div className="flex flex-col items-center space-y-4">
                <img 
                  src={image} 
                  alt="Food to analyze" 
                  className="max-w-xs rounded-lg shadow-md"
                />
                <Button 
                  onClick={analyzeFood}
                  disabled={isAnalyzing}
                  className="bg-nari-primary hover:bg-nari-primary/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Utensils className="h-4 w-4 mr-2" />
                      Analyze Food
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{analysisResult.foodName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>PCOS Compatibility</span>
                  <span className="font-semibold">{analysisResult.pcosCompatibility}%</span>
                </div>
                <Progress 
                  value={analysisResult.pcosCompatibility} 
                  className={`h-2 ${
                    analysisResult.pcosCompatibility > 70 ? "bg-green-500" : 
                    analysisResult.pcosCompatibility > 40 ? "bg-yellow-500" : 
                    "bg-red-500"
                  }`}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Carbs</div>
                  <div className="font-semibold">{analysisResult.nutritionalInfo.carbs}g</div>
                </div>
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Protein</div>
                  <div className="font-semibold">{analysisResult.nutritionalInfo.protein}g</div>
                </div>
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Fats</div>
                  <div className="font-semibold">{analysisResult.nutritionalInfo.fats}g</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Glycemic Load</div>
                  <div className="font-semibold">{analysisResult.nutritionalInfo.glycemicLoad}</div>
                </div>
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Inflammation</div>
                  <div className="font-semibold">{analysisResult.nutritionalInfo.inflammatoryScore}</div>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="font-medium mb-1">Recommendation</h3>
                <p className="text-muted-foreground text-sm">{analysisResult.recommendation}</p>
              </div>
              
              {analysisResult.pcosCompatibility < 80 && analysisResult.alternatives.length > 0 && (
                <div>
                  <h3 className="font-medium mb-1">Alternative Options</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {analysisResult.alternatives.map((alternative, index) => (
                      <li key={index}>{alternative}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline"
              className="border-nari-accent text-nari-accent hover:bg-nari-accent/10"
              onClick={clearImage}
            >
              Analyze Another Food
            </Button>
            <div className="space-x-2">
              <Button 
                variant="outline"
                className="bg-nari-primary hover:bg-nari-primary/90"
                onClick={shareWithChat}
              >
                <MessageSquareText className="mr-2 h-4 w-4" />
                Share in Chat
              </Button>
              <Button 
                className="bg-nari-primary hover:bg-nari-primary/90"
                onClick={saveToHistory}
              >
                Save to History
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodAnalysis;
