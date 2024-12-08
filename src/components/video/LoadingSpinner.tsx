import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  isVisible: boolean;
}

const LoadingSpinner = ({ isVisible }: LoadingSpinnerProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20 h-16 w-16" />
        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
      </div>
    </div>
  );
};

export default LoadingSpinner;