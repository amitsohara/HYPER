import { AttentionCandidate, AttentionFocusMode } from "./types.js";
import { GoalAttentionEngine } from "./goalAttentionEngine.js";
import { WorldAttentionEngine } from "./worldAttentionEngine.js";
import { ConceptAttentionEngine } from "./conceptAttentionEngine.js";
import { SaliencyEngine } from "./saliencyEngine.js";
import { FocusController } from "./focusController.js";
import { CognitiveLoadManager } from "./cognitiveLoadManager.js";
import { WorkingMemoryManager } from "./workingMemoryManager.js";
import { AttentionHistory } from "./attentionHistory.js";
import { SpecialistAllocationEngine } from "./specialistAllocationEngine.js";
import { HyperMindCognitiveSociety } from "../hcse01/societyManager.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { CognitiveDomain } from "../hcns01/types.js";
import { v4 as uuidv4 } from "uuid";

export class ExecutiveAttentionManager {
    public goalAttentionEngine: GoalAttentionEngine;
    public worldAttentionEngine: WorldAttentionEngine;
    public conceptAttentionEngine: ConceptAttentionEngine;
    public saliencyEngine: SaliencyEngine;
    public focusController: FocusController;
    public cognitiveLoadManager: CognitiveLoadManager;
    public workingMemory: WorkingMemoryManager;
    public attentionHistory: AttentionHistory;
    public specialistAllocator: SpecialistAllocationEngine;

    private candidates: Map<string, AttentionCandidate> = new Map();

    constructor(private society: HyperMindCognitiveSociety) {
        this.goalAttentionEngine = new GoalAttentionEngine();
        this.worldAttentionEngine = new WorldAttentionEngine();
        this.conceptAttentionEngine = new ConceptAttentionEngine();
        this.saliencyEngine = new SaliencyEngine();
        this.focusController = new FocusController();
        this.cognitiveLoadManager = new CognitiveLoadManager();
        this.workingMemory = new WorkingMemoryManager();
        this.attentionHistory = new AttentionHistory();
        this.specialistAllocator = new SpecialistAllocationEngine(this.society);
    }

    public registerCandidate(candidate: AttentionCandidate): void {
        this.candidates.set(candidate.id, candidate);
    }

    public shiftAttention(): void {
        if (!this.cognitiveLoadManager.canAcceptLoad(10)) {
            console.warn("[HEAM] Cognitive load too high, skipping attention shift");
            return;
        }

        const sorted = Array.from(this.candidates.values()).sort((a, b) => b.score.totalScore - a.score.totalScore);
        
        const selected = sorted.slice(0, 3); // Take top 3
        this.workingMemory.clear();

        selected.forEach(c => {
            if (c.type === "GOAL") this.workingMemory.addGoal(c.referenceId);
            else if (c.type === "WORLD_REGION") this.workingMemory.addWorldRegion(c.referenceId);
            else if (c.type === "CONCEPT") this.workingMemory.addConcept(c.referenceId);
        });

        this.attentionHistory.persist({
            id: uuidv4(),
            timestamp: Date.now(),
            mode: this.focusController.getMode(),
            candidatesSelected: selected.map(c => c.id),
            reasoning: `Selected top ${selected.length} candidates based on total score.`
        });

        HyperMindEventMesh.getInstance().publish({
            type: "ATTENTION_SHIFTED",
            domain: CognitiveDomain.SYSTEM,
            priority: 2, // HIGH
            source: "HEAM-01",
            payload: { selected: selected.map(c => c.id), workingMemory: this.workingMemory.getState() }
        });
    }

    public interrupt(priority: number): boolean {
        if (this.focusController.interrupt(priority)) {
            HyperMindEventMesh.getInstance().publish({
                type: "ATTENTION_INTERRUPTED",
                domain: CognitiveDomain.SYSTEM,
                priority: 3, // CRITICAL
                source: "HEAM-01",
                payload: { priority }
            });
            return true;
        }
        return false;
    }
}
