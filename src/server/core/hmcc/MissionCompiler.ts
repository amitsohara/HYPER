export interface CanonicalMissionObject {
    mission_id: string;
    name: string;
    description: string;
    type: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    objectives: { primary: string; secondary: string[] };
    constraints: any;
    inputs: any[];
    outputs: any[];
    safety_policies: string[];
    resource_limits: any;
    owner: string;
    status: "APPROVED_PENDING_DISPATCH" | "RUNNING" | "COMPLETED" | "FAILED";
    confidence: number;
    required_engines: string[];
    estimated_runtime_sec: number;
    estimated_cost: number;
    created_time: number;
    updated_time: number;
    mission_graph: any;
    risk_profile: any;
}

export class MissionCompiler {
    public static compile(naturalLanguageInput: string, overrides: any = {}): CanonicalMissionObject {
        // In a real system, this would call HILA (LLM Arbitrator) to parse the natural language input.
        // For HMCC v1.0, we generate a structured canonical object from the user's intent.
        
        const isOptimization = naturalLanguageInput.toLowerCase().includes("optimize");
        const isAnalysis = naturalLanguageInput.toLowerCase().includes("analyze") || naturalLanguageInput.toLowerCase().includes("inspect");

        const requiredEngines = ["HPE", "HRE"];
        if (isOptimization) requiredEngines.push("HSTE"); // Simulation needed for optimization
        if (isAnalysis) requiredEngines.push("HPAE"); // Analytics engine

        const mission: CanonicalMissionObject = {
            mission_id: "hm-miss-" + Math.random().toString(16).slice(2, 8),
            name: overrides.name || "Compiled Mission",
            description: naturalLanguageInput,
            type: isOptimization ? "Autonomous Optimization" : isAnalysis ? "Analysis & Inspection" : "General Automation",
            priority: overrides.priority || "High",
            objectives: {
                primary: overrides.primaryObjective || "Execute the defined mission successfully.",
                secondary: []
            },
            constraints: overrides.constraints || { max_runtime_sec: 3600, privacy_mode: "strict" },
            inputs: overrides.inputs || [],
            outputs: overrides.outputs || [],
            safety_policies: ["SP-01-NO-HARM", "SP-02-SANDBOX-FIRST"],
            resource_limits: { cpu: 80, memory: 4096 },
            owner: "HMCC",
            status: "APPROVED_PENDING_DISPATCH",
            confidence: 0.94,
            required_engines: requiredEngines,
            estimated_runtime_sec: 2700,
            estimated_cost: 0.05,
            created_time: Date.now(),
            updated_time: Date.now(),
            mission_graph: { nodes: [], edges: [] },
            risk_profile: { level: "Low", detected_risks: ["Data ingestion timeout"] }
        };

        return mission;
    }
}
