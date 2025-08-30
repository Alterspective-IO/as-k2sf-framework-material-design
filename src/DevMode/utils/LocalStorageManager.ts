/**
 * LocalStorageManager - Handles persistent storage with JSON serialization
 */
export class LocalStorageManager {
  private prefix: string;

  constructor(prefix: string = 'devmode') {
    this.prefix = prefix;
  }

  /**
   * Get item from localStorage
   */
  public get<T>(key: string): T | null {
    try {
      const fullKey = `${this.prefix}-${key}`;
      const item = localStorage.getItem(fullKey);
      
      if (item === null) {
        return null;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  public set<T>(key: string, value: T): boolean {
    try {
      const fullKey = `${this.prefix}-${key}`;
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  public remove(key: string): void {
    const fullKey = `${this.prefix}-${key}`;
    localStorage.removeItem(fullKey);
  }

  /**
   * Clear all items with this prefix
   */
  public clear(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Check if localStorage is available
   */
  public isAvailable(): boolean {
    try {
      const testKey = `${this.prefix}-test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}