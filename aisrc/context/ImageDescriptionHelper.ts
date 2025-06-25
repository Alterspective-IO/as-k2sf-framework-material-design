import { ImageDescription } from '../types/ImageDescription';

export class ImageDescriptionHelper {
  async describe(url: string): Promise<ImageDescription> {
    // TODO: integrate with Azure OpenAI Vision
    return { url, description: '' };
  }
}
