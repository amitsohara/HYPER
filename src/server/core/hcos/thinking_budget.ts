export class ThinkingBudget {
    max_iterations: number = 1000;
    max_simulation_depth: number = 5;
    max_recursive_depth: number = 10;
    max_hypothesis_count: number = 20;
    max_exploration_branches: number = 50;
    max_execution_time_ms: number = 3600000; // 1 hour
    
    current_iterations: number = 0;
    start_time: number = Date.now();
    
    isExhausted(): boolean {
        if (this.current_iterations >= this.max_iterations) return true;
        if (Date.now() - this.start_time >= this.max_execution_time_ms) return true;
        return false;
    }
    
    consumeIteration() {
        this.current_iterations++;
    }
}
