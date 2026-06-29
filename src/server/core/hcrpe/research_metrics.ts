export class ResearchMetrics {
    static getMetrics(researchPlans: any[]) {
        return {
            total: researchPlans.length,
            active: researchPlans.filter(p => p.status === "ACTIVE").length,
            completed: researchPlans.filter(p => p.status === "COMPLETED").length
        };
    }
}
