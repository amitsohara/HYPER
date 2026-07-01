import { HyperMindReasoningEngine } from "./hreSpecialist.js";
import { DeductiveRule } from "./strategies/deductiveStrategy.js";
import { CSPVariable, CSPConstraint } from "./strategies/constraintStrategy.js";
import { BayesEvent, BayesConditional } from "./strategies/probabilisticStrategy.js";
import { ConceptStructure } from "./strategies/analogicalStrategy.js";
import { InductiveObservation } from "./strategies/inductiveStrategy.js";
import { AbductiveRule } from "./strategies/abductiveStrategy.js";
import { CausalNode, CausalEdge } from "./strategies/causalStrategy.js";
import { SemanticConcept } from "./strategies/commonsenseStrategy.js";

async function runValidation() {
    const hre = HyperMindReasoningEngine.getInstance();
    await hre.initialize();

    const evidence = [
        { id: "e1", source: "sensor", content: "door open", confidence: 0.9, provenance: "sys" }
    ];

    const rule: DeductiveRule = {
        id: "rule1",
        conditions: ["door open"],
        conclusion: "security breach"
    };

    // 1. Deductive Reasoning
    const session = await hre.manager.executeReasoning("Determine status", ["door open"], "DEDUCTIVE", evidence, { rules: [rule] });
    
    if (session.finalConclusions.length === 0) {
        throw new Error("Deductive strategy failed to produce conclusion");
    }

    if (!session.finalConclusions[0].explanation) {
        throw new Error("Explanation engine failed to decorate conclusion");
    }

    if (session.inferenceGraph.nodes.size === 0) {
        throw new Error("Inference graph was not populated");
    }

    // 2. Abductive Reasoning
    const abductiveRules: AbductiveRule[] = [
        { hypothesis: "wind", observation: "door open", likelihood: 0.2, prior: 0.5 },
        { hypothesis: "intruder", observation: "door open", likelihood: 0.9, prior: 0.1 }
    ];
    const abductiveSession = await hre.manager.executeReasoning("Determine cause", ["door open"], "ABDUCTIVE", evidence, { abductiveRules });
    if (abductiveSession.alternativeConclusions.length === 0) {
        throw new Error("Abductive reasoning failed to generate alternative hypotheses");
    }

    // 3. Constraint Reasoning
    const variables: CSPVariable[] = [
        { name: "A", domain: [1, 2, 3] },
        { name: "B", domain: [1, 2, 3] }
    ];
    const constraints: CSPConstraint[] = [
        { variables: ["A", "B"], evaluate: (assignment) => assignment.A !== assignment.B }
    ];
    const constraintSession = await hre.manager.executeReasoning("Solve constraints", [], "CONSTRAINT_BASED", [], { variables, constraints });
    if (constraintSession.finalConclusions.length === 0 || constraintSession.finalConclusions[0].content.includes("No CSP Solution exists")) {
        throw new Error("Constraint strategy failed to produce a valid conclusion");
    }

    // 4. Probabilistic Reasoning
    const hypothesisEvent: BayesEvent = { name: "Rain", prior: 0.2 };
    const conditionals: BayesConditional[] = [
        { hypothesis: "Rain", evidence: "Cloudy", probGivenHypothesis: 0.9, probGivenNotHypothesis: 0.3 }
    ];
    const probabilisticSession = await hre.manager.executeReasoning("Determine probability of rain", [], "PROBABILISTIC", [], { hypothesisEvent, conditionals, observedEvidence: ["Cloudy"] });
    if (probabilisticSession.finalConclusions.length === 0 || probabilisticSession.overallConfidence <= 0.2) {
        throw new Error("Probabilistic strategy failed to correctly update posterior probability");
    }

    // 5. Analogical Reasoning
    const sourceConcept: ConceptStructure = {
        name: "Solar System",
        properties: { center: "Sun", orbits: true, emptySpace: true },
        relations: []
    };
    const targetConcept: ConceptStructure = {
        name: "Atom",
        properties: { center: "Nucleus", orbits: true, emptySpace: true },
        relations: []
    };
    const analogicalSession = await hre.manager.executeReasoning("Find analogy", [], "ANALOGICAL", [], { sourceConcept, targetConcept });
    if (analogicalSession.finalConclusions.length === 0) {
        throw new Error("Analogical strategy failed to compute similarity correctly");
    }

    // 6. Multi-Hop Reasoning
    const globalGraph = {
        nodes: new Map([
            ["A", { id: "A", content: "A" }],
            ["B", { id: "B", content: "B" }],
            ["C", { id: "C", content: "C" }]
        ]),
        edges: [
            { sourceId: "A", targetId: "B" },
            { sourceId: "B", targetId: "C" }
        ]
    };
    const multiHopSession = await hre.manager.executeReasoning("Find path", [], "MULTI_HOP", [], { globalGraph, startNodeId: "A", targetNodeContent: "C" });
    if (multiHopSession.finalConclusions.length === 0) {
        throw new Error("Multi-hop strategy failed to find graph path");
    }

    // 7. Inductive Reasoning
    const observations: InductiveObservation[] = [
        { id: "o1", attributes: ["has_feathers", "can_fly"] },
        { id: "o2", attributes: ["has_feathers", "can_fly"] },
        { id: "o3", attributes: ["has_feathers", "can_fly"] }
    ];
    const inductiveSession = await hre.manager.executeReasoning("Induce rules", [], "INDUCTIVE", [], { observations, supportThreshold: 0.1, confidenceThreshold: 0.9 });
    if (inductiveSession.finalConclusions.length === 0) {
        throw new Error("Inductive strategy failed to induce rules");
    }

    // 8. Causal Reasoning
    const causalNodes: CausalNode[] = [
        { id: "Rain", state: true },
        { id: "WetGrass", state: false }
    ];
    const causalEdges: CausalEdge[] = [
        { sourceId: "Rain", targetId: "WetGrass", weight: 0.9 }
    ];
    const causalSession = await hre.manager.executeReasoning("Predict effects", [], "CAUSAL", [], { causalNodes, causalEdges });
    if (causalSession.finalConclusions.length === 0) {
        throw new Error("Causal strategy failed to predict effects");
    }

    // 9. Counterfactual Reasoning
    const cfSession = await hre.manager.executeReasoning("Simulate counterfactual", [], "COUNTERFACTUAL", [], { 
        causalNodes, 
        causalEdges,
        interventionNodeId: "Rain",
        interventionState: false
    });
    if (cfSession.finalConclusions.length === 0) {
        throw new Error("Counterfactual strategy failed to simulate intervention");
    }

    // 10. Commonsense Reasoning
    const conceptGraph = new Map<string, SemanticConcept>([
        ["Bird", { id: "Bird", properties: ["can_fly"], isA: ["Animal"] }],
        ["Penguin", { id: "Penguin", properties: ["cannot_fly"], isA: ["Bird"] }],
        ["Sparrow", { id: "Sparrow", properties: [], isA: ["Bird"] }]
    ]);
    const commonsenseSession = await hre.manager.executeReasoning("Inherit properties", [], "COMMONSENSE", [], { 
        conceptGraph, 
        queryConceptId: "Sparrow", 
        queryProperty: "can_fly" 
    });
    if (commonsenseSession.finalConclusions.length === 0) {
        throw new Error("Commonsense strategy failed to inherit property");
    }

    console.log("HRE PV-01 Validation Passed.");
}

runValidation().catch(console.error);

