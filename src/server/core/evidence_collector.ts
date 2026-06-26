export class EvidenceCollector {
  static collect(data: any): any[] {
    const evidence: any[] = [];
    
    // Extract research, simulation, world model, social intelligence, etc.
    if (data.scientific_discovery) evidence.push({ source: "Research", data: data.scientific_discovery });
    if (data.digital_twin) evidence.push({ source: "Simulation", data: data.digital_twin });
    if (data.world_model) evidence.push({ source: "World Model", data: data.world_model });
    if (data.social_cognition) evidence.push({ source: "Social Intelligence", data: data.social_cognition });
    if (data.agent_debate) evidence.push({ source: "Agent Debate", data: data.agent_debate });
    if (data.benchmark_results) evidence.push({ source: "Benchmark", data: data.benchmark_results });
    if (data.beliefs) evidence.push({ source: "Memory", data: data.beliefs });

    return evidence;
  }
}
