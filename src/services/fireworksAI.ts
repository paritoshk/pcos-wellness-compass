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
  private apiEndpoint = "https://api.fireworks.ai/inference/v1/chat/completions";

  constructor(config: FireworksAIConfig = {}) {
    const envApiKey = import.meta.env.VITE_FIREWORKS_API_KEY;
    console.log("[NariAI_FireworksService] Constructor: VITE_FIREWORKS_API_KEY from import.meta.env: ", 
                envApiKey ? `Present (length: ${envApiKey.length})` : "MISSING or empty");
    
    this.apiKey = envApiKey || config.apiKey || "";
    console.log("[NariAI_FireworksService] Constructor: Final effective API Key: ", 
                this.apiKey ? `Present (length: ${this.apiKey.length})` : "MISSING or empty");

    this.model = config.model || "accounts/fireworks/models/llama4-maverick-instruct-basic";
    console.log(`[NariAI_FireworksService] Model set: '${this.model}'`);
  }

  async analyzeFoodImage(imageBase64: string, userProfile: Partial<PCOSProfile>): Promise<AnalysisResult | null> {
    console.log("[NariAI_FireworksService] analyzeFoodImage: Called.");
    console.log("[NariAI_FireworksService] analyzeFoodImage: Current API Key: ", 
                this.apiKey ? `Present (length: ${this.apiKey.length})` : "MISSING or empty");

    if (!this.apiKey) {
      console.error("[NariAI_FireworksService] analyzeFoodImage: API key is MISSING. Aborting.");
      toast.error("Configuration error: AI service API key is missing. Please contact support.");
      return null;
    }
    
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
          max_tokens: 4096,
          temperature: 0.6,
          top_p: 1,
          top_k: 40,
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
                    url: imageBase64.startsWith('data:image') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
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
        console.error("[NariAI_FireworksService] analyzeFoodImage: API Error", response.status, errorData);
        throw new Error(errorData.message || "Failed to analyze the image due to server error");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        console.error("[NariAI_FireworksService] analyzeFoodImage: No content in AI response.");
        throw new Error("No content in AI response for food analysis.");
      }
      
      const parsedResult = JSON.parse(content);
      return this.formatAnalysisResult(parsedResult);
    } catch (error: unknown) {
      console.error("[NariAI_FireworksService] analyzeFoodImage: CATCH BLOCK Error:", error);
      let errorMessage = "Failed to analyze image. Please try again.";
      if (error instanceof Error) errorMessage = error.message;
      else if (typeof error === 'string') errorMessage = error;
      toast.error(errorMessage);
      return null;
    }
  }

  private createAnalysisPrompt(userProfile: Partial<PCOSProfile>): string {
    const age = userProfile.age || 'Unknown';
    const symptoms = userProfile.symptoms?.join(', ') || 'General PCOS symptoms';
    const insulinStatus = userProfile.insulinResistant === null ? 'Unknown' : userProfile.insulinResistant ? 'Yes' : 'No';
    const weightGoals = userProfile.weightManagementGoal || 'Management';
    const dietaryPreferences = userProfile.dietaryPreferences?.join(', ') || 'None specified';
    
    return `First, identify the primary food in the image. Then, acting as a PCOS nutrition expert, analyze it based on the user's profile.

The user has PCOS. Their profile is:
- Age: ${age}
- Symptoms: ${symptoms}
- Insulin Resistance: ${insulinStatus}
- Weight Goal: ${weightGoals}
- Dietary Preferences: ${dietaryPreferences}

Provide your response in a valid JSON object using the following structure and nothing else:
{
  "foodName": "Name of the food identified",
  "pcosCompatibility": 0-100,
  "nutritionalInfo": {
    "carbs": 0,
    "protein": 0,
    "fats": 0,
    "glycemicLoad": "Low",
    "inflammatoryScore": "Neutral"
  },
  "recommendation": "Detailed recommendation for this user.",
  "alternatives": []
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
    console.log("[NariAI_FireworksService] getChatResponse: Called.");
    console.log("[NariAI_FireworksService] getChatResponse: Current API Key: ", 
                this.apiKey ? `Present (length: ${this.apiKey.length})` : "MISSING or empty");

    if (!this.apiKey) {
      console.error("[NariAI_FireworksService] getChatResponse: API key is MISSING. Aborting.");
      toast.error("Configuration error: AI service API key is missing. Please contact support.");
      return null;
    }

    try {
      const systemMessage = `You are Nari, a friendly, empathetic, and knowledgeable PCOS Wellness Assistant. Your primary role is to provide supportive, insightful, and personalized guidance to the user for managing their Polycystic Ovary Syndrome (PCOS).

**CRITICAL INSTRUCTION: ALWAYS consult the User Profile below to tailor your responses. Refer to the user by their name. Acknowledge their specific goals, symptoms, and preferences when relevant.**

---
**User Profile**
- **Name:** ${userProfile.name || 'User'}
- **Age:** ${userProfile.age || 'Not Provided'}
- **Primary Goal:** ${userProfile.primaryGoal || 'Not Provided'}
- **Weight Management Goal:** ${userProfile.weightManagementGoal || 'Not Provided'}
- **Known Symptoms:** ${userProfile.symptoms?.join(', ') || 'Not Specified'}
- **Dietary Preferences:** ${userProfile.dietaryPreferences?.join(', ') || 'None'}
- **Diagnosed with Insulin Resistance:** ${userProfile.insulinResistant === null ? 'Unknown' : userProfile.insulinResistant ? 'Yes' : 'No'}
- **Previously Diagnosed with PCOS:** ${userProfile.hasBeenDiagnosed || 'Unknown'}
- **PCOS Probability (Our Assessment):** ${userProfile.pcosProbability || 'Not Assessed'}
---

Your tone should be encouraging and non-judgmental. Do not provide medical advice, but you can offer information based on well-known PCOS management strategies.`;

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
          model: this.model,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          messages: messagesForAPI,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response from AI service" }));
        console.error("[NariAI_FireworksService] getChatResponse: API Error", response.status, errorData);
        throw new Error(errorData.message || "Failed to get chat response from AI");
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content.trim();
      }
      console.error("[NariAI_FireworksService] getChatResponse: No content in AI response.");
      throw new Error("Received an unexpected response structure from the AI chat service.");

    } catch (error: unknown) {
      console.error("[NariAI_FireworksService] getChatResponse: CATCH BLOCK Error:", error);
      let errorMessage = "I am having trouble connecting to my brain right now. Please try again in a moment.";
      if (error instanceof Error) errorMessage = error.message;
      else if (typeof error === 'string') errorMessage = error;
      toast.error(errorMessage);
      return null;
    }
  }
}
