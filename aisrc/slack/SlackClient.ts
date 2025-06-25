import { Message } from '../types/Message';

export interface SlackClient {
  fetchMessages(channelId: string): Promise<Message[]>;
}

export class DefaultSlackClient implements SlackClient {
  constructor(private token: string) {}

  async fetchMessages(channelId: string): Promise<Message[]> {
    // TODO: Implement Slack API fetch logic, including pagination and rate limit handling
    return [];
  }
}
