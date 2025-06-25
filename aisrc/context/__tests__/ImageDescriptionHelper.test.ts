import { ImageDescriptionHelper } from '../ImageDescriptionHelper';

describe('ImageDescriptionHelper', () => {
  it('returns empty description by default', async () => {
    const helper = new ImageDescriptionHelper();
    const desc = await helper.describe('url');
    expect(desc.description).toBe('');
  });
});
