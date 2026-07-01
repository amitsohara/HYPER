import { CognitiveEvent, CognitiveDomain } from "./types.js";

export type EventHandler = (event: CognitiveEvent) => Promise<void> | void;

export interface Subscription {
    id: string;
    topic: string; // can be domain, type, or wildcard
    handler: EventHandler;
}

export class EventRouter {
    private subscriptions: Subscription[] = [];

    public subscribe(topic: string, handler: EventHandler): string {
        const id = Math.random().toString(36).substring(7);
        this.subscriptions.push({ id, topic, handler });
        return id;
    }

    public unsubscribe(id: string): void {
        this.subscriptions = this.subscriptions.filter(s => s.id !== id);
    }

    public route(event: CognitiveEvent): EventHandler[] {
        return this.subscriptions
            .filter(sub => this.matches(sub.topic, event))
            .map(sub => sub.handler);
    }

    private matches(topic: string, event: CognitiveEvent): boolean {
        if (topic === "*") return true;
        if (topic === event.type) return true;
        if (topic === event.domain) return true;
        if (event.destination && topic === event.destination) return true;
        return false;
    }

    public getSubscriberCount(): number {
        return this.subscriptions.length;
    }
}
