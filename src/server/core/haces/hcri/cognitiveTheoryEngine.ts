import { ScientificTheory, TheoryStage } from "./researchTypes.ts";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CognitiveTheoryEngine {
    private theories: Map<string, ScientificTheory> = new Map();
    private eventBus = ResearchEventBus.getInstance();

    public createOrUpdateTheory(name: string, description: string, evidenceId: string): ScientificTheory {
        const existing = Array.from(this.theories.values()).find(t => t.name === name);
        if (existing) {
            existing.supporting_evidence.push(evidenceId);
            existing.confidence += 5;
            if (existing.confidence > 90) existing.stage = TheoryStage.SCIENTIFIC_PRINCIPLE;
            else if (existing.confidence > 70) existing.stage = TheoryStage.THEORY;
            this.eventBus.publish(ResearchEvents.THEORY_UPDATED, { theory: existing });
            return existing;
        }

        const theory: ScientificTheory = {
            theory_id: uuidv4(),
            name,
            description,
            stage: TheoryStage.HYPOTHESIS,
            supporting_evidence: [evidenceId],
            contradictory_evidence: [],
            confidence: 50,
            revision_history: ["Initial formulation"],
            timestamp: Date.now()
        };
        
        this.theories.set(theory.theory_id, theory);
        this.eventBus.publish(ResearchEvents.THEORY_UPDATED, { theory });
        return theory;
    }
    
    public getTheories(): ScientificTheory[] {
        return Array.from(this.theories.values());
    }
}
