const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `  app.post("/api/hml/missions/deploy", async (req, res) => {
    try {
        HyperMindEventMesh.getInstance().publish({
            type: "WORLD_OBSERVATION",
            domain: CognitiveDomain.OBSERVATION,
            priority: 1,
            source: "MissionControlUI",
            payload: {
                entity: { name: "Anomalous Signature", type: "THREAT" }
            }
        });
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
  });`;

const replacement = `  app.post("/api/hml/missions/deploy", async (req, res) => {
    try {
        const directive = req.body.directive || "Optimize heavy traffic at Nashik Road Junction.";
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
                entity: { name: "User Request", type: "MISSION_DIRECTIVE" }
            }
        });
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
  });`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");
