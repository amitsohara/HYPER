import { ModuleType } from "./thinking_types.js";

export class ThinkingPolicy {
    static determineModule(context: any, attention: any): ModuleType {
        // High level heuristic for what module to trigger next based on current focus
        if (attention.current_focus === "RESEARCH") {
            return ModuleType.RESEARCH;
        } else if (attention.current_focus === "SIMULATION") {
            return ModuleType.SIMULATION;
        } else if (attention.current_focus === "HYPOTHESIS") {
            return ModuleType.HYPOTHESIS;
        } else if (attention.current_focus === "MISSION") {
            return ModuleType.PLANNER;
        }
        return ModuleType.REFLECTION;
    }
}
