import { Play, Pause, Volume2, VolumeX, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { VideoControlsProps } from './VideoPlayerTypes';

const VideoControls = ({
  isPlaying,
  isFullscreen,
  volume,
  isMuted,
  showControls,
  onPlayPause,
  onFullscreenToggle,
  onVolumeChange,
  onMuteToggle,
  onClose
}: VideoControlsProps) => {
  return (
    <>
      {/* Close button at top right */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-4 right-4 text-white hover:bg-white/20 z-50",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Bottom controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onMuteToggle}
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
            <Slider
              className="w-24"
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={onVolumeChange}
            />
          </div>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onFullscreenToggle}
          >
            {isFullscreen ? (
              <Minimize2 className="h-6 w-6" />
            ) : (
              <Maximize2 className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default VideoControls;