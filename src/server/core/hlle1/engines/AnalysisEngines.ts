import { Episode } from "../types.js";

export class FailureAnalysisEngine {
    analyze(episode: Episode): string[] {
        const failures = episode.results.filter(r => r.eventType === "MISSION_FAILED");
        if (failures.length > 0) {
            return ["Failure detected: Analyzed root cause as incorrect assumptions."];
        }
        return [];
    }
}

export class SuccessAnalysisEngine {
    analyze(episode: Episode): string[] {
        const successes = episode.results.filter(r => r.eventType === "MISSION_COMPLETED");
        if (successes.length > 0) {
            return ["Success detected: Extracted best practices."];
        }
        return [];
    }
}
