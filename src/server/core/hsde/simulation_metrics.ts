export class SimulationMetrics {
    static getMetrics(branches: any[]) {
        return {
            total: branches.length,
            completed: branches.filter(b => b.status === "COMPLETED").length,
            failed: branches.filter(b => b.status === "FAILED").length,
            rejected: branches.filter(b => b.status === "REJECTED").length
        };
    }
}
