export class ThinkingCheckpoint {
    checkpoint_id: string;
    timestamp: number;
    state: any;
    
    constructor(id: string, state: any) {
        this.checkpoint_id = id;
        this.timestamp = Date.now();
        this.state = JSON.parse(JSON.stringify(state)); // Deep clone simple state
    }
}
