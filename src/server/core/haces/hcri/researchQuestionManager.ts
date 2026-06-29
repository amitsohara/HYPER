import { ResearchQuestion, ResearchStatus } from "./researchTypes.ts";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ResearchQuestionManager {
    private questions: Map<string, ResearchQuestion> = new Map();
    private eventBus = ResearchEventBus.getInstance();

    public createQuestion(data: Omit<ResearchQuestion, "question_id" | "status" | "timestamp">): ResearchQuestion {
        const question: ResearchQuestion = {
            ...data,
            question_id: uuidv4(),
            status: ResearchStatus.PROPOSED,
            timestamp: Date.now()
        };
        this.questions.set(question.question_id, question);
        this.eventBus.publish(ResearchEvents.RESEARCH_QUESTION_CREATED, { question });
        return question;
    }

    public getQuestion(id: string): ResearchQuestion | undefined {
        return this.questions.get(id);
    }

    public getAllQuestions(): ResearchQuestion[] {
        return Array.from(this.questions.values());
    }
}
