import { SpecialistRegistry } from "./specialistRegistry.js";
import { SpecialistType } from "./cognitiveTypes.js";
import { CognitiveEventBus, CognitiveEvents } from "./cognitiveEvents.js";
import { CognitiveMetrics } from "./cognitiveMetrics.js";

export class SpecialistManager {
    private eventBus = CognitiveEventBus.getInstance();

    constructor(private registry: SpecialistRegistry) {}

    public async executeSpecialist(type: SpecialistType, input: any, blackboard: any): Promise<any> {
        const specialist = this.registry.get(type);
        if (!specialist) {
            throw new Error(`Specialist ${type} not registered`);
        }

        this.eventBus.publish(CognitiveEvents.SPECIALIST_ACTIVATED, { type });
        CognitiveMetrics.recordSpecialist(type);

        return await specialist.process(input, blackboard);
    }
}
