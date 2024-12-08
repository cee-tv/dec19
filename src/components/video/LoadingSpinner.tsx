import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  isVisible: boolean;
}

const LoadingSpinner = ({ isVisible }: LoadingSpinnerProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
};

export default LoadingSpinner;