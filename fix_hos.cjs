const fs = require('fs');

// 1. Update hos1/types.ts
let types = fs.readFileSync('src/server/core/hos1/types.ts', 'utf8');
types = types.replace(/export interface MissionContext \{[\s\S]*?allocatedResources: string\[\];\s*\}/, `export interface MissionContext {
    id: string;
    name: string;
    directive: string;
    objective: string;
    description: string;
    priority: number;
    deadline?: number;
    requiredCapabilities: string[];
    allocatedResources: string[];
    observations?: any[];
    plans?: any[];
    decisions?: any[];
    results?: any[];
    status?: string;
}`);
fs.writeFileSync('src/server/core/hos1/types.ts', types);

// 2. Update hos1/managers/MissionManagers.ts
let mgr = fs.readFileSync('src/server/core/hos1/managers/MissionManagers.ts', 'utf8');
mgr = mgr.replace(/createMission\(name: string, priority: number\): MissionContext \{[\s\S]*?return \{[\s\S]*?\};\s*\}/, `createMission(name: string, priority: number, directive: string = "", description: string = "", objective: string = ""): MissionContext {
        return {
            id: \`sys-mission\`,
            name,
            directive: directive || name,
            objective: objective || description || name,
            description,
            priority,
            requiredCapabilities: [],
            allocatedResources: [],
            status: "CREATED",
            observations: [],
            plans: [],
            decisions: [],
            results: []
        };
    }`);
fs.writeFileSync('src/server/core/hos1/managers/MissionManagers.ts', mgr);

console.log("Updated HOS");
