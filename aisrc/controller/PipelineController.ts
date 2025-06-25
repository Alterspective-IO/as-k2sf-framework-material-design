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

export class PipelineController {
  constructor(
    private slack: SlackClient,
    private grouper: ThreadGrouper,
    private backup: BackupManager,
    private consolidator: Consolidator,
    private imageHelper: ImageDescriptionHelper,
    private enricher: ContextEnricher,
    private qa: QAGenerator
  ) {}

  async run(channelId: string): Promise<void> {
    logInfo(`Fetching messages for ${channelId}`);
    const raw = await this.slack.fetchMessages(channelId);

    logInfo('Grouping threads');
    const threads = await this.grouper.group(raw);

    logInfo('Creating backup');
    await this.backup.save(channelId, raw);

    logInfo('Consolidating messages');
    const consolidated = this.consolidator.consolidate(raw);

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

    logInfo('Generating Q&A output');
    await this.qa.generate(enriched);
  }
}
