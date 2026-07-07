const fs = require('fs');
const path = 'src/server/core/pipeline/phase2_mission_pipeline.ts';
let code = fs.readFileSync(path, 'utf8');

// We want to move the eventsToRegister block to before `const hpae = new HPAESpecialist(mesh);`

const registerEventsCode = `
    const eventsToRegister = [
        "WORLD_OBSERVATION", "WORLD_MODEL_UPDATED", "CONCEPT_DISCOVERED", 
        "ATTENTION_SHIFTED", "THOUGHT_GENERATED", "CONCLUSION_GENERATED",
        "PLAN_CREATED", "SIMULATION_STARTED", "SIMULATION_COMPLETED", "PLAN_EVALUATED", 
        "ACTION_AUTHORIZED", "ACTION_REJECTED", "ACTION_COMPLETED", 
        "MISSION_COMPLETED", "LEARNING_ARTIFACT_CREATED",
        "KNOWLEDGE_UPDATED", "GOAL_CREATED"
    ];
    eventsToRegister.forEach(evt => {
        if (!mesh.registry.isRegistered(evt)) {
            mesh.registerEventType({
                type: evt,
                domain: CognitiveDomain.SYSTEM,
                description: \`Event: \${evt}\`
            });
        }
    });
`;

// Remove the old one
code = code.replace(/    \/\/ Register necessary events[\s\S]*?\}\);\s*\n/m, '');

// Insert the new one
code = code.replace('    // 1. Instantiate Specialists', registerEventsCode + '\n    // 1. Instantiate Specialists');

fs.writeFileSync(path, code);
