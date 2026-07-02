import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { EventStreamer } from "../stream/EventStreamer";
import { TelemetryCollector } from "../collectors/TelemetryCollector";
import { MetricsEngine } from "../metrics/MetricsEngine";

export class CognitiveObservatory {
    private static instance: CognitiveObservatory;
    private eventMesh: HyperMindEventMesh;
    private streamer: EventStreamer;
    private telemetry: TelemetryCollector;
    private metrics: MetricsEngine;

    private constructor() {
        this.eventMesh = HyperMindEventMesh.getInstance();
        this.streamer = new EventStreamer();
        this.telemetry = new TelemetryCollector();
        this.metrics = new MetricsEngine(this.telemetry);
        this.initializeSubscriptions();
    }

    public static getInstance(): CognitiveObservatory {
        if (!CognitiveObservatory.instance) {
            CognitiveObservatory.instance = new CognitiveObservatory();
        }
        return CognitiveObservatory.instance;
    }

    private initializeSubscriptions() {
        this.eventMesh.subscribe("*", (eventType, data) => {
            // Forward everything to streaming and telemetry
            const eventPayload = {
                id: crypto.randomUUID(),
                type: eventType,
                timestamp: Date.now(),
                data: data
            };
            this.telemetry.recordEvent(eventPayload);
            this.streamer.broadcast(eventPayload);
            this.metrics.processEvent(eventPayload);
        });
    }

    public getStreamer() { return this.streamer; }
    public getTelemetry() { return this.telemetry; }
    public getMetrics() { return this.metrics; }
}
