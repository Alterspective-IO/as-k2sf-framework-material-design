import { Message } from '../types/Message';

export class Consolidator {
  consolidate(messages: Message[]): Message[] {
    const map = new Map<string, Message>();
    for (const msg of messages) {
      const existing = map.get(msg.id);
      if (existing) {
        const images = Array.from(new Set([...(existing.images || []), ...(msg.images || [])]));
        map.set(msg.id, { ...existing, ...msg, images });
      } else {
        map.set(msg.id, { ...msg });
      }
    }
    return Array.from(map.values()).sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
  }
}
