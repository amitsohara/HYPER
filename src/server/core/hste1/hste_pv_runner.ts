import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HSTESpecialist } from "./hsteSpecialist.js";
import { CognitiveDomain } from "../hcns01/types.js";

async function runValidation() {
    console.log("Starting HSTE PV-01 Validation...");
    
    const eventMesh = HyperMindEventMesh.getInstance();
    
    // Register events for testing
    eventMesh.registerEventType({ type: "PLAN_CREATED", domain: CognitiveDomain.REASONING, description: "A plan was created" });
    eventMesh.registerEventType({ type: "SIMULATION_STARTED", domain: CognitiveDomain.REASONING, description: "Simulation started" });
    eventMesh.registerEventType({ type: "SIMULATION_COMPLETED", domain: CognitiveDomain.REASONING, description: "Simulation completed" });
    eventMesh.registerEventType({ type: "PLAN_EVALUATED", domain: CognitiveDomain.REASONING, description: "Plan evaluated via simulation" });

    const hste = new HSTESpecialist(eventMesh);
    await hste.initialize();

    let evCount = 0;
    eventMesh.subscribe("SIMULATION_STARTED", () => { evCount++; });
    eventMesh.subscribe("SIMULATION_COMPLETED", () => { evCount++; });
    eventMesh.subscribe("PLAN_EVALUATED", (e) => {
        evCount++;
        console.log(`Plan Evaluated with ${e.payload.outcomes.length} scenarios.`);
    });

    console.log("Triggering PLAN_CREATED event...");
    await hste.handleEvent({
        type: "PLAN_CREATED",
        domain: CognitiveDomain.REASONING,
        priority: 1,
        source: "TEST",
        payload: {
            plan: { id: "P-100", name: "Deploy Robot" },
            worldState: { entities: [{ id: "R-1", type: "ROBOT" }] }
        }
    } as any);

    // Generate Scenarios: Best, Worst, Average (3)
    // For each: SIMULATION_STARTED, SIMULATION_COMPLETED
    // Final: PLAN_EVALUATED
    // Total events expected: 3*2 + 1 = 7

    // Wait for async events to propagate
    await new Promise(resolve => setTimeout(resolve, 100));

    if (evCount < 7) {
        throw new Error(`Expected at least 7 simulation events, got ${evCount}`);
    }

    console.log("\nTesting Monte Carlo Engine...");
    const baseTwin = hste.twinManager.createTwin({ entities: [] });
    const scenarios = hste.scenarioGenerator.generateScenarios(baseTwin, { id: "MC-Plan" });
    const mcMetrics = await hste.monteCarloEngine.runMonteCarlo(scenarios[2], 10); // Run 10 iterations on average case
    console.log(`Monte Carlo Metrics: Utility ${mcMetrics.utility.toFixed(2)}, Risk ${mcMetrics.risk.toFixed(2)}, Success ${mcMetrics.successProbability.toFixed(2)}`);

    console.log("\nTesting Counterfactual Engine...");
    const cfRun = await hste.counterfactualEngine.runCounterfactual(baseTwin, { removeTrafficLight: true });
    console.log(`Counterfactual Outcome: ${cfRun.outcome.narrative}`);

    console.log("\nHSTE PV-01 Validation Passed.");
}

runValidation().catch(err => {
    console.error("HSTE PV-01 Validation Failed:", err);
    process.exit(1);
});
