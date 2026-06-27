export class DomainVocabularyAnalyzer {
  static analyze(text: string, profile: any): { score: number; violations: string[] } {
    const textLower = text?.toLowerCase() || "";
    const violations: string[] = [];
    
    // Check against suspicious vocabulary
    if (profile.suspicious_vocabulary && Array.isArray(profile.suspicious_vocabulary)) {
        for (const word of profile.suspicious_vocabulary) {
            if (textLower.includes(word.toLowerCase())) {
                violations.push(word);
            }
        }
    }
    
    const primaryDomain = profile?.primary_domain || "General";
    
    // Hardcoded common wrong domain leaks if not business
    if (!primaryDomain.toLowerCase().includes("business") && 
        !primaryDomain.toLowerCase().includes("startup") && 
        !primaryDomain.toLowerCase().includes("enterprise")) {
        const commonStartupLeaks = ["mvp", "gtm", "go-to-market", "icp", "ideal customer profile", "cac", "ltv", "seed round", "seed investors"];
        for (const word of commonStartupLeaks) {
             if (textLower.includes(word) && !violations.includes(word)) {
                 violations.push(word);
             }
        }
    }

    const score = violations.length === 0 ? 100 : Math.max(0, 100 - (violations.length * 10));
    
    return { score, violations };
  }
}
