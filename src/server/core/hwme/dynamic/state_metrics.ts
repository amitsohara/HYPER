export class StateMetrics {
    static getMetrics(state: any) {
        return {
            variable_count: Object.keys(state.variables || {}).length,
            confidence: state.confidence || 0,
            uncertainty: state.uncertainty || 0
        };
    }
}
