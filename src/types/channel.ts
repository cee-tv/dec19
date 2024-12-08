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