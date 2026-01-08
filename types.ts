
export type TempUnit = 'C' | 'F';

export interface WeatherData {
  location: string;
  timeRange: string;
  temperature: string; // usually like "32°C"
  rainfall: string;
  wind: string;
  skyCondition: string;
  uvIndex: string;
  airQuality: string;
  alerts: string;
  forecastSummary: string;
  activityAdvice: string;
  confidenceLevel: string;
  chartData?: Array<{ time: string; temp: number }>; // temp is assumed to be in Celsius
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  data?: WeatherData;
  sources?: string[];
}

export interface CampusEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  type: 'academic' | 'sports' | 'cultural' | 'technical';
  location: string;
}
