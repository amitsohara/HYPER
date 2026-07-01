import { CognitiveEvent, CognitiveDomain, EventPriority, EventTrace, EventSchema, EventMetrics } from "./types.js";
import { EventRegistry } from "./eventRegistry.js";
import { EventTraceManager } from "./eventTraceManager.js";
import { EventRouter, EventHandler } from "./eventRouter.js";
import { EventDispatcher } from "./eventDispatcher.js";
import { IEventPersistenceProvider, InMemoryEventPersistence } from "./eventPersistence.js";
import { randomUUID } from "crypto";

export class HyperMindEventMesh {
    private static instance: HyperMindEventMesh;
    
    public registry: EventRegistry;
    public traceManager: EventTraceManager;
    public router: EventRouter;
    public dispatcher: EventDispatcher;
    public persistence: IEventPersistenceProvider;

    private constructor() {
        this.registry = new EventRegistry();
        this.traceManager = new EventTraceManager();
        this.router = new EventRouter();
        this.persistence = new InMemoryEventPersistence(); // Default
        this.dispatcher = new EventDispatcher(this.router, this.traceManager, this.persistence);
    }

    public static getInstance(): HyperMindEventMesh {
        if (!HyperMindEventMesh.instance) {
            HyperMindEventMesh.instance = new HyperMindEventMesh();
        }
        return HyperMindEventMesh.instance;
    }

    public setPersistenceProvider(provider: IEventPersistenceProvider) {
        this.persistence = provider;
        this.dispatcher = new EventDispatcher(this.router, this.traceManager, this.persistence);
    }

    public registerEventType(schema: EventSchema): void {
        this.registry.registerEventType(schema);
    }

    public publish(eventPayload: Omit<CognitiveEvent, "id" | "timestamp">): string {
        const id = randomUUID();
        const event: CognitiveEvent = {
            ...eventPayload,
            id,
            timestamp: Date.now()
        };

        this.traceManager.initializeTrace(event, event.correlationId);
        
        try {
            this.registry.validate(event);
            this.dispatcher.enqueue(event);
        } catch (error: any) {
            // Unregistered event types might be allowed depending on strict mode, 
            // but we'll enforce registration for production HCNS.
            console.error(`[HCNS-01] Event Validation Failed:`, error.message);
            throw error;
        }

        return id;
    }

    public subscribe(topic: string, handler: EventHandler): string {
        return this.router.subscribe(topic, handler);
    }

    public unsubscribe(subscriptionId: string): void {
        this.router.unsubscribe(subscriptionId);
    }

    public getTrace(eventId: string): EventTrace | undefined {
        return this.traceManager.getTrace(eventId);
    }

    public async queryEvents(criteria: any): Promise<CognitiveEvent[]> {
        return this.persistence.queryEvents(criteria);
    }

    public getMetrics(): EventMetrics {
        this.dispatcher.updateMetrics();
        return this.dispatcher.metrics;
    }
}
