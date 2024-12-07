import { useEffect, useRef } from 'react';
import shaka from 'shaka-player';

interface VideoPlayerProps {
  manifestUrl: string;
  drmUrl?: string;
}

const VideoPlayer = ({ manifestUrl, drmUrl }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);

  useEffect(() => {
    const initPlayer = async () => {
      if (!videoRef.current) return;

      // Install built-in polyfills to patch browser incompatibilities
      shaka.polyfill.installAll();

      // Check if the browser supports the basic functionality
      if (!shaka.Player.isBrowserSupported()) {
        console.error('Browser not supported!');
        return;
      }

      try {
        if (playerRef.current) {
          await playerRef.current.destroy();
        }

        // Create a Player instance
        const player = new shaka.Player(videoRef.current);
        playerRef.current = player;

        // Attach player event listeners
        player.addEventListener('error', (event) => {
          console.error('Error code', event.detail.code, 'object', event.detail);
        });

        // Configure DRM if URL is provided
        if (drmUrl) {
          player.configure({
            drm: {
              clearKeys: {
                // Add your DRM configuration here
              }
            }
          });
        }

        // Load the manifest
        await player.load(manifestUrl);
        console.log('The video has now been loaded!');
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [manifestUrl, drmUrl]);

  return (
    <div className="relative w-full aspect-video bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
      />
    </div>
  );
};

export default VideoPlayer;