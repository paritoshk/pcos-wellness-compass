
import { toast } from "sonner";

interface FireworksAIConfig {
  apiKey: string;
  model: string;
}

interface AnalysisResult {
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

export class FireworksAIService {
  private apiKey: string;
  private model: string;
  private apiEndpoint = "https://api.fireworks.ai/inference/v1/chat/completions";

  constructor(config: FireworksAIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || "accounts/fireworks/models/llama4-maverick-instruct-basic";
  }

  async analyzeFoodImage(imageBase64: string, userProfile: any): Promise<AnalysisResult | null> {
    try {
      const prompt = this.createAnalysisPrompt(userProfile);
      
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          temperature: 0.4,
          top_p: 0.95,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze the image");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the JSON response
      const parsedResult = JSON.parse(content);
      
      return this.formatAnalysisResult(parsedResult);
    } catch (error: any) {
      console.error("Food analysis error:", error);
      toast.error("Failed to analyze food image: " + (error.message || "Unknown error"));
      return null;
    }
  }

  private createAnalysisPrompt(userProfile: any): string {
    const dietaryPreferences = userProfile.dietaryPreferences?.join(", ") || "None specified";
    const insulinStatus = userProfile.insulinResistant ? "has insulin resistance" : "does not have insulin resistance";
    
    return `You are an AI nutritionist specialized in PCOS (Polycystic Ovary Syndrome) nutrition analysis.
    
Analyze the food in this image and provide a detailed assessment for a PCOS patient who ${insulinStatus} and has the following dietary preferences: ${dietaryPreferences}.

Return your analysis in JSON format with the following structure:
{
  "foodName": "Name of the food",
  "pcosCompatibility": 0-100 score indicating how compatible this food is for PCOS management,
  "nutritionalInfo": {
    "carbs": estimated carbs in grams,
    "protein": estimated protein in grams,
    "fats": estimated fats in grams,
    "glycemicLoad": "Low", "Medium", or "High",
    "inflammatoryScore": "Anti-inflammatory", "Neutral", or "Pro-inflammatory"
  },
  "recommendation": "Detailed explanation on why this food is good or bad for PCOS",
  "alternatives": ["3-5 better alternatives if applicable"]
}`;
  }

  private formatAnalysisResult(rawResult: any): AnalysisResult {
    // Ensure we have all required fields with fallbacks
    return {
      foodName: rawResult.foodName || "Unknown Food",
      pcosCompatibility: Number(rawResult.pcosCompatibility) || 50,
      nutritionalInfo: {
        carbs: Number(rawResult.nutritionalInfo?.carbs) || 0,
        protein: Number(rawResult.nutritionalInfo?.protein) || 0,
        fats: Number(rawResult.nutritionalInfo?.fats) || 0,
        glycemicLoad: rawResult.nutritionalInfo?.glycemicLoad || "Unknown",
        inflammatoryScore: rawResult.nutritionalInfo?.inflammatoryScore || "Unknown"
      },
      recommendation: rawResult.recommendation || "No specific recommendations available.",
      alternatives: Array.isArray(rawResult.alternatives) ? rawResult.alternatives : []
    };
  }
}
