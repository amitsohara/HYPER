import { SpecialistRegistry, ISpecialist } from "./specialistRegistry.js";
import { SpecialistManager } from "./specialistManager.js";
import { CognitiveStateManager } from "./cognitiveStateManager.js";
import { CognitiveScheduler } from "./cognitiveScheduler.js";
import { CognitiveCycle } from "./cognitiveCycle.js";
import { ConfidenceEngine } from "./confidenceEngine.js";
import { ConflictResolver } from "./conflictResolver.js";
import { SpecialistType } from "./cognitiveTypes.js";

// Mock specialist implementations to prevent failure
class MockSpecialist implements ISpecialist {
    constructor(public type: SpecialistType) {}
    async process(input: any, blackboard: any) {
        return { message: `Mock execution of ${this.type}` };
    }
}

export class CognitiveRuntime {
    public registry: SpecialistRegistry;
    public manager: SpecialistManager;
    public stateManager: CognitiveStateManager;
    public scheduler: CognitiveScheduler;
    public cycle: CognitiveCycle;
    public confidenceEngine: ConfidenceEngine;
    public conflictResolver: ConflictResolver;

    constructor() {
        this.registry = new SpecialistRegistry();
        this.manager = new SpecialistManager(this.registry);
        this.stateManager = new CognitiveStateManager();
        this.scheduler = new CognitiveScheduler();
        this.cycle = new CognitiveCycle(this.scheduler, this.manager, this.stateManager);
        this.confidenceEngine = new ConfidenceEngine();
        this.conflictResolver = new ConflictResolver();

        // Register default mock specialists so the cycle can run
        for (const type of Object.values(SpecialistType)) {
            this.registry.register(new MockSpecialist(type as SpecialistType));
        }
    }
}
