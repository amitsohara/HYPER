import { ResearchReport } from "./researchTypes.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ResearchReportGenerator {
    public generateReport(title: string, type: any, content: string, entities: string[]): ResearchReport {
        return {
            report_id: uuidv4(),
            title,
            type,
            content,
            related_entities: entities,
            timestamp: Date.now()
        };
    }
}
