import { IntelligencePotentialProfile, CapabilityGap, ResearchCategory } from "./researchTypes.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class IntelligencePotentialMap {
    private currentProfile: IntelligencePotentialProfile | null = null;

    public generateMap(currentScores: Record<string, number>): IntelligencePotentialProfile {
        const gaps: CapabilityGap[] = [];
        
        for (const cat in ResearchCategory) {
            const category = ResearchCategory[cat as keyof typeof ResearchCategory];
            const current = currentScores[category] || 50;
            const potential = 95; // Assume theoretical potential
            const gap = potential - current;
            
            let priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
            if (gap > 30) priority = "CRITICAL";
            else if (gap > 20) priority = "HIGH";
            else if (gap > 10) priority = "MEDIUM";
            
            gaps.push({
                category,
                current_score: current,
                potential_score: potential,
                gap,
                research_priority: priority
            });
        }
        
        this.currentProfile = {
            profile_id: uuidv4(),
            timestamp: Date.now(),
            gaps
        };
        
        return this.currentProfile;
    }

    public getProfile(): IntelligencePotentialProfile | null {
        return this.currentProfile;
    }
}
