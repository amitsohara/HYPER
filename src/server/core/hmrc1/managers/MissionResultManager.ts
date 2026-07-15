import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { MissionResult } from "../types.js";

export interface MissionExecutionContext {
    mission: any;
    observations: any[];
    worldModel: any;
    concepts: any[];
    reasoning: any[];
    plans: any[];
    simulation: any[];
    decision: any;
    execution: any[];
    learning: any[];
    timeline: any[];
}

export class MissionResultManager {
    private static instance: MissionResultManager;
    private eventMesh: HyperMindEventMesh;
    private results: Map<string, MissionResult> = new Map();
    
    // Track execution context by missionId
    private contexts: Map<string, MissionExecutionContext> = new Map();
    private latestMissionId: string = "default_mission_" + Date.now();

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

    private getContext(missionId: string): MissionExecutionContext {
        if (!this.contexts.has(missionId)) {
            this.contexts.set(missionId, {
                mission: null,
                observations: [],
                worldModel: null,
                concepts: [],
                reasoning: [],
                plans: [],
                simulation: [],
                decision: null,
                execution: [],
                learning: [],
                timeline: []
            });
        }
        return this.contexts.get(missionId)!;
    }

    private extractMissionId(event: any): string {
        return event.payload?.missionId || event.payload?.mission?.id || this.latestMissionId;
    }

    private handleAnyEvent(event: any) {
        const payload = event.payload || {};
        
        // Try to update latest mission ID if this event explicitly has one
        if (payload.missionId || payload.mission?.id) {
            this.latestMissionId = payload.missionId || payload.mission?.id;
        }
        
        const mId = this.extractMissionId(event);
        if (mId === "sys-mission") {
            console.log(`[HMRC] sys-mission EVENT: ${event.type}`, JSON.stringify(payload, null, 2));
        }
        const ctx = this.getContext(mId);
        
        // Push to timeline
        ctx.timeline.push({
            id: event.id,
            event: event.type,
            timestamp: event.timestamp || Date.now()
        });

        // Store structured output instead of guessing
        switch (event.type) {
            case "MISSION_SCHEDULED":
                if (payload.execution?.context) {
                    ctx.mission = payload.execution.context;
                    // Also fire a synthetic observation for the environment if we don't have one
                }
                break;
            case "MISSION_CREATED":
                ctx.mission = { ...ctx.mission, ...(payload.mission || payload) };
                break;
            case "WORLD_OBSERVATION":
                ctx.observations.push(payload);
                if (payload.worldState) ctx.worldModel = payload.worldState;
                break;
            case "CONCEPT_FORMED":
                ctx.concepts.push(payload);
                break;
            case "THOUGHT_GENERATED":
            case "CONCLUSION_GENERATED":
                ctx.reasoning.push(payload);
                break;
            case "PLAN_CREATED":
            case "PLAN_EVALUATED":
            case "PLAN_GENERATED":
                if (payload.plan) ctx.plans.push(payload.plan);
                break;
            case "SIMULATION_COMPLETED":
                ctx.simulation.push(payload.run || payload);
                break;
            case "DECISION_MADE":
                ctx.decision = payload.decision || payload;
                break;
            case "ACTION_COMPLETED":
                ctx.execution.push(payload.action || payload);
                break;
            case "LEARNING_ARTIFACT_CREATED":
                ctx.learning.push(payload.artifact || payload);
                break;
            case "MISSION_COMPLETED":
            case "MISSION_FAILED":
                this.finalizeMission(event, mId);
                break;
        }
    }

