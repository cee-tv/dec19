import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  isVisible: boolean;
}

const LoadingSpinner = ({ isVisible }: LoadingSpinnerProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="relative">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 animate-spin">
          <div className="h-16 w-16 rounded-full border-4 border-t-red-500 border-r-red-500/40 border-b-red-500/20 border-l-red-500/60" />
        </div>
        
        {/* Inner pulsing circle */}
        <div className="h-8 w-8 rounded-full bg-red-500/90 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default LoadingSpinner;