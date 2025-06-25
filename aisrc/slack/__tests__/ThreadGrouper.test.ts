import { DefaultThreadGrouper } from '../ThreadGrouper';

describe('DefaultThreadGrouper', () => {
  it('returns empty array for empty input', async () => {
    const grouper = new DefaultThreadGrouper();
    const threads = await grouper.group([]);
    expect(threads).toEqual([]);
  });
});
