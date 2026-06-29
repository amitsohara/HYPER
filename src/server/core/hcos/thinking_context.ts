export class ThinkingContext {
    // Current working context for a session
    workspace_snapshot: any;
    current_mission: string;
    
    constructor(mission: string) {
        this.current_mission = mission;
        this.workspace_snapshot = {};
    }
}
