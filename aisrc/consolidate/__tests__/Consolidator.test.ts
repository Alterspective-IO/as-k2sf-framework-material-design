import { Consolidator } from '../Consolidator';

describe('Consolidator', () => {
  it('deduplicates messages by id', () => {
    const consolidator = new Consolidator();
    const result = consolidator.consolidate([
      { id: '1', channel: 'c', text: 'a', user: 'u', timestamp: '1', images: ['i1'] },
      { id: '1', channel: 'c', text: 'b', user: 'u', timestamp: '2', images: ['i2'] }
    ]);
    expect(result.length).toBe(1);
    expect(result[0].text).toBe('b');
    expect(result[0].images).toEqual(['i1','i2']);
  });
});
