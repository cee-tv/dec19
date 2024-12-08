export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  drmKey?: {
    keyId: string;
    key: string;
  };
}

export const channels: Channel[] = [
  {
    id: "1",
    name: "CCTV-1",
    logo: "https://raw.githubusercontent.com/cee-tv/Chinatv/refs/heads/main/CCTV1.png",
    streamUrl: "https://node1.olelive.com:6443/live/CCTV1HD/hls.m3u8",
  },
  {
    id: "2",
    name: "CCTV-2",
    logo: "https://raw.githubusercontent.com/cee-tv/Chinatv/refs/heads/main/CCTV2.png",
    streamUrl: "https://node1.olelive.com:6443/live/CCTV2HD/hls.m3u8",
  },
  {
    id: "3",
    name: "CCTV-3",
    logo: "https://raw.githubusercontent.com/cee-tv/Chinatv/refs/heads/main/CCTV3.png",
    streamUrl: "https://node1.olelive.com:6443/live/CCTV3HD/hls.m3u8",
  },
  {
    id: "4",
    name: "CCTV-4",
    logo: "https://raw.githubusercontent.com/cee-tv/Chinatv/refs/heads/main/CCTV4.png",
    streamUrl: "https://node1.olelive.com:6443/live/CCTV4HD/hls.m3u8",
  }
];