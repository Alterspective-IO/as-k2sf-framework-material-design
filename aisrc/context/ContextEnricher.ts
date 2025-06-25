import { Message } from '../types/Message';
import { ImageDescriptionHelper } from './ImageDescriptionHelper';

export class ContextEnricher {
  constructor(private imageHelper: ImageDescriptionHelper) {}

  async enrich(messages: Message[]): Promise<Message[]> {
    for (const msg of messages) {
      if (!msg.images || msg.images.length === 0) continue;
      const descriptions = [];
      for (const url of msg.images) {
        const desc = await this.imageHelper.describe(url);
        descriptions.push(desc);
      }
      (msg as any).imageDescriptions = descriptions;
    }
    return messages;
  }
}
