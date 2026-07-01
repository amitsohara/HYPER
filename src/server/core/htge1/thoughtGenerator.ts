import { ThoughtManager } from "./thoughtManager.js";
import { ThoughtObject } from "./types.js";

export class ThoughtGenerator {
    constructor(private thoughtManager: ThoughtManager) {}

    public generateFromWorldUpdate(regionId: string, observation: string): ThoughtObject {
        return this.thoughtManager.createThought(
            `World Region ${regionId} updated`,
            `Observation: ${observation}`,
            "WorldAttentionEngine",
            "system-session",
            [regionId]
        );
    }

    public generateFromConceptActivation(conceptId: string, context: string): ThoughtObject {
        return this.thoughtManager.createThought(
            `Concept ${conceptId} activated`,
            `Context: ${context}`,
            "ConceptAttentionEngine",
            "system-session",
            [],
            [conceptId]
        );
    }

    public generateFromGoalFocus(goalId: string, urgency: number): ThoughtObject {
        return this.thoughtManager.createThought(
            `Focused on Goal ${goalId}`,
            `Urgency level: ${urgency}`,
            "GoalAttentionEngine",
            "system-session",
            [],
            [],
            [goalId]
        );
    }
}
