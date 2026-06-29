import { ArchitecturePattern } from "./architectureTypes.js";

export class PatternLibrary {
    private patterns: ArchitecturePattern[] = [
        {
            pattern_id: "PAT-001",
            name: "Hierarchical Reasoning",
            description: "Breaks reasoning down into macro and micro plans.",
            advantages: ["Scalable", "Interpretable"],
            disadvantages: ["Latency overhead"],
            typical_use_cases: ["Complex planning"],
            known_limitations: ["Not ideal for reactive systems"],
            benchmark_performance: "High accuracy, medium latency"
        },
        {
            pattern_id: "PAT-002",
            name: "Blackboard Architecture",
            description: "Multiple agents post to a common knowledge space.",
            advantages: ["Flexible", "Highly modular"],
            disadvantages: ["Complex conflict resolution"],
            typical_use_cases: ["Multi-agent collaboration"],
            known_limitations: ["Can become a bottleneck"],
            benchmark_performance: "High creativity, unpredictable latency"
        }
    ];

    public getPatterns(): ArchitecturePattern[] {
        return this.patterns;
    }
}
