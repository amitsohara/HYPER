import * as fs from 'fs';
import * as path from 'path';
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";

export class MissionLogger {
    private static instance: MissionLogger;
    private logFile: string;
    private isLogging: boolean = false;

    private constructor() {
        this.logFile = path.join(process.cwd(), 'mission_execution_log.txt');
        this.startLogging();
    }

    public static getInstance(): MissionLogger {
        if (!MissionLogger.instance) {
            MissionLogger.instance = new MissionLogger();
        }
        return MissionLogger.instance;
    }
    
    private write(data: string) {
        try {
            fs.appendFileSync(this.logFile, data);
        } catch (e) {
            console.error("Failed to write to mission log:", e);
        }
    }

    private startLogging() {
        if (this.isLogging) return;
        this.isLogging = true;

        this.write(`\n\n--- LOGGER STARTED AT ${new Date().toISOString()} ---\n`);

        const mesh = HyperMindEventMesh.getInstance();
        
        const relevantEvents = new Set([
            "WORLD_OBSERVATION", "WORLD_MODEL_UPDATED", "CONCEPT_DISCOVERED", 
            "ATTENTION_SHIFTED", "THOUGHT_GENERATED", "CONCLUSION_GENERATED",
            "PLAN_CREATED", "PLAN_EVALUATED", "ACTION_AUTHORIZED", "ACTION_REJECTED", 
            "ACTION_COMPLETED", "MISSION_COMPLETED", "LEARNING_ARTIFACT_CREATED",
            "KNOWLEDGE_UPDATED", "GOAL_CREATED"
        ]);

        mesh.subscribe("*", (event: any) => {
            if (!relevantEvents.has(event.type) && !event.type.startsWith("MISSION")) return;

            const logEntry = `[${new Date(event.timestamp || Date.now()).toISOString()}] [EVENT: ${event.type}] (Source: ${event.source}) ID: ${event.id}\n`;
            this.write(logEntry);

            if (event.payload) {
                try {
                    const payloadStr = JSON.stringify(event.payload, null, 2);
                    this.write(`  Payload: ${payloadStr}\n`);
                } catch (e) {
                    this.write(`  Payload: [Unserializable]\n`);
                }
            }
        });
    }

    public logCustom(msg: string) {
        this.write(`[${new Date().toISOString()}] [INFO] ${msg}\n`);
    }
}
