'use client';

import React from 'react';
import { useServerStatus } from '../../store/earthquakeStore';
import { Wifi, WifiOff, Users, Radio } from 'lucide-react';
import clsx from 'clsx';

const ConnectionStatus: React.FC = () => {
  const serverStatus = useServerStatus();
  const { isConnected, socketConnected, connectedClients } = serverStatus;

  return (
    <div className="flex items-center gap-3">
      {/* Connection Mode Indicator */}
      <div className={clsx(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-300",
        isConnected 
          ? socketConnected 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          : "bg-red-500/10 border-red-500/20 text-red-400"
      )}>
        {isConnected ? (
          <div className="relative flex items-center justify-center">
             <Wifi className="w-3.5 h-3.5" />
             {socketConnected && (
               <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
             )}
          </div>
        ) : (
          <WifiOff className="w-3.5 h-3.5" />
        )}
        <span className="text-xs font-medium uppercase tracking-wider">
          {isConnected ? (socketConnected ? 'Live Stream' : 'Polling') : 'Offline'}
        </span>
      </div>

      {/* Active Users Counter */}
      {connectedClients > 0 && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm text-slate-400">
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{connectedClients}</span>
        </div>
      )}
      
      {/* System Pulse */}
      <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
        <Radio className={clsx(
          "w-4 h-4 transition-colors duration-500",
          isConnected ? "text-cyan-500 animate-pulse" : "text-slate-600"
        )} />
      </div>
    </div>
  );
};

export default ConnectionStatus;
