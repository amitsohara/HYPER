import { OperatingKernel } from "./kernel/OperatingKernel.js";
import { MissionManager, MissionScheduler, MissionQueue } from "./managers/MissionManagers.js";
import { ResourceManager } from "./managers/ResourceManagers.js";
import { PluginManager } from "./managers/PluginManagers.js";
import { SecurityManager } from "./managers/SecurityManagers.js";
import { TelemetryManager } from "./managers/TelemetryManagers.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";

export * from "./types.js";
export * from "./kernel/OperatingKernel.js";
export * from "./managers/MissionManagers.js";
export * from "./managers/ResourceManagers.js";
export * from "./managers/PluginManagers.js";
export * from "./managers/SecurityManagers.js";
export * from "./managers/TelemetryManagers.js";

export class HyperMindOS {
    public kernel: OperatingKernel;
    public missionManager: MissionManager;
    public resourceManager: ResourceManager;
    public pluginManager: PluginManager;
    public securityManager: SecurityManager;
    public telemetryManager: TelemetryManager;

    constructor(private eventMesh: HyperMindEventMesh) {
        this.kernel = new OperatingKernel(eventMesh);
        
        const queue = new MissionQueue();
        const scheduler = new MissionScheduler(queue, eventMesh);
        this.missionManager = new MissionManager(scheduler, eventMesh);
        
        this.resourceManager = new ResourceManager();
        this.pluginManager = new PluginManager(eventMesh);
        this.securityManager = new SecurityManager();
        this.telemetryManager = new TelemetryManager();
    }

    async boot() {
        await this.kernel.boot();
        this.telemetryManager.health.reportHealth("HOS_KERNEL", true, {});
    }

    async shutdown() {
        await this.kernel.shutdown();
    }
}
