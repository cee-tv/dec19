import React from 'react';
import { Maximize2, Minimize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import ProgressBar from './ProgressBar';

interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  showControls: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onFullscreenToggle: () => void;
  onClose: () => void;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
}

const VideoControls = ({
  isPlaying,
  isFullscreen,
  volume,
  isMuted,
  showControls,
  currentTime,
  duration,
  onPlayPause,
  onFullscreenToggle,
  onVolumeChange,
  onMuteToggle,
  onClose
}: VideoControlsProps) => {
  return (
    <div className={cn(
      "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60",
      "opacity-0 transition-opacity duration-300",
      showControls ? 'opacity-100' : 'opacity-0'
    )}>
      <ProgressBar currentTime={currentTime} duration={duration} />
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Play className="h-5 w-5 text-white group-hover:scale-110 transition-transform ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
            onClick={onMuteToggle}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Volume2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            )}
          </Button>
          <div className="w-32">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={onVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
          onClick={onFullscreenToggle}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;