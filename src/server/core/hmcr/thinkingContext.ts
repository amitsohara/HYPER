import { CognitiveBlackboard } from "./cognitiveBlackboard.js";
import { CognitiveTask, CognitiveState, CognitiveMode } from "./cognitiveTypes.js";
import { v4 as uuidv4 } from "uuid";

export class ThinkingContext {
    public context_id: string;
    public blackboard: CognitiveBlackboard;
    public task: CognitiveTask;
    public state: CognitiveState;
    public toolRequests: any[] = [];
    public activeCycle: number = 0;

    constructor(task: CognitiveTask) {
        this.context_id = uuidv4();
        this.task = task;
        this.blackboard = new CognitiveBlackboard();
        this.state = {
            mode: CognitiveMode.IDLE,
            active_specialists: [],
            confidence_level: 0
        };
    }
}
