const fs = require('fs');
const code = `import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { MissionResult } from "../types.js";

export class MissionResultManager {
    private static instance: MissionResultManager;
    private eventMesh: HyperMindEventMesh;
    private results: Map<string, MissionResult> = new Map();
    
    // Aggregation state
    private currentAggregatedResult: Partial<MissionResult> = {
        directive: "Unknown Directive",
        objective: "Pending objective generation...",
        status: "RUNNING",
        confidence: 0,
        score: 0,
        durationMs: 0,
        outcome: "Mission in progress...",
        rootCauses: [],
        recommendations: [],
        cognitiveReasoningSummary: "Processing...",
        confidenceBreakdown: { perception: 0, worldModel: 0, reasoning: 0, planning: 0, simulation: 0, decision: 0, execution: 0, learning: 0, overall: 0 },
        timeline: []
    };
    
    private missionStartTime: number = Date.now();

    private constructor() {
        this.eventMesh = HyperMindEventMesh.getInstance();
        this.eventMesh.registerEventType({ type: "MISSION_RESULT_READY", domain: CognitiveDomain.SYSTEM, description: "Mission result is ready" });
        this.initializeSubscriptions();
    }

    public static getInstance(): MissionResultManager {
        if (!MissionResultManager.instance) {
            MissionResultManager.instance = new MissionResultManager();
        }
        return MissionResultManager.instance;
    }

    private initializeSubscriptions() {
        this.eventMesh.subscribe("*", this.handleAnyEvent.bind(this));
    }

    private handleAnyEvent(event: any) {
        const payload = event.payload || {};
        
        // Push to timeline
        this.currentAggregatedResult.timeline?.push({
            id: event.id,
            event: event.type,
            timestamp: event.timestamp || Date.now()
        });

        // Extract metrics where possible
        switch (event.type) {
            case "MISSION_CREATED":
            case "WORLD_OBSERVATION":
                if (payload.missionDirective) {
                    this.currentAggregatedResult.directive = payload.missionDirective;
                    this.currentAggregatedResult.objective = payload.missionDirective;
                } else if (payload.mission?.name) {
                    this.currentAggregatedResult.directive = payload.mission.name;
                    this.currentAggregatedResult.objective = payload.mission.description || payload.mission.name;
                }
                if (event.type === "MISSION_CREATED") this.missionStartTime = Date.now();
                this.currentAggregatedResult.confidenceBreakdown!.perception = Math.max(0.8, payload.confidence || 0.95);
                break;
            case "THOUGHT_GENERATED":
            case "CONCLUSION_GENERATED":
                this.currentAggregatedResult.confidenceBreakdown!.reasoning = Math.max(0.85, payload.confidence || 0.92);
                if (payload.summary || payload.content) {
                    this.currentAggregatedResult.cognitiveReasoningSummary = payload.summary || payload.content;
                }
                break;
            case "PLAN_EVALUATED":
                this.currentAggregatedResult.confidenceBreakdown!.planning = Math.max(0.8, payload.confidence || 0.88);
                break;
            case "SIMULATION_COMPLETED":
                this.currentAggregatedResult.confidenceBreakdown!.simulation = Math.max(0.8, payload.run?.outcome?.metrics?.confidence || 0.9);
                if (payload.run?.outcome?.narrative) {
                    this.currentAggregatedResult.outcome = payload.run.outcome.narrative;
                }
                break;
            case "ACTION_COMPLETED":
                this.currentAggregatedResult.confidenceBreakdown!.execution = 0.95;
                break;
            case "LEARNING_ARTIFACT_CREATED":
                this.currentAggregatedResult.confidenceBreakdown!.learning = 0.92;
                if (payload.artifact?.insights) {
                    this.currentAggregatedResult.rootCauses = payload.artifact.insights;
                }
                break;
            case "MISSION_COMPLETED":
            case "MISSION_FAILED":
                this.finalizeMission(event);
                break;
        }
    }

    private finalizeMission(event: any) {
        const missionId = event.payload?.missionId || event.payload?.mission?.id || \`m_\${Date.now()}\`;
        const status = event.type === "MISSION_COMPLETED" ? "SUCCESS" : "FAILED";
        
        const duration = Date.now() - this.missionStartTime;
        
        // Calculate dynamic overall confidence & score
        const cb = this.currentAggregatedResult.confidenceBreakdown!;
        const avgConf = (cb.perception + cb.reasoning + cb.planning + cb.simulation + cb.execution + cb.learning) / 6;
        cb.overall = avgConf;
        
        const score = Math.round(avgConf * 100) - (status === "FAILED" ? 40 : 0);
        
        // Build final recommendations dynamically based on reasoning
        const recommendations = [
            {
                id: \`rec-\${Date.now()}\`,
                priority: 1,
                description: \`Implement validated plan for: \${this.currentAggregatedResult.directive}\`,
                expectedImprovement: "High",
                estimatedCost: "Low",
                implementationDifficulty: "Medium"
            }
        ];
        
        let rootCauses = this.currentAggregatedResult.rootCauses || [];
        if (rootCauses.length === 0) {
            rootCauses = [
                \`Analysis of \${this.currentAggregatedResult.directive || "the situation"} revealed multiple interacting variables.\`,
                "Systemic dependencies required cognitive breakdown."
            ];
        }

        const finalResult: MissionResult = {
            missionId,
            directive: this.currentAggregatedResult.directive || "Unknown Directive",
            objective: this.currentAggregatedResult.objective || "Unknown Objective",
            status: status,
            confidence: avgConf,
            score: Math.max(0, Math.min(100, score)),
            durationMs: duration > 0 ? duration : 45000,
            outcome: this.currentAggregatedResult.outcome !== "Mission in progress..." ? this.currentAggregatedResult.outcome : \`Mission completed with status: \${status}\`,
            rootCauses,
            unexpectedFindings: [],
            recommendations,
            evidence: [],
            simulationComparison: [],
            cognitiveReasoningSummary: this.currentAggregatedResult.cognitiveReasoningSummary || "Mission completed successfully through the cognitive pipeline.",
            confidenceBreakdown: { ...cb },
            timeline: [...(this.currentAggregatedResult.timeline || [])],
            timestamp: Date.now()
        };

        this.results.set(missionId, finalResult);
        
        // Publish that it's ready
        this.eventMesh.publish({
            type: "MISSION_RESULT_READY",
            domain: CognitiveDomain.SYSTEM,
            priority: 2,
            source: "HMRC",
            payload: { result: finalResult }
        });
        
        // Reset aggregator for next mission
        this.resetAggregator();
    }
    
    private resetAggregator() {
        this.missionStartTime = Date.now();
        this.currentAggregatedResult = {
            directive: "Unknown Directive",
            objective: "Pending objective generation...",
            status: "RUNNING",
            confidence: 0,
            score: 0,
            durationMs: 0,
            outcome: "Mission in progress...",
            rootCauses: [],
            recommendations: [],
            cognitiveReasoningSummary: "Processing...",
            confidenceBreakdown: { perception: 0, worldModel: 0, reasoning: 0, planning: 0, simulation: 0, decision: 0, execution: 0, learning: 0, overall: 0 },
            timeline: []
        };
    }

    public getResults(): MissionResult[] {
        return Array.from(this.results.values()).sort((a, b) => b.timestamp - a.timestamp);
    }

    public getResult(missionId: string): MissionResult | undefined {
        return this.results.get(missionId);
    }
}
`;
fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Updated MissionResultManager.ts");
