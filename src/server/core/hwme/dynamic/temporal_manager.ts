import { ClockManager } from "./clock_manager.js";

export class TemporalManager {
    clock: ClockManager;
    
    constructor() {
        this.clock = new ClockManager();
    }
    
    getCurrentTick() {
        return this.clock.getMissionTime();
    }
}
