const fs = require('fs');

let code = `
                entity: { name: "Nashik Road Junction", type: "INTERSECTION", properties: { status: "congested" } },
                relationships: [],
                additionalEntities: [
                    { id: "e1", name: "Main Road", type: "ROAD", properties: { lanes: 4 } },
                    { id: "e2", name: "Vehicle 101", type: "VEHICLE", properties: { speed: 5, status: "stopped" } },
                    { id: "e3", name: "Vehicle 102", type: "VEHICLE", properties: { speed: 0, status: "stopped" } },
                    { id: "e4", name: "Signal A", type: "SIGNAL", properties: { state: "red", timer: 45 } },
                    { id: "e5", name: "Pedestrian Flow", type: "PEDESTRIAN", properties: { density: "high" } },
                    { id: "e6", name: "Minor Accident", type: "ACCIDENT", properties: { severity: "low", blockingLanes: 1 } },
                    { id: "e7", name: "Debris", type: "OBSTACLE", properties: { size: "small" } }
                ]
`;

// Let's modify observationIntegrator.ts to handle additionalEntities
let obsPath = 'src/server/core/hwme1/observationIntegrator.ts';
let obsCode = fs.readFileSync(obsPath, 'utf8');

if (!obsCode.includes('additionalEntities')) {
    obsCode = obsCode.replace(
        'if (payload.entity) {',
        `if (payload.additionalEntities) {
            for (const e of payload.additionalEntities) {
                this.entityManager.createEntity(e);
            }
        }
        if (payload.entity) {`
    );
    fs.writeFileSync(obsPath, obsCode);
}

// Modify server.ts to inject the world model
let serverPath = 'server.ts';
let serverCode = fs.readFileSync(serverPath, 'utf8');

serverCode = serverCode.replace(
    'entity: { name: "User Request", type: "MISSION_DIRECTIVE" }',
    `entity: { name: "User Request", type: "MISSION_DIRECTIVE" },
                additionalEntities: [
                    { id: "e1", name: "Nashik Road Junction", type: "INTERSECTION", properties: { status: "congested" } },
                    { id: "e2", name: "Main Road", type: "ROAD", properties: { lanes: 4 } },
                    { id: "e3", name: "Vehicle 101", type: "VEHICLE", properties: { speed: 5, status: "stopped" } },
                    { id: "e4", name: "Vehicle 102", type: "VEHICLE", properties: { speed: 0, status: "stopped" } },
                    { id: "e5", name: "Signal A", type: "SIGNAL", properties: { state: "red", timer: 45 } },
                    { id: "e6", name: "Pedestrian Flow", type: "PEDESTRIAN", properties: { density: "high" } },
                    { id: "e7", name: "Minor Accident", type: "ACCIDENT", properties: { severity: "low", blockingLanes: 1 } },
                    { id: "e8", name: "Debris", type: "OBSTACLE", properties: { size: "small" } }
                ]`
);

fs.writeFileSync(serverPath, serverCode);
console.log("Seeded world in server.ts and updated ObservationIntegrator");
