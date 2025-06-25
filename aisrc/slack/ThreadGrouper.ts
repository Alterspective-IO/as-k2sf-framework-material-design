import { Message } from '../types/Message';
import { Thread } from '../types/Thread';

export interface ThreadGrouper {
  group(messages: Message[]): Promise<Thread[]>;
}

export class DefaultThreadGrouper implements ThreadGrouper {
  async group(messages: Message[]): Promise<Thread[]> {
    // TODO: Implement grouping logic, including inferred replies with confidence scores
    return [];
  }
}
