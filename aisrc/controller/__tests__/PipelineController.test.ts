import { PipelineController } from '../PipelineController';
import { DefaultSlackClient } from '../../slack/SlackClient';
import { DefaultThreadGrouper } from '../../slack/ThreadGrouper';
import { BackupManager } from '../../backup/BackupManager';
import { Consolidator } from '../../consolidate/Consolidator';
import { ImageDescriptionHelper } from '../../context/ImageDescriptionHelper';
import { ContextEnricher } from '../../context/ContextEnricher';
import { QAGenerator } from '../../qa/QAGenerator';

describe('PipelineController', () => {
  it('runs without throwing', async () => {
    const controller = new PipelineController(
      new DefaultSlackClient(''),
      new DefaultThreadGrouper(),
      new BackupManager('__tmp__'),
      new Consolidator(),
      new ImageDescriptionHelper(),
      new ContextEnricher(new ImageDescriptionHelper()),
      new QAGenerator('__tmp__')
    );
    await expect(controller.run('c')).resolves.toBeUndefined();
  });
});
