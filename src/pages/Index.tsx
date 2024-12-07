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
  drmKey?: {
    keyId: string;
    key: string;
  };
}

const channels: Channel[] = [
  {
    id: '1',
    name: 'TV5',
    logo: '/placeholder.svg',
    streamUrl: 'https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_hd.mpd',
    drmKey: {
      keyId: '2615129ef2c846a9bbd43a641c7303ef',
      key: '07c7f996b1734ea288641a68e1cfdc4d'
    }
  },
  {
    id: '2',
    name: 'Cinema One',
    logo: '/placeholder.svg',
    streamUrl: 'https://cinemaone-abscbn-ono.amagi.tv/index_3.m3u8'
  }
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
                drmKey={selectedChannel.drmKey}
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