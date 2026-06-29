export class StrategyRepository {
    // Current active policies
    private active_policies: Map<string, any> = new Map();
    
    updatePolicy(target: string, config: any) {
        this.active_policies.set(target, config);
    }
    
    getPolicy(target: string): any {
        return this.active_policies.get(target);
    }
}
