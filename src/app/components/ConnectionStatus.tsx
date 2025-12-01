import React from 'react';
import { useServerStatus } from '../../store/earthquakeStore';
import { Wifi, WifiOff, Users } from 'lucide-react';
import clsx from 'clsx';

const ConnectionStatus: React.FC = () => {
  const serverStatus = useServerStatus();
  const { isConnected, socketConnected, connectedClients, lastUpdate } = serverStatus;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-sm">
        {isConnected ? (
          <Wifi className={clsx("w-4 h-4", socketConnected ? "text-emerald-400" : "text-amber-400")} />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <span className={clsx("text-xs font-medium", isConnected ? "text-emerald-400" : "text-red-400")}>
          {isConnected ? (socketConnected ? 'Realtime' : 'Polling') : 'Disconnected'}
        </span>
      </div>

      {connectedClients > 0 && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-sm text-slate-400">
          <Users className="w-3 h-3" />
          <span className="text-xs font-medium">{connectedClients} online</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
