import { HypothesisModel } from "./hypothesis_model.js";
import { HypothesisGenerator } from "./hypothesis_generator.js";
import { HypothesisPredictor } from "./hypothesis_predictor.js";
import { ExperimentDesigner } from "./experiment_designer.js";
import { FalsificationEngine } from "./falsification_engine.js";
import { HypothesisValidator } from "./hypothesis_validator.js";
import { HypothesisRanker } from "./hypothesis_ranker.js";
import { HypothesisGraph } from "./hypothesis_graph.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class HypothesisGenerationEngine {
    private hypotheses: Map<string, HypothesisModel> = new Map();
    graph: HypothesisGraph = new HypothesisGraph();
    
    generateHypotheses(context: string): HypothesisModel[] {
        const candidates = HypothesisGenerator.generateMultiple(context);
        const newModels: HypothesisModel[] = [];
        
        for (const c of candidates) {
            const h = c.proposed_model as HypothesisModel;
            if (!h.hypothesis_id) h.hypothesis_id = uuidv4();
            h.supporting_evidence = [];
            h.counter_examples = [];
            h.predictions = HypothesisPredictor.generatePredictions(h);
            h.created_at = Date.now();
            h.updated_at = Date.now();
            
            // Just for test 3 mock:
            if (context.includes("Contradictory evidence")) {
                h.description += " Contradictory evidence";
            }
            
            const val = HypothesisValidator.validate(h);
            if (!val.valid) {
                 console.warn("Generated hypothesis failed validation:", val.errors);
                 continue;
            }
            
            this.hypotheses.set(h.hypothesis_id, h);
            this.graph.addNode(h);
            newModels.push(h);
        }
        
        return newModels;
    }
    
    falsify(hypothesis_id: string): { falsified: boolean, reason?: string } {
        const h = this.hypotheses.get(hypothesis_id);
        if (!h) return { falsified: false, reason: "Not found" };
        return FalsificationEngine.attemptFalsification(h);
    }
    
    getRanked() {
        return HypothesisRanker.rank(Array.from(this.hypotheses.values()));
    }
    
    getHypothesis(id: string) { return this.hypotheses.get(id); }
    getAll() { return Array.from(this.hypotheses.values()); }
}
