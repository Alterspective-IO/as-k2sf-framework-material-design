import { Consolidator } from '../Consolidator';

describe('Consolidator', () => {
  it('deduplicates messages by id', () => {
    const consolidator = new Consolidator();
    const result = consolidator.consolidate([
      { id: '1', channel: 'c', text: 'a', user: 'u', timestamp: 't' },
      { id: '1', channel: 'c', text: 'b', user: 'u', timestamp: 't' }
    ]);
    expect(result.length).toBe(1);
    expect(result[0].text).toBe('b');
  });
});
