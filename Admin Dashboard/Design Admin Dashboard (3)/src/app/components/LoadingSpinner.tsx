import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading data from server...</p>
      </div>
    </div>
  );
}

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
