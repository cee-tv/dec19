import { useEffect, useRef, useState } from 'react';
import VideoControls from './video/VideoControls';
import PlayerCore from './video/PlayerCore';
import type { VideoPlayerProps } from './video/VideoPlayerTypes';
import { Loader2 } from 'lucide-react';

const VideoPlayer = ({ manifestUrl, channelTitle, drmKey, onClose, onPrevChannel, onNextChannel }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);

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
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    const video = videoRef.current;

    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    if (video) {
      video.addEventListener('waiting', () => setIsBuffering(true));
      video.addEventListener('playing', () => setIsBuffering(false));
      video.addEventListener('canplay', () => {
        setIsBuffering(false);
        video.play();
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (video) {
        video.removeEventListener('waiting', () => setIsBuffering(true));
        video.removeEventListener('playing', () => setIsBuffering(false));
        video.removeEventListener('canplay', () => setIsBuffering(false));
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
      
      <PlayerCore
        manifestUrl={manifestUrl}
        drmKey={drmKey}
        videoRef={videoRef}
      />
      
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      <VideoControls
        isPlaying={isPlaying}
        isFullscreen={isFullscreen}
        volume={volume}
        isMuted={isMuted}
        showControls={showControls}
        channelTitle={channelTitle}
        onPlayPause={togglePlay}
        onFullscreenToggle={toggleFullscreen}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={toggleMute}
        onClose={onClose}
        onPrevChannel={onPrevChannel}
        onNextChannel={onNextChannel}
      />
    </div>
  );
};

export default VideoPlayer;