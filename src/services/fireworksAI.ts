import { toast } from "sonner";
import { PCOSProfile } from '@/contexts/UserContext';

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
  private chatModel: string;
  private foodModel: string;
  private apiEndpoint = "https://api.fireworks.ai/inference/v1/chat/completions";

  constructor(config: FireworksAIConfig = {}) {
    console.log('Vite ENV variables available in FireworksAIService:', import.meta.env);
    // Use environment variable first, fallback to config
    this.apiKey = import.meta.env.VITE_FIREWORKS_API_KEY || config.apiKey || "";
    console.log('Selected API Key:', this.apiKey ? 'Key Present (masked)' : 'Key NOT Present');
    this.foodModel = config.model || "accounts/fireworks/models/firellava-13b";
    this.chatModel = config.model || "accounts/fireworks/models/llama-v3-8b-instruct";
  }

  async analyzeFoodImage(imageBase64: string, userProfile: Partial<PCOSProfile>): Promise<AnalysisResult | null> {
    try {
      if (!this.apiKey) {
        // toast.error("Fireworks AI API key is not configured. Please contact support."); // Avoid UI side effects in service
        throw new Error("API key is not configured for Fireworks AI service.");
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
          model: this.foodModel,
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
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response from AI service" }));
        throw new Error(errorData.message || "Failed to analyze the image due to server error");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content in AI response for food analysis.");
      }
      
      const parsedResult = JSON.parse(content);
      return this.formatAnalysisResult(parsedResult);
    } catch (error: unknown) {
      console.error("Error analyzing food image:", error);
      let errorMessage = "Failed to analyze image. Please try again.";
      if (error instanceof Error) errorMessage = error.message;
      else if (typeof error === 'string') errorMessage = error;
      // throw new Error(errorMessage); // Re-throwing to be caught by UI layer which can show toast
      toast.error(errorMessage); // Or handle toast here if preferred for service-level errors
      return null; // Return null to indicate failure to the caller
    }
  }

  private createAnalysisPrompt(userProfile: Partial<PCOSProfile>): string {
    const age = userProfile.age || 'Unknown';
    const symptoms = userProfile.symptoms?.join(', ') || 'General PCOS symptoms';
    const insulinStatus = userProfile.insulinResistant === null ? 'Unknown' : userProfile.insulinResistant ? 'Yes' : 'No';
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

  private formatAnalysisResult(rawResult: Partial<AnalysisResult>): AnalysisResult {
    const result: AnalysisResult = {
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

    if (result.pcosCompatibility >= 80 && result.alternatives.length > 0) {
      result.alternatives = [];
    }

    return result;
  }

  async getChatResponse(conversationHistory: Array<{role: 'user' | 'assistant', content: string}>, userProfile: PCOSProfile): Promise<string | null> {
    try {
      if (!this.apiKey) {
        // toast.error("Fireworks AI API key is not configured. Please contact support.");
        throw new Error("API key is not configured for Fireworks AI service.");
      }

      const systemMessage = `You are Ama, a friendly and empathetic PCOS Wellness Assistant. Your goal is to provide helpful information, support, and guidance to users managing Polycystic Ovary Syndrome (PCOS). Personalize your responses based on the user's profile where appropriate. User's name: ${userProfile.name || 'there'}. User's reported symptoms: ${userProfile.symptoms?.join(', ') || 'not specified'}.`;

      const messagesForAPI = [
        { role: 'system', content: systemMessage },
        ...conversationHistory
      ];

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.chatModel,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          messages: messagesForAPI,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response from AI service" }));
        console.error("Fireworks AI chat error response:", errorData);
        throw new Error(errorData.message || "Failed to get chat response from AI");
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content.trim();
      }
      // Fallback if structure is not as expected but request was OK
      console.error("Unexpected response structure from Fireworks AI chat:", data);
      throw new Error("Received an unexpected response structure from the AI chat service.");

    } catch (error: unknown) {
      console.error("Error getting chat response:", error);
      let errorMessage = "I am having trouble connecting to my brain right now. Please try again in a moment."; // Friendly fallback
      if (error instanceof Error && error.message && !error.message.toLowerCase().includes("api key")) {
         // Don't expose generic fetch errors directly if not specific from AI
         if (!error.message.includes("Failed to parse error response") && !error.message.includes("unexpected response structure")) {
            errorMessage = error.message;
         }
      }
      // throw new Error(errorMessage); // Re-throwing to be caught by UI layer
      toast.error(errorMessage); // Show toast from service for now
      return null; // Return null to indicate failure
    }
  }
}
