export class ModuleProfiler {
    static calculateUtility(moduleScore: any) {
        const relevance = moduleScore.relevance_score || 0;
        const contribution = moduleScore.contribution_score || 0;
        return (relevance * 0.6) + (contribution * 0.4);
    }
}
