import { GoogleGenAI } from "@google/genai";
import { MissionUnderstanding } from "./mission_understanding.js";
import { MissionGraphBuilder } from "./mission_graph_builder.js";
import { CapabilityPlanner } from "./capability_planner.js";
import { ResourceAllocator } from "./resource_allocator.js";
import { ExecutionPlanner } from "./execution_planner.js";

export class MetaCognitionEngine {
    static async run(ai: GoogleGenAI, mission: string, mode: string) {
        console.log("[MCE] Starting Meta-Cognition Engine...");
        
        const understanding = await MissionUnderstanding.understand(ai, mission);
        console.log("[MCE] ❶ What do I know?", understanding.knowns);
        console.log("[MCE] ❷ What do I need to know?", understanding.unknowns);
        console.log("[MCE] ❸ How should I think?", understanding.reasoning_strategy);
        
        console.log("[MCE] Building Mission Graph...");
        const graph = await MissionGraphBuilder.build(ai, understanding);
        
        console.log("[MCE] Inferring Capabilities...");
        const capabilities = await CapabilityPlanner.inferCapabilities(ai, graph, understanding);
        console.log("[MCE] ❹ Which capabilities should I use?", capabilities.map((c: any) => c.module));

        console.log("[MCE] ❺ How confident am I?", understanding.confidence_score);
        
        console.log("[MCE] Allocating Resources...");
        const resources = ResourceAllocator.allocate(understanding, mode);
        
        const budgetMultiplier = mode === 'deep' ? 0.8 : mode === 'fast' ? 1.5 : 1.0;
        
        console.log("[MCE] Planning Execution...");
        const plan = await ExecutionPlanner.plan(ai, understanding, capabilities, budgetMultiplier);
        
        return {
            understanding,
            mission_graph: graph,
            capabilities,
            resources,
            execution_plan: plan
        };
    }
}
