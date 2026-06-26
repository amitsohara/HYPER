export class AlternativeGenerator {
  static generate(options: any[], rankings: any[]): any {
    if (!options || options.length === 0 || !rankings || rankings.length === 0) return {};

    const getOptionById = (id: string) => options.find(o => o.id === id);

    const alternatives: any = {};
    
    if (rankings.length > 1) {
      alternatives.second_best = getOptionById(rankings[1].id);
    }

    // High Risk / High Reward alternative
    const highRisk = options.find(o => o.key_risks?.length > 2 && o.expected_outcome?.toLowerCase().includes("high"));
    if (highRisk && highRisk.id !== rankings[0].id) {
      alternatives.high_risk_high_reward = highRisk;
    }

    // Fast alternative
    const fastest = [...options].sort((a, b) => {
      const timeA = parseInt(a.estimated_timeline) || 999;
      const timeB = parseInt(b.estimated_timeline) || 999;
      return timeA - timeB;
    })[0];
    
    if (fastest && fastest.id !== rankings[0].id) {
      alternatives.fastest = fastest;
    }

    return alternatives;
  }
}
