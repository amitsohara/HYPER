import { CycleState } from "./cycle_state.js";

export class CycleScheduler {
  static getExecutionSteps(mode: string): string[] {
    const allSteps = [
      "Observe", "Understand", "Imagine", "Reason", "Predict", "Decide", "Act",
      "ObserveOutcome", "Experience", "Reflect", "Learn", "UpdateBeliefs", "Improve"
    ];

    switch (mode) {
      case "fast":
        return ["Observe", "Understand", "Decide", "Act", "Learn"]; // Learn summary only
      case "balanced":
        return allSteps; // Full single cognitive cycle
      case "deep":
        return allSteps; // Repeated up to 3 times, handled by Engine + Policy
      case "research":
        return allSteps; // Includes KAL
      case "simulation":
        return allSteps; // Heavy imagination & counterfactuals
      default:
        return allSteps;
    }
  }
}
