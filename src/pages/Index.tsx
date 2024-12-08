import { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import ChannelGrid from '../components/ChannelGrid';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { channels } from '../data/channels';

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
            src="/lovable-uploads/69e9c2f6-59f7-404a-8ad3-a6cc3586d51d.png"
            alt="CeePlay Logo"
            className="w-12 h-12"
          />
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
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