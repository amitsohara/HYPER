import { Observation, MotorCommand, ExecutionFeedback } from "../types.js";

export interface IEnvironmentAdapter {
    getName(): string;
    observe(): Promise<Observation[]>;
    execute(command: MotorCommand): Promise<ExecutionFeedback>;
    reset(): Promise<void>;
    getState(): Promise<any>;
}
