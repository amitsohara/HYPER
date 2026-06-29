export class ProcessMetrics {
    static getMetrics(instances: any[]) {
        return {
            total: instances.length,
            active: instances.filter(i => i.status === "RUNNING").length,
            completed: instances.filter(i => i.status === "COMPLETED").length,
            failed: instances.filter(i => i.status === "FAILED").length
        };
    }
}
