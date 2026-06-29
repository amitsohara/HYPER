import { EvolutionProposal, PriorityScore } from "./evolutionTypes.js";

export class EvolutionPriorityManager {
    private priorityQueue: EvolutionProposal[] = [];

    public computePriority(proposal: EvolutionProposal): PriorityScore {
        const expected_capability_improvement = 80;
        const mission_frequency = 60;
        const severity = proposal.affected_cognitive_systems.length > 2 ? 70 : 40;
        const safety_impact = 20;
        const implementation_cost = proposal.estimated_engineering_effort;
        const engineering_effort = proposal.estimated_engineering_effort;
        const compute_budget = proposal.required_resources.compute_budget;
        const strategic_importance = 75;
        const long_term_value = 85;

        const overall_priority_score = (
            expected_capability_improvement * 0.2 +
            mission_frequency * 0.15 +
            severity * 0.15 +
            strategic_importance * 0.2 +
            long_term_value * 0.2 +
            (100 - Math.min(implementation_cost, 100)) * 0.1
        );

        return {
            expected_capability_improvement,
            mission_frequency,
            severity,
            safety_impact,
            implementation_cost,
            engineering_effort,
            compute_budget,
            strategic_importance,
            long_term_value,
            overall_priority_score
        };
    }

    public enqueue(proposal: EvolutionProposal) {
        if (!proposal.priority_score) {
            proposal.priority_score = this.computePriority(proposal);
        }
        this.priorityQueue.push(proposal);
        this.priorityQueue.sort((a, b) => (b.priority_score?.overall_priority_score || 0) - (a.priority_score?.overall_priority_score || 0));
    }

    public dequeue(): EvolutionProposal | undefined {
        return this.priorityQueue.shift();
    }

    public getQueue(): EvolutionProposal[] {
        return [...this.priorityQueue];
    }
}
