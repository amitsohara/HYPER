import { MotorPrimitive, MotorSequence, MotorSkill, MotorProgram, ValidationStatus, MotorPolicy } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class MotorPrimitiveLibrary {
    private primitives: Map<string, MotorPrimitive> = new Map();

    constructor() {
        this.registerPrimitive({ id: "prim-move-fwd", name: "Move Forward", description: "Moves the agent forward", parameters: { speed: 1.0 }, version: 1 });
        this.registerPrimitive({ id: "prim-turn-left", name: "Turn Left", description: "Rotates the agent left", parameters: { angle: 90 }, version: 1 });
        this.registerPrimitive({ id: "prim-grip", name: "Grip", description: "Closes the gripper", parameters: { force: 0.5 }, version: 1 });
        this.registerPrimitive({ id: "prim-balance", name: "Balance", description: "Maintains dynamic stability", parameters: {}, version: 1 });
    }

    registerPrimitive(primitive: MotorPrimitive) {
        this.primitives.set(primitive.id, primitive);
    }

    getPrimitive(id: string): MotorPrimitive | undefined {
        return this.primitives.get(id);
    }
}

export class SkillCompositionEngine {
    constructor(private primitiveLibrary: MotorPrimitiveLibrary) {}

    compose(name: string, description: string, sequenceSteps: { primitiveId: string; parameters: any }[]): MotorSkill {
        const sequence: MotorSequence = {
            id: `seq-${uuidv4()}`,
            steps: sequenceSteps
        };

        const policy: MotorPolicy = {
            id: `pol-${uuidv4()}`,
            parameters: {},
            optimizationAlgorithm: "DEFAULT",
            performanceHistory: []
        };

        const program: MotorProgram = {
            id: `prog-${uuidv4()}`,
            sequence,
            policy
        };

        return {
            id: `skill-${uuidv4()}`,
            traceId: `trc-${uuidv4()}`,
            researchId: `res-${uuidv4()}`,
            name,
            description,
            program,
            preconditions: {},
            confidence: 0.5, // Initial confidence
            validationStatus: ValidationStatus.CANDIDATE,
            supportedEnvironments: ["GENERIC"],
            provenance: "HSME_COMPOSITION",
            version: 1,
            lifecycle: "CREATED",
            timestamp: Date.now(),
            telemetry: {}
        };
    }
}
