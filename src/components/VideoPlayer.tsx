import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
// @ts-ignore
import shaka from 'shaka-player';

const VideoPlayer = ({ manifestUrl, drmKey, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const initPlayer = async () => {
      if (!videoRef.current) return;

      const player = new shaka.Player(videoRef.current);

      player.addEventListener('error', onErrorEvent);

      try {
        await player.load(manifestUrl);
        if (drmKey) {
          const config = {
            drm: {
              servers: {
                'com.widevine.alpha': drmKey.key,
              },
            },
          };
          player.configure(config);
        }
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    initPlayer();

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [manifestUrl, drmKey]);

  const onErrorEvent = (event) => {
    console.error('Error code', event.detail.code, 'object', event.detail);
  };

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} className="w-full h-full" controls />
      <Button
        variant="ghost"
        className="absolute top-4 right-4"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default VideoPlayer;
