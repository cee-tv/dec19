import { Channel } from '../pages/Index';
import { cn } from '../lib/utils';
import { Card } from './ui/card';
import { Play } from 'lucide-react';
import { Button } from './ui/button';

interface ChannelGridProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  selectedChannelId?: string;
}

const ChannelGrid = ({ channels, onChannelSelect, selectedChannelId }: ChannelGridProps) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      {channels.map((channel) => (
        <Card
          key={channel.id}
          className={cn(
            "group relative aspect-square cursor-pointer transition-all duration-300 glass overflow-hidden",
            "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl",
            selectedChannelId === channel.id && "ring-2 ring-primary",
          )}
        >
          <div className="absolute inset-0 w-full h-full">
            <img
              src={channel.logo}
              alt={`${channel.name} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "bg-[rgba(229,9,20,0.8)] hover:bg-[rgba(229,9,20,0.9)]",
              "w-[40px] h-[40px] p-0 flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "border-none rounded-full"
            )}
            onClick={() => onChannelSelect(channel)}
          >
            <Play className="h-4 w-4" />
          </Button>
          
          <div className={cn(
            "absolute bottom-0 left-0 right-0",
            "bg-gradient-to-t from-black/90 to-transparent",
            "transform transition-transform duration-300",
            selectedChannelId === channel.id ? "translate-y-0" : "translate-y-full",
            "group-hover:translate-y-0 p-2"
          )}>
            <h3 className="text-xs font-medium text-white text-center truncate">
              {channel.name}
            </h3>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ChannelGrid;