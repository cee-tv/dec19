import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  isVisible: boolean;
}

const LoadingSpinner = ({ isVisible }: LoadingSpinnerProps) => {
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "transition-opacity duration-200",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
};

export default LoadingSpinner;