import { Message } from '../types/Message';
import { Thread } from '../types/Thread';

export interface ThreadGrouper {
  group(messages: Message[]): Promise<Thread[]>;
}

export class DefaultThreadGrouper implements ThreadGrouper {
  async group(messages: Message[]): Promise<Thread[]> {
    const threads = new Map<string, Thread>();

    for (const msg of messages) {
      const threadId = msg.threadTs || msg.id;
      let thread = threads.get(threadId);
      if (!thread) {
        thread = { id: threadId, messages: [], confidence: msg.threadTs ? 1 : undefined };
        threads.set(threadId, thread);
      }
      thread.messages.push(msg);
    }

    return Array.from(threads.values());
  }
}
