import { Observation, UnifiedObservation } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class SensorFusionEngine {
    fuse(observations: Observation[]): UnifiedObservation {
        const entities: any[] = [];
        const events: any[] = [];
        
        for (const obs of observations) {
            if (obs.data.objectsDetected) {
                entities.push(...obs.data.objectsDetected.map((o: string) => ({ name: o, type: "OBJECT" })));
            }
            if (obs.data.transcript) {
                events.push({ type: "SPEECH", content: obs.data.transcript });
            }
        }

        return {
            id: uuidv4(),
            timestamp: Date.now(),
            entities,
            events,
            relationships: [],
            confidence: observations.length > 0 ? Math.min(...observations.map(o => o.confidence)) : 0,
            sourceObservations: observations.map(o => o.id)
        };
    }
}
