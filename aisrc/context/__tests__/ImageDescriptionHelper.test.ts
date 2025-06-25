import { ImageDescriptionHelper } from '../ImageDescriptionHelper';

describe('ImageDescriptionHelper', () => {
  it('returns empty description by default', async () => {
    const helper = new ImageDescriptionHelper();
    const desc = await helper.describe('url');
    expect(desc.description).toBe('');
  });

  it('fetches caption from API when credentials provided', async () => {
    const apiResponse = { captionResult: { text: 'a cat' } };
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(apiResponse),
      headers: { get: () => null },
    });
    (global as any).fetch = fetchMock;

    const helper = new ImageDescriptionHelper('cache.json', 'endpoint', 'key');
    const desc = await helper.describe('http://image');

    expect(desc.description).toBe('a cat');
    expect(fetchMock).toHaveBeenCalled();
  });
});
