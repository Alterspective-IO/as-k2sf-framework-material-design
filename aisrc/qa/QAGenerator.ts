import { Message } from '../types/Message';
import { promises as fs } from 'fs';
import { join } from 'path';

export class QAGenerator {
  constructor(private outputDir: string) {}

  async generate(messages: Message[]): Promise<void> {
    const file = join(this.outputDir, 'qa.csv');
    const header = 'id,thread,channel,text';
    const csv = [
      header,
      ...messages.map(m => {
        const text = m.text.replace(/"/g, '""').replace(/\n/g, ' ');
        return `"${m.id}","${m.threadTs || m.id}","${m.channel}","${text}"`;
      })
    ].join('\n');
    await fs.writeFile(file, csv, 'utf8');
  }
}
