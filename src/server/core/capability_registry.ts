export interface CapabilityDef {
    module: string;
    capabilities: string[];
    cost: "low" | "medium" | "high";
    token_usage: "low" | "medium" | "high";
}

export class CapabilityRegistry {
    private static registry: CapabilityDef[] = [
        {
            module: "social_cognition",
            capabilities: ["emotion", "stakeholder", "trust", "cooperation", "ethics", "leadership", "human behavior", "psychology", "culture"],
            cost: "medium",
            token_usage: "medium"
        },
        {
            module: "world_model",
            capabilities: ["causal reasoning", "system dynamics", "feedback loops", "prediction", "simulation", "scenario generation"],
            cost: "high",
            token_usage: "high"
        },
        {
            module: "scientific_discovery",
            capabilities: ["physics", "biology", "chemistry", "hypothesis generation", "empirical validation", "data analysis"],
            cost: "high",
            token_usage: "high"
        },
        {
            module: "knowledge_acquisition",
            capabilities: ["knowledge retrieval", "evidence gathering", "citations", "literature review", "fact checking"],
            cost: "medium",
            token_usage: "high"
        },
        {
            module: "agent_debate",
            capabilities: ["conflict resolution", "multi-perspective analysis", "red teaming", "criticism", "consensus building"],
            cost: "high",
            token_usage: "high"
        },
        {
            module: "benchmark_results",
            capabilities: ["evaluation", "metrics", "scoring", "quality assurance", "validation"],
            cost: "low",
            token_usage: "low"
        },
        {
            module: "beliefs",
            capabilities: ["core assumptions", "value systems", "prioritization frameworks", "mental models"],
            cost: "low",
            token_usage: "low"
        },
        {
            module: "multi_agent_society",
            capabilities: ["organizational dynamics", "emergent behavior", "market simulation", "resource allocation simulation"],
            cost: "high",
            token_usage: "high"
        },
        {
            module: "recursive_improvement",
            capabilities: ["self-correction", "optimization", "meta-learning", "refinement"],
            cost: "medium",
            token_usage: "medium"
        },
        {
            module: "autonomous_learning",
            capabilities: ["skill extraction", "pattern recognition", "knowledge synthesis", "experience replay"],
            cost: "medium",
            token_usage: "medium"
        },
        {
            module: "embodied_intelligence",
            capabilities: ["physical constraints", "spatial reasoning", "resource limits", "environmental interaction"],
            cost: "medium",
            token_usage: "medium"
        },
        {
            module: "digital_twin",
            capabilities: ["earth simulation", "climate modeling", "global impact", "environmental feedback"],
            cost: "high",
            token_usage: "high"
        },
        {
            module: "theory_of_mind",
            capabilities: ["intent inference", "perspective taking", "hidden motivations", "cognitive bias detection"],
            cost: "medium",
            token_usage: "medium"
        },
        {
            module: "common_sense",
            capabilities: ["heuristic reasoning", "practical logic", "everyday constraints", "obvious reality checks"],
            cost: "low",
            token_usage: "low"
        },
        {
            module: "collective_intelligence",
            capabilities: ["crowd wisdom", "distributed problem solving", "aggregate trends", "cultural consensus"],
            cost: "medium",
            token_usage: "medium"
        },
        {
            module: "knowledge_graph",
            capabilities: ["semantic mapping", "entity relationships", "ontology management", "graph traversal"],
            cost: "medium",
            token_usage: "medium"
        }
    ];

    static getRegistry() {
        return this.registry;
    }
}
