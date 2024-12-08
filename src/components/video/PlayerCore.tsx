import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import shaka from 'shaka-player';

interface PlayerCoreProps {
  manifestUrl: string;
  drmKey?: {
    keyId: string;
    key: string;
  };
  videoRef: React.RefObject<HTMLVideoElement>;
}

const PlayerCore = ({ manifestUrl, drmKey, videoRef }: PlayerCoreProps) => {
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<Hls | null>(null);

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
        // Add event listeners for play state
        const video = videoRef.current;
        const handlePlay = () => {
          const event = new Event('videoplay');
          video.dispatchEvent(event);
        };
        
        const handlePause = () => {
          const event = new Event('videopause');
          video.dispatchEvent(event);
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        if (manifestUrl.includes('.m3u8')) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 30,
              maxBufferSize: 30 * 1000 * 1000,
              maxBufferLength: 30,
              liveSyncDurationCount: 3,
              liveMaxLatencyDurationCount: 10,
              maxMaxBufferLength: 30,
              startLevel: -1,
              abrEwmaDefaultEstimate: 500000,
              abrBandWidthFactor: 0.95,
              abrBandWidthUpFactor: 0.7,
              fragLoadingTimeOut: 20000,
              manifestLoadingTimeOut: 20000,
              levelLoadingTimeOut: 20000
            });
            hlsRef.current = hls;
            hls.loadSource(manifestUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch(() => {
                // Autoplay was prevented
                handlePause();
              });
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = manifestUrl;
          }
        } else {
          const player = new shaka.Player(video);
          playerRef.current = player;

          player.configure({
            streaming: {
              bufferingGoal: 30,
              rebufferingGoal: 2,
              bufferBehind: 30,
              retryParameters: {
                maxAttempts: 4,
                baseDelay: 1000,
                backoffFactor: 2,
                fuzzFactor: 0.5
              },
              smallGapLimit: 0.5,
              jumpLargeGaps: true
            }
          });

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
          video.play().catch(() => {
            // Autoplay was prevented
            handlePause();
          });
        }

        return () => {
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('pause', handlePause);
        };
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
  }, [manifestUrl, drmKey, videoRef]);

  return null;
};

export default PlayerCore;