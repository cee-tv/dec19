import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface CenterPlayButtonProps {
  isPlaying: boolean;
  showControls: boolean;
  onClick: () => void;
}

const CenterPlayButton = ({ isPlaying, showControls, onClick }: CenterPlayButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-16 h-16 rounded-full bg-black/30 hover:bg-black/50",
        "backdrop-blur-sm border border-white/10 transition-all duration-200 group",
        "opacity-0 transition-opacity duration-300",
        showControls ? 'opacity-100' : 'opacity-0'
      )}
      onClick={onClick}
    >
      {isPlaying ? (
        <Pause className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
      ) : (
        <Play className="h-8 w-8 text-white group-hover:scale-110 transition-transform ml-1" />
      )}
    </Button>
  );
};

export default CenterPlayButton;