export class ThinkingMetrics {
    static getMetrics(session: any) {
        return {
            iterations: session.budget.current_iterations,
            time_ms: Date.now() - session.budget.start_time,
            thoughts: session.stack.getAll().length
        };
    }
}
