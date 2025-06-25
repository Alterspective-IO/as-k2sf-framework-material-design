export const config = {
  slackToken: process.env.SLACK_TOKEN || '',
  channels: (process.env.SLACK_CHANNELS || '').split(','),
  backupDir: 'backup',
  outputDir: 'output',
};
