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
    await manager.save(channel, [{ id: '1', channel: 'c', text: '', user: '', timestamp: '1' }]);
    await manager.save(channel, [{ id: '2', channel: 'c', text: '', user: '', timestamp: '2' }]);
    const restored = await manager.restore(channel);
    expect(restored?.length).toBe(2);
    const exists = await fs.stat(file).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});
