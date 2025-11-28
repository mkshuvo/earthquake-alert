import React from 'react';
import { useServerStatus, useError } from '../../store/earthquakeStore';

const ConnectionStatus: React.FC = () => {
  const serverStatus = useServerStatus();
  const error = useError();

  const getStatusColor = () => {
    if (error) return 'text-red-400';
    if (serverStatus.isConnected) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getStatusIcon = () => {
    if (error) return '❌';
    if (serverStatus.isConnected) return '🟢';
    return '🟡';
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (serverStatus.isConnected) return 'Connected';
    return 'Connecting...';
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
      
      {error && (
        <div className="text-xs text-red-400 max-w-md truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
