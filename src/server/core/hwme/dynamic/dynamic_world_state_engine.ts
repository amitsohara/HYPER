import { WorldStateManager } from "./world_state_manager.js";

export class DynamicWorldStateEngine {
    private static worlds: Map<string, WorldStateManager> = new Map();

    static createWorld(world_id: string): WorldStateManager {
        const manager = new WorldStateManager(world_id);
        this.worlds.set(world_id, manager);
        return manager;
    }

    static getWorld(world_id: string): WorldStateManager | undefined {
        return this.worlds.get(world_id);
    }
    
    static getAllWorlds(): WorldStateManager[] {
        return Array.from(this.worlds.values());
    }
}
