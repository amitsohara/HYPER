import { HeuristicAbstraction } from "./abstraction_types.js";

export class HeuristicConflictDetector {
    static detect(heuristics: HeuristicAbstraction[]): any[] {
        const conflicts = [];

        // Basic conflict detection based on opposing 'then_guidance' or 'if_conditions'.
        // In a real system, use an LLM or logic engine.
        // For dev_stub, let's just mock a conflict if two heuristics have high support but different guidance for same domain.
        
        for (let i = 0; i < heuristics.length; i++) {
            for (let j = i + 1; j < heuristics.length; j++) {
                const h1 = heuristics[i];
                const h2 = heuristics[j];

                // Check if they share a domain
                const sharedDomains = h1.applicable_domains.filter(d => h2.applicable_domains.includes(d));
                
                if (sharedDomains.length > 0) {
                    // Very rudimentary conflict detection
                    const guidance1 = h1.then_guidance.join(" ").toLowerCase();
                    const guidance2 = h2.then_guidance.join(" ").toLowerCase();
                    
                    if (guidance1.includes("prioritize") && guidance2.includes("delay")) {
                         conflicts.push({
                             heuristics: [h1.abstraction_id, h2.abstraction_id],
                             conflict_reason: `Conflicting guidance in ${sharedDomains.join(", ")} domain.`,
                             resolution_suggestion: h1.support_count > h2.support_count ? 
                                 `Prefer '${h1.title}' due to higher support count (${h1.support_count} vs ${h2.support_count}).` :
                                 `Compare context carefully; both have strong support.`
                         });
                    }
                }
            }
        }

        return conflicts;
    }
}
