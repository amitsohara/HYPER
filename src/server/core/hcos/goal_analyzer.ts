export class GoalAnalyzer {
    static analyze(mission: string): any {
        let complexity = 50;
        let novelty = 50;
        let requires_simulation = false;
        let expected_depth = 5;

        const lower = mission.toLowerCase();
        if (lower.includes("mars") || lower.includes("city")) {
            complexity = 90;
            novelty = 90;
            requires_simulation = true;
            expected_depth = 20;
        } else if (lower.includes("arithmetic") || lower.includes("simple")) {
            complexity = 10;
            novelty = 10;
            requires_simulation = false;
            expected_depth = 2;
        }

        return {
            complexity,
            novelty,
            required_domains: ["GENERAL"],
            expected_uncertainty: novelty * 0.8,
            estimated_reasoning_depth: expected_depth,
            expected_simulations: requires_simulation,
            expected_imagination: novelty > 70,
            expected_research: novelty > 50
        };
    }
}
