import { CognitiveAutopsy, CausalGraph } from "./diagnosticTypes.js";
import { DiagnosticEventBus, DiagnosticEvents } from "./diagnosticEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CognitiveAutopsySystem {
    private eventBus = DiagnosticEventBus.getInstance();

    public performAutopsy(missionData: any, causalGraph: CausalGraph): CognitiveAutopsy {
        const autopsy: CognitiveAutopsy = {
            autopsy_id: uuidv4(),
            mission_id: missionData.mission_id || "unknown",
            mission_goals: missionData.goals || [],
            inputs: missionData.inputs || [],
            knowledge_retrieved: ["Core Physics", "Agent Guidelines"],
            reasoning_process: ["Plan generated", "Step 1 evaluated", "Failure at Step 2"],
            planning_decisions: ["Chose DFS search"],
            tool_usage: ["Search Web", "Run Code"],
            memory_access: ["Recalled past failure similar to this"],
            simulations_run: ["Simulated node expansion"],
            decision_points: ["Decided to trust simulation over heuristic"],
            execution_steps: ["Step 1", "Step 2 failed"],
            outcome: missionData.success ? "SUCCESS" : "FAILURE",
            root_cause_analysis: causalGraph,
            lessons_learned: ["Need better heuristic for step 2"],
            timestamp: Date.now()
        };

        this.eventBus.publish(DiagnosticEvents.AUTOPSY_GENERATED, { autopsy });
        return autopsy;
    }
}
