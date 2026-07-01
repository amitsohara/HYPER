import { CognitiveEvent, CognitiveDomain } from "./types.js";

export interface EventSchema {
    type: string;
    domain: CognitiveDomain;
    description: string;
}

export class EventRegistry {
    private registeredTypes: Map<string, EventSchema> = new Map();

    public registerEventType(schema: EventSchema): void {
        this.registeredTypes.set(schema.type, schema);
    }

    public isRegistered(type: string): boolean {
        return this.registeredTypes.has(type);
    }

    public getSchema(type: string): EventSchema | undefined {
        return this.registeredTypes.get(type);
    }
    
    public getAllSchemas(): EventSchema[] {
        return Array.from(this.registeredTypes.values());
    }

    public validate(event: CognitiveEvent): boolean {
        if (!this.isRegistered(event.type)) {
            // For flexibility, we can either strict fail or warn. We choose strict fail.
            throw new Error(`Event type \${event.type} is not registered in the EventRegistry.`);
        }
        return true;
    }
}
