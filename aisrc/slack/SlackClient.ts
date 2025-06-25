import { Message } from '../types/Message';

export interface SlackClient {
  fetchMessages(channelId: string): Promise<Message[]>;
}

export class DefaultSlackClient implements SlackClient {
  constructor(private token: string) {}

  async fetchMessages(channelId: string): Promise<Message[]> {
    if (!this.token) return [];

    const messages: Message[] = [];
    let cursor: string | undefined;

    do {
      const params = new URLSearchParams({
        channel: channelId,
        limit: '200',
      });
      if (cursor) params.set('cursor', cursor);
      const url = `https://slack.com/api/conversations.history?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || 'Slack API error');
      }

      const batch = (data.messages as any[]).map((m) => ({
        id: m.ts,
        channel: channelId,
        text: m.text || '',
        user: m.user,
        timestamp: m.ts,
        threadTs: m.thread_ts,
        images:
          (m.files || [])
            .filter((f: any) => f.mimetype && f.mimetype.startsWith('image/'))
            .map((f: any) => f.url_private) || [],
      })) as Message[];

      messages.push(...batch);
      cursor = data.response_metadata?.next_cursor;
    } while (cursor);

    return messages;
  }
}
