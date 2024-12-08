import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

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
        if (manifestUrl.includes('.m3u8')) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 30,
              maxBufferSize: 30 * 1000 * 1000, // 30MB
              maxBufferLength: 30,
              liveSyncDurationCount: 3,
              liveMaxLatencyDurationCount: 10,
              maxMaxBufferLength: 30,
              startLevel: -1, // Auto quality selection
              abrEwmaDefaultEstimate: 500000, // 500kbps default bandwidth estimate
              abrBandWidthFactor: 0.95,
              abrBandWidthUpFactor: 0.7,
              fragLoadingTimeOut: 20000,
              manifestLoadingTimeOut: 20000,
              levelLoadingTimeOut: 20000
            });
            hlsRef.current = hls;
            hls.loadSource(manifestUrl);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play();
            });
          } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = manifestUrl;
          }
        } else {
          const { default: shaka } = await import('shaka-player');
          
          if (!shaka.Player.isBrowserSupported()) {
            console.error('Browser not supported!');
            return;
          }

          const player = new shaka.Player(videoRef.current);
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
          console.log('Video loaded successfully');
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
  }, [manifestUrl, drmKey, videoRef]);

  return null;
};

export default PlayerCore;