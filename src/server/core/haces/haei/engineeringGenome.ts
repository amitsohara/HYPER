import { EngineeringGenome } from "./engineeringTypes.js";
import { EngineeringEventBus, EngineeringEvents } from "./engineeringEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class EngineeringGenomeRepository {
    private genome: EngineeringGenome;
    private eventBus = EngineeringEventBus.getInstance();

    constructor() {
        this.genome = {
            genome_id: uuidv4(),
            engineering_decisions: [],
            patterns_used: ["SOLID", "Clean Architecture", "Event-Driven"],
            libraries: ["Node.js", "TypeScript"],
            frameworks: ["Express"],
            optimization_decisions: [],
            security_decisions: [],
            refactoring_history: [],
            build_history: [],
            deployment_history: [],
            bug_history: [],
            testing_coverage: 0,
            performance_metrics: {},
            timestamp: Date.now()
        };
    }

    public updateGenome(updates: Partial<EngineeringGenome>) {
        this.genome = { ...this.genome, ...updates, timestamp: Date.now() };
        this.eventBus.publish(EngineeringEvents.ENGINEERING_GENOME_UPDATED, { genome: this.genome });
    }

    public getGenome(): EngineeringGenome {
        return this.genome;
    }
}
