import { WorldStateManager } from "./worldStateManager.js";
import { EntityManager } from "./entityManager.js";
import { RelationshipEngine } from "./relationshipEngine.js";
import { TemporalEngine } from "./temporalEngine.js";
import { SpatialEngine } from "./spatialEngine.js";
import { CausalityEngine } from "./causalityEngine.js";
import { GoalModel } from "./goalModel.js";
import { ContextEngine } from "./contextEngine.js";
import { UncertaintyEngine } from "./uncertaintyEngine.js";
import { SimulationEngine } from "./simulationEngine.js";
import { ObservationIntegrator } from "./observationIntegrator.js";

export class HyperMindWorldModelEngine {
    private static instance: HyperMindWorldModelEngine;

    public stateManager: WorldStateManager;
    public entityManager: EntityManager;
    public relationshipEngine: RelationshipEngine;
    public temporalEngine: TemporalEngine;
    public spatialEngine: SpatialEngine;
    public causalityEngine: CausalityEngine;
    public goalModel: GoalModel;
    public contextEngine: ContextEngine;
    public uncertaintyEngine: UncertaintyEngine;
    public simulationEngine: SimulationEngine;
    public observationIntegrator: ObservationIntegrator;

    private constructor() {
        this.stateManager = new WorldStateManager();
        const canonical = this.stateManager.getCanonicalWorld();
        
        this.entityManager = new EntityManager(canonical);
        this.relationshipEngine = new RelationshipEngine(canonical);
        this.temporalEngine = new TemporalEngine(canonical);
        this.spatialEngine = new SpatialEngine(canonical);
        this.causalityEngine = new CausalityEngine(canonical);
        this.goalModel = new GoalModel(canonical);
        this.contextEngine = new ContextEngine(canonical);
        this.uncertaintyEngine = new UncertaintyEngine(canonical);
        this.simulationEngine = new SimulationEngine(this.stateManager);
        this.observationIntegrator = new ObservationIntegrator(
            this.entityManager,
            this.relationshipEngine,
            this.temporalEngine,
            this.causalityEngine,
            this.goalModel,
            this.contextEngine
        );
    }

    public static getInstance(): HyperMindWorldModelEngine {
        if (!HyperMindWorldModelEngine.instance) {
            HyperMindWorldModelEngine.instance = new HyperMindWorldModelEngine();
        }
        return HyperMindWorldModelEngine.instance;
    }

    public initialize(): void {
        this.observationIntegrator.startListening();
    }
}
