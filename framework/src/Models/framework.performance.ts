import { v4 as uuidv4 } from "uuid";
import { IPerformanceSession } from "../interfaces/IPerformanceSession";

export async function PScope(p_instance: PerformanceSession, p_func: Function) {
  await p_func();
  p_instance.finish();
}








export const enum LogType {
  framework = "framework",
  extensions = "extensions",
  customControls = "customControls",
  events = "events",
  unknown = "unknown",
  popupManager = "popupManager",
  windowMessaging = "windowMessaging",
  performanceCheck = "performanceCheck"
}

export type LogTypeColorMapping = {
  [key in LogType]: string;
};

export type LoggingEnabledType = {
  [key in LogType]: boolean;
};

let loggingEnabledSettings: LoggingEnabledType = {
  framework: false,
  extensions: false,
  customControls: false,
  events: false,
  unknown: false,
  popupManager: false,
  windowMessaging: false,
  performanceCheck: false
}; 
export {loggingEnabledSettings}

let logTypeColors: LogTypeColorMapping = {
  framework: "green",
  extensions: "blue",
  customControls: "magenta",
  events: "purple",
  unknown: "brown",
  popupManager: "pink",
  windowMessaging: "yellow",
  performanceCheck:"rgb(0, 98, 255)"
};

export class PerformanceSession implements IPerformanceSession {
  name: string;
  time: Date;
  start: number;
  end?: number;
  id: string;
  counter: number = 0;
  state: "running" | "complete" | "none" = "none";
  groupName: string;
  type: LogType;
  obj = { something: "value" };
  enabled: boolean;

  static counter: number = 0;

  static performanceSessions: Array<PerformanceSession> = new Array();
  color: string;
  static getAllPerformanceSession(): Array<PerformanceSession> {
    return PerformanceSession.performanceSessions;
  }

  public get elapsedTime(): number {
    return (this.end ? this.end : performance.now()) - this.start;
  }

  constructor(
    name?: string,
    type: LogType = LogType.framework,
    enabled?: boolean
  ) {
    if (!name) {
      name = "unknown";
    }
    this.enabled = enabled || loggingEnabledSettings[type];
    this.type = type;
    this.name = name;
    this.id = uuidv4();
    this.time = new Date(Date.now());
    this.start = performance.now();
    this.counter = PerformanceSession.counter++;
    this.state = "running";
    this.groupName = `Executing:[${this.counter}] [${performance.now()}] ${this.name}`;
    this.color = logTypeColors[type];

    PerformanceSession.performanceSessions.push(this);
    if (this.enabled == true)
      console.group(`%c${this.groupName}`, `color: ${this.color}`);      
  }

  log(message: string, ...args: any) {
    if (this.enabled)
      Log(`[${this.counter}] ${message}`, { data: args, logType: this.type });
  }

  finish() {
    this.end = performance.now();
    const inSeconds = this.end - this.start;
    this.state = "complete";

    if (this.enabled == true) {
      (console["groupEnd"] as Function)(`%c${this.groupName}`); //TypeScript doesnt want a parameter
      console.info(
        `%cCompleted:[${this.counter}] ${this.name} in ${inSeconds} milliseconds`,
        `color: ${this.color}`
      );
    }
  }
}

export type LogOptions = {
  type?:
    | "log"
    | "error"
    | "warn"
    | "time"
    | "timeEnd"
    | "table"
    | "group"
    | "groupEnd"
    | "trace"
    | "groupCollapsed";
  logType?: LogType;
  color?: string;
  data?: unknown;
  enabled?: boolean;
};

export function Log(message: string, logOptions?: LogOptions) {
  let logType = logOptions?.logType || LogType.unknown;
  let enabled = logOptions?.enabled || loggingEnabledSettings[logType];
  if (enabled == false) return;

  let type = logOptions?.type || "groupCollapsed";
  let color = logOptions?.color || logTypeColors[logType]; //if not specific color use log type color
  let method: Function = console[type];
  let methodToExecute;

  message = `[${performance.now()}] ${message}`


  if (!type.includes("time")) {
    if (logOptions?.data) {
      methodToExecute = () => {
        method(`%c${message}`, `color: ${color}`, logOptions.data);
      };
    } else {
      methodToExecute = () => {
        method(`%c${message}`, `color: ${color}`);
      };
    }

    // console.groupCollapsed(`%c${message}`,`color: ${color}`)
    //method(`%c${message}`, `color: ${color}`)
    methodToExecute();
    if (logOptions?.data) console.table(logOptions?.data);
    console.trace();
    console.groupEnd();
  } else {
    method(`${message}`);
  }
}
