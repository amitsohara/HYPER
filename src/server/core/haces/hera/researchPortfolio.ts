import { ResearchInitiative, ResearchStatus } from "./researchTypes.js";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.js";

export class ResearchPortfolio {
    private initiatives: Map<string, ResearchInitiative> = new Map();
    private eventBus = ResearchEventBus.getInstance();

    public addInitiative(initiative: ResearchInitiative): void {
        this.initiatives.set(initiative.initiative_id, initiative);
        this.eventBus.publish(ResearchEvents.RESEARCH_INITIATIVE_CREATED, { initiative });
    }

    public getInitiative(id: string): ResearchInitiative | undefined {
        return this.initiatives.get(id);
    }

    public updateInitiativeStatus(id: string, status: ResearchStatus): void {
        const initiative = this.initiatives.get(id);
        if (initiative) {
            initiative.status = status;
            initiative.updated_at = Date.now();
            if (status === ResearchStatus.COMPLETED) {
                this.eventBus.publish(ResearchEvents.RESEARCH_COMPLETED, { initiative });
            } else if (status === ResearchStatus.ARCHIVED) {
                this.eventBus.publish(ResearchEvents.RESEARCH_ARCHIVED, { initiative });
            }
        }
    }

    public getAllInitiatives(): ResearchInitiative[] {
        return Array.from(this.initiatives.values());
    }

    public getActiveInitiatives(): ResearchInitiative[] {
        return this.getAllInitiatives().filter(i => i.status === ResearchStatus.ACTIVE);
    }
}
