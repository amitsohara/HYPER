import { ProceduralMemory, MotorSkill, ValidationStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";

export class ProceduralMemoryManager {
    private memory: ProceduralMemory = {
        id: `mem-${uuidv4()}`,
        skills: {},
        lastUpdated: Date.now()
    };

    constructor(private eventMesh: HyperMindEventMesh) {}

    store(skill: MotorSkill) {
        if (skill.validationStatus === ValidationStatus.EXECUTIVE_APPROVED || skill.validationStatus === ValidationStatus.PROMOTED) {
            this.memory.skills[skill.id] = skill;
            this.memory.lastUpdated = Date.now();
            
            this.eventMesh.publish({
                type: "PROCEDURAL_MEMORY_UPDATED",
                domain: CognitiveDomain.MEMORY,
                priority: 1,
                source: "HSME",
                payload: { skillId: skill.id }
            });
        }
    }

    retrieve(skillId: string): MotorSkill | undefined {
        return this.memory.skills[skillId];
    }
    
    getMemory(): ProceduralMemory {
        return this.memory;
    }
}
