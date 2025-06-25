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

  constructor(private cacheFile = 'image-cache.json') {}

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

    const result: ImageDescription = { url, description: '' }; // TODO: call Azure Vision API
    this.cache.set(url, result);
    await this.save();
    return result;
  }
}
