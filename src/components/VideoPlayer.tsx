import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Maximize2, Minimize2, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import shaka from 'shaka-player';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  manifestUrl: string;
  drmKey?: {
    keyId: string;
    key: string;
  };
  onClose?: () => void;
}

const VideoPlayer = ({ manifestUrl, drmKey, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  useEffect(() => {
    const initPlayer = async () => {
      if (!videoRef.current) return;

      if (playerRef.current) {
        await playerRef.current.destroy();
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      try {
        if (manifestUrl.includes('.m3u8')) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(manifestUrl);
            hls.attachMedia(videoRef.current);
            console.log('HLS player initialized');
          } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = manifestUrl;
          }
        } else {
          shaka.polyfill.installAll();
          if (!shaka.Player.isBrowserSupported()) {
            console.error('Browser not supported!');
            return;
          }

          const player = new shaka.Player(videoRef.current);
          playerRef.current = player;

          if (drmKey) {
            player.configure({
              drm: {
                clearKeys: {
                  [drmKey.keyId]: drmKey.key
                }
              }
            });
          }

          await player.load(manifestUrl);
          console.log('The video has now been loaded!');
          
          if (containerRef.current) {
            containerRef.current.requestFullscreen();
          }
        }
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [manifestUrl, drmKey]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onClick={togglePlay}
      />
      
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        showControls ? 'opacity-100' : 'opacity-0'
      )}>
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Maximize2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            )}
          </Button>
        </div>

        {/* Center play/pause button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          ) : (
            <Play className="h-8 w-8 text-white group-hover:scale-110 transition-transform ml-1" />
          )}
        </Button>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
            onClick={toggleMute}
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
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;