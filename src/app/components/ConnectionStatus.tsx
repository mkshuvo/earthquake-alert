import React from 'react';
import { useServerStatus, useError } from '../../store/earthquakeStore';

const ConnectionStatus: React.FC = () => {
  const serverStatus = useServerStatus();
  const error = useError();

  const getStatusColor = () => {
    if (serverStatus.isConnected) return 'text-green-400';
    return 'text-blue-400'; // Show blue for polling mode
  };

  const getStatusIcon = () => {
    if (serverStatus.isConnected) return '🟢';
    return '📡'; // Show antenna for polling
  };

  const getStatusText = () => {
    if (serverStatus.isConnected) return 'Connected';
    return 'Polling'; // Show polling instead of connecting
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusIcon()} {getStatusText()}
      </span>
      
      {serverStatus.lastUpdate && (
        <span className="text-xs text-gray-400">
          Last update: {serverStatus.lastUpdate.toLocaleTimeString()}
        </span>
      )}
      
      {serverStatus.connectedClients > 0 && (
        <span className="text-xs text-blue-400">
          ({serverStatus.connectedClients} clients)
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;
