
import { toast } from "sonner";

interface FireworksAIConfig {
  model?: string;
  apiKey?: string;
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

  constructor(config: FireworksAIConfig = {}) {
    this.apiKey = config.apiKey || "";
    this.model = config.model || "accounts/fireworks/models/llama4-maverick-instruct-basic";
  }

  async analyzeFoodImage(imageBase64: string, userProfile: any): Promise<AnalysisResult | null> {
    try {
      if (!this.apiKey) {
        toast.error("Please set your Fireworks AI API key in your profile settings");
        throw new Error("API key is not set");
      }
      
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
    const age = userProfile.age || 'Unknown';
    const symptoms = userProfile.symptoms?.join(', ') || 'General PCOS symptoms';
    const insulinStatus = userProfile.insulinResistant ? 'Yes' : 'Unknown/No';
    const weightGoals = userProfile.weightGoals || 'Management';
    const dietaryPreferences = userProfile.dietaryPreferences?.join(', ') || 'None specified';
    
    return `You are a specialized nutritionist and expert in PCOS (Polycystic Ovary Syndrome) dietary management. Your task is to analyze food images to provide personalized dietary guidance for PCOS patients.

Your understanding of PCOS dietary management includes:
1. Insulin resistance is present in 70-80% of PCOS patients, requiring low glycemic index foods
2. Anti-inflammatory diet components help reduce PCOS symptoms
3. Hormone-balancing foods can help regulate menstrual irregularities
4. Weight management is often a key factor in symptom control
5. Individual responses to foods vary based on specific PCOS phenotype

Please analyze this food image for a PCOS patient with the following profile:
- Age: ${age}
- PCOS symptoms: ${symptoms}
- Insulin resistance: ${insulinStatus}
- Current weight goals: ${weightGoals}
- Dietary preferences: ${dietaryPreferences}

For each food identified, please provide detailed analysis in JSON format with the following structure:
{
  "foodName": "Name of the food with high confidence",
  "pcosCompatibility": 0-100 score indicating how compatible this food is for PCOS management,
  "nutritionalInfo": {
    "carbs": estimated carbs in grams,
    "protein": estimated protein in grams,
    "fats": estimated fats in grams,
    "glycemicLoad": "Low", "Medium", or "High",
    "inflammatoryScore": "Anti-inflammatory", "Neutral", or "Pro-inflammatory"
  },
  "recommendation": "Detailed explanation on why this food is good or bad for PCOS and specific benefits or concerns for this individual's profile",
  "alternatives": ["Better alternatives if pcosCompatibility is below 80%"]
}`;
  }

  private formatAnalysisResult(rawResult: any): AnalysisResult {
    // Ensure we have all required fields with fallbacks
    const result = {
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

    // Only provide alternatives if compatibility is below 80%
    if (result.pcosCompatibility >= 80) {
      result.alternatives = [];
    }

    return result;
  }
}
