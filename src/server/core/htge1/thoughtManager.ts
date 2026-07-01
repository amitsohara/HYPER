import { ThoughtObject, ThoughtLifecycleState } from "./types.js";
import { ThoughtPersistence } from "./thoughtPersistence.js";
import { ThoughtPrioritizationEngine } from "./thoughtPrioritizationEngine.js";
import { ThoughtWorkspace } from "./thoughtWorkspace.js";
import { v4 as uuidv4 } from "uuid";

export class ThoughtManager {
    constructor(
        private persistence: ThoughtPersistence,
        private prioritizationEngine: ThoughtPrioritizationEngine,
        private workspace: ThoughtWorkspace
    ) {}

    public createThought(
        summary: string,
        detailedRepresentation: string,
        origin: string,
        sessionId: string,
        associatedWorldObjects: string[] = [],
        associatedConcepts: string[] = [],
        associatedGoals: string[] = []
    ): ThoughtObject {
        const thought: ThoughtObject = {
            id: uuidv4(),
            sessionId,
            origin,
            currentStatus: "Initial",
            summary,
            detailedRepresentation,
            associatedWorldObjects,
            associatedConcepts,
            associatedGoals,
            associatedSpecialists: [],
            attentionScore: 0.5,
            confidence: 0.5,
            evidence: [],
            dependencies: [],
            contradictions: [],
            predictions: [],
            priority: 0,
            lifecycleState: ThoughtLifecycleState.GENERATED,
            version: 1,
            researchTraceability: {
                hirqIds: [],
                tgpId: "TGP-001",
                hctIds: []
            },
            metadata: {},
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.prioritizationEngine.calculatePriority(thought, 0.5, 0.5, 0.5); // Defaults
        thought.lifecycleState = ThoughtLifecycleState.ACTIVE;
        
        this.persistence.save(thought);
        this.workspace.enforceCapacity();
        
        return thought;
    }

    public archiveThought(id: string): void {
        const thought = this.persistence.get(id);
        if (thought) {
            thought.lifecycleState = ThoughtLifecycleState.ARCHIVED;
            thought.version++;
            thought.updatedAt = Date.now();
        }
    }

    public getThought(id: string): ThoughtObject | undefined {
        return this.persistence.get(id);
    }
}
