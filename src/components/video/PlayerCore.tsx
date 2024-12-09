import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
// Import shaka-player correctly
import * as shaka from 'shaka-player';

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
          // HLS Optimization for faster playback
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 10, // Reduced for faster initial load
              maxBufferSize: 15 * 1000 * 1000, // 15MB for faster loading
              maxBufferLength: 15,
              startLevel: -1, // Auto quality selection
              abrEwmaDefaultEstimate: 1000000, // 1Mbps initial estimate
              abrMaxWithRealBitrate: true,
              progressive: true,
              testBandwidth: false, // Skip initial bandwidth test
              fragLoadingTimeOut: 8000, // 8 seconds timeout
              manifestLoadingTimeOut: 8000,
              manifestLoadingMaxRetry: 2
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

          // Optimize Shaka Player configuration for faster playback
          player.configure({
            streaming: {
              bufferingGoal: 10, // Reduced buffer size for faster start
              rebufferingGoal: 1, // Start playing sooner after buffering
              bufferBehind: 15, // Keep less buffer behind
              retryParameters: {
                maxAttempts: 2, // Fewer retry attempts
                baseDelay: 100,
                backoffFactor: 1.5,
                timeout: 8000 // 8 seconds timeout
              }
            },
            abr: {
              enabled: true,
              defaultBandwidthEstimate: 1000000, // 1Mbps initial estimate
              switchInterval: 4, // Faster quality switches
              bandwidthUpgradeTarget: 0.9,
              bandwidthDowngradeTarget: 0.7,
              restrictions: {
                minHeight: 360 // Start with lower quality for faster initial load
              }
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