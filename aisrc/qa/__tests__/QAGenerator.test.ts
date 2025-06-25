import { QAGenerator } from '../QAGenerator';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('QAGenerator', () => {
  const dir = '__tmp__';
  const qa = new QAGenerator(dir);
  const file = join(dir, 'qa.csv');

  afterAll(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('writes csv file', async () => {
    await qa.generate([{ id: '1', channel: 'c', text: 'a', user: 'u', timestamp: 't' }]);
    const exists = await fs.stat(file).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});
