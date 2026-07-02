import { IEnvironmentAdapter } from "./IEnvironmentAdapter.js";
import { Observation, MotorCommand, ExecutionFeedback, SensorType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class SimulationAdapter implements IEnvironmentAdapter {
    private state: Record<string, any> = {};

    getName(): string {
        return "SIMULATION_ADAPTER";
    }

    async observe(): Promise<Observation[]> {
        return [{
            id: uuidv4(),
            source: SensorType.API,
            timestamp: Date.now(),
            data: { simulatedState: this.state },
            confidence: 1.0,
            metadata: { simulated: true }
        }];
    }

    async execute(command: MotorCommand): Promise<ExecutionFeedback> {
        this.state[command.type] = command.payload;
        return {
            actionId: command.actionId,
            success: true,
            latencyMs: 10,
            reward: 1.0
        };
    }

    async reset(): Promise<void> {
        this.state = {};
    }

    async getState(): Promise<any> {
        return this.state;
    }
}
