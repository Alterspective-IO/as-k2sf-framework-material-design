import { Message } from '../types/Message';

export class Consolidator {
  consolidate(messages: Message[]): Message[] {
    const map = new Map<string, Message>();
    for (const msg of messages) {
      map.set(msg.id, { ...map.get(msg.id), ...msg });
    }
    return Array.from(map.values());
  }
}
