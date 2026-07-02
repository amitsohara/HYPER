import { WorldTwin } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class TwinManager {
    private twins: Map<string, WorldTwin> = new Map();

    /**
     * Clones the canonical world model into an isolated WorldTwin.
     */
    createTwin(canonicalState: any, metadata: Record<string, any> = {}): WorldTwin {
        const twin: WorldTwin = {
            id: uuidv4(),
            parentWorldId: "CANONICAL",
            version: 1,
            timestamp: Date.now(),
            state: JSON.parse(JSON.stringify(canonicalState)), // Deep copy isolation
            metadata
        };
        this.twins.set(twin.id, twin);
        return twin;
    }

    getTwin(id: string): WorldTwin | undefined {
        return this.twins.get(id);
    }

    deleteTwin(id: string): void {
        this.twins.delete(id);
    }
}
