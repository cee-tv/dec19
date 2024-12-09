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
              backBufferLength: 10,
              maxBufferSize: 15 * 1000 * 1000,
              maxBufferLength: 15,
              startLevel: -1,
              abrEwmaDefaultEstimate: 1000000,
              abrMaxWithRealBitrate: true,
              progressive: true,
              testBandwidth: false,
              fragLoadingTimeOut: 8000,
              manifestLoadingTimeOut: 8000,
              manifestLoadingMaxRetry: 2
            });
            hlsRef.current = hls;
            hls.loadSource(manifestUrl);
            hls.attachMedia(videoRef.current);
            
            // Start playing as soon as possible
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play();
            });
          } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = manifestUrl;
            videoRef.current.play();
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

          player.configure({
            streaming: {
              bufferingGoal: 10,
              rebufferingGoal: 1,
              bufferBehind: 15,
              retryParameters: {
                maxAttempts: 2,
                baseDelay: 100,
                backoffFactor: 1.5,
                timeout: 8000
              }
            },
            abr: {
              enabled: true,
              defaultBandwidthEstimate: 1000000,
              switchInterval: 4,
              bandwidthUpgradeTarget: 0.9,
              bandwidthDowngradeTarget: 0.7,
              restrictions: {
                minHeight: 360
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
          // Start playing immediately after loading
          videoRef.current.play();
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