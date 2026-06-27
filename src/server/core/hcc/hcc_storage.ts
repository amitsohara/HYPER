import { HyperMindCognitiveCore } from "./cognitive_core.js";

class HccStorage {
    private storage = new Map<string, any>();

    async saveCognitiveState(missionId: string, key: string, state: any) {
        if (!this.storage.has(missionId)) {
            this.storage.set(missionId, {});
        }
        const missionStorage = this.storage.get(missionId);
        missionStorage[key] = state;
    }

    async getCognitiveState(missionId: string, key: string) {
        const missionStorage = this.storage.get(missionId);
        return missionStorage ? missionStorage[key] : null;
    }
}

export const hccStorage = new HccStorage();
