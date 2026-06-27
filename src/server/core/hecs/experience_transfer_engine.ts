import { GoogleGenAI } from "@google/genai";
import { ExperienceTransfer } from './experience_types.js';
import { CrossDomainRetriever } from './cross_domain_retriever.js';
import { AnalogyMapper } from './analogy_mapper.js';
import { TransferabilityScorer } from './transferability_scorer.js';
import { NegativeTransferDetector } from './negative_transfer_detector.js';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ExperienceTransferEngine {
    static async transferExperience(ai: GoogleGenAI, missionId: string, missionPrompt: string, targetDomain: string): Promise<ExperienceTransfer[]> {
        const candidates = CrossDomainRetriever.retrieveCandidates(missionPrompt, targetDomain);
        const successfulTransfers: ExperienceTransfer[] = [];

        // In a real system, we might pre-filter candidates or use embeddings,
        // but here we evaluate the top N candidates.
        const topCandidates = candidates.slice(0, 3); // evaluate max 3 to save time

        for (const candidate of topCandidates) {
            // 1. Map analogy
            const analogyResult = await AnalogyMapper.mapAnalogy(
                ai,
                candidate.mission_domain,
                targetDomain,
                candidate.reusable_patterns || [],
                missionPrompt
            );

            // 2. Score transferability
            const scoringResult = await TransferabilityScorer.score(
                ai,
                candidate.mission_domain,
                targetDomain,
                analogyResult.analogy,
                candidate.reusable_patterns || [],
                missionPrompt
            );

            // 3. Detect negative transfer
            const riskResult = await NegativeTransferDetector.detectRisk(
                ai,
                candidate.mission_domain,
                targetDomain,
                scoringResult.transferable_patterns,
                analogyResult.analogy,
                missionPrompt
            );

            // Calculate confidence
            const confidence = scoringResult.transferability_score - riskResult.risk_of_negative_transfer;

            // Apply rules
            if (scoringResult.transferability_score >= 60 && riskResult.risk_of_negative_transfer < 40 && confidence >= 60) {
                const transfer: ExperienceTransfer = {
                    transfer_id: uuidv4(),
                    source_experience_id: candidate.experience_id,
                    target_mission_id: missionId,
                    source_domain: candidate.mission_domain,
                    target_domain: targetDomain,
                    analogy: analogyResult.analogy,
                    transferable_patterns: scoringResult.transferable_patterns,
                    non_transferable_patterns: scoringResult.non_transferable_patterns,
                    transferability_score: scoringResult.transferability_score,
                    risk_of_negative_transfer: riskResult.risk_of_negative_transfer,
                    confidence: confidence,
                    reasoning: analogyResult.reasoning
                };
                successfulTransfers.push(transfer);
            }
        }

        return successfulTransfers;
    }
}
