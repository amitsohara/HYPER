import { CycleState } from "./cycle_state.js";

export class CyclePolicy {
  static shouldContinue(state: CycleState, iterationCount: number): boolean {
    if (iterationCount > this.getMaxIterations(state.mode)) return false;
    
    // Stop if token budget exceeded (managed globally but can be checked here)
    if (state.errors.some(e => e.message?.includes("Token budget exceeded"))) return false;

    // Check if repeated cycle produces no new insight (placeholder)
    // if (confidence improvement < threshold) return false;

    return true;
  }

  static getMaxIterations(mode: string): number {
    switch (mode) {
      case "deep":
        return 3;
      case "balanced":
      case "fast":
      case "research":
      case "simulation":
      default:
        return 1;
    }
  }
}
