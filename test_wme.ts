import { WorldMechanismEngine } from "./src/server/core/hwme/mechanism/world_mechanism_engine.js";
import { MechanismModel } from "./src/server/core/hwme/mechanism/mechanism_model.js";
import { MechanismType, MechanismStatus, MechanismTriggerType, MechanismLinkType } from "./src/server/core/hwme/mechanism/mechanism_types.js";

async function runTests() {
    console.log("Running WME Tests...");

    const wme = new WorldMechanismEngine();

    // Test 1: Valid Mechanism (Solar Energy Generation)
    console.log("\n--- Test 1: Valid Mechanism ---");
    const solarMechanism: MechanismModel = {
        mechanism_id: "mech_solar_1",
        name: "Solar Energy Generation",
        description: "Converts solar radiation into electrical energy",
        domain: MechanismType.PHYSICAL,
        confidence: 95,
        status: MechanismStatus.VALIDATED,
        source: "Physics library",
        created_at: Date.now(),
        updated_at: Date.now(),
        triggers: [
            { trigger_id: "trig_light", type: MechanismTriggerType.CONDITION, condition: "light_level > 0", description: "Presence of sunlight" }
        ],
        conditions: ["panels_clean"],
        inputs: ["solar_radiation"],
        internal_rules: [
            { rule_id: "rule_1", description: "Photovoltaic effect", logic: "energy_out = solar_radiation * efficiency" }
        ],
        transformation_logic: "Linear conversion",
        outputs: ["electrical_energy"],
        side_effects: [
            { effect_id: "eff_heat", target_type: "RESOURCE", target_id: "heat", operation: "ADD", value: 10, description: "Waste heat generated" },
            { effect_id: "eff_energy", target_type: "RESOURCE", target_id: "energy", operation: "ADD", value: 50, description: "Energy generated" }
        ],
        failure_modes: ["panel_degradation", "dust_storm"]
    };

    const res1 = wme.registerMechanism(solarMechanism);
    console.log("Register solar mechanism:", res1);
    
    // Test 2: Activate Mechanism
    console.log("\n--- Test 2: Activate Mechanism ---");
    const resActivate = wme.activateMechanism("mech_solar_1");
    console.log("Activation result:", resActivate);

    // Test 3: Impossible Mechanism
    console.log("\n--- Test 3: Impossible Mechanism ---");
    const perpetualMechanism: MechanismModel = {
        ...solarMechanism,
        mechanism_id: "mech_impossible_1",
        name: "Perpetual Motion Machine",
        description: "Generates infinite energy",
        status: MechanismStatus.HYPOTHETICAL
    };
    
    const res2 = wme.registerMechanism(perpetualMechanism);
    console.log("Register perpetual mechanism:", res2);
    
    // Test 4: Mechanism Graph
    console.log("\n--- Test 4: Mechanism Graph (Competing/Dependencies) ---");
    const waterMechanism: MechanismModel = {
        ...solarMechanism,
        mechanism_id: "mech_water_1",
        name: "Water Electrolysis",
        description: "Converts water to O2 and H2 using energy",
        domain: MechanismType.CHEMICAL,
        triggers: [{ trigger_id: "t1", type: MechanismTriggerType.CONDITION, condition: "energy > 10", description: "" }]
    };
    wme.registerMechanism(waterMechanism);
    
    wme.graph.addLink({
        link_id: "link_1",
        source_node_id: "mech_solar_1",
        target_node_id: "mech_water_1",
        type: MechanismLinkType.ENABLES,
        strength: 100,
        description: "Solar power provides energy for electrolysis"
    });
    
    console.log("Graph Nodes:", wme.graph.nodes.size);
    console.log("Graph Links:", wme.graph.links.size);
}

runTests();
