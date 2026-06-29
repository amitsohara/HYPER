export class MechanismMetrics {
    static getMetrics(mechanisms: any[]) {
        return {
            total: mechanisms.length,
            active: mechanisms.filter(m => m.status === "ACTIVE").length,
            hypothetical: mechanisms.filter(m => m.status === "HYPOTHETICAL").length,
            validated: mechanisms.filter(m => m.status === "VALIDATED").length
        };
    }
}
