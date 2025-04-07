
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';
import { useUser } from '@/contexts/UserContext';
import { FireworksAIService } from '@/services/fireworksAI';
import FireworksAPIKeyInput from '@/components/FireworksAPIKeyInput';

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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast: hookToast } = useToast();
  const { profile } = useUser();

  useEffect(() => {
    // Check for saved API key on component mount
    const savedApiKey = localStorage.getItem("fireworks_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size and type
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

  const analyzeImage = async () => {
    if (!image || !apiKey) return;
    
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
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
      const fireworksService = new FireworksAIService({
        apiKey,
        model: "accounts/fireworks/models/llama4-maverick-instruct-basic"
      });

      const result = await fireworksService.analyzeFoodImage(image, profile);
      
      if (result) {
        setAnalysisResult(result);
        toast.success("Analysis complete!");
      } else {
        toast.error("Failed to analyze the image. Please try again.");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("An error occurred during analysis");
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  };

  const saveToHistory = () => {
    // Implement history saving functionality here
    toast.success("Analysis saved to history");
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Food Analysis</h1>
      
      {!apiKey && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <FireworksAPIKeyInput onApiKeySubmit={setApiKey} />
          </CardContent>
        </Card>
      )}
      
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
              
              {!image ? (
                <Button 
                  onClick={handleCapture} 
                  className="bg-pcos hover:bg-pcos-dark flex items-center gap-2"
                  size="lg"
                  disabled={!apiKey}
                >
                  <Camera className="h-5 w-5" />
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
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {image && !analysisResult && !isAnalyzing && (
              <Button 
                onClick={analyzeImage} 
                className="w-full bg-pcos hover:bg-pcos-dark" 
                disabled={isAnalyzing || !apiKey}
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
                  indicatorClassName="bg-pcos"
                />
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
                  className="h-2"
                  indicatorClassName={
                    analysisResult.pcosCompatibility > 70 ? "bg-green-500" : 
                    analysisResult.pcosCompatibility > 40 ? "bg-yellow-500" : 
                    "bg-red-500"
                  }
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
              
              <div>
                <h3 className="font-medium mb-1">Alternative Options</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {analysisResult.alternatives.map((alternative, index) => (
                    <li key={index}>{alternative}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={clearImage}>
              Analyze Another Food
            </Button>
            <Button 
              variant="outline" 
              className="border-pcos text-pcos hover:bg-pcos/10"
              onClick={saveToHistory}
            >
              Save to History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodAnalysis;
