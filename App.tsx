
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import ChatWindow from './components/ChatWindow';
import CampusEvents from './components/CampusEvents';
import { geminiService } from './services/geminiService';
import { ChatMessage, WeatherData, TempUnit, CampusEvent } from './types';
import { AlertCircle, ThermometerSun, Wind, CloudLightning, BookOpen, Map, Shield, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentWeatherData, setCurrentWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TempUnit>('C');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleUnit = useCallback(() => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await geminiService.sendMessage(text, history);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        data: response.weatherData,
        sources: response.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.weatherData) {
        setCurrentWeatherData(response.weatherData);
      }
    } catch (err: any) {
      console.error(err);
      setError("ATMOS is currently experiencing connection issues. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const handleCheckEvent = useCallback((event: CampusEvent) => {
    const prompt = `/event Forecast for "${event.name}" happening on ${event.date} at ${event.time} located at ${event.location}. Give me a setup, main, and teardown weather guide.`;
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const prompt = `Please provide a detailed weather report for my current GPS location: ${latitude}, ${longitude}. Also, tell me exactly which locality or city this is.`;
        handleSendMessage(prompt);
      },
      (err) => {
        setIsLoading(false);
        setError("Unable to retrieve your location. Please check your browser permissions.");
        console.error(err);
      }
    );
  }, [handleSendMessage]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = "Welcome to ATMOS, the official Weather Intelligence platform for **Jaya Shakthi Engineering Students**. \n\nI can help you plan your campus travel, outdoor lab sessions (like Surveying or Civil Labs), and sports activities based on real-time Chennai weather data.\n\nAre you currently on campus, or heading there now?";
      setMessages([{ role: 'assistant', content: welcomeText }]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100">
      <Header unit={unit} onToggleUnit={toggleUnit} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12 flex flex-col gap-12">
        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-300 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Hero Section / Overview */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Event Season Is Here</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Academic Weather <br /> 
            <span className="atmos-gradient bg-clip-text text-transparent">Powering Jaya Shakthi.</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Personalized weather insights for engineering students. From lab planning to event travel, 
            ATMOS ensures you're never caught off guard by the Chennai elements.
          </p>
        </section>

        {/* Campus Events Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <CampusEvents onCheckEvent={handleCheckEvent} />
        </section>

        {/* Dynamic Weather Content */}
        <section className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-3/5 space-y-8 order-2 lg:order-1">
            {currentWeatherData ? (
              <WeatherCard data={currentWeatherData} unit={unit} />
            ) : (
              <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 border-white/5 min-h-[400px]">
                <div className="flex gap-4">
                  <ThermometerSun className="text-blue-500 w-12 h-12" />
                  <Wind className="text-emerald-500 w-12 h-12" />
                  <CloudLightning className="text-purple-500 w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Student Dashboard</h3>
                  <p className="text-slate-400 max-w-sm mt-2">
                    Ask me about the weather in Chennai or near college to unlock student-focused activity advice.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
                <button 
                  onClick={handleDetectLocation}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-2xl atmos-gradient text-white font-semibold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Map size={18} />}
                  Auto-Detect My Campus Location
                </button>
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/5 order-1 lg:order-2 sticky top-24">
            <ChatWindow 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              onDetectLocation={handleDetectLocation}
              isLoading={isLoading} 
            />
          </div>
        </section>

        {/* Student-Centric Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
          <FeatureItem 
            title="Lab Day Prep" 
            desc="Predicts humidity and heat for outdoor engineering labs and workshops."
            icon={<BookOpen className="text-orange-400" />}
          />
          <FeatureItem 
            title="Commute Planning" 
            desc="Live tracking of monsoon risks and waterlogging on routes to college."
            icon={<Map className="text-blue-400" />}
          />
          <FeatureItem 
            title="Campus Safety" 
            desc="Instant alerts for extreme heat or cyclonic weather affecting TN."
            icon={<Shield className="text-purple-400" />}
          />
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/50 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 atmos-gradient rounded-lg" />
            <span className="font-bold text-white">ATMOS AI | JSEC Edition</span>
          </div>
          <p className="text-slate-500 text-xs">
            © 2024 Created for Jaya Shakthi Engineering Students. Grounded by Google Search.
          </p>
          <div className="flex gap-6 text-slate-400 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">College Portal</a>
            <a href="#" className="hover:text-white transition-colors">Weather API</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureItem: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-white font-semibold mb-2">{title}</h4>
    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
  </div>
);

export default App;
