import { promises as fs } from 'fs';

export async function safeWrite(path: string, data: string): Promise<void> {
  await fs.mkdir(require('path').dirname(path), { recursive: true });
  await fs.writeFile(path, data, 'utf8');
}
