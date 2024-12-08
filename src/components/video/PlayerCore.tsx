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
        console.log('Attempting to load stream:', manifestUrl);

        if (manifestUrl.includes('.m3u8')) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup: (xhr) => {
                xhr.withCredentials = true; // Enable credentials for CORS
              },
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

            hls.on(Hls.Events.ERROR, (event, data) => {
              console.error('HLS Error:', data);
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.log('Fatal network error encountered, trying to recover');
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log('Fatal media error encountered, trying to recover');
                    hls.recoverMediaError();
                    break;
                  default:
                    console.error('Fatal error, cannot recover');
                    hls.destroy();
                    break;
                }
              }
            });

            hls.loadSource(manifestUrl);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play().catch(e => {
                console.error('Error auto-playing:', e);
              });
            });
          } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = manifestUrl;
          }
        } else {
          const { default: shaka } = await import('shaka-player');
          
          shaka.polyfill.installAll();
          
          if (!shaka.Player.isBrowserSupported()) {
            console.error('Browser not supported for Shaka Player');
            return;
          }

          const player = new shaka.Player(videoRef.current);
          playerRef.current = player;

          // Add error handling
          player.addEventListener('error', (event) => {
            console.error('Shaka Player Error:', event.detail);
          });

          player.configure({
            streaming: {
              bufferingGoal: 30,
              rebufferingGoal: 2,
              bufferBehind: 30,
              retryParameters: {
                maxAttempts: 4,
                baseDelay: 1000,
                backoffFactor: 2,
                fuzzFactor: 0.5,
                timeout: 30000 // Increased timeout
              },
              smallGapLimit: 0.5,
              jumpLargeGaps: true
            },
            manifest: {
              retryParameters: {
                maxAttempts: 4,
                baseDelay: 1000,
                backoffFactor: 2,
                fuzzFactor: 0.5,
                timeout: 30000 // Increased timeout
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

          try {
            await player.load(manifestUrl);
            console.log('Video loaded successfully');
          } catch (error) {
            console.error('Error loading video:', error);
            // Try to recover from error
            if (player.retryStreaming) {
              console.log('Attempting to retry streaming...');
              player.retryStreaming();
            }
          }
        }
      } catch (error) {
        console.error('Error initializing player:', error);
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