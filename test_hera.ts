import { AgendaManager, ResearchCategory, ResearchStatus } from "./src/server/core/haces/hera/index.js";

async function runTests() {
    console.log("Running HERA Tests...");

    const hera = new AgendaManager();

    console.log("\n--- Test 1: Add Research Initiative ---");
    hera.portfolio.addInitiative({
        initiative_id: "RES-1",
        title: "Improve Mathematical Discovery",
        description: "Enhance ability to discover novel theorems.",
        category: ResearchCategory.MATHEMATICS,
        priority: 90,
        expected_impact: 85,
        status: ResearchStatus.PROPOSED,
        dependencies: [],
        owner_division: "Core Reasoning",
        benchmark_targets: ["MATH", "GSM8K"],
        completion_criteria: ["Achieve 90% on MATH dataset"],
        hypothesis: {
            question: "Can tree search improve math discovery?",
            hypothesis: "MCTS over formal proofs will discover novel solutions.",
            supporting_evidence: ["AlphaGeometry success"],
            evaluation_plan: "Run against Lean formalizer",
            success_criteria: ["Solve 5 unsolved problems"],
            estimated_cost: {
                compute: 50000,
                engineering_effort: 300,
                time_days: 30
            },
            expected_capability_gain: { "MATHEMATICS": 20 }
        },
        created_at: Date.now(),
        updated_at: Date.now()
    });

    console.log("Active Initiatives:", hera.portfolio.getAllInitiatives().length);

    console.log("\n--- Test 2: Run HERA Cycle ---");
    hera.runCycle();
    console.log("Intelligence Profile Generated:", hera.intelligenceMap.getProfile() !== null);
    console.log("Opportunities Scanned:", hera.opportunityScanner.getOpportunities().length);

    console.log("\n--- Test 3: Weakness Discovery ---");
    hera.weaknessDiscovery.analyzePerformance({ success: false, reason: "timeout" });
    console.log("Weaknesses Found:", hera.weaknessDiscovery.getWeaknesses().length);

    console.log("\n--- Test 4: Generate Annual Roadmap ---");
    const report = hera.generateAnnualReport();
    console.log("Annual Report Generated:", report.report_id);
    console.log("Included Priorities:", report.research_priorities.length);

    console.log("\n--- Test 5: Metrics ---");
    console.log("HERA Metrics:", hera.getMetrics());
}

runTests();
