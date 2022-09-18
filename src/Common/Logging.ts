// import { LogType, PerformanceSession } from "asframework/src";
// import { PScope } from "asframework/src/Models/framework.performance";

// export type LogOptions = {
//   type?:
//     | "log"
//     | "error"
//     | "warn"
//     | "time"
//     | "timeEnd"
//     | "table"
//     | "group"
//     | "groupEnd"
//     | "trace"
//     | "groupCollapsed";
//   color?: string;
//   data?: unknown;
// };

// let localPerformanceSessions = new Array<PerformanceSession>();

// export function Log(message: string, logOptions?: LogOptions) {
//   let type = logOptions?.type || "groupCollapsed";
//   let color = logOptions?.color || "black";
//   let method: Function = console[type];
//   let methodToExecute;
//   if (!type.includes("time")) {
//     if (logOptions?.data) {
//       methodToExecute = () => {
//         method(`%c${message}`, `color: ${color}`, logOptions.data);
//       };
//     } else {
//       methodToExecute = () => {
//         method(`%c${message}`, `color: ${color}`);
//       };
//     }

//     // console.groupCollapsed(`%c${message}`,`color: ${color}`)
//     //method(`%c${message}`, `color: ${color}`)
//     methodToExecute();
//     if (logOptions?.data) console.table(logOptions?.data);
//     console.trace();
//     console.groupEnd();
//   } else {
//     method(`${message}`);
//   }
// }

// export async function LogScope(label: string, func: Function) {
//   let p = new PerformanceSession(label, LogType.extensions);
//   await PScope(p, func);
// }

// export function LogIn(label: string): string {
//   let p = new PerformanceSession(label, LogType.extensions);
//   localPerformanceSessions.push(p);
//   return p.id;
// }

// export function LogOut(id: string) {
//   let p = localPerformanceSessions.find((ps) => ps.id == id);
//   if (p) p.finish();
// }
