import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
}

const ProgressBar = ({ currentTime, duration }: ProgressBarProps) => {
  const progress = (currentTime / duration) * 100 || 0;
  
  return (
    <div className="absolute bottom-16 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;