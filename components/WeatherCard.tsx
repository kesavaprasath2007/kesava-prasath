
import React from 'react';
import { Thermometer, Droplets, Wind, Sun, AlertTriangle, MapPin, Activity, ShieldCheck } from 'lucide-react';
import { WeatherData, TempUnit } from '../types';
import ForecastChart from './ForecastChart';

interface WeatherCardProps {
  data: WeatherData;
  unit: TempUnit;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit }) => {
  // Helper to convert temperature string to desired unit
  const formatTemp = (tempStr: string, targetUnit: TempUnit) => {
    const match = tempStr.match(/(-?\d+(?:\.\d+)?)\s*°?([CF])/i);
    if (!match) return tempStr;

    const value = parseFloat(match[1]);
    const sourceUnit = match[2].toUpperCase();

    if (sourceUnit === targetUnit) return `${value}°${targetUnit}`;

    if (sourceUnit === 'C' && targetUnit === 'F') {
      return `${Math.round((value * 9) / 5 + 32)}°F`;
    } else if (sourceUnit === 'F' && targetUnit === 'C') {
      return `${Math.round(((value - 32) * 5) / 9)}°C`;
    }

    return tempStr;
  };

  // Prepare chart data based on selected unit
  const processedChartData = data.chartData?.map(point => ({
    ...point,
    temp: unit === 'F' ? Math.round((point.temp * 9) / 5 + 32) : point.temp
  }));

  return (
    <div className="glass rounded-3xl p-6 md:p-8 w-full max-w-4xl mx-auto overflow-hidden relative shadow-2xl">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <MapPin size={18} />
            <span className="text-sm font-semibold tracking-wide uppercase">{data.location}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {formatTemp(data.temperature, unit)}
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
              {data.skyCondition}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300">
              Confidence: {data.confidenceLevel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <StatBox icon={<Droplets size={16} />} label="Rainfall" value={data.rainfall} />
          <StatBox icon={<Wind size={16} />} label="Wind" value={data.wind} />
          <StatBox icon={<Sun size={16} />} label="UV Index" value={data.uvIndex} />
          <StatBox icon={<Activity size={16} />} label="Air Quality" value={data.airQuality} />
        </div>
      </div>

      {data.alerts && data.alerts.toLowerCase() !== 'none' && (
        <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200">
          <AlertTriangle className="text-red-400 shrink-0" />
          <p className="text-sm font-medium">{data.alerts}</p>
        </div>
      )}

      {processedChartData && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Temperature Trend (°{unit})</h3>
          <ForecastChart data={processedChartData} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-400" />
            Forecast Summary
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
            {data.forecastSummary}
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" />
            Activity Advice
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
            {data.activityAdvice}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center min-w-[100px]">
    <div className="text-blue-400 mb-2">{icon}</div>
    <span className="text-[10px] uppercase tracking-tighter text-slate-400 mb-1 font-bold">{label}</span>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
);

export default WeatherCard;
