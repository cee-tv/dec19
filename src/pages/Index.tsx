import { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import ChannelGrid from '../components/ChannelGrid';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { channels } from '../data/channels';

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  drmUrl?: string;
  drmKey?: {
    keyId: string;
    key: string;
  };
}

const Index = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChannelSelect = (channel: Channel) => {
    console.log('Selected channel:', channel);
    setSelectedChannel(channel);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <img 
            src="https://raw.githubusercontent.com/cee-tv/Chinatv/refs/heads/main/Picsart_24-07-19_20-57-59-759.png"
            alt="CeePlay Logo"
            className="h-12 w-auto"
          />
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            CeePlay
          </h1>
        </div>
        
        <div className="relative">
          <Input
            type="search"
            placeholder="Search channels..."
            className="w-full glass rounded-2xl h-12 px-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <ChannelGrid
            channels={filteredChannels}
            onChannelSelect={handleChannelSelect}
            selectedChannelId={selectedChannel?.id}
          />
        </ScrollArea>
      </div>

      {selectedChannel && (
        <div className="fixed inset-0 z-50 bg-black">
          <VideoPlayer
            manifestUrl={selectedChannel.streamUrl}
            drmKey={selectedChannel.drmKey}
            onClose={() => setSelectedChannel(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;