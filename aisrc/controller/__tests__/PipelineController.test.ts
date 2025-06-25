import { PipelineController } from '../PipelineController';
import { DefaultSlackClient } from '../../slack/SlackClient';
import { DefaultThreadGrouper } from '../../slack/ThreadGrouper';
import { BackupManager } from '../../backup/BackupManager';
import { Consolidator } from '../../consolidate/Consolidator';
import { ImageDescriptionHelper } from '../../context/ImageDescriptionHelper';
import { ContextEnricher } from '../../context/ContextEnricher';
import { QAGenerator } from '../../qa/QAGenerator';

describe('PipelineController', () => {
  it('runs with dummy network responses', async () => {
    const slackResp = {
      ok: true,
      messages: [{ ts: '1', text: 'hi', user: 'u', files: [] }],
      response_metadata: { next_cursor: '' },
    };
    const fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(slackResp),
      headers: { get: () => null },
    });
    (global as any).fetch = fetchMock;

    const controller = new PipelineController(
      new DefaultSlackClient('token'),
      new DefaultThreadGrouper(),
      new BackupManager('__tmp__'),
      new Consolidator(),
      new ImageDescriptionHelper(),
      new ContextEnricher(new ImageDescriptionHelper()),
      new QAGenerator('__tmp__')
    );
    await expect(controller.run('c')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalled();
  });
});
