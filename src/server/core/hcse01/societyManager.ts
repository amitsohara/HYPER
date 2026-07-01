import { SpecialistRegistry } from "./specialistRegistry.js";
import { SocietyStateManager } from "./societyStateManager.js";
import { CognitiveSessionManager } from "./cognitiveSessionManager.js";
import { CapabilityDiscoveryEngine } from "./capabilityDiscoveryEngine.js";
import { SpecialistLifecycleManager } from "./specialistLifecycleManager.js";
import { SocietyHealthMonitor } from "./societyHealthMonitor.js";
import { HCNSAdapter } from "./hcnsAdapter.js";
import { ISpecialist, SocietyState } from "./types.js";

export class HyperMindCognitiveSociety {
    private static instance: HyperMindCognitiveSociety;

    public registry: SpecialistRegistry;
    public stateManager: SocietyStateManager;
    public sessionManager: CognitiveSessionManager;
    public discoveryEngine: CapabilityDiscoveryEngine;
    public lifecycleManager: SpecialistLifecycleManager;
    public healthMonitor: SocietyHealthMonitor;
    public hcnsAdapter: HCNSAdapter;

    private constructor() {
        this.hcnsAdapter = new HCNSAdapter();
        this.registry = new SpecialistRegistry();
        this.stateManager = new SocietyStateManager(this.hcnsAdapter);
        this.sessionManager = new CognitiveSessionManager(this.hcnsAdapter);
        this.discoveryEngine = new CapabilityDiscoveryEngine(this.registry);
        this.lifecycleManager = new SpecialistLifecycleManager();
        this.healthMonitor = new SocietyHealthMonitor(this.registry);
    }

    public static getInstance(): HyperMindCognitiveSociety {
        if (!HyperMindCognitiveSociety.instance) {
            HyperMindCognitiveSociety.instance = new HyperMindCognitiveSociety();
        }
        return HyperMindCognitiveSociety.instance;
    }

    public async initializeSociety(): Promise<void> {
        await this.stateManager.transitionTo(SocietyState.INITIALIZING);
        // Initialization logic for the whole society
        await this.stateManager.transitionTo(SocietyState.IDLE);
    }

    public async registerSpecialist(specialist: ISpecialist): Promise<void> {
        await this.lifecycleManager.initialize(specialist);
        this.registry.register(specialist);
        await this.lifecycleManager.activate(specialist);
    }

    public async removeSpecialist(id: string): Promise<void> {
        const specialist = this.registry.get(id);
        if (specialist) {
            await this.lifecycleManager.retire(specialist);
            this.registry.remove(id);
        }
    }

    public async shutdown(): Promise<void> {
        await this.stateManager.transitionTo(SocietyState.SHUTTING_DOWN);
        
        const specialists = this.registry.getAll();
        for (const specialist of specialists) {
            await this.lifecycleManager.retire(specialist);
        }
        
        // Finalize cleanup
    }

    public async recover(): Promise<void> {
        await this.stateManager.transitionTo(SocietyState.RECOVERING);
        
        const specialists = this.registry.getAll();
        for (const specialist of specialists) {
            const health = specialist.getHealth();
            if (health.status === "ERROR" || health.status === "SUSPENDED") {
                await this.lifecycleManager.recover(specialist);
            }
        }
        
        await this.stateManager.transitionTo(SocietyState.IDLE);
    }
}
