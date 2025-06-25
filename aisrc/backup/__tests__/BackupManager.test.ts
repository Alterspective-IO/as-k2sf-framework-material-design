import { BackupManager } from '../BackupManager';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('BackupManager', () => {
  const dir = '__tmp__';
  const manager = new BackupManager(dir);
  const channel = 'test';
  const file = join(dir, `${channel}.bak`);

  afterAll(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('saves and restores', async () => {
    await manager.save(channel, []);
    const restored = await manager.restore(channel);
    expect(restored).toEqual([]);
    const exists = await fs.stat(file).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});
