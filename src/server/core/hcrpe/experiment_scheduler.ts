export class ExperimentScheduler {
    static schedule(plan: any): any[] {
        // Mock scheduler
        return [
            { type: "SEQUENTIAL", step: 1, action: "Setup Baseline" },
            { type: "PARALLEL", step: 2, action: "Run Variants" },
            { type: "DEPENDENT", step: 3, action: "Analyze Results" }
        ];
    }
}
