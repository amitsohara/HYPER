import { ProcessInstance } from "./process_instance.js";
import { ProcessStatus } from "./process_types.js";
import { DynamicWorldStateEngine } from "../dynamic/dynamic_world_state_engine.js";

export class ProcessExecutor {
    static executeStep(instance: ProcessInstance, stepId: string, world_id: string): { success: boolean, error?: string } {
        const world = DynamicWorldStateEngine.getWorld(world_id);
        if (!world && !instance.simulation_mode) {
             return { success: false, error: "World not found" };
        }
        
        const step = instance.model.flow.steps.find(s => s.step_id === stepId);
        if (!step) return { success: false, error: "Step not found" };

        instance.current_step_id = stepId;
        
        // Apply effects
        const changes: Record<string, any> = {};
        for (const effect of step.effects) {
            let currentValue = 0;
            if (world) {
                const variable = world.variables.get(effect.target_variable);
                if (variable) currentValue = variable.value;
            }
            
            if (effect.operation === 'SUBTRACT') {
                changes[effect.target_variable] = currentValue - effect.value;
            } else if (effect.operation === 'ADD') {
                changes[effect.target_variable] = currentValue + effect.value;
            } else if (effect.operation === 'SET') {
                changes[effect.target_variable] = effect.value;
            }
            
            // Validate changes BEFORE applying if we are bound to a world
            if (world) {
                 if (effect.operation === 'SUBTRACT' && changes[effect.target_variable] < 0) {
                      instance.status = ProcessStatus.FAILED;
                      return { success: false, error: `Missing resources or impossible state for ${effect.target_variable}` };
                 }
            }
        }
        
        if (world && !instance.simulation_mode) {
             const updateResult = world.applyUpdate({
                 timestamp: Date.now(),
                 source: `Process:${instance.instance_id}:Step:${stepId}`,
                 reason: `Execution of ${step.name}`,
                 changes
             });
             
             if (!updateResult.success) {
                 instance.status = ProcessStatus.FAILED;
                 return { success: false, error: updateResult.errors?.join(", ") };
             }
        }
        
        instance.history.push({ step_id: stepId, timestamp: Date.now(), changes });
        
        return { success: true };
    }
}
