import { Maximize2, Minimize2, Play, Pause, Volume2, VolumeX, X, SkipBack, SkipForward } from 'lucide-react';
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
  channelTitle,
  onPlayPause,
  onFullscreenToggle,
  onVolumeChange,
  onMuteToggle,
  onClose,
  onPrevChannel,
  onNextChannel
}: VideoControlsProps) => {
  return (
    <>
      {/* Top bar with close button and channel title */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent",
          "flex items-center justify-between",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <h2 className="text-white text-xl font-semibold">
          {channelTitle}
        </h2>
        
        <div className="w-10" /> {/* Spacer to center the title */}
      </div>

      {/* Bottom controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-4">
          {/* Previous Channel Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={onPrevChannel}
            disabled={!onPrevChannel}
          >
            <SkipBack className="h-6 w-6" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>

          {/* Next Channel Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={onNextChannel}
            disabled={!onNextChannel}
          >
            <SkipForward className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
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
            className="text-white hover:bg-white/20 rounded-full"
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