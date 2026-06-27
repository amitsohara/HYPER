import { GoogleGenAI } from "@google/genai";
import { DomainProfileBuilder, DomainProfile } from "./domain_profile_builder.js";
import { ReportSectionValidator, ValidationResult } from "./report_section_validator.js";
import { ContradictionChecker, ContradictionResult } from "./contradiction_checker.js";
import { DomainRepairEngine } from "./domain_repair_engine.js";

export class DomainAlignmentGuard {
  static async validateAndRepair(
    ai: GoogleGenAI, 
    mission: string, 
    understanding: any, 
    draftReport: any, 
    strategy: any
  ): Promise<{
    finalReport: any,
    guardMetrics: {
        profile: DomainProfile,
        sectionValidations: ValidationResult[],
        contradictions: ContradictionResult,
        final_alignment_score: number
    }
  }> {
    
    // 1. Build Domain Profile
    const profile = await DomainProfileBuilder.build(ai, mission, understanding);
    
    // 2. Validate Sections
    const sectionValidations: ValidationResult[] = [];
    let repairedReport = { ...draftReport };
    
    for (const [sectionName, content] of Object.entries(draftReport)) {
        if (typeof content === "object" && content !== null) {
            const validation = await ReportSectionValidator.validate(ai, sectionName, content, profile);
            sectionValidations.push(validation);
            
            // 3. Repair if needed
            if (validation.repair_required) {
                console.log(`[DomainGuard] Repairing section ${sectionName} due to wrong domain leakage:`, validation.wrong_domain_terms);
                repairedReport[sectionName] = await DomainRepairEngine.repairSection(ai, sectionName, content, profile, validation);
            }
        }
    }
    
    // 4. Check for Contradictions
    let contradictionResult = await ContradictionChecker.check(ai, repairedReport, strategy);
    
    // 5. Repair Contradictions if needed
    if (contradictionResult.repair_required) {
         console.log(`[DomainGuard] Repairing contradictions:`, contradictionResult.contradictions);
         repairedReport = await DomainRepairEngine.repairContradictions(ai, repairedReport, strategy, contradictionResult.contradictions);
         
         // Re-check after repair
         contradictionResult = await ContradictionChecker.check(ai, repairedReport, strategy);
    }
    
    // Calculate final score
    const scores = sectionValidations.map(v => v.domain_alignment_score);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;
    
    let final_alignment_score = avgScore;
    if (contradictionResult.contradictions.length > 0) {
        final_alignment_score = Math.max(0, final_alignment_score - 20); // Penalty for unresolved contradictions
    }

    return {
        finalReport: repairedReport,
        guardMetrics: {
            profile,
            sectionValidations,
            contradictions: contradictionResult,
            final_alignment_score
        }
    };
  }
}
