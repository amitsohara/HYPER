export class AlternativeGenerator {
  static generate(options: any[], rankings: any[]): any {
    if (!options || options.length === 0 || !rankings || rankings.length === 0) return {};

    const getOptionById = (id: string) => options.find(o => o.id === id);

    const alternatives: any = {};
    const assignedIds = new Set<string>();
    
    // Top choice is already assigned
    assignedIds.add(rankings[0].id);

    if (rankings.length > 1) {
      const secondBest = getOptionById(rankings[1].id);
      if (secondBest && !assignedIds.has(secondBest.id)) {
          alternatives.second_best = secondBest;
          assignedIds.add(secondBest.id);
      }
    }

    // High Risk / High Reward alternative
    const highRisk = options.find(o => o.key_risks?.length > 2 && o.expected_outcome?.toLowerCase().includes("high") && !assignedIds.has(o.id));
    if (highRisk) {
      alternatives.high_risk_high_reward = highRisk;
      assignedIds.add(highRisk.id);
    }

    // Fast alternative
    const fastest = [...options]
      .filter(o => !assignedIds.has(o.id))
      .sort((a, b) => {
      const timeA = parseInt(a.estimated_timeline) || 999;
      const timeB = parseInt(b.estimated_timeline) || 999;
      return timeA - timeB;
    })[0];
    
    if (fastest) {
      alternatives.fastest = fastest;
      assignedIds.add(fastest.id);
    }

    return alternatives;
  }
}
