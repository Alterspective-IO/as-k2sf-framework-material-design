import { DefaultThreadGrouper } from '../ThreadGrouper';

describe('DefaultThreadGrouper', () => {
  it('returns empty array for empty input', async () => {
    const grouper = new DefaultThreadGrouper();
    const threads = await grouper.group([]);
    expect(threads).toEqual([]);
  });

  it('groups messages by threadTs', async () => {
    const grouper = new DefaultThreadGrouper();
    const messages = [
      { id: '1', channel: 'c', text: 'a', user: 'u', timestamp: 't1' },
      { id: '2', channel: 'c', text: 'b', user: 'u', timestamp: 't2', threadTs: '1' },
    ];
    const threads = await grouper.group(messages);
    expect(threads.length).toBe(1);
    expect(threads[0].messages.length).toBe(2);
  });
});
