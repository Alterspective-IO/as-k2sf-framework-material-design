import { APITester } from '../APITester';
import { DefaultSlackClient } from '../../slack/SlackClient';
import { promises as fs } from 'fs';

describe('APITester', () => {
  it('generates test image', async () => {
    const tester = new APITester(new DefaultSlackClient(''), '', '');
    const path = '__tmp__/img.png';
    await tester.generateTestImage(path);
    const exists = await fs.stat(path).then(() => true).catch(() => false);
    expect(exists).toBe(true);
    await fs.rm(path, { force: true });
  });

  it('checkSlack returns true when client succeeds', async () => {
    const client = { fetchMessages: jest.fn().mockResolvedValue([{ id: '1' }]) } as unknown as DefaultSlackClient;
    const tester = new APITester(client, '', '');
    const ok = await tester.checkSlack('c');
    expect(ok).toBe(true);
    expect(client.fetchMessages).toHaveBeenCalledWith('c');
  });

  it('checkVision posts image to API', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ captionResult: { text: 'test' } }),
    });
    (global as any).fetch = fetchMock;
    const tester = new APITester(new DefaultSlackClient(''), 'http://endpoint', 'key');
    const img = '__tmp__/img.png';
    await tester.generateTestImage(img);
    const ok = await tester.checkVision(img);
    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
    await fs.rm(img, { force: true });
  });
});
