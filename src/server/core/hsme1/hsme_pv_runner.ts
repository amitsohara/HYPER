import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HSMESpecialist } from "./hsmeSpecialist.js";
import { CognitiveDomain } from "../hcns01/types.js";
import { ValidationStatus } from "./types.js";

async function runValidation() {
    console.log("Starting HSME PV-01 Validation...");
    
    const eventMesh = HyperMindEventMesh.getInstance();
    
    eventMesh.registerEventType({ type: "FEEDBACK_RECEIVED", domain: CognitiveDomain.EXECUTION, description: "Motor feedback received" });
    eventMesh.registerEventType({ type: "MOTOR_POLICY_UPDATED", domain: CognitiveDomain.LEARNING, description: "Motor policy updated" });
    eventMesh.registerEventType({ type: "TRAJECTORY_GENERATED", domain: CognitiveDomain.EXECUTION, description: "Trajectory generated" });
    eventMesh.registerEventType({ type: "PROCEDURAL_MEMORY_UPDATED", domain: CognitiveDomain.MEMORY, description: "Procedural memory updated" });

    const hsme = new HSMESpecialist(eventMesh);
    await hsme.initialize();

    let policyUpdatedCount = 0;
    let memoryUpdatedCount = 0;

    eventMesh.subscribe("MOTOR_POLICY_UPDATED", () => { policyUpdatedCount++; });
    eventMesh.subscribe("PROCEDURAL_MEMORY_UPDATED", () => { memoryUpdatedCount++; });

    // 1. Compose a skill
    console.log("Testing Skill Composition...");
    const rideBicycle = hsme.compositionEngine.compose(
        "Ride Bicycle", 
        "Pedal, balance, steer", 
        [
            { primitiveId: "prim-balance", parameters: {} },
            { primitiveId: "prim-move-fwd", parameters: { speed: 1.0 } }
        ]
    );

    if (rideBicycle.program.sequence.steps.length !== 2) {
        throw new Error("Skill composition failed.");
    }

    // 2. Trajectory Generation
    console.log("Testing Trajectory Generation...");
    const traj = hsme.trajectoryPlanner.plan([{x: 0, y: 0}, {x: 10, y: 10}], []);
    if (!traj) {
        throw new Error("Trajectory generation failed.");
    }

    // 3. Feedback Learning & Procedural Memory
    console.log("Testing Feedback Learning (Success)...");
    
    // Simulate feedback loop
    await hsme.handleEvent({
        type: "FEEDBACK_RECEIVED",
        domain: CognitiveDomain.EXECUTION,
        priority: 1,
        source: "HPAE",
        payload: {
            skillId: rideBicycle.id,
            skill: rideBicycle, // pass along for mock test
            feedback: {
                id: "fb-1",
                traceId: "trc-fb-1",
                success: true,
                latency: 10,
                precision: 0.9,
                stability: 0.9,
                energy: 10,
                smoothness: 0.9,
                safety: 1.0,
                timestamp: Date.now()
            }
        }
    } as any);

    // Provide more feedback to raise confidence > 0.8
    for(let i = 0; i < 5; i++) {
        await hsme.handleEvent({
            type: "FEEDBACK_RECEIVED",
            domain: CognitiveDomain.EXECUTION,
            priority: 1,
            source: "HPAE",
            payload: {
                skillId: rideBicycle.id,
                skill: rideBicycle,
                feedback: {
                    id: `fb-${i+2}`,
                    traceId: `trc-fb-${i+2}`,
                    success: true,
                    latency: 10,
                    precision: 0.9,
                    stability: 0.9,
                    energy: 10,
                    smoothness: 0.9,
                    safety: 1.0,
                    timestamp: Date.now()
                }
            }
        } as any);
    }

    // 4. Transfer Learning
    console.log("Testing Transfer Learning...");
    const transferred = hsme.transferEngine.transfer(rideBicycle, "ROBOT_B");
    if (transferred.supportedEnvironments[0] !== "ROBOT_B" || transferred.validationStatus !== ValidationStatus.CANDIDATE) {
        throw new Error("Transfer learning failed preconditions.");
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    if (policyUpdatedCount < 1) {
        throw new Error("Expected MOTOR_POLICY_UPDATED events.");
    }

    if (memoryUpdatedCount < 1) {
        throw new Error("Expected PROCEDURAL_MEMORY_UPDATED events.");
    }

    const storedSkill = hsme.memoryManager.retrieve(rideBicycle.id);
    if (!storedSkill || storedSkill.validationStatus !== ValidationStatus.EXECUTIVE_APPROVED) {
        throw new Error("Skill was not properly stored in procedural memory.");
    }

    console.log("HSME PV-01 Validation Passed.");
}

runValidation().catch(console.error);
