import { ResearchHypothesis, ResearchStatus } from "./researchTypes.ts";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class HypothesisManager {
    private hypotheses: Map<string, ResearchHypothesis> = new Map();
    private eventBus = ResearchEventBus.getInstance();

    public createHypothesis(data: Omit<ResearchHypothesis, "hypothesis_id" | "status" | "timestamp">): ResearchHypothesis {
        const hypothesis: ResearchHypothesis = {
            ...data,
            hypothesis_id: uuidv4(),
            status: ResearchStatus.PROPOSED,
            timestamp: Date.now()
        };
        this.hypotheses.set(hypothesis.hypothesis_id, hypothesis);
        this.eventBus.publish(ResearchEvents.HYPOTHESIS_CREATED, { hypothesis });
        return hypothesis;
    }

    public getHypothesis(id: string): ResearchHypothesis | undefined {
        return this.hypotheses.get(id);
    }
    
    public updateStatus(id: string, status: ResearchStatus) {
        const h = this.hypotheses.get(id);
        if (h) {
            h.status = status;
        }
    }

    public getAllHypotheses(): ResearchHypothesis[] {
        return Array.from(this.hypotheses.values());
    }
}
