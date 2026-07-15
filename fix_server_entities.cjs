const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const updatedDeploy = `app.post("/api/hml/missions/deploy", async (req, res) => {
    try {
        const directive = req.body.directive || "Optimize heavy traffic at Target Area.";
        
        // Use HOS to create and run the mission
        const hos = global.hos;
        const ctx = hos.missionManager.createMission(directive, 10, directive, directive, directive);
        hos.missionManager.runMission(ctx);
        
        // Inject synthetic environment state directly to HCNS so HWME has something to work with
        HyperMindEventMesh.getInstance().publish({
            type: "WORLD_OBSERVATION",
            domain: CognitiveDomain.OBSERVATION,
            priority: 1,
            source: "EnvironmentSimulator",
            payload: {
                missionId: ctx.id,
                additionalEntities: [
                    { id: "e1", name: "Target Area", type: "INTERSECTION", properties: { status: "congested" } },
                    { id: "e2", name: "Main Road", type: "ROAD", properties: { lanes: 4 } },
                    { id: "e3", name: "Vehicle 101", type: "VEHICLE", properties: { speed: 5, status: "stopped" } },
                    { id: "e4", name: "Vehicle 102", type: "VEHICLE", properties: { speed: 0, status: "stopped" } },
                    { id: "e5", name: "Signal A", type: "SIGNAL", properties: { state: "red", timer: 45 } },
                    { id: "e6", name: "Pedestrian Flow", type: "PEDESTRIAN", properties: { density: "high" } },
                    { id: "e7", name: "Minor Accident", type: "ACCIDENT", properties: { severity: "low", blockingLanes: 1 } },
                    { id: "e8", name: "Debris", type: "OBSTACLE", properties: { size: "small" } }
                ]
            }
        });

        res.json({ status: "deployed", missionId: ctx.id, directive });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
  });`;

code = code.replace(/app\.post\("\/api\/hml\/missions\/deploy", async \(req, res\) => \{[\s\S]*?\}\s*\);/m, updatedDeploy);

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts entities logic");
