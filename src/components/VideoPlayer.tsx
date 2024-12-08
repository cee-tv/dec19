import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import VideoControls from './video/VideoControls';
import CenterPlayButton from './video/CenterPlayButton';
import LoadingSpinner from './video/LoadingSpinner';
import type { VideoPlayerProps } from './video/VideoPlayerTypes';

declare const shaka: any; // Fix for TypeScript shaka-player type issues

const VideoPlayer = ({ manifestUrl, drmKey, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleSeeking = () => setIsBuffering(true);
    const handleSeeked = () => setIsBuffering(false);

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

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
          await import('shaka-player/dist/shaka-player.compiled');
          
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