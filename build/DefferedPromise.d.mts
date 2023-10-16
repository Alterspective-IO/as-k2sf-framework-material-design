export declare class DeferredPromise<T> {
    private _resolve;
    private _reject;
    promise: Promise<T>;
    constructor();
    resolve(value?: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}
