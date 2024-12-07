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
            "group relative p-4 cursor-pointer transition-all duration-300",
            "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary",
            selectedChannelId === channel.id && "ring-2 ring-primary",
          )}
        >
          <div className="aspect-video mb-3 overflow-hidden rounded-md bg-muted">
            <img
              src={channel.logo}
              alt={`${channel.name} logo`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <h3 className="text-sm font-medium text-card-foreground truncate">
            {channel.name}
          </h3>
        </Card>
      ))}
    </div>
  );
};

export default ChannelGrid;