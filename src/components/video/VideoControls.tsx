import React from 'react';
import { Maximize2, Minimize2, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  showControls: boolean;
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
  onPlayPause,
  onFullscreenToggle,
  onClose,
  onVolumeChange,
  onMuteToggle
}: VideoControlsProps) => {
  return (
    <div className={cn(
      "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60",
      "opacity-0 transition-opacity duration-300",
      showControls ? 'opacity-100' : 'opacity-0'
    )}>
      {/* Top right close button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
        </Button>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Left side play/pause button */}
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

          {/* Volume controls */}
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

        {/* Right side fullscreen button */}
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