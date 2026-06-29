export class ImprovementMetrics {
    static getMetrics(history: any) {
        const all = history.getHistory();
        return {
            total_proposed: all.length,
            total_deployed: all.filter((p: any) => p.status === "DEPLOYED").length,
            total_rejected: all.filter((p: any) => p.status === "REJECTED").length,
            total_rolled_back: all.filter((p: any) => p.status === "ROLLED_BACK").length
        };
    }
}
