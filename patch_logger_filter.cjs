const fs = require('fs');
let code = fs.readFileSync('src/server/core/logging/MissionLogger.ts', 'utf8');

const filterCode = `
        const relevantEvents = new Set([
            "WORLD_OBSERVATION", "WORLD_MODEL_UPDATED", "CONCEPT_DISCOVERED", 
            "ATTENTION_SHIFTED", "THOUGHT_GENERATED", "CONCLUSION_GENERATED",
            "PLAN_CREATED", "PLAN_EVALUATED", "ACTION_AUTHORIZED", "ACTION_REJECTED", 
            "ACTION_COMPLETED", "MISSION_COMPLETED", "LEARNING_ARTIFACT_CREATED",
            "KNOWLEDGE_UPDATED", "GOAL_CREATED"
        ]);
        mesh.subscribe("*", (event: any) => {
            if (!relevantEvents.has(event.type) && !event.type.startsWith("MISSION")) return;
`;

code = code.replace(
    'mesh.subscribe("*", (event: any) => {',
    filterCode
);

fs.writeFileSync('src/server/core/logging/MissionLogger.ts', code);
