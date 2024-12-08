import { useEffect, useRef, useState } from 'react';
import VideoControls from './video/VideoControls';
import CenterPlayButton from './video/CenterPlayButton';
import PlayerCore from './video/PlayerCore';
import LoadingSpinner from './video/LoadingSpinner';
import type { VideoPlayerProps } from './video/VideoPlayerTypes';

const VideoPlayer = ({ manifestUrl, drmKey, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);  // Changed to false initially
  const [isPlaying, setIsPlaying] = useState(false);  // Changed to false initially
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
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Add video event listeners for buffering state
    const video = videoRef.current;
    if (video) {
      const handleWaiting = () => setIsBuffering(true);
      const handlePlaying = () => setIsBuffering(false);
      const handleCanPlay = () => {
        setIsBuffering(false);
        video.play().catch(() => {
          // Autoplay was prevented
          setIsPlaying(false);
        });
      };

      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('canplay', handleCanPlay);

      return () => {
        if (container) {
          container.removeEventListener('mousemove', handleMouseMove);
        }
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('canplay', handleCanPlay);
        clearTimeout(timeout);
      };
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
      
      <PlayerCore
        manifestUrl={manifestUrl}
        drmKey={drmKey}
        videoRef={videoRef}
      />
      
      <LoadingSpinner isVisible={isBuffering} />

      <VideoControls
        isPlaying={isPlaying}
        isFullscreen={isFullscreen}
        volume={volume}
        isMuted={isMuted}
        showControls={showControls}
        onPlayPause={togglePlay}
        onFullscreenToggle={toggleFullscreen}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={toggleMute}
        onClose={onClose}
      />

      <CenterPlayButton
        isPlaying={isPlaying}
        showControls={showControls}
        onClick={togglePlay}
      />
    </div>
  );
};

export default VideoPlayer;