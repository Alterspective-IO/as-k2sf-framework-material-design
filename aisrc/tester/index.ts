import { APITester } from './APITester';
import { DefaultSlackClient } from '../slack/SlackClient';
import { config } from '../config';
import { logInfo } from '../utils/logger';

async function main() {
  const tester = new APITester(
    new DefaultSlackClient(config.slackToken),
    process.env.AZURE_VISION_ENDPOINT || '',
    process.env.AZURE_VISION_KEY || ''
  );
  const img = '__tmp__/tester-image.png';
  await tester.generateTestImage(img);
  const slackOk = await tester.checkSlack(config.channels[0] || '');
  const visionOk = await tester.checkVision(img);
  logInfo(`Slack connectivity: ${slackOk ? 'ok' : 'failed'}`);
  logInfo(`Vision connectivity: ${visionOk ? 'ok' : 'failed'}`);
}

main().catch(err => console.error(err));
