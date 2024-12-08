import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
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
              backBufferLength: 90
            });
            hlsRef.current = hls;
            hls.loadSource(manifestUrl);
            hls.attachMedia(videoRef.current);
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
              },
              streaming: {
                bufferingGoal: 30,
                rebufferingGoal: 15,
                bufferBehind: 30
              },
              abr: {
                enabled: true,
                defaultBandwidthEstimate: 1000000
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