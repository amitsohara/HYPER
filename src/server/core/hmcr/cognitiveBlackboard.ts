import { CognitiveEventBus, CognitiveEvents } from "./cognitiveEvents.js";
import { SpecialistType } from "./cognitiveTypes.js";

export class CognitiveBlackboard {
    private eventBus = CognitiveEventBus.getInstance();
    private state: Map<string, any> = new Map();

    public write(key: string, data: any, source: SpecialistType | 'ECC') {
        this.state.set(key, { data, source, timestamp: Date.now() });
        this.eventBus.publish(CognitiveEvents.BLACKBOARD_UPDATED, { key, source });
    }

    public read(key: string): any {
        return this.state.get(key)?.data;
    }

    public readAll(): Record<string, any> {
        const result: Record<string, any> = {};
        for (const [key, val] of this.state.entries()) {
            result[key] = val;
        }
        return result;
    }

    public clear() {
        this.state.clear();
    }
}
