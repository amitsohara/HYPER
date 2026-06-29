export interface PrincipleEvidence {
    evidence_id: string;
    source_type: "MECHANISM" | "PROCESS" | "EXPERIENCE" | "PATTERN" | "SIMULATION";
    source_id: string;
    description: string;
    strength: number; // 0 to 100
    supports: boolean; // true if supports, false if counter-evidence
}
