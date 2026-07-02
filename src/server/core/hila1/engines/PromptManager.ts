export class PromptManager {
    getSystemPrompt(domain: string): string {
        return `You are acting as a specialist consultant for the ${domain} domain in the HyperMind architecture.`;
    }

    getReasoningPrompt(task: string, evidence: string[]): string {
        return `Apply logical reasoning to the following task:\nTask: ${task}\nEvidence: ${evidence.join(', ')}`;
    }

    getPlanningPrompt(goal: string): string {
        return `Decompose the following goal into a sequence of atomic tasks:\nGoal: ${goal}`;
    }

    getSimulationPrompt(scenario: any): string {
        return `Simulate the following scenario and predict outcomes:\nScenario: ${JSON.stringify(scenario)}`;
    }

    getDecisionPrompt(options: any[]): string {
        return `Evaluate the following options and select the optimal path based on risk and utility:\nOptions: ${JSON.stringify(options)}`;
    }
}
