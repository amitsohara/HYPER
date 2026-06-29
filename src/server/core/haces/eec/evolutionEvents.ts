export enum EvolutionEvents {
    MISSION_COMPLETED = "MissionCompleted",
    EVOLUTION_ASSESSMENT_STARTED = "EvolutionAssessmentStarted",
    EVOLUTION_PROPOSAL_CREATED = "EvolutionProposalCreated",
    PROPOSAL_REJECTED = "ProposalRejected",
    RESEARCH_STARTED = "ResearchStarted",
    ARCHITECTURE_APPROVED = "ArchitectureApproved",
    ENGINEERING_STARTED = "EngineeringStarted",
    VERIFICATION_PASSED = "VerificationPassed",
    BENCHMARK_PASSED = "BenchmarkPassed",
    SANDBOX_SUCCEEDED = "SandboxSucceeded",
    DEPLOYMENT_APPROVED = "DeploymentApproved",
    EVOLUTION_COMPLETED = "EvolutionCompleted",
    STATE_CHANGED = "StateChanged",
    RESOURCE_ALLOCATED = "ResourceAllocated",
    RISK_ASSESSED = "RiskAssessed"
}

export type EventCallback = (payload: any) => void;

export class EvolutionEventBus {
    private static instance: EvolutionEventBus;
    private listeners: Map<EvolutionEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): EvolutionEventBus {
        if (!EvolutionEventBus.instance) {
            EvolutionEventBus.instance = new EvolutionEventBus();
        }
        return EvolutionEventBus.instance;
    }

    public subscribe(event: EvolutionEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: EvolutionEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
