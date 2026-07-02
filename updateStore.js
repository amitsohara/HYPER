const fs = require('fs');

const path = 'src/store/useHyperMindStore.ts';
let code = fs.readFileSync(path, 'utf-8');

const target = `         } else {
            // Push other events to history
            set((state) => ({
                events: [...state.events, msg].slice(-1000)
            }));
         }`;

const replacement = `         } else if (msg.type === "SIMULATION_STARTED") {
           useSimulationStore.getState().addScenario({
               scenarioId: msg.payload?.scenarioId || \`sim-\${Date.now()}\`,
               scenarioName: msg.payload?.scenarioName || "Simulated Scenario",
               metrics: { successProbability: 0, risk: 0, utility: 0, confidence: 0, cost: 0 },
               narrative: "Initializing simulation...",
               status: 'RUNNING'
           });
           set((state) => ({ events: [...state.events, msg].slice(-1000) }));
         } else if (msg.type === "SIMULATION_COMPLETED") {
           if (msg.payload?.run) {
               const run = msg.payload.run;
               useSimulationStore.getState().updateScenarioStatus(run.scenarioId, run.status, run.outcome);
               if (run.outcome) {
                   useSimulationStore.getState().addScenario({
                       scenarioId: run.scenarioId,
                       scenarioName: run.outcome.narrative || "Simulated Scenario",
                       metrics: run.outcome.metrics || { successProbability: 0, risk: 0, utility: 0, confidence: 0, cost: 0 },
                       narrative: run.outcome.narrative || "Simulation completed.",
                       status: run.status
                   });
               }
           }
           set((state) => ({ events: [...state.events, msg].slice(-1000) }));
         } else if (msg.type === "PLAN_EVALUATED") {
           if (msg.payload?.outcomes) {
               msg.payload.outcomes.forEach((outcome: any) => {
                   useSimulationStore.getState().addScenario({
                       scenarioId: outcome.scenarioId || \`sim-\${Date.now()}\`,
                       scenarioName: outcome.narrative || "Simulated Scenario",
                       metrics: outcome.metrics || { successProbability: 0, risk: 0, utility: 0, confidence: 0, cost: 0 },
                       narrative: outcome.narrative || "Simulation completed.",
                       status: 'COMPLETED'
                   });
               });
           }
           set((state) => ({ events: [...state.events, msg].slice(-1000) }));
         } else {
            // Push other events to history
            set((state) => ({
                events: [...state.events, msg].slice(-1000)
            }));
         }`;

code = code.replace(target, replacement);
fs.writeFileSync(path, code);
console.log("Done");
