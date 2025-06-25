import { Message } from '../types/Message';
import { promises as fs } from 'fs';
import { join } from 'path';

export class QAGenerator {
  constructor(private outputDir: string) {}

  async generate(messages: Message[]): Promise<void> {
    const file = join(this.outputDir, 'qa.csv');
    const csv = messages.map(m => `"${m.id}","${m.text.replace(/"/g, '""')}"`).join('\n');
    await fs.writeFile(file, csv, 'utf8');
  }
}
