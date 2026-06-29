export interface ModuleNode {
    id: string;
    name: string;
    description: string;
    layer: 'Core' | 'Cognitive' | 'Agents' | 'Execution' | 'Observability';
    status: 'Active' | 'Inactive' | 'Degraded';
}

export interface ModuleRelationship {
    source: string;
    target: string;
    type: 'Depends On' | 'Provides Data To' | 'Controls' | 'Observes';
}

export interface CapabilityDependency {
    capability: string;
    dependent_modules: string[];
}

export interface CognitiveGenomeMap {
    version: string;
    timestamp: number;
    modules: ModuleNode[];
    relationships: ModuleRelationship[];
    capabilities: CapabilityDependency[];
}

export class CognitiveGenomeService {
    private static currentVersion = "1.0.0";
    
    private static currentGenome: CognitiveGenomeMap = {
        version: "1.0.0",
        timestamp: Date.now(),
        modules: [
            { id: "M-1", name: "Master Orchestrator", description: "Central coordination and task delegation", layer: "Core", status: "Active" },
            { id: "M-2", name: "Persistent Brain", description: "Long-term episodic and semantic memory", layer: "Core", status: "Active" },
            { id: "M-3", name: "Cognitive Cycle", description: "Reasoning, planning, and meta-reflection loops", layer: "Cognitive", status: "Active" },
            { id: "M-4", name: "Digital Twin", description: "Simulation and environment modeling", layer: "Cognitive", status: "Active" },
            { id: "M-5", name: "Multi-Agent Society", description: "Swarm intelligence and consensus building", layer: "Agents", status: "Active" },
            { id: "M-6", name: "Autonomous Learning", description: "Experience extraction and skill improvement", layer: "Learning", status: "Active" as any },
            { id: "M-7", name: "Engineering Institute", description: "Code generation, building, and validation", layer: "Execution", status: "Active" },
            { id: "M-8", name: "Cognitive Observatory", description: "System health and telemetry monitoring", layer: "Observability", status: "Active" }
        ],
        relationships: [
            { source: "M-1", target: "M-3", type: "Controls" },
            { source: "M-1", target: "M-5", type: "Controls" },
            { source: "M-3", target: "M-2", type: "Provides Data To" },
            { source: "M-4", target: "M-3", type: "Provides Data To" },
            { source: "M-6", target: "M-2", type: "Depends On" },
            { source: "M-8", target: "M-1", type: "Observes" }
        ],
        capabilities: [
            { capability: "Complex Reasoning", dependent_modules: ["M-1", "M-3"] },
            { capability: "Self-Improvement", dependent_modules: ["M-3", "M-6"] },
            { capability: "Simulation", dependent_modules: ["M-4"] },
            { capability: "Code Synthesis", dependent_modules: ["M-7"] }
        ]
    };

    private static history: CognitiveGenomeMap[] = [ { ...CognitiveGenomeService.currentGenome } ];
    
    public static getGenome(): CognitiveGenomeMap {
        return this.currentGenome;
    }

    public static getHistory(): CognitiveGenomeMap[] {
        return [...this.history].sort((a, b) => b.timestamp - a.timestamp);
    }

    public static getSnapshot(version: string): CognitiveGenomeMap | undefined {
        return this.history.find(g => g.version === version);
    }

    public static createSnapshot(newVersion: string, modules: ModuleNode[], relationships: ModuleRelationship[], capabilities: CapabilityDependency[]): CognitiveGenomeMap {
        this.currentVersion = newVersion;
        const newGenome: CognitiveGenomeMap = {
            version: this.currentVersion,
            timestamp: Date.now(),
            modules: [...modules],
            relationships: [...relationships],
            capabilities: [...capabilities]
        };
        this.currentGenome = newGenome;
        this.history.push({ ...newGenome });
        return newGenome;
    }
}
