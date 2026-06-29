import { HypothesisCandidate } from "./hypothesis_candidate.js";
import { HypothesisStatus } from "./hypothesis_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class HypothesisGenerator {
    static generateMultiple(context: string): HypothesisCandidate[] {
        const candidates: HypothesisCandidate[] = [];
        
        // Mock generation logic for divergent competing explanations
        if (context.includes("water recycling") || context.includes("Mars")) {
            candidates.push({
                candidate_id: uuidv4(),
                generation_logic: "Divergent engineering 1",
                proposed_model: {
                    title: "Biological Filtration",
                    description: "Use genetically modified plants to filter wastewater.",
                    origin: "Cross-domain analogy (Botany -> Engineering)",
                    assumptions: ["Plants survive Mars radiation", "High efficiency"],
                    status: HypothesisStatus.CANDIDATE,
                    confidence: 50
                }
            });
            candidates.push({
                candidate_id: uuidv4(),
                generation_logic: "Divergent engineering 2",
                proposed_model: {
                    title: "Chemical Distillation",
                    description: "Use solar-powered thermal distillation and chemical treatment.",
                    origin: "Standard engineering approach",
                    assumptions: ["Consistent solar energy available"],
                    status: HypothesisStatus.CANDIDATE,
                    confidence: 60
                }
            });
        } else if (context.includes("emergency room")) {
            candidates.push({
                candidate_id: uuidv4(),
                generation_logic: "Operational Hypothesis A",
                proposed_model: {
                    title: "Triage Optimization",
                    description: "Implement AI-driven triage to prioritize critical cases instantly.",
                    origin: "Computational analogy",
                    assumptions: ["Data is available instantly"],
                    status: HypothesisStatus.CANDIDATE,
                    confidence: 45
                }
            });
            candidates.push({
                candidate_id: uuidv4(),
                generation_logic: "Operational Hypothesis B",
                proposed_model: {
                    title: "Parallel Processing",
                    description: "Add more staff during peak hours to process patients in parallel.",
                    origin: "Queueing theory",
                    assumptions: ["Staff is available to hire"],
                    status: HypothesisStatus.CANDIDATE,
                    confidence: 55
                }
            });
        } else {
             candidates.push({
                candidate_id: uuidv4(),
                generation_logic: "General abstract hypothesis",
                proposed_model: {
                    title: "General Explanation A",
                    description: `Hypothesis based on ${context}`,
                    origin: "Standard generation",
                    assumptions: [],
                    status: HypothesisStatus.CANDIDATE,
                    confidence: 50
                }
            });
            candidates.push({
                candidate_id: uuidv4(),
                generation_logic: "General abstract hypothesis",
                proposed_model: {
                    title: "General Explanation B",
                    description: `Alternative hypothesis based on ${context}`,
                    origin: "Alternative generation",
                    assumptions: [],
                    status: HypothesisStatus.CANDIDATE,
                    confidence: 50
                }
            });
        }
        
        return candidates;
    }
}
