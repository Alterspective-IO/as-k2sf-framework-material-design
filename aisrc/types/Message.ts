export interface Message {
  id: string;
  channel: string;
  text: string;
  user: string;
  timestamp: string;
  threadTs?: string;
  images?: string[];
}
