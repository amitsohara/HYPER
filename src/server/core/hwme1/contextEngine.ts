import { CanonicalWorld } from "./types.js";

export class ContextEngine {
    constructor(private canonicalWorld: CanonicalWorld) {}

    public updateContext(key: string, value: any): void {
        this.canonicalWorld.context[key] = value;
    }

    public getContext(key: string): any {
        return this.canonicalWorld.context[key];
    }

    public clearSessionContext(): void {
        this.canonicalWorld.context = {};
    }
}
