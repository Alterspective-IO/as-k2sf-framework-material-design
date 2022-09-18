import { IPerformanceSession } from "../interfaces/IPerformanceSession";
export declare function PScope(p_instance: PerformanceSession, p_func: Function): Promise<void>;
export declare enum LogType {
    framework = "framework",
    extensions = "extensions",
    customControls = "customControls",
    events = "events",
    unknown = "unknown",
    popupManager = "popupManager",
    windowMessaging = "windowMessaging",
    performanceCheck = "performanceCheck"
}
export declare type LogTypeColorMapping = {
    [key in LogType]: string;
};
export declare type LoggingEnabledType = {
    [key in LogType]: boolean;
};
declare let loggingEnabledSettings: LoggingEnabledType;
export { loggingEnabledSettings };
export declare class PerformanceSession implements IPerformanceSession {
    name: string;
    time: Date;
    start: number;
    end?: number;
    id: string;
    counter: number;
    state: "running" | "complete" | "none";
    groupName: string;
    type: LogType;
    obj: {
        something: string;
    };
    enabled: boolean;
    static counter: number;
    static performanceSessions: Array<PerformanceSession>;
    color: string;
    static getAllPerformanceSession(): Array<PerformanceSession>;
    get elapsedTime(): number;
    constructor(name?: string, type?: LogType, enabled?: boolean);
    log(message: string, ...args: any): void;
    finish(): void;
}
export declare type LogOptions = {
    type?: "log" | "error" | "warn" | "time" | "timeEnd" | "table" | "group" | "groupEnd" | "trace" | "groupCollapsed";
    logType?: LogType;
    color?: string;
    data?: unknown;
    enabled?: boolean;
};
export declare function Log(message: string, logOptions?: LogOptions): void;
