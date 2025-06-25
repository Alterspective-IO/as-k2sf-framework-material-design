import { config } from './config';
import { DefaultSlackClient } from './slack/SlackClient';
import { DefaultThreadGrouper } from './slack/ThreadGrouper';
import { BackupManager } from './backup/BackupManager';
import { Consolidator } from './consolidate/Consolidator';
import { ImageDescriptionHelper } from './context/ImageDescriptionHelper';
import { ContextEnricher } from './context/ContextEnricher';
import { QAGenerator } from './qa/QAGenerator';
import { PipelineController } from './controller/PipelineController';

async function main() {
  const slack = new DefaultSlackClient(config.slackToken);
  const grouper = new DefaultThreadGrouper();
  const backup = new BackupManager(config.backupDir);
  const consolidator = new Consolidator();
  const imageHelper = new ImageDescriptionHelper();
  const enricher = new ContextEnricher(imageHelper);
  const qa = new QAGenerator(config.outputDir);
  const controller = new PipelineController(slack, grouper, backup, consolidator, imageHelper, enricher, qa, config.outputDir);

  for (const channel of config.channels) {
    if (!channel) continue;
    await controller.run(channel);
  }
}

main().catch(err => console.error(err));
