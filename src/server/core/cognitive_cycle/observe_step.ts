import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { RealityRepresentationCore } from "../hwme/reality_representation_core.js";
import { CognitiveWorkspace } from "../hcw/cognitive_workspace.js";
import { WorkspaceStore } from "../hcw/workspace_state.js";

export class ObserveStep implements ICycleStep {
  name = "Observe";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    state.observation = {
      mission: state.mission,
      user_context: state.user_context,
      hcc_state: core.getState(),
      timestamp: Date.now()
    };
    state.hcc_state_before = { ...state.observation.hcc_state };

    // Initialize Workspace
    const workspace_id = CognitiveWorkspace.createWorkspace(state.mission, state.mission_id);
    state.current_workspace_id = workspace_id;

    // Parse Reality
    if (ai) {
        try {
            const world_model = await RealityRepresentationCore.parseMission(ai, state.mission);
            const ws = WorkspaceStore.getWorkspace(workspace_id);
            if (ws) {
                if (!ws.world_model) {
                    ws.world_model = { real_world: undefined, imagined_world: undefined };
                }
                ws.world_model.real_world = world_model;
            }
        } catch (e) {
            console.error("[ObserveStep] Failed to parse reality", e);
        }
    }
  }
}
