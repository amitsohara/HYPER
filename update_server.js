const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
`        const directive = req.body.directive || "Optimize heavy traffic at Nashik Road Junction.";
        HyperMindEventMesh.getInstance().publish({
            type: "WORLD_OBSERVATION",
            domain: CognitiveDomain.OBSERVATION,
            priority: 1,
            source: "MissionControlUI",
            payload: {
                missionDirective: directive,
                context: {
                    type: "USER_DIRECTIVE",
                    description: directive
                },
                entity: { name: "User Request", type: "MISSION_DIRECTIVE" },
                additionalEntities: [
                    { id: "e1", name: "Nashik Road Junction", type: "INTERSECTION", properties: { status: "congested" } },
                    { id: "e2", name: "Main Road", type: "ROAD", properties: { lanes: 4 } },
                    { id: "e3", name: "Vehicle 101", type: "VEHICLE", properties: { speed: 5, status: "stopped" } },
                    { id: "e4", name: "Vehicle 102", type: "VEHICLE", properties: { speed: 0, status: "stopped" } },
                    { id: "e5", name: "Signal A", type: "SIGNAL", properties: { state: "red", timer: 45 } },
                    { id: "e6", name: "Pedestrian Flow", type: "PEDESTRIAN", properties: { density: "high" } },
                    { id: "e7", name: "Minor Accident", type: "ACCIDENT", properties: { severity: "low", blockingLanes: 1 } },
                    { id: "e8", name: "Debris", type: "OBSTACLE", properties: { size: "small" } }
                ]
            }
        });`,
`        const directive = req.body.directive || "Generic user directive.";
        HyperMindEventMesh.getInstance().publish({
            type: "WORLD_OBSERVATION",
            domain: CognitiveDomain.OBSERVATION,
            priority: 1,
            source: "MissionControlUI",
            payload: {
                missionDirective: directive,
                context: {
                    type: "USER_DIRECTIVE",
                    description: directive
                },
                entity: { name: "User Request", type: "MISSION_DIRECTIVE" },
                additionalEntities: []
            }
        });`
);
fs.writeFileSync('server.ts', code);
