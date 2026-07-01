import { IReasoningStrategy } from "./IReasoningStrategy.js";
import { ReasoningSession, Evidence } from "./types.js";

export class StrategyExecutionLayer {
    private strategies: Map<string, IReasoningStrategy> = new Map();

    public registerStrategy(strategy: IReasoningStrategy): void {
        this.strategies.set(strategy.getName(), strategy);
    }

    public async executeStrategy(strategyName: string, session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const strategy = this.strategies.get(strategyName);
        if (!strategy) {
            throw new Error(`Strategy ${strategyName} not registered.`);
        }
        await strategy.execute(session, evidenceSet);
        
        session.executionMetrics = strategy.benchmark();
    }
}
