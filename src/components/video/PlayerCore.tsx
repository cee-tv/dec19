import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
// Import shaka-player as a namespace instead of a direct import
import * as shaka from 'shaka-player/dist/shaka-player.ui';

interface PlayerCoreProps {
  manifestUrl: string;
  drmKey?: {
    keyId: string;
    key: string;
  };
  videoRef: React.RefObject<HTMLVideoElement>;
}

const PlayerCore = ({ manifestUrl, drmKey, videoRef }: PlayerCoreProps) => {
  const playerRef = useRef<shaka.Player | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const initPlayer = async () => {
      if (!videoRef.current) return;

      // Cleanup previous instances
      if (playerRef.current) {
        await playerRef.current.destroy();
        playerRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      try {
        if (manifestUrl.includes('.m3u8')) {
          // HLS Optimization
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 30,
              maxBufferSize: 30 * 1000 * 1000, // 30MB
              maxBufferLength: 30,
              startLevel: -1, // Auto quality selection
              abrEwmaDefaultEstimate: 500000, // 500kbps initial estimate
              abrMaxWithRealBitrate: true,
              progressive: true // Enable progressive loading
            });
            hlsRef.current = hls;
            hls.loadSource(manifestUrl);
            hls.attachMedia(videoRef.current);
          } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = manifestUrl;
          }
        } else {
          // DASH Optimization
          shaka.polyfill.installAll();
          
          if (!shaka.Player.isBrowserSupported()) {
            console.error('Browser not supported!');
            return;
          }

          const player = new shaka.Player();
          await player.attach(videoRef.current);
          playerRef.current = player;

          // Optimize Shaka Player configuration
          player.configure({
            streaming: {
              bufferingGoal: 30,
              rebufferingGoal: 2,
              bufferBehind: 30,
              retryParameters: {
                maxAttempts: 4,
                baseDelay: 100,
                backoffFactor: 2,
                fuzzFactor: 0.5
              },
              smallGapLimit: 0.5,
              jumpLargeGaps: true
            },
            abr: {
              enabled: true,
              defaultBandwidthEstimate: 1000000,
              switchInterval: 8,
              bandwidthUpgradeTarget: 0.85,
              bandwidthDowngradeTarget: 0.95
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