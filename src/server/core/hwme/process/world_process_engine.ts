import { ProcessModel } from "./process_model.js";
import { ProcessInstance } from "./process_instance.js";
import { ProcessStatus } from "./process_types.js";
import { ProcessValidator } from "./process_validator.js";
import { ProcessExecutor } from "./process_executor.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class WorldProcessEngine {
    private static instances: Map<string, ProcessInstance> = new Map();

    static createInstance(model: ProcessModel, simulation_mode: boolean = false): ProcessInstance | null {
        const validation = ProcessValidator.validate(model);
        if (!validation.valid) {
            console.error("Process model validation failed:", validation.errors);
            return null;
        }

        const instance: ProcessInstance = {
            instance_id: uuidv4(),
            model,
            status: ProcessStatus.IDLE,
            history: [],
            allocated_resources: {},
            simulation_mode
        };
        this.instances.set(instance.instance_id, instance);
        return instance;
    }

    static startProcess(instance_id: string, world_id: string): { success: boolean, error?: string } {
        const instance = this.instances.get(instance_id);
        if (!instance) return { success: false, error: "Instance not found" };

        instance.status = ProcessStatus.RUNNING;
        instance.start_time = Date.now();

        // Very basic linear executor for demonstration
        for (const step of instance.model.flow.steps) {
            if (instance.status !== ProcessStatus.RUNNING) break;
            
            const result = ProcessExecutor.executeStep(instance, step.step_id, world_id);
            if (!result.success) {
                instance.status = ProcessStatus.FAILED;
                return result;
            }
        }

        if (instance.status === ProcessStatus.RUNNING) {
            instance.status = ProcessStatus.COMPLETED;
            instance.end_time = Date.now();
        }

        return { success: instance.status === ProcessStatus.COMPLETED };
    }
    
    static getInstance(instance_id: string) {
        return this.instances.get(instance_id);
    }
    
    static getAllInstances() {
        return Array.from(this.instances.values());
    }
}
