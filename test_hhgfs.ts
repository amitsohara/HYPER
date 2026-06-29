import { HypothesisGenerationEngine } from "./src/server/core/hhgfs/hypothesis_generation_engine.js";
import { ExperimentDesigner } from "./src/server/core/hhgfs/experiment_designer.js";

async function runTests() {
    console.log("Running HHGFS Tests...");

    const hhgfs = new HypothesisGenerationEngine();

    // Test 1: Water recycling on Mars
    console.log("\n--- Test 1: Water recycling on Mars ---");
    const marsHypotheses = hhgfs.generateHypotheses("water recycling on Mars");
    console.log(`Generated ${marsHypotheses.length} hypotheses.`);
    for (const h of marsHypotheses) {
        console.log(`- [${h.title}] Conf: ${h.confidence}, Preds: ${h.predictions.length}`);
        const experiments = ExperimentDesigner.design(h);
        console.log(`  Experiments proposed: ${experiments.length}`);
    }
    const rankedMars = hhgfs.getRanked();
    console.log("Ranked best:", rankedMars[0].title);

    // Test 2: Emergency Room Wait Time
    console.log("\n--- Test 2: Emergency room waiting time ---");
    const erHypotheses = hhgfs.generateHypotheses("emergency room waiting time");
    console.log(`Generated ${erHypotheses.length} hypotheses.`);
    
    // Attempt falsification on one
    const targetId = erHypotheses[0].hypothesis_id;
    console.log(`Attempting falsification on [${erHypotheses[0].title}]...`);
    const falsifyResult = hhgfs.falsify(targetId);
    console.log("Falsification result:", falsifyResult);
    console.log("New status:", hhgfs.getHypothesis(targetId)?.status);
    console.log("New confidence:", hhgfs.getHypothesis(targetId)?.confidence);

    // Test 3: Contradictory Evidence
    console.log("\n--- Test 3: Contradictory Evidence ---");
    const ceHypotheses = hhgfs.generateHypotheses("Contradictory evidence");
    console.log("Attempting falsification...");
    const ceRes = hhgfs.falsify(ceHypotheses[0].hypothesis_id);
    console.log("Result:", ceRes);
    console.log("Final status:", hhgfs.getHypothesis(ceHypotheses[0].hypothesis_id)?.status);

    // Test 4: Cross-domain Analogical
    console.log("\n--- Test 4: Cross-domain problem ---");
    const cdHypotheses = hhgfs.generateHypotheses("Cross-domain problem");
    console.log(`Generated ${cdHypotheses.length} cross-domain analogies.`);
}

runTests();
