import { displayFormIfHidden } from "./DisplayHidden";

export function runTheFramework(): boolean {
  let runFramework = !window.location.search
    .toLowerCase()
    .includes("asdisabled");
  if (!runFramework) {
    console.warn("Alterspective Framework Disabled");
    displayFormIfHidden()
  }
  return runFramework;
}
