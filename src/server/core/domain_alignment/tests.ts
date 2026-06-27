import { GoogleGenAI } from "@google/genai";
import { DomainAlignmentGuard } from "./domain_alignment_guard.js";

async function runTests() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
  
  // Test 1: BUILD A CITY ON MARS
  console.log("--- Test 1: BUILD A CITY ON MARS ---");
  const marsDraft = {
    weekly_action_plan: ["Define MVP for the habitat", "Calculate CAC for new colonists", "Launch GTM strategy for Mars City"],
    risks: ["Seed investors pull out", "Radiation shielding fails"]
  };
  const marsStrategy = {
    best_strategy: { description: "Use nuclear power and ISRU" }
  };
  const marsResult = await DomainAlignmentGuard.validateAndRepair(
      ai,
      "BUILD A CITY ON MARS",
      { intent: "Build a permanent settlement" },
      marsDraft,
      marsStrategy
  );
  console.log("Profile:", marsResult.guardMetrics.profile.primary_domain);
  console.log("Violations detected:", marsResult.guardMetrics.wrong_domain_terms_detected);
  console.log("Repaired Report:", JSON.stringify(marsResult.finalReport, null, 2));


  // Test 2: Create an AI startup
  console.log("\\n--- Test 2: Create an AI startup ---");
  const startupDraft = {
    weekly_action_plan: ["Define MVP", "Calculate CAC/LTV", "Find seed investors"],
    risks: ["Competitor launches similar product", "Regolith clogs the servers"]
  };
  const startupResult = await DomainAlignmentGuard.validateAndRepair(
      ai,
      "Create an AI startup",
      { intent: "Launch a SaaS business" },
      startupDraft,
      { best_strategy: { description: "Raise seed round and launch MVP" } }
  );
  console.log("Profile:", startupResult.guardMetrics.profile.primary_domain);
  console.log("Violations detected:", startupResult.guardMetrics.wrong_domain_terms_detected);
  console.log("Repaired Report:", JSON.stringify(startupResult.finalReport, null, 2));


  // Test 3: Impact of war
  console.log("\\n--- Test 3: Impact of war ---");
  const warDraft = {
    weekly_action_plan: ["Assess infrastructure loss", "Define MVP for refugee camps", "Customer discovery for aid"],
    risks: ["Geopolitical instability", "Pricing strategy for food"]
  };
  const warResult = await DomainAlignmentGuard.validateAndRepair(
      ai,
      "Analyze the impact of war",
      { intent: "Understand humanitarian and geopolitical effects" },
      warDraft,
      { best_strategy: { description: "Focus on humanitarian aid and infrastructure recovery" } }
  );
  console.log("Profile:", warResult.guardMetrics.profile.primary_domain);
  console.log("Violations detected:", warResult.guardMetrics.wrong_domain_terms_detected);
  console.log("Repaired Report:", JSON.stringify(warResult.finalReport, null, 2));


  // Test 4: Reduce hospital waiting time
  console.log("\\n--- Test 4: Reduce hospital waiting time ---");
  const hospitalDraft = {
    weekly_action_plan: ["Optimize patient flow in OPD", "Monitor launch windows", "Calculate CAC/LTV for patients"],
    risks: ["Bed shortage", "Regolith dust in ER"]
  };
  const hospitalResult = await DomainAlignmentGuard.validateAndRepair(
      ai,
      "Reduce hospital waiting time",
      { intent: "Improve healthcare efficiency" },
      hospitalDraft,
      { best_strategy: { description: "Optimize triage and staffing" } }
  );
  console.log("Profile:", hospitalResult.guardMetrics.profile.primary_domain);
  console.log("Violations detected:", hospitalResult.guardMetrics.wrong_domain_terms_detected);
  console.log("Repaired Report:", JSON.stringify(hospitalResult.finalReport, null, 2));
}

runTests();
