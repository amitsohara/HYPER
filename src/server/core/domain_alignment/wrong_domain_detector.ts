export class WrongDomainDetector {
    static detect(sectionName: string, sectionContent: any, profile: any): { score: number, violations: string[] } {
        return { score: 100, violations: [] };
    }
}
