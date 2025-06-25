import { SlackClient } from '../slack/SlackClient';
import { ThreadGrouper } from '../slack/ThreadGrouper';
import { BackupManager } from '../backup/BackupManager';
import { Consolidator } from '../consolidate/Consolidator';
import { ImageDescriptionHelper } from '../context/ImageDescriptionHelper';
import { ContextEnricher } from '../context/ContextEnricher';
import { QAGenerator } from '../qa/QAGenerator';
import { Message } from '../types/Message';
import { logInfo } from '../utils/logger';
import { showProgress } from '../utils/progress';
import { safeWrite } from '../utils/fileHelpers';
import { join } from 'path';
import { promises as fs } from 'fs';

export class PipelineController {
  constructor(
    private slack: SlackClient,
    private grouper: ThreadGrouper,
    private backup: BackupManager,
    private consolidator: Consolidator,
    private imageHelper: ImageDescriptionHelper,
    private enricher: ContextEnricher,
    private qa: QAGenerator,
    private outputDir: string
  ) {}

  async run(channelId: string): Promise<void> {
    logInfo(`Fetching messages for ${channelId}`);
    const raw = await this.slack.fetchMessages(channelId);

    await this.writePhase('fetch', 'messages.json', raw);

    const restored = await this.backup.restore(channelId);
    const combined = restored ? [...restored, ...raw] : raw;

    logInfo('Grouping threads');
    const threads = await this.grouper.group(combined);
    await this.writePhase('group', 'threads.json', threads);

    logInfo('Creating backup');
    await this.backup.save(channelId, combined);
    await this.writePhase('backup', 'messages.json', combined);

    logInfo('Consolidating messages');
    const consolidated = this.consolidator.consolidate(combined);
    await this.writePhase('consolidate', 'messages.json', consolidated);

    logInfo('Describing images');
    let processed = 0;
    for (const msg of consolidated) {
      if (msg.images) {
        for (const img of msg.images) {
          await this.imageHelper.describe(img);
        }
      }
      showProgress(++processed, consolidated.length);
    }
    process.stdout.write('\n');

    logInfo('Enriching context');
    const enriched = await this.enricher.enrich(consolidated);
    await this.writePhase('enrich', 'messages.json', enriched);

    logInfo('Generating Q&A output');
    await this.qa.generate(enriched);
    await this.writePhase('qa', 'qa.csv', await fs.promises.readFile(join(this.outputDir, 'qa.csv'), 'utf8'));
  }

  private async writePhase(phase: string, file: string, data: any): Promise<void> {
    const dir = join(this.outputDir, `phase-${phase}`);
    const path = join(dir, file);
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    await safeWrite(path, content);
  }
}
