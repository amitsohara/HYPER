export class PrincipleMetrics {
    static getMetrics(principles: any[]) {
        return {
            total_principles: principles.length,
            validated: principles.filter(p => p.status === "ACCEPTED").length,
            rejected: principles.filter(p => p.status === "REJECTED").length,
            candidates: principles.filter(p => p.status === "CANDIDATE").length
        };
    }
}
