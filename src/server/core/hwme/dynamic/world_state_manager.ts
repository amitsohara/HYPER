import { TemporalManager } from "./temporal_manager.js";
import { StateHistory } from "./state_history.js";
import { StateVariable, StateVariableType } from "./state_variable.js";
import { StateSnapshot } from "./state_snapshot.js";
import { StateUpdate } from "./state_update.js";
import { StateValidator } from "./state_validator.js";
import { StateTransitionEngine } from "./state_transition_engine.js";
import { StateMetrics } from "./state_metrics.js";
import { StatePrediction } from "./state_prediction.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class WorldStateManager {
    world_id: string;
    temporal: TemporalManager;
    history: StateHistory;
    variables: Map<string, StateVariable>;
    confidence: number = 100;
    uncertainty: number = 0;
    predictions: StatePrediction[] = [];
    current_state_id: string;

    constructor(world_id: string) {
        this.world_id = world_id;
        this.temporal = new TemporalManager();
        this.history = new StateHistory();
        this.variables = new Map();
        this.current_state_id = uuidv4();
    }
    
    initVariable(id: string, name: string, type: StateVariableType, initialValue: any) {
        this.variables.set(id, {
            id,
            name,
            type,
            value: initialValue,
            confidence: 100,
            uncertainty: 0,
            source: "Initialization",
            last_update: this.temporal.getCurrentTick()
        });
    }

    getState() {
        const vars: Record<string, any> = {};
        this.variables.forEach((v, k) => vars[k] = v.value);
        return {
            world_id: this.world_id,
            state_id: this.current_state_id,
            timestamp: this.temporal.getCurrentTick(),
            variables: vars,
            confidence: this.confidence,
            uncertainty: this.uncertainty,
            metrics: StateMetrics.getMetrics(this)
        };
    }

    applyUpdate(update: StateUpdate): { success: boolean, errors?: string[] } {
        const validation = StateValidator.validate(this.getState(), update);
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        const oldStateId = this.current_state_id;
        const newStateId = uuidv4();
        
        // Apply changes
        for (const [key, val] of Object.entries(update.changes)) {
            const variable = this.variables.get(key);
            if (variable) {
                variable.value = val;
                variable.last_update = update.timestamp;
                variable.source = update.source;
            } else {
                 // Dynamic creation
                 this.variables.set(key, {
                     id: key,
                     name: key,
                     type: typeof val === 'number' ? StateVariableType.NUMERIC : StateVariableType.ENUM,
                     value: val,
                     confidence: 90,
                     uncertainty: 10,
                     source: update.source,
                     last_update: update.timestamp
                 });
            }
        }
        
        this.current_state_id = newStateId;

        const transition = StateTransitionEngine.computeTransition(oldStateId, newStateId, update);
        this.history.recordTransition(transition);
        
        // Create Snapshot occasionally or when requested, here we do it per update for simplicity in testing
        this.createSnapshot(update.reason);

        return { success: true };
    }
    
    createSnapshot(reason: string) {
        const vars: Record<string, any> = {};
        this.variables.forEach((v, k) => vars[k] = v.value);
        
        const snapshot: StateSnapshot = {
            snapshot_id: this.current_state_id,
            timestamp: this.temporal.getCurrentTick(),
            reason,
            variables: vars,
            metrics: StateMetrics.getMetrics(this)
        };
        this.history.recordSnapshot(snapshot);
    }
    
    addPrediction(prediction: StatePrediction) {
        this.predictions.push(prediction);
    }
    
    rollback(snapshot_id: string): boolean {
        const snapshot = this.history.snapshots.find(s => s.snapshot_id === snapshot_id);
        if (!snapshot) return false;
        
        this.current_state_id = snapshot.snapshot_id;
        // Restore variables
        for (const [key, val] of Object.entries(snapshot.variables)) {
            const v = this.variables.get(key);
            if (v) v.value = val;
        }
        
        // Record the rollback as an update
        this.history.recordTransition({
             transition_id: uuidv4(),
             trigger: "Rollback",
             source_state_id: this.current_state_id, // Note: rollback target is now current
             target_state_id: uuidv4(),
             reason: `Rolled back to ${snapshot_id}`,
             timestamp: this.temporal.getCurrentTick(),
             confidence: 100,
             changes: {}
        });
        
        return true;
    }
}
