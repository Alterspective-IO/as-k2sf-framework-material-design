import { DefaultSlackClient } from '../SlackClient';

describe('DefaultSlackClient', () => {
  it('fetchMessages returns empty array by default', async () => {
    const client = new DefaultSlackClient('');
    const messages = await client.fetchMessages('C123');
    expect(messages).toEqual([]);
  });
});
