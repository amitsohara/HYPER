import { DigitalTwinState, CognitiveGenome, CapabilityProfile } from "./observabilityTypes.js";
import { ObservabilityEventBus, ObservabilityEvents } from "./observabilityEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class DigitalTwin {
    private state: DigitalTwinState;
    private eventBus = ObservabilityEventBus.getInstance();

    constructor() {
        this.state = this.initializeState();
    }

    private initializeState(): DigitalTwinState {
        return {
            twin_id: uuidv4(),
            timestamp: Date.now(),
            genome: {
                genome_id: uuidv4(),
                version: "1.0.0",
                active_modules: ["HCOS", "HCW", "HECS", "HWME", "HERA", "HACES_EEC"],
                relationships: [],
                data_flows: [],
                dependency_graph: {},
                capability_graph: {},
                timestamp: Date.now()
            },
            health_profile: {
                profile_id: uuidv4(),
                timestamp: Date.now(),
                metrics: {},
                overall_health_score: 100
            },
            capability_profile: {
                capabilities: {},
                timestamp: Date.now()
            },
            performance: {
                snapshot_id: uuidv4(),
                timestamp: Date.now(),
                mission_success_rate: 100,
                average_latency_ms: 0,
                resource_efficiency: 100,
                throughput: 0,
                reliability: 100
            },
            active_bottlenecks: [],
            evolution_readiness: {
                readiness_score: 0,
                evidence_quality: 0,
                research_maturity: 0,
                benchmark_confidence: 0,
                risk_level: 0,
                resource_availability: 0,
                expected_capability_gain: 0,
                is_ready: false,
                timestamp: Date.now()
            },
            active_missions: [],
            research_priorities: []
        };
    }

    public updateState(updates: Partial<DigitalTwinState>): void {
        this.state = { ...this.state, ...updates, timestamp: Date.now() };
        this.eventBus.publish(ObservabilityEvents.DIGITAL_TWIN_UPDATED, { state: this.state });
    }

    public updateGenome(genome: CognitiveGenome): void {
        this.state.genome = genome;
        this.state.timestamp = Date.now();
        this.eventBus.publish(ObservabilityEvents.DIGITAL_TWIN_UPDATED, { state: this.state });
    }

    public getState(): DigitalTwinState {
        return this.state;
    }
}
