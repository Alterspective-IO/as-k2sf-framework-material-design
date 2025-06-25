import { Message } from '../types/Message';
import { Thread } from '../types/Thread';

export interface ThreadGrouper {
  group(messages: Message[]): Promise<Thread[]>;
}

export class DefaultThreadGrouper implements ThreadGrouper {
  async group(messages: Message[]): Promise<Thread[]> {
    const threads = new Map<string, Thread>();
    const ordered = [...messages].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
    let lastThreadId: string | undefined;

    for (const msg of ordered) {
      let threadId = msg.threadTs;
      let confidence = 1;

      if (!threadId) {
        // simple heuristic: if the message starts with a quote and we saw a previous thread
        if (msg.text.trim().startsWith('>') && lastThreadId) {
          threadId = lastThreadId;
          confidence = 0.5;
        } else {
          threadId = msg.id;
        }
      }

      let thread = threads.get(threadId);
      if (!thread) {
        thread = { id: threadId, messages: [], confidence: confidence };
        threads.set(threadId, thread);
      }
      thread.messages.push(msg);
      lastThreadId = threadId;
    }

    return Array.from(threads.values());
  }
}
