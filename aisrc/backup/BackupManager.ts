import { Message } from '../types/Message';
import { promises as fs } from 'fs';
import { join } from 'path';

export class BackupManager {
  constructor(private backupDir: string) {}

  async save(channel: string, messages: Message[]): Promise<void> {
    const file = join(this.backupDir, `${channel}.bak`);
    await fs.writeFile(file, JSON.stringify(messages, null, 2), 'utf8');
  }

  async restore(channel: string): Promise<Message[] | null> {
    const file = join(this.backupDir, `${channel}.bak`);
    try {
      const data = await fs.readFile(file, 'utf8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
