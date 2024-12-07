import { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import ChannelGrid from '../components/ChannelGrid';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';

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

const channels: Channel[] = Array.from({ length: 90 }, (_, index) => ({
  id: String(index + 1),
  name: `Channel ${index + 1}`,
  logo: 'https://placehold.co/400x300/png',
  streamUrl: 'https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_hd.mpd',
  drmKey: {
    keyId: '2615129ef2c846a9bbd43a641c7303ef',
    key: '07c7f996b1734ea288641a68e1cfdc4d'
  }
}));

// Add Cinema One as the last channel
channels.push({
  id: '91',
  name: 'Cinema One',
  logo: 'https://placehold.co/400x300/png',
  streamUrl: 'https://cinemaone-abscbn-ono.amagi.tv/index_3.m3u8'
});

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
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          ClearKey Channel Grid
        </h1>
        
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