import { PipelineController } from '../PipelineController';
import { DefaultSlackClient } from '../../slack/SlackClient';
import { DefaultThreadGrouper } from '../../slack/ThreadGrouper';
import { BackupManager } from '../../backup/BackupManager';
import { Consolidator } from '../../consolidate/Consolidator';
import { ImageDescriptionHelper } from '../../context/ImageDescriptionHelper';
import { ContextEnricher } from '../../context/ContextEnricher';
import { QAGenerator } from '../../qa/QAGenerator';
import { promises as fs } from 'fs';

it('pipeline executes end-to-end with dummy data', async () => {
  const slackResp = {
    ok: true,
    messages: [
      {
        ts: '1',
        text: 'hi',
        user: 'u',
        files: [{ mimetype: 'image/png', url_private: 'http://img' }],
      },
    ],
    response_metadata: { next_cursor: '' },
  };
  const visionResp = { captionResult: { text: 'picture' } };
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(slackResp),
      headers: { get: () => null },
    })
    .mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(visionResp),
      headers: { get: () => null },
    });
  (global as any).fetch = fetchMock;

  const controller = new PipelineController(
    new DefaultSlackClient('token'),
    new DefaultThreadGrouper(),
    new BackupManager('__tmp__'),
    new Consolidator(),
    new ImageDescriptionHelper('cache.json', 'endpoint', 'key'),
    new ContextEnricher(new ImageDescriptionHelper('cache.json', 'endpoint', 'key')),
    new QAGenerator('__tmp__')
  );
  await controller.run('c');
  const exists = await fs
    .stat('__tmp__/qa.csv')
    .then(() => true)
    .catch(() => false);
  expect(exists).toBe(true);
});
