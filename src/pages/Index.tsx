import { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import ChannelGrid from '../components/ChannelGrid';
import { toast } from '../components/ui/use-toast';

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  drmUrl?: string;
}

const channels: Channel[] = [
  {
    id: '1',
    name: 'Channel One',
    logo: '/placeholder.svg',
    streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
  },
  {
    id: '2',
    name: 'Channel Two',
    logo: '/placeholder.svg',
    streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
  },
  // Add more channels as needed
];

const Index = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const handleChannelSelect = (channel: Channel) => {
    console.log('Selected channel:', channel);
    setSelectedChannel(channel);
    toast({
      title: `Now playing: ${channel.name}`,
      duration: 2000,
    });
  };

  useEffect(() => {
    // Set initial channel
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {selectedChannel && (
            <div className="rounded-lg overflow-hidden shadow-lg bg-card">
              <VideoPlayer
                manifestUrl={selectedChannel.streamUrl}
                drmUrl={selectedChannel.drmUrl}
              />
            </div>
          )}
          <ChannelGrid
            channels={channels}
            onChannelSelect={handleChannelSelect}
            selectedChannelId={selectedChannel?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;