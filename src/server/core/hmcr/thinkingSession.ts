import { v4 as uuidv4 } from "uuid";
import { ThinkingContext } from "./thinkingContext.js";
import { CognitiveTask } from "./cognitiveTypes.js";

export class ThinkingSession {
    public session_id: string;
    public context: ThinkingContext;
    public status: 'INITIALIZED' | 'THINKING' | 'WAITING_FOR_TOOL' | 'COMPLETED' | 'FAILED';
    public start_time: number;
    public end_time?: number;

    constructor(task: CognitiveTask) {
        this.session_id = uuidv4();
        this.context = new ThinkingContext(task);
        this.status = 'INITIALIZED';
        this.start_time = Date.now();
    }

    public complete() {
        this.status = 'COMPLETED';
        this.end_time = Date.now();
    }

    public fail() {
        this.status = 'FAILED';
        this.end_time = Date.now();
    }
}
