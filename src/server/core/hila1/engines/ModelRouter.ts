import { IntelligenceRequest, ProviderType } from "../types/index.js";
import { ProviderManager } from "../providers/ProviderManager.js";

export class ModelRouter {
    constructor(private providerManager: ProviderManager) {}

    async route(request: IntelligenceRequest): Promise<ProviderType> {
        return ProviderType.GEMINI;
    }
}
