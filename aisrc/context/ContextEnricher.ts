import { Message } from '../types/Message';
import { ImageDescriptionHelper } from './ImageDescriptionHelper';

export class ContextEnricher {
  constructor(private imageHelper: ImageDescriptionHelper) {}

  async enrich(messages: Message[]): Promise<Message[]> {
    // TODO: Add context enrichment logic with checkpointing
    return messages;
  }
}
