import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { ExperienceCollector, EpisodeManager } from "./managers/ExperienceManager.js";
import { PatternDiscoveryEngine, HeuristicDiscoveryEngine, SkillLearningEngine, StrategyLearningEngine } from "./engines/DiscoveryEngines.js";
import { KnowledgeValidationEngine, KnowledgeEvolutionEngine } from "./engines/KnowledgeEvolutionEngine.js";
import { ValidationStatus } from "./types.js";

export class HLLESpecialist implements ISpecialist {
    private registration: SpecialistRegistration = {
        id: "HLLE-1",
        name: "HyperMind Lifelong Learning Engine",
        version: "1.0.0",
        capabilities: [{
            name: "Lifelong Learning",
            description: "Learns patterns, heuristics, and skills from experience.",
            domain: CognitiveDomain.LEARNING,
            roles: [CognitiveRole.REASONING, CognitiveRole.VERIFICATION],
            requiredInputs: ["MISSION_COMPLETED", "ACTION_COMPLETED", "PLAN_EVALUATED"],
            producedOutputs: ["LEARNING_ARTIFACT_CREATED", "KNOWLEDGE_UPDATED"],
            confidence: 1.0
        }],
        status: SpecialistStatus.INITIALIZING,
        availability: 1.0,
        priority: 1,
        dependencies: [],
        resourceRequirements: {},
        communicationEndpoints: [],
        researchMapping: { hirqIds: [], hctIds: [] }
    };

    public expCollector: ExperienceCollector;
    public epManager: EpisodeManager;
    private patternEngine = new PatternDiscoveryEngine();
    private heuristicEngine = new HeuristicDiscoveryEngine();
    private skillEngine = new SkillLearningEngine();
    private strategyEngine = new StrategyLearningEngine();
    private validationEngine = new KnowledgeValidationEngine();
    private evolutionEngine: KnowledgeEvolutionEngine;

    constructor(private eventMesh: HyperMindEventMesh) {
        this.expCollector = new ExperienceCollector(eventMesh);
        this.epManager = new EpisodeManager();
        this.evolutionEngine = new KnowledgeEvolutionEngine(eventMesh);
    }

    getIdentity(): SpecialistRegistration {
        return this.registration;
    }

    async initialize(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
        this.eventMesh.subscribe("MISSION_COMPLETED", this.handleMissionCompleted.bind(this));
        // In reality, it would subscribe to many more to build up the full Experience trace
        this.eventMesh.subscribe("ACTION_COMPLETED", this.handleGeneralEvent.bind(this));
        this.eventMesh.subscribe("PLAN_EVALUATED", this.handleGeneralEvent.bind(this));
    }

    async activate(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
    }

    async suspend(): Promise<void> {
        this.registration.status = SpecialistStatus.SUSPENDED;
    }

    async resume(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
    }

    async retire(): Promise<void> {
        this.registration.status = SpecialistStatus.RETIRING;
    }

    async recover(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
    }

    getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return {
            status: this.registration.status,
            metrics: {}
        };
    }

    getConfidence(taskDescription: string): number {
        return 1.0;
    }

    async handleEvent(event: CognitiveEvent<any>): Promise<void> {
        if (event.type === "MISSION_COMPLETED") {
            await this.handleMissionCompleted(event);
        } else {
            await this.handleGeneralEvent(event);
        }
    }

    private async handleGeneralEvent(event: CognitiveEvent<any>) {
        this.expCollector.recordExperience(event);
    }

    private async handleMissionCompleted(event: CognitiveEvent<any>) {
        const missionId = event.payload?.mission?.id || "unknown";
        
        // 1. Gather all experiences (in a real system, filter by trace/mission ID)
        const experiences = this.expCollector.getExperiences();

        // 2. Create Episode
        const episode = this.epManager.createEpisode(missionId, experiences);

        // 3. Discover Knowledge
        const patterns = this.patternEngine.discoverPatterns([episode]);
        const heuristics = this.heuristicEngine.discoverHeuristics([episode]);
        const skills = this.skillEngine.learnSkills([episode]);
        const strategies = this.strategyEngine.learnStrategies([episode]);

        const allArtifacts = [...patterns, ...heuristics, ...skills, ...strategies];

        for (const artifact of allArtifacts) {
            this.eventMesh.publish({
                type: "LEARNING_ARTIFACT_CREATED",
                domain: CognitiveDomain.LEARNING,
                priority: 1,
                source: "HLLE",
                payload: { artifact }
            });

            // 4. Validate
            if (this.validationEngine.validate(artifact)) {
                // 5. Evolve / Promote
                this.evolutionEngine.proposePromotion(artifact);
            }
        }
    }
}
