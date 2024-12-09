export interface VideoPlayerProps {
  manifestUrl: string;
  drmKey?: {
    keyId: string;
    key: string;
  };
  onClose?: () => void;
  onPrevChannel?: () => void;
  onNextChannel?: () => void;
}

export interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  showControls: boolean;
  onPlayPause: () => void;
  onFullscreenToggle: () => void;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
  onClose?: () => void;
  onPrevChannel?: () => void;
  onNextChannel?: () => void;
}