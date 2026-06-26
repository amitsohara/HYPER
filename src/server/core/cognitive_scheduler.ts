export class CognitiveScheduler {
    static schedule(selectedModules: any[]) {
        const orderWeight: Record<string, number> = {
            "knowledge_acquisition": 10,
            "knowledge_graph": 20,
            "world_model": 30,
            "theory_of_mind": 40,
            "common_sense": 50,
            "embodied_intelligence": 60,
            "social_cognition": 70,
            "collective_intelligence": 80,
            "multi_agent_society": 90,
            "agent_debate": 100,
            "scientific_discovery": 110,
            "beliefs": 120,
            "benchmark_results": 130,
            "recursive_improvement": 140,
            "autonomous_learning": 150
        };

        const scheduled = [...selectedModules].sort((a, b) => {
            const wA = orderWeight[a.module] || 999;
            const wB = orderWeight[b.module] || 999;
            return wA - wB;
        });

        return scheduled.map(s => s.module);
    }
}
