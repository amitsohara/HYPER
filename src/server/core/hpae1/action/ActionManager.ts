import { SkillRegistry } from "./SkillRegistry.js";
import { IEnvironmentAdapter } from "../eaf/IEnvironmentAdapter.js";
import { Action, MotorCommand, ExecutionTrace, ActionStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";

export class ActionManager {
    public skillRegistry: SkillRegistry;
    
    constructor(private eventMesh: HyperMindEventMesh, private adapter: IEnvironmentAdapter) {
        this.skillRegistry = new SkillRegistry();
    }

    async executeAction(action: Action): Promise<ExecutionTrace> {
        action.status = ActionStatus.EXECUTING;
        
        const skill = this.skillRegistry.getSkill(action.skillId);
        if (!skill) {
            action.status = ActionStatus.FAILED;
            throw new Error(`Skill ${action.skillId} not found`);
        }

        const command: MotorCommand = {
            id: uuidv4(),
            actionId: action.id,
            type: skill.name === "Click" ? "CLICK" : "API_CALL",
            payload: action.parameters
        };

        const feedback = await this.adapter.execute(command);
        
        action.status = feedback.success ? ActionStatus.COMPLETED : ActionStatus.FAILED;

        this.eventMesh.publish({
            type: feedback.success ? "ACTION_COMPLETED" : "ACTION_FAILED",
            domain: 9 as any, // EXECUTIVE equivalent or execution domain
            priority: 1,
            source: "HPAE_ACTION_MANAGER",
            payload: { action, feedback }
        });

        return {
            id: uuidv4(),
            actionId: action.id,
            motorCommands: [command],
            feedback,
            timestamp: Date.now()
        };
    }
}
