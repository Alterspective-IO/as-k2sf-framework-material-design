import { ContextEnricher } from '../ContextEnricher';
import { ImageDescriptionHelper } from '../ImageDescriptionHelper';

describe('ContextEnricher', () => {
  it('returns messages unchanged by default', async () => {
    const enricher = new ContextEnricher(new ImageDescriptionHelper());
    const messages = [{ id: '1', channel: 'c', text: 'a', user: 'u', timestamp: 't' }];
    const result = await enricher.enrich(messages);
    expect(result).toEqual(messages);
  });
});
