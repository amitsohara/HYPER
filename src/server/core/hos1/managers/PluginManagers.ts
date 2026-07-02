import { Plugin, PluginManifest } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { ISpecialist } from "../../hcse01/types.js";

export class PluginRegistry {
    private plugins: Map<string, Plugin> = new Map();

    register(plugin: Plugin) {
        this.plugins.set(plugin.id, plugin);
    }

    get(id: string): Plugin | undefined {
        return this.plugins.get(id);
    }

    getAll(): Plugin[] {
        return Array.from(this.plugins.values());
    }
}

export class PluginLoader {
    constructor(private registry: PluginRegistry, private eventMesh: HyperMindEventMesh) {}

    load(manifest: PluginManifest, specialistInstance: ISpecialist): Plugin {
        const plugin: Plugin = {
            id: `plg-${uuidv4()}`,
            traceId: `trc-${uuidv4()}`,
            researchId: `res-${uuidv4()}`,
            manifest,
            status: "LOADED",
            instance: specialistInstance,
            timestamp: Date.now(),
            version: 1,
            confidence: 1.0,
            metadata: {},
            lifecycle: "LOADED",
            telemetry: {},
            provenance: "HOS_LOADER"
        };

        this.registry.register(plugin);

        this.eventMesh.publish({
            type: "PLUGIN_LOADED",
            domain: CognitiveDomain.SYSTEM,
            priority: 1,
            source: "HOS_LOADER",
            payload: { pluginId: plugin.id, manifest }
        });

        return plugin;
    }
}

export class PluginManager {
    public registry = new PluginRegistry();
    public loader: PluginLoader;

    constructor(eventMesh: HyperMindEventMesh) {
        this.loader = new PluginLoader(this.registry, eventMesh);
    }

    enable(pluginId: string) {
        const p = this.registry.get(pluginId);
        if (p && p.status === "LOADED") {
            p.status = "ACTIVE";
            if (p.instance && p.instance.activate) {
                p.instance.activate();
            }
        }
    }
}
