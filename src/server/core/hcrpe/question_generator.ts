import { QuestionType } from "./research_types.js";
import { ResearchQuestion } from "./research_task.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class QuestionGenerator {
    static generateFromGaps(gaps: any[]): ResearchQuestion[] {
        return gaps.map(gap => ({
            question_id: uuidv4(),
            text: `What mechanism explains ${gap.description}?`,
            type: QuestionType.EXPLORATORY,
            context: gap
        }));
    }
    
    static generateFromContradictions(contradictions: any[]): ResearchQuestion[] {
        return contradictions.map(c => ({
            question_id: uuidv4(),
            text: `Why do these mechanisms conflict: ${c.description}?`,
            type: QuestionType.DIAGNOSTIC,
            context: c
        }));
    }
    
    static generateFromUncertainties(uncertainties: any[]): ResearchQuestion[] {
        return uncertainties.map(u => ({
            question_id: uuidv4(),
            text: `What experiment would reduce uncertainty about ${u.target}?`,
            type: QuestionType.PREDICTIVE,
            context: u
        }));
    }
}
