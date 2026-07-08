import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { MissionResult } from "../types.js";

export class MissionResultManager {
    private static instance: MissionResultManager;
    private eventMesh: HyperMindEventMesh;
    private results: Map<string, MissionResult> = new Map();

    private constructor() {
        this.eventMesh = HyperMindEventMesh.getInstance();
        this.initializeSubscriptions();
        this.seedInitialResult();
    }

    public static getInstance(): MissionResultManager {
        if (!MissionResultManager.instance) {
            MissionResultManager.instance = new MissionResultManager();
        }
        return MissionResultManager.instance;
    }

    private seedInitialResult() {
        this.generateResult(`m_seed_${Date.now()}`, "SUCCESS", {}).then(res => this.results.set(res.missionId, res));
    }
    private initializeSubscriptions() {
        this.eventMesh.subscribe("MISSION_COMPLETED", this.handleMissionCompleted.bind(this));
        this.eventMesh.subscribe("MISSION_FAILED", this.handleMissionFailed.bind(this));
    }

    private async handleMissionCompleted(event: any) {
        const missionId = event.payload?.missionId || `m_${Date.now()}`;
        const result = await this.generateResult(missionId, "SUCCESS", event);
        this.results.set(missionId, result);
        this.eventMesh.publish({
            type: "MISSION_RESULT_READY",
            domain: CognitiveDomain.SYSTEM,
            priority: 2,
            source: "HMRC",
            payload: { result }
        });
    }

    private async handleMissionFailed(event: any) {
        const missionId = event.payload?.missionId || `m_${Date.now()}`;
        const result = await this.generateResult(missionId, "FAILED", event);
        this.results.set(missionId, result);
        this.eventMesh.publish({
            type: "MISSION_RESULT_READY",
            domain: CognitiveDomain.SYSTEM,
            priority: 2,
            source: "HMRC",
            payload: { result }
        });
    }

    private async generateResult(missionId: string, status: any, event: any): Promise<MissionResult> {
        // Mocking engine outputs for now, ideally they'd be populated by respective engines
        return {
            missionId,
            directive: "Optimize heavy traffic at Nashik Road Junction.",
            status: status,
            confidence: 0.94,
            score: 92,
            durationMs: 151000,
            objective: "Reduce congestion.",
            outcome: status === "SUCCESS" ? "Traffic congestion reduced by an estimated 34%." : "Failed to optimize traffic.",
            rootCauses: [
                "Poor signal timing",
                "Illegal parking",
                "Pedestrian crossing bottlenecks"
            ],
            unexpectedFindings: [
                "High delivery truck density",
                "School peak-hour congestion"
            ],
            recommendations: [
                {
                    id: "r1",
                    priority: 1,
                    description: "Increase green phase by 18 seconds.",
                    expectedImprovement: "34%",
                    estimatedCost: "₹12 lakh",
                    implementationDifficulty: "Medium"
                },
                {
                    id: "r2",
                    priority: 2,
                    description: "Restrict roadside parking.",
                    expectedImprovement: "15%",
                    estimatedCost: "₹2 lakh",
                    implementationDifficulty: "Low"
                }
            ],
            evidence: [
                { source: "Camera", description: "Visual tracking of intersection", confidence: 0.96 },
                { source: "Simulation", description: "Traffic throughput analysis", confidence: 0.92 }
            ],
            simulationComparison: [
                { name: "Current", metrics: "8.4 min delay", selected: false },
                { name: "Scenario B", metrics: "4.8 min delay", selected: true }
            ],
            cognitiveReasoningSummary: "HyperMind determined that congestion is primarily caused by inefficient signal timing combined with roadside parking and pedestrian interference. Simulations indicate that Scenario B provides the highest throughput while maintaining safety.",
            confidenceBreakdown: {
                perception: 0.96,
                worldModel: 0.93,
                reasoning: 0.91,
                planning: 0.94,
                simulation: 0.92,
                decision: 0.95,
                execution: 0.90,
                learning: 0.89,
                overall: 0.94
            },
            timeline: [
                { id: "t1", event: "Mission Created", timestamp: Date.now() - 150000 },
                { id: "t2", event: "Observation Complete", timestamp: Date.now() - 140000 },
                { id: "t3", event: "Mission Closed", timestamp: Date.now() }
            ],
            timestamp: Date.now()
        };
    }

    public getResults(): MissionResult[] {
        return Array.from(this.results.values());
    }

    public getResult(missionId: string): MissionResult | undefined {
        return this.results.get(missionId);
    }
}
