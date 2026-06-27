import { GoogleGenAI } from "@google/genai";
import { DomainProfileBuilder, DomainProfile } from "./domain_profile_builder.js";
import { ReportSectionValidator, ValidationResult } from "./report_section_validator.js";
import { ContradictionChecker, ContradictionResult } from "./contradiction_checker.js";
import { DomainRepairEngine } from "./domain_repair_engine.js";

export class DomainAlignmentGuard {
  static async validateAndRepair(
    ai: GoogleGenAI, 
    mission: string, 
    rawMissionResult: any, 
    draftReport: any, 
    strategy: any
  ): Promise<{
    finalReport: any,
    guardMetrics: {
        profile: DomainProfile,
        final_alignment_score: number,
        section_results: ValidationResult[],
        wrong_domain_terms_detected: string[],
        contradictions_detected: string[],
        repaired_sections: string[],
        repair_required: boolean,
        passed: boolean
    }
  }> {
    
    // 1. Build Domain Profile
    const profile = await DomainProfileBuilder.build(ai, mission, rawMissionResult);
    
    // 2. Validate Sections
    const section_results: ValidationResult[] = [];
    let repairedReport = { ...draftReport };
    const repaired_sections: string[] = [];
    const wrong_domain_terms_detected = new Set<string>();
    let overall_repair_required = false;
    
    for (const [sectionName, content] of Object.entries(draftReport)) {
        if (typeof content === "object" && content !== null) {
            const validation = await ReportSectionValidator.validate(ai, sectionName, content, profile);
            section_results.push(validation);
            
            validation.wrong_domain_terms.forEach(t => wrong_domain_terms_detected.add(t));
            
            // 3. Repair if needed
            if (validation.repair_required) {
                overall_repair_required = true;
                console.log(`[DomainGuard] Repairing section ${sectionName} due to wrong domain leakage:`, validation.wrong_domain_terms);
                repairedReport[sectionName] = await DomainRepairEngine.repairSection(ai, sectionName, content, profile, validation);
                repaired_sections.push(sectionName);
            }
        }
    }
    
    // 4. Check for Contradictions
    let contradictionResult = await ContradictionChecker.check(ai, repairedReport, strategy);
    
    // 5. Repair Contradictions if needed
    if (contradictionResult.repair_required) {
         overall_repair_required = true;
         console.log(`[DomainGuard] Repairing contradictions:`, contradictionResult.contradictions);
         repairedReport = await DomainRepairEngine.repairContradictions(ai, repairedReport, strategy, contradictionResult.contradictions);
         
         repaired_sections.push("contradictions_repaired");
         
         // Re-check after repair
         contradictionResult = await ContradictionChecker.check(ai, repairedReport, strategy);
    }
    
    // Re-evaluate if repairs happened
    if (overall_repair_required) {
        section_results.length = 0; // Clear old results
        for (const [sectionName, content] of Object.entries(repairedReport)) {
            if (typeof content === "object" && content !== null) {
                const validation = await ReportSectionValidator.validate(ai, sectionName, content, profile);
                section_results.push(validation);
                
                // If it STILL requires repair, it means repair failed
                if (validation.repair_required) {
                    console.log(`[DomainGuard] Repair failed for section ${sectionName}. Violations remain.`);
                }
            }
        }
    }
    
    // Calculate final score based on the LATEST results
    const scores = section_results.map(v => v.domain_alignment_score);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;
    
    let final_alignment_score = avgScore;
    if (contradictionResult.contradictions.length > 0) {
        final_alignment_score = Math.max(0, final_alignment_score - 20); // Penalty for unresolved contradictions
    }

    const final_repair_required = section_results.some(v => v.repair_required) || contradictionResult.repair_required;
    const passed = !final_repair_required && final_alignment_score >= 80 && contradictionResult.severity !== "high";

    return {
        finalReport: repairedReport,
        guardMetrics: {
            profile,
            final_alignment_score,
            section_results,
            wrong_domain_terms_detected: Array.from(wrong_domain_terms_detected),
            contradictions_detected: contradictionResult.contradictions,
            repaired_sections,
            repair_required: final_repair_required,
            passed
        }
    };
  }
}
