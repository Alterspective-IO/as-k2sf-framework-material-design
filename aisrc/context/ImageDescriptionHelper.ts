import { ImageDescription } from '../types/ImageDescription';
import { promises as fs } from 'fs';

function mapToObj(map: Map<string, ImageDescription>): Record<string, ImageDescription> {
  const obj: Record<string, ImageDescription> = {};
  for (const [k, v] of map) obj[k] = v;
  return obj;
}

function objToMap(obj: Record<string, ImageDescription>): Map<string, ImageDescription> {
  return new Map(Object.entries(obj));
}

export class ImageDescriptionHelper {
  private cache = new Map<string, ImageDescription>();
  private loaded = false;

  constructor(
    private cacheFile = 'image-cache.json',
    private endpoint = process.env.AZURE_VISION_ENDPOINT || '',
    private apiKey = process.env.AZURE_VISION_KEY || ''
  ) {}

  private async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const data = await fs.readFile(this.cacheFile, 'utf8');
      this.cache = objToMap(JSON.parse(data));
    } catch {
      // ignore missing cache
    }
    this.loaded = true;
  }

  private async save(): Promise<void> {
    await fs.writeFile(this.cacheFile, JSON.stringify(mapToObj(this.cache), null, 2), 'utf8');
  }

  async describe(url: string): Promise<ImageDescription> {
    await this.load();
    if (!url) return { url, description: '' };
    const cached = this.cache.get(url);
    if (cached) return cached;

    let description = '';
    if (this.endpoint && this.apiKey) {
      try {
        const res = await fetch(`${this.endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&language=en&features=caption`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': this.apiKey,
          },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        description = data?.captionResult?.text || '';
      } catch {
        description = '';
      }
    }

    const result: ImageDescription = { url, description };
    this.cache.set(url, result);
    await this.save();
    return result;
  }
}
