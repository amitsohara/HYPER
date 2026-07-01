import { CognitiveEvent, EventPriority, EventLifecycleStatus, EventMetrics } from "./types.js";
import { EventRouter } from "./eventRouter.js";
import { EventTraceManager } from "./eventTraceManager.js";
import { IEventPersistenceProvider } from "./eventPersistence.js";

export class EventDispatcher {
    private queue: CognitiveEvent[] = [];
    private isProcessing = false;
    
    // Metrics
    public metrics: EventMetrics = {
        throughput: 0,
        latency: 0,
        retries: 0,
        failures: 0,
        queueDepth: 0,
        subscribers: 0,
        publishRate: 0,
        memoryUsage: 0
    };

    private processedCount = 0;
    private totalLatencyMs = 0;

    constructor(
        private router: EventRouter,
        private traceManager: EventTraceManager,
        private persistence: IEventPersistenceProvider
    ) {}

    public enqueue(event: CognitiveEvent): void {
        this.traceManager.updateLifecycle(event.id, EventLifecycleStatus.QUEUED);
        this.queue.push(event);
        this.queue.sort((a, b) => b.priority - a.priority); // High priority first
        this.metrics.queueDepth = this.queue.length;
        this.metrics.publishRate++;

        this.processQueue().catch(console.error);
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const event = this.queue.shift();
            if (!event) break;
            
            this.metrics.queueDepth = this.queue.length;
            
            this.traceManager.updateLifecycle(event.id, EventLifecycleStatus.DISPATCHED);
            const handlers = this.router.route(event);

            const startTime = Date.now();
            try {
                this.traceManager.updateLifecycle(event.id, EventLifecycleStatus.RECEIVED);
                
                await Promise.all(handlers.map(async handler => {
                    await handler(event);
                }));

                this.traceManager.updateLifecycle(event.id, EventLifecycleStatus.PROCESSED);
                await this.persistence.saveEvent(event);
                this.traceManager.updateLifecycle(event.id, EventLifecycleStatus.PERSISTED);

                const latency = Date.now() - startTime;
                this.totalLatencyMs += latency;
                this.processedCount++;
                this.metrics.throughput = this.processedCount;
                this.metrics.latency = this.totalLatencyMs / this.processedCount;
                
            } catch (error: any) {
                this.traceManager.updateLifecycle(event.id, EventLifecycleStatus.FAILED, error.message);
                this.metrics.failures++;
                // Handle retry policies here based on priority
            }
        }

        this.isProcessing = false;
    }

    public updateMetrics() {
        this.metrics.subscribers = this.router.getSubscriberCount();
        this.metrics.memoryUsage = process.memoryUsage().heapUsed;
    }
}
