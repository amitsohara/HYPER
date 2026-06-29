import { StateSnapshot } from "./state_snapshot.js";
import { StateEvent } from "./state_event.js";
import { StateTransition } from "./state_transition.js";

export class StateHistory {
    snapshots: StateSnapshot[] = [];
    events: StateEvent[] = [];
    transitions: StateTransition[] = [];

    recordSnapshot(snapshot: StateSnapshot) {
        this.snapshots.push(snapshot);
    }

    recordEvent(event: StateEvent) {
        this.events.push(event);
    }

    recordTransition(transition: StateTransition) {
        this.transitions.push(transition);
    }
    
    getTimeline() {
        // Combine events, transitions, snapshots into a single chronological timeline
        const all = [
            ...this.snapshots.map(s => ({ type: 'SNAPSHOT', time: s.timestamp, data: s })),
            ...this.events.map(e => ({ type: 'EVENT', time: e.timestamp, data: e })),
            ...this.transitions.map(t => ({ type: 'TRANSITION', time: t.timestamp, data: t }))
        ];
        return all.sort((a, b) => a.time - b.time);
    }
}
