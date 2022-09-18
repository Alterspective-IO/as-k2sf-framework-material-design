export interface IPerformanceSession {
    name: string;
    time: Date;
    start: number;
    end?: number;
    id: string;
    elapsedTime: number;
}
