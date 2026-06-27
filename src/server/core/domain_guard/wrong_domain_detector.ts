import { DomainVocabularyAnalyzer } from "./domain_vocabulary_analyzer.js";

export class WrongDomainDetector {
  static detect(sectionName: string, sectionContent: any, profile: any) {
    const contentString = JSON.stringify(sectionContent);
    const vocabAnalysis = DomainVocabularyAnalyzer.analyze(contentString, profile);
    
    let templateLeakageDetected = vocabAnalysis.violations.length > 0;
    
    return {
        has_leakage: templateLeakageDetected,
        violations: vocabAnalysis.violations,
        score: vocabAnalysis.score
    };
  }
}
