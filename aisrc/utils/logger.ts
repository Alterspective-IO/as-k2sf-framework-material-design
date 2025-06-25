export function logInfo(message: string): void {
  console.log(`\x1b[34m[INFO]\x1b[0m ${message}`);
}

export function logWarn(message: string): void {
  console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`);
}

export function logError(message: string): void {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
}
