import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from './ui/button';
import * as shaka from 'shaka-player';

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

          const player = new shaka.Player();
          await player.attach(videoRef.current);
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

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="glass rounded-full hover:bg-white/90 dark:hover:bg-black/90"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="glass rounded-full hover:bg-white/90 dark:hover:bg-black/90"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;