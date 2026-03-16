import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

export function ConnectionStatus({ isLoading, error, lastUpdated }: ConnectionStatusProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-600">
        <WifiOff className="h-3 w-3" />
        <span>Connection Error</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-blue-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Syncing...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-green-600">
      <Wifi className="h-3 w-3" />
      <span>
        Connected
        {lastUpdated && ` • Updated ${formatTimestamp(lastUpdated)}`}
      </span>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
