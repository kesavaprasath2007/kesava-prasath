
import React from 'react';
import { Calendar, Trophy, Music, Zap, ArrowRight } from 'lucide-react';
import { CampusEvent } from '../types';

interface CampusEventsProps {
  onCheckEvent: (event: CampusEvent) => void;
}

const MOCK_EVENTS: CampusEvent[] = [
  { id: '1', name: 'Inter-College Sports Meet', date: 'March 15, 2024', time: '08:00 AM', type: 'sports', location: 'Main Ground' },
  { id: '2', name: 'Jaya Shakthi Tech Expo', date: 'March 18, 2024', time: '10:00 AM', type: 'technical', location: 'Auditorium' },
  { id: '3', name: 'Cultural Night: SANGAM', date: 'March 22, 2024', time: '05:30 PM', type: 'cultural', location: 'Open Air Theater' },
];

const CampusEvents: React.FC<CampusEventsProps> = ({ onCheckEvent }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'sports': return <Trophy className="text-emerald-400" size={18} />;
      case 'technical': return <Zap className="text-blue-400" size={18} />;
      case 'cultural': return <Music className="text-purple-400" size={18} />;
      default: return <Calendar className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar size={20} className="text-blue-400" />
          Upcoming Campus Events
        </h3>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">March 2024</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MOCK_EVENTS.map((event) => (
          <div 
            key={event.id} 
            className="glass p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  {getIcon(event.type)}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{event.time}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {event.name}
              </h4>
              <p className="text-[10px] text-slate-400 mb-4">{event.date} • {event.location}</p>
            </div>
            
            <button 
              onClick={() => onCheckEvent(event)}
              className="w-full py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              Get Event Forecast <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampusEvents;
