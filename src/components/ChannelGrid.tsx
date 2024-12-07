import { Channel } from '../pages/Index';
import { cn } from '../lib/utils';
import { Card } from './ui/card';

interface ChannelGridProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  selectedChannelId?: string;
}

const ChannelGrid = ({ channels, onChannelSelect, selectedChannelId }: ChannelGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {channels.map((channel) => (
        <Card
          key={channel.id}
          onClick={() => onChannelSelect(channel)}
          className={cn(
            "group relative p-3 cursor-pointer transition-all duration-300 glass",
            "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl",
            "flex items-center justify-center aspect-[4/3]",
            selectedChannelId === channel.id && "ring-2 ring-primary",
          )}
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={channel.logo}
                alt={`${channel.name} logo`}
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-card-foreground truncate">
                {channel.name}
              </h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ChannelGrid;