import { Message } from './Message';

export interface Thread {
  id: string;
  messages: Message[];
  confidence?: number;
}
