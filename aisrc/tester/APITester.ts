import { DefaultSlackClient } from '../slack/SlackClient';
import { promises as fs } from 'fs';
import { logInfo, logError } from '../utils/logger';

export class APITester {
  constructor(
    private slack: DefaultSlackClient,
    private visionEndpoint: string,
    private visionKey: string
  ) {}

  async generateTestImage(path: string): Promise<void> {
    const pixel =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAKvmohwAAAAASUVORK5CYII=';
    await fs.mkdir(require('path').dirname(path), { recursive: true });
    await fs.writeFile(path, Buffer.from(pixel, 'base64'));
  }

  async checkSlack(channel: string): Promise<boolean> {
    try {
      const msgs = await this.slack.fetchMessages(channel);
      logInfo(`Slack API returned ${msgs.length} messages`);
      return true;
    } catch (err: any) {
      logError(`Slack API failed: ${err.message}`);
      return false;
    }
  }

  async checkVision(imagePath: string): Promise<boolean> {
    if (!this.visionEndpoint || !this.visionKey) {
      logError('Vision API credentials missing');
      return false;
    }
    const buffer = await fs.readFile(imagePath);
    try {
      const res = await fetch(
        `${this.visionEndpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&language=en&features=caption`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': this.visionKey,
          },
          body: buffer,
        }
      );
      const data = await res.json();
      const caption = data?.captionResult?.text || '';
      logInfo(`Vision API caption: ${caption}`);
      return !!caption;
    } catch (err: any) {
      logError(`Vision API failed: ${err.message}`);
      return false;
    }
  }
}
