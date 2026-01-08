
import React from 'react';
import { Cpu, GraduationCap } from 'lucide-react';
import { TempUnit } from '../types';

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: () => void;
}

const Header: React.FC<HeaderProps> = ({ unit, onToggleUnit }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 atmos-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative">
          <Cpu className="text-white w-6 h-6" />
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 border border-blue-500">
             <GraduationCap className="text-blue-600 w-2.5 h-2.5" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-none">ATMOS</h1>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mt-0.5">Jaya Shakthi Engineering Edition</span>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Campus Forecast</a>
        <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Study Planner</a>
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleUnit}
          className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 hover:bg-white/10 transition-colors"
          title={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
        >
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${unit === 'C' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
            °C
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${unit === 'F' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
            °F
          </div>
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-semibold text-blue-300">Student Mode</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
