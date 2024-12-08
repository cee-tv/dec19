import { type Channel } from '../types/channel';

interface ChannelGridProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  selectedChannelId?: string;
}

const ChannelGrid = ({ channels, onChannelSelect, selectedChannelId }: ChannelGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {channels.map(channel => (
        <div
          key={channel.id}
          className={`p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${selectedChannelId === channel.id ? 'border-primary' : 'border-transparent'}`}
          onClick={() => onChannelSelect(channel)}
        >
          <img src={channel.logo} alt={channel.name} className="w-full h-auto rounded-md" />
          <h2 className="mt-2 text-center text-lg font-semibold">{channel.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default ChannelGrid;
