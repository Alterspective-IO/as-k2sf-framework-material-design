export class DeferredPromise<T> {
    private _resolve!: (value?: T | PromiseLike<T>) => void;
    private _reject!: (reason?: any) => void;
    public promise: Promise<T>;
  
    constructor() {
      this.promise = new Promise<T>((resolve, reject) => {
        (this._resolve as any) = resolve;
        this._reject = reject;
      });
    }
  
    resolve(value?: T | PromiseLike<T>): void {
      this._resolve(value);
    }
  
    reject(reason?: any): void {
      this._reject(reason);
    }
  }

  