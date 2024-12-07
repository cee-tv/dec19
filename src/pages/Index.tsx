import { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import ChannelGrid from '../components/ChannelGrid';
import { toast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../components/ui/drawer';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { X } from 'lucide-react';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChannelSelect = (channel: Channel) => {
    console.log('Selected channel:', channel);
    setSelectedChannel(channel);
    setIsDrawerOpen(true);
    toast({
      title: `Now playing: ${channel.name}`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search channels..."
              className="w-full"
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
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>{selectedChannel?.name}</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          {selectedChannel && (
            <div className="p-4">
              <VideoPlayer
                manifestUrl={selectedChannel.streamUrl}
                drmKey={selectedChannel.drmKey}
              />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Index;