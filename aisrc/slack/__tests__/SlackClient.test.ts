import { DefaultSlackClient } from '../SlackClient';

describe('DefaultSlackClient', () => {
  it('fetchMessages returns empty array by default', async () => {
    const client = new DefaultSlackClient('');
    const messages = await client.fetchMessages('C123');
    expect(messages).toEqual([]);
  });

  it('fetchMessages fetches messages from API', async () => {
    const apiResponse = {
      ok: true,
      messages: [
        {
          ts: '1',
          text: 'hello',
          user: 'u1',
          thread_ts: '1',
          files: [],
        },
      ],
      response_metadata: { next_cursor: '' },
    };
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(apiResponse),
      headers: { get: () => null },
    });
    (global as any).fetch = fetchMock;

    const client = new DefaultSlackClient('token');
    const messages = await client.fetchMessages('C123');

    expect(messages.length).toBe(1);
    expect(messages[0].text).toBe('hello');
    expect(fetchMock).toHaveBeenCalled();
  });
});
