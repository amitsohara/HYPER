export class ThinkingEvents {
    private listeners: Map<string, Function[]> = new Map();

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    emit(event: string, data: any) {
        const cbs = this.listeners.get(event);
        if (cbs) {
            cbs.forEach(cb => cb(data));
        }
    }
}
