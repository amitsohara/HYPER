import { SuccessRecord, DiagnosticConfidence } from "./diagnosticTypes.js";
import { DiagnosticEventBus, DiagnosticEvents } from "./diagnosticEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class SuccessAnalyzer {
    private eventBus = DiagnosticEventBus.getInstance();

    public analyze(missionData: any, confidence: DiagnosticConfidence): SuccessRecord {
        const record: SuccessRecord = {
            success_id: uuidv4(),
            mission_id: missionData.mission_id || "unknown",
            contributing_systems: ["HCOS", "HECS"],
            reasoning_path: ["Identified core problem", "Simulated solutions", "Executed best path"],
            knowledge_used: ["Physics.Kinematics"],
            planning_strategy: "Hierarchical Task Network",
            learning_contribution: "Discovered fast-path heuristic for similar tasks.",
            reusable_heuristics: ["Always check edge cases before simulation."],
            confidence,
            benchmark_impact: 5,
            timestamp: Date.now()
        };

        this.eventBus.publish(DiagnosticEvents.SUCCESS_PATTERN_DETECTED, { record });
        return record;
    }
}
