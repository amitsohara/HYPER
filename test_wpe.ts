import { DynamicWorldStateEngine } from "./src/server/core/hwme/dynamic/dynamic_world_state_engine.js";
import { StateVariableType } from "./src/server/core/hwme/dynamic/state_variable.js";
import { WorldProcessEngine } from "./src/server/core/hwme/process/world_process_engine.js";
import { ProcessModel } from "./src/server/core/hwme/process/process_model.js";
import { StepType, ProcessResourceType } from "./src/server/core/hwme/process/process_types.js";

async function runTests() {
    console.log("Running WPE Tests...");

    // Setup World
    const world = DynamicWorldStateEngine.createWorld("mars_city_1");
    world.initVariable("energy", "Energy", StateVariableType.NUMERIC, 100);
    world.initVariable("materials", "Materials", StateVariableType.NUMERIC, 500);
    world.initVariable("habitats", "Habitats", StateVariableType.NUMERIC, 0);

    // Test 1: Build City Process
    console.log("\n--- Test 1: Build City Process ---");
    const buildHabitatModel: ProcessModel = {
        process_id: "proc_build_habitat",
        name: "Construct Habitat",
        description: "Builds a new habitat",
        domain: "Construction",
        purpose: "Expansion",
        owner: "System",
        priority: 1,
        inputs: [], outputs: [], preconditions: [], postconditions: [],
        resources: [
            { resource_id: "res_energy", name: "energy", type: ProcessResourceType.ENERGY, quantity: 50, required: true },
            { resource_id: "res_mat", name: "materials", type: ProcessResourceType.MATERIALS, quantity: 200, required: true }
        ],
        dependencies: [], constraints: [], duration: 10, risk: "Low", confidence: 90, triggers: [],
        flow: {
            flow_id: "flow_1",
            dependencies: [],
            steps: [
                {
                    step_id: "step_1",
                    name: "Consume Resources",
                    type: StepType.SEQUENTIAL,
                    description: "Use energy and materials",
                    duration: 5,
                    effects: [
                        { effect_id: "e1", target_variable: "energy", operation: "SUBTRACT", value: 50, description: "Consume 50 energy" },
                        { effect_id: "e2", target_variable: "materials", operation: "SUBTRACT", value: 200, description: "Consume 200 materials" }
                    ]
                },
                {
                    step_id: "step_2",
                    name: "Build",
                    type: StepType.SEQUENTIAL,
                    description: "Erect structure",
                    duration: 5,
                    effects: [
                        { effect_id: "e3", target_variable: "habitats", operation: "ADD", value: 1, description: "Add 1 habitat" }
                    ]
                }
            ]
        }
    };

    const instance1 = WorldProcessEngine.createInstance(buildHabitatModel);
    if (!instance1) return console.log("Failed to create instance");

    console.log("Initial state:", world.getState().variables);
    
    const result1 = WorldProcessEngine.startProcess(instance1.instance_id, world.world_id);
    console.log("Process execution result:", result1);
    
    console.log("State after process:", world.getState().variables);
    
    // Test 3: Another process
    console.log("\n--- Test 3: Build Another (Should succeed and drain energy) ---");
    const instance2 = WorldProcessEngine.createInstance(buildHabitatModel);
    if (instance2) {
        const result2 = WorldProcessEngine.startProcess(instance2.instance_id, world.world_id);
        console.log("Process execution result:", result2);
        console.log("State after execution:", world.getState().variables);
    }
    
    // Test 4: Impossible process
    console.log("\n--- Test 4: Impossible process (Missing Energy) ---");
    const instance3 = WorldProcessEngine.createInstance(buildHabitatModel);
    if (instance3) {
        const result3 = WorldProcessEngine.startProcess(instance3.instance_id, world.world_id);
        console.log("Process execution result:", result3);
        console.log("State after failure:", world.getState().variables);
    }
}

runTests();
