import { CuriosityEngine } from "./src/server/core/hcrpe/curiosity_engine.js";

async function runTests() {
    console.log("Running HCRPE Tests...");

    const engine = new CuriosityEngine();

    // Test 1: Mars City
    console.log("\n--- Test 1: Mars City ---");
    const plans1 = engine.process("Build a Mars City");
    console.log(`Generated ${engine.getGaps().length} gaps.`);
    console.log(`Generated ${engine.getQuestions().length} questions.`);
    console.log(`Created ${plans1.length} prioritized research plans.`);
    if (plans1.length > 0) {
        console.log(`Top plan: ${plans1[0].title}`);
    }

    // Test 2: Conflicting mechanisms
    console.log("\n--- Test 2: Conflicting mechanisms ---");
    const plans2 = engine.process("Conflicting mechanisms detected in system");
    console.log(`Current questions count: ${engine.getQuestions().length}`);
    console.log(`Created ${plans2.length} plans. Top plan: ${plans2[0]?.title}`);

    // Test 3: Low-confidence principle
    console.log("\n--- Test 3: Low-confidence principle ---");
    const plans3 = engine.process("Low-confidence principle");
    console.log(`Current questions count: ${engine.getQuestions().length}`);

    // Test 4: Solved problem
    console.log("\n--- Test 4: Solved problem ---");
    const plans4 = engine.process("Solved problem");
    console.log(`Created new plans: ${plans4.length - plans3.length} (Expected 0)`);
}

runTests();
