import { SlackClient } from '../slack/SlackClient';
import { ThreadGrouper } from '../slack/ThreadGrouper';
import { BackupManager } from '../backup/BackupManager';
import { Consolidator } from '../consolidate/Consolidator';
import { ImageDescriptionHelper } from '../context/ImageDescriptionHelper';
import { ContextEnricher } from '../context/ContextEnricher';
import { QAGenerator } from '../qa/QAGenerator';
import { Message } from '../types/Message';

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
    const raw = await this.slack.fetchMessages(channelId);
    const threads = await this.grouper.group(raw);
    await this.backup.save(channelId, raw);
    const consolidated = this.consolidator.consolidate(raw);
    await Promise.all(raw.map(m => this.imageHelper.describe(m.images?.[0] ?? ''))); // Warm cache
    const enriched = await this.enricher.enrich(consolidated);
    await this.qa.generate(enriched);
  }
}
