import { SocietyState } from "./types.js";
import { HCNSAdapter } from "./hcnsAdapter.js";

export class SocietyStateManager {
    private currentState: SocietyState = SocietyState.IDLE;

    constructor(private hcnsAdapter: HCNSAdapter) {}

    public getState(): SocietyState {
        return this.currentState;
    }

    public async transitionTo(newState: SocietyState): Promise<void> {
        if (this.currentState === newState) return;
        
        const oldState = this.currentState;
        this.currentState = newState;

        await this.hcnsAdapter.publishStateTransition(oldState, newState);
    }
}
