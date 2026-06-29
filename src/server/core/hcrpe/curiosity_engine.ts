import { KnowledgeGapDetector } from "./knowledge_gap_detector.js";
import { UncertaintyAnalyzer } from "./uncertainty_analyzer.js";
import { ContradictionDetector } from "./contradiction_detector.js";
import { QuestionGenerator } from "./question_generator.js";
import { ResearchPlanner } from "./research_planner.js";
import { ResearchPriorityEngine } from "./research_priority_engine.js";
import { ResearchPlan, ResearchQuestion } from "./research_task.js";

export class CuriosityEngine {
    private plans: Map<string, ResearchPlan> = new Map();
    private questions: ResearchQuestion[] = [];
    private gaps: any[] = [];
    
    process(context: string) {
        const contextData = { context };
        
        const detectedGaps = KnowledgeGapDetector.detect(contextData);
        const detectedUncertainties = UncertaintyAnalyzer.analyze(contextData);
        const detectedContradictions = ContradictionDetector.detect(contextData);
        
        this.gaps.push(...detectedGaps);
        
        const qGaps = QuestionGenerator.generateFromGaps(detectedGaps);
        const qCont = QuestionGenerator.generateFromContradictions(detectedContradictions);
        const qUnc = QuestionGenerator.generateFromUncertainties(detectedUncertainties);
        
        const allQuestions = [...qGaps, ...qCont, ...qUnc];
        this.questions.push(...allQuestions);
        
        if (allQuestions.length > 0) {
             const plan = ResearchPlanner.createPlan(allQuestions, context);
             
             // Check if duplicate plan
             const isDuplicate = Array.from(this.plans.values()).some(p => p.title === plan.title);
             if (!isDuplicate) {
                 this.plans.set(plan.plan_id, plan);
             }
        }
        
        return this.getPriorities();
    }
    
    getPriorities(): ResearchPlan[] {
        return ResearchPriorityEngine.rank(Array.from(this.plans.values()));
    }
    
    getQuestions() { return this.questions; }
    getGaps() { return this.gaps; }
    getPlan(id: string) { return this.plans.get(id); }
    getAllPlans() { return Array.from(this.plans.values()); }
}
