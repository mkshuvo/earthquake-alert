'use client';

import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, color, delay = 0 }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (typeof value === 'number' && isVisible) {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, isVisible]);

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-${color}-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-${color}-500/20 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transition: 'all 0.5s ease-out' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
