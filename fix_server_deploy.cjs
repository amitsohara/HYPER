const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const updatedDeploy = `app.post("/api/hml/missions/deploy", async (req, res) => {
    try {
        const directive = req.body.directive || "Optimize heavy traffic at Target Area.";
        
        // Use HOS to create and run the mission
        const hos = global.hos;
        const ctx = hos.missionManager.createMission(directive, 10, directive, directive, directive);
        hos.missionManager.runMission(ctx);
        
        // Note: the HOS scheduler fires MISSION_SCHEDULED
        // HMRC will listen to MISSION_SCHEDULED and establish the context
        // HPAE listens to MISSION_SCHEDULED and will fire WORLD_OBSERVATION

        res.json({ status: "deployed", missionId: ctx.id, directive });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
  });`;

code = code.replace(/app\.post\("\/api\/hml\/missions\/deploy", async \(req, res\) => \{[\s\S]*?\}\s*\);/m, updatedDeploy);

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts deployment logic");
