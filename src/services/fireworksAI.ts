
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
          temperature: 0.3,
          top_p: 0.95,          messages: [
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
    
    return `You are a specialized nutritionist and expert in PCOS (Polycystic Ovary Syndrome) dietary management. Your task is to analyze food images to provide accurate, evidence-based dietary guidance for PCOS patients.

Your understanding of PCOS dietary management includes:
1. Insulin resistance is present in 70-80% of PCOS patients, requiring low glycemic index foods and moderate carbohydrate intake
2. Anti-inflammatory diet components help reduce PCOS symptoms
3. Hormone-balancing foods can help regulate menstrual irregularities
4. Weight management is often a key factor in symptom control
5. Processed foods and refined carbohydrates should generally be limited
6. High-fat foods, especially those high in saturated fats, can worsen insulin resistance
7. Fast food and highly processed meals are typically poor choices for PCOS management

IMPORTANT: Be honest and accurate in your assessment. Do NOT overstate the compatibility of unhealthy foods. Fast food, fried foods, and high-sugar items should receive appropriately low compatibility scores.

Please analyze this food image for a PCOS patient with the following profile:
- Age: ${age}
- PCOS symptoms: ${symptoms}
- Insulin resistance: ${insulinStatus}
- Current weight goals: ${weightGoals}
- Dietary preferences: ${dietaryPreferences}

For each food identified, please provide detailed analysis in JSON format with the following structure:
{
  "foodName": "Name of the food with high confidence",
  "pcosCompatibility": 0-100 score indicating how compatible this food is for PCOS management (be realistic - fast food and high-sugar items should score below 40),
  "nutritionalInfo": {
    "carbs": estimated carbs in grams,
    "protein": estimated protein in grams,
    "fats": estimated fats in grams,
    "glycemicLoad": "Low", "Medium", or "High",
    "inflammatoryScore": "Anti-inflammatory", "Neutral", or "Pro-inflammatory"
  },
  "recommendation": "Honest assessment of why this food is good or bad for PCOS, including specific concerns about insulin resistance, inflammation, and weight management if applicable",
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

  async sendChatMessage(message: string, userProfile: any): Promise<string> {
    try {
      console.log('Sending chat message with API key:', this.apiKey ? 'API key is set' : 'API key is missing');
      
      if (!this.apiKey) {
        toast.error("Please set your Fireworks AI API key in your profile settings");
        return "I'm sorry, but I can't process your request right now. The API key is missing. Please check your settings and try again.";
      }
      
      const prompt = this.createChatPrompt(userProfile);
      
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
              role: "system",
              content: prompt
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('API error details:', errorData);
          toast.error("Error from API: " + (errorData.message || "Unknown error"));
          return "I'm sorry, but there was an error processing your request. Please try again later.";
        } catch (e) {
          console.error('Failed to parse error response:', e);
          return "I'm sorry, but there was an error processing your request. Please try again later.";
        }
      }

      try {
        const data = await response.json();
        console.log('API response received successfully');
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error('Invalid API response format:', data);
          return "I received an invalid response format. Please try again.";
        }
        const content = data.choices[0].message.content;
        return content;
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        return "I encountered an error processing the response. Please try again.";
      }
    } catch (error: any) {
      console.error("Chat message error:", error);
      toast.error("Failed to get a response: " + (error.message || "Unknown error"));
      return "I'm sorry, I couldn't process your message. Please try again later.";
    }
  }

  private createChatPrompt(userProfile: any): string {
    const age = userProfile.age || 'Unknown';
    const symptoms = userProfile.symptoms?.join(', ') || 'General PCOS symptoms';
    const insulinStatus = userProfile.insulinResistant ? 'Yes' : 'Unknown/No';
    const weightGoals = userProfile.weightGoals || 'Management';
    const dietaryPreferences = userProfile.dietaryPreferences?.join(', ') || 'None specified';
    
    return `You are a specialized PCOS (Polycystic Ovary Syndrome) wellness assistant providing personalized guidance for women with PCOS. Your responses should be evidence-based, compassionate, and tailored to the user's specific PCOS profile.

User's PCOS Profile:
- Age: ${age}
- PCOS symptoms: ${symptoms}
- Insulin resistance: ${insulinStatus}
- Current weight goals: ${weightGoals}
- Dietary preferences: ${dietaryPreferences}

Your expertise includes:
1. Dietary recommendations for PCOS management, especially for insulin resistance
2. Exercise guidance appropriate for PCOS
3. Lifestyle modifications to reduce symptoms
4. Stress management techniques
5. Sleep optimization strategies
6. Supplement recommendations (with medical disclaimer)

When responding:
- Tailor your advice to the user's specific symptoms and profile
- Provide practical, actionable advice
- Be encouraging and empathetic
- Include scientific rationale when appropriate
- Recommend consulting healthcare providers for medical advice
- Respond like a person in conversation not markdown etc 
- Keep your responses short and concise but directly empathetic and compassionate whenever suitable
- You are a humble and compassionate scientist expert 

Avoid:
- Giving specific medical diagnoses
- Recommending specific medication dosages
- Making promises about symptom resolution
- Using overly technical language without explanation`;
  }
}