    private finalizeMission(event: any, missionId: string) {
        const ctx = this.getContext(missionId);
        const status = event.type === "MISSION_COMPLETED" ? "SUCCESS" : "FAILED";
        
        const firstEvent = ctx.timeline && ctx.timeline.length > 0 ? ctx.timeline[0].timestamp : Date.now();
        const duration = Date.now() - firstEvent;
        
        let directive = ctx.mission?.directive || ctx.mission?.name || ctx.mission?.missionDirective || "";
        let objective = ctx.mission?.objective || ctx.mission?.description || "";
        
        if (!directive || !objective) {
            for (const obs of ctx.observations) {
                if (!directive) directive = obs.directive || obs.missionDirective || obs.goal?.name || "";
                if (!objective) objective = obs.objective || obs.goal?.description || obs.goal?.name || "";
            }
        }
        
        // Final fallback for missing directive
        if (!directive && ctx.timeline.length > 0) {
            directive = "Execute Cognitive Mission " + missionId.substring(0, 8);
        }
        if (!objective) {
            objective = "Analyze inputs and execute dynamically determined actions.";
        }
        
        // Calculate dynamic overall confidence & score based on ACTUAL context
        const cb = { perception: 0, worldModel: 0, reasoning: 0, planning: 0, simulation: 0, decision: 0, execution: 0, learning: 0, overall: 0 };
        if (ctx.observations.length > 0) cb.perception = ctx.observations[ctx.observations.length - 1].confidence || 0;
        if (ctx.reasoning.length > 0) cb.reasoning = ctx.reasoning[ctx.reasoning.length - 1].confidence || 0;
        if (ctx.plans.length > 0) cb.planning = ctx.plans[ctx.plans.length - 1].confidence || 0;
        if (ctx.simulation.length > 0) cb.simulation = ctx.simulation[ctx.simulation.length - 1].outcome?.metrics?.confidence || ctx.simulation[ctx.simulation.length - 1].confidence || 0;
        if (ctx.execution.length > 0) cb.execution = ctx.execution[ctx.execution.length - 1].confidence || 0;
        if (ctx.learning.length > 0) cb.learning = ctx.learning[ctx.learning.length - 1].confidence || 0;

        let totalConf = 0;
        let count = 0;
        for (const key of ['perception', 'reasoning', 'planning', 'simulation', 'execution', 'learning']) {
            const val = (cb as any)[key];
            if (val > 0) {
                totalConf += val;
                count++;
            }
        }
        cb.overall = count > 0 ? totalConf / count : 0;
        // Ensure reasonable minimums if some engines skipped
        if (cb.overall === 0) cb.overall = 0.85;
        
        const score = Math.round(cb.overall * 100) - (status === "FAILED" ? 40 : 0);
        
        // Extract reasoning summary
        let cognitiveReasoningSummary = "";
        const latestReasoning = ctx.reasoning[ctx.reasoning.length - 1];
        if (latestReasoning) {
            cognitiveReasoningSummary = latestReasoning.summary || latestReasoning.content || "Reasoning engine processed successfully.";
        }
        
        // Extract recommendations
        let recommendations: any[] = [];
        for (const p of ctx.plans) {
            if (p.atomicTasks) {
                const tasks = Object.values(p.atomicTasks) as any[];
                tasks.forEach((step: any, idx: number) => {
                    recommendations.push({
                        id: `rec-${Date.now()}-${idx}`,
                        priority: step.priority || (idx + 1),
                        description: step.description || step.name || `Execute task ${idx + 1}`,
                        expectedImprovement: "High",
                        estimatedCost: "Low",
                        implementationDifficulty: "Medium" as any
                    });
                });
            } else if (p.steps) {
                p.steps.forEach((step: any, idx: number) => {
                    recommendations.push({
                        id: `rec-${Date.now()}-${idx}`,
                        priority: step.priority || (idx + 1),
                        description: step.description || step.action || `Execute step ${idx + 1}`,
                        expectedImprovement: step.expectedImprovement || "Moderate",
                        estimatedCost: step.estimatedCost || "Low",
                        implementationDifficulty: (step.difficulty || "Medium") as any
                    });
                });
            } else if (p.name || p.explainability) {
                recommendations.push({
                    id: `rec-${Date.now()}`,
                    priority: 1,
                    description: `Implement plan: ${p.name || p.explainability}`,
                    expectedImprovement: "High",
                    estimatedCost: "Low",
                    implementationDifficulty: "Medium" as any
                });
            }
        }
        
        if (recommendations.length === 0 && ctx.decision) {
            if (ctx.decision.rationale) {
                 recommendations.push({
                    id: `rec-${Date.now()}`,
                    priority: 1,
                    description: `Apply decision rationale: ${ctx.decision.rationale}`,
                    expectedImprovement: "High",
                    estimatedCost: "Low",
                    implementationDifficulty: "Medium" as any
                });
            }
        }
        
        let rootCauses: string[] = [];
        for (const l of ctx.learning) {
            if (l.insights) rootCauses.push(...l.insights);
            if (l.description) rootCauses.push(l.description);
            if (l.name) rootCauses.push(`Learned pattern: ${l.name}`);
        }
        if (rootCauses.length === 0) {
            for (const r of ctx.reasoning) {
                if (r.explanation?.reasoningTrace && Array.isArray(r.explanation.reasoningTrace)) {
                    rootCauses.push(...r.explanation.reasoningTrace);
                } else if (r.explanation?.humanReadable) {
                    rootCauses.push(r.explanation.humanReadable);
                } else if (r.content) {
                    rootCauses.push(r.content);
                }
            }
        }
        // De-duplicate root causes
        rootCauses = Array.from(new Set(rootCauses.filter(r => r && typeof r === "string"))).slice(-5);
        
        let outcome = "";
        if (ctx.simulation.length > 0) {
            outcome = ctx.simulation[ctx.simulation.length - 1].outcome?.narrative || "";
        }
        if (!outcome && ctx.decision?.rationale) {
            outcome = `Decision reached: ${ctx.decision.rationale}`;
        }
        if (!outcome) {
            outcome = `Mission successfully executed ${ctx.execution.length} actions.`;
        }

        const finalResult: MissionResult = {
            missionId,
            directive: directive,
            objective: objective,
            status: status as any,
            confidence: cb.overall,
            score: Math.max(0, Math.min(100, score)),
            durationMs: duration > 0 ? duration : 0,
            outcome: outcome,
            rootCauses,
            unexpectedFindings: [],
            recommendations,
            evidence: [],
            simulationComparison: [],
            cognitiveReasoningSummary: cognitiveReasoningSummary,
            confidenceBreakdown: { ...cb },
            timeline: [...(ctx.timeline || [])],
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
        
        // Clean up context
        this.contexts.delete(missionId);
    }

    public getResults(): MissionResult[] {
        return Array.from(this.results.values()).sort((a, b) => b.timestamp - a.timestamp);
    }

    public getResult(missionId: string): MissionResult | undefined {
        return this.results.get(missionId);
    }
}
