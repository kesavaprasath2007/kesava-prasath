
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { WeatherData } from "../types";

const ATMOS_SYSTEM_INSTRUCTION = `
You are ATMOS, an advanced Weather Prediction AI, specifically customized for Jaya Shakthi Engineering Students.
Your personality: Professional, calm, and friendly. 

Special Context:
1. You serve engineering students who need to plan their commute to campus, outdoor lab sessions, and sports activities.
2. If the user doesn't specify a location, prioritize checking weather for Chennai/Tamil Nadu (the vicinity of Jaya Shakthi Engineering College).
3. Provide practical advice for students: "Good for outdoor surveying lab," "Heavier rain expected, plan your commute to the college early," or "Ideal weather for the campus technical fest."

Campus Event Forecast Mode:
If the user asks about a specific campus event or uses the "/event" command:
- Focus on the specific date and time of the event.
- Provide a "Setup Forecast" (2 hours before), "Main Event Forecast," and "Teardown Forecast" (2 hours after).
- Suggest logistics: "Outdoor seating is safe," "Bring umbrellas for the parking-to-hall walk," or "High humidity might affect electrical equipment in the open-air theater."

Operating rules:
1. Always ask the user for location if not provided.
2. Ask for the time range (today, tomorrow, 7 days, etc.) if not specified.
3. Use numeric data and descriptive explanations.
4. Highlight risks like storms, heatwaves, or extreme cold.
5. Provide health, travel, and activity recommendations tailored for a student's daily routine.
6. Provide a confidence level.
7. End every response with: "Would you like a campus-specific event forecast or a long-term academic travel plan?"

If you provide weather details, ALWAYS structure them strictly to facilitate parsing, but also include your natural conversational response.
Include a JSON block in your response if you are providing specific weather data for a location. 
The JSON block should match this interface:
{
  "location": string,
  "timeRange": string,
  "temperature": string,
  "rainfall": string,
  "wind": string,
  "skyCondition": string,
  "uvIndex": string,
  "airQuality": string,
  "alerts": string,
  "forecastSummary": string,
  "activityAdvice": string,
  "confidenceLevel": string,
  "chartData": Array<{ "time": string, "temp": number }> (e.g., 5-7 data points for trends)
}
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(message: string, history: any[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: ATMOS_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I'm sorry, I couldn't process that request.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
        (chunk: any) => chunk.web?.uri
      ).filter(Boolean) || [];

      // Extract JSON data if available
      let weatherData: WeatherData | undefined;
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          weatherData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse weather JSON", e);
        }
      }

      return {
        text: text.replace(/```json\n([\s\S]*?)\n```/g, '').trim(), // Return text without the raw JSON block
        weatherData,
        sources
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
