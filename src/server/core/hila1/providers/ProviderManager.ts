import { IIntelligenceProvider } from "../interfaces/IIntelligenceProvider.js";
import { ProviderType } from "../types/index.js";

export class ProviderManager {
    private providers: Map<ProviderType, IIntelligenceProvider> = new Map();

    registerProvider(provider: IIntelligenceProvider) {
        this.providers.set(provider.type, provider);
    }

    async initializeAll() {
        for (const provider of this.providers.values()) {
            await provider.initialize();
        }
    }

    getProvider(type: ProviderType): IIntelligenceProvider | undefined {
        return this.providers.get(type);
    }

    getAvailableProviders(): ProviderType[] {
        return Array.from(this.providers.keys());
    }

    getHealthyProviders(): Promise<ProviderType[]> {
        return Promise.all(
            Array.from(this.providers.values()).map(async p => {
                if (await p.health()) return p.type;
                return null;
            })
        ).then(res => res.filter(r => r !== null) as ProviderType[]);
    }
}
