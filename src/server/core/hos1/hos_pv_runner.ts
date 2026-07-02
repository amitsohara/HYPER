import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HyperMindOS } from "./index.js";
import { PluginManifest } from "./types.js";
import { HyperMindCLI } from "./cli.js";

async function runValidation() {
    console.log("Starting HOS PV-01 Validation...");
    
    const eventMesh = HyperMindEventMesh.getInstance();
    const hos = new HyperMindOS(eventMesh);

    // 1. Boot
    await hos.boot();
    if (hos.kernel.getContext().state !== "RUNNING") {
        throw new Error("HOS Kernel failed to boot into RUNNING state.");
    }

    // 2. Resource Allocation
    const alloc = hos.resourceManager.allocate("target-1", { cpuShares: 50, memoryMb: 1024, gpuShares: 0, diskMb: 1024, eventThroughputMax: 100 });
    if (!alloc) {
        throw new Error("Resource allocation failed.");
    }

    // 3. Plugin Loading
    const manifest: PluginManifest = {
        name: "TrafficSpecialist",
        version: "1.0.0",
        capabilities: ["TrafficAnalysis", "Simulation"],
        dependencies: ["HWME", "HSTE"],
        permissions: ["WORLD_MODEL_READ", "SIMULATION_RUN"]
    };
    
    const plugin = hos.pluginManager.loader.load(manifest, {} as any);
    if (!plugin || hos.pluginManager.registry.get(plugin.id)?.status !== "LOADED") {
        throw new Error("Plugin loading failed.");
    }

    // 4. Security Check
    const allowed = hos.securityManager.permissions.check("PLUGIN", "WORLD_MODEL_READ", plugin.id, "HWME");
    if (!allowed) {
        throw new Error("Security permission check failed.");
    }

    // 5. Mission Scheduling
    let scheduled = false;
    eventMesh.subscribe("MISSION_SCHEDULED", () => { scheduled = true; });
    
    const ctx = hos.missionManager.createMission("TestMission", 10);
    hos.missionManager.runMission(ctx);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!scheduled) {
        throw new Error("Mission scheduling failed.");
    }

    // 6. CLI Test
    const cli = new HyperMindCLI(hos);
    await cli.execute(["status"]);

    // 7. Shutdown
    await hos.shutdown();
    if (hos.kernel.getContext().state !== "OFFLINE") {
        throw new Error("HOS Kernel failed to shutdown cleanly.");
    }

    console.log("HOS PV-01 Validation Passed.");
}

runValidation().catch(console.error);
