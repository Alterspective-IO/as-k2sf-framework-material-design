export function showProgress(current: number, total: number): void {
  const percent = ((current / total) * 100).toFixed(2);
  process.stdout.write(`\r${percent}% (${current}/${total})`);
}
