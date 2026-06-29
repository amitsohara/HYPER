import { RoadmapItem, ResearchHorizon } from "./researchTypes.js";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.js";

export class ResearchRoadmap {
    private items: Map<string, RoadmapItem> = new Map();
    private eventBus = ResearchEventBus.getInstance();

    public addItem(item: RoadmapItem): void {
        this.items.set(item.item_id, item);
    }

    public getItemsByHorizon(horizon: ResearchHorizon): RoadmapItem[] {
        return Array.from(this.items.values()).filter(item => item.horizon === horizon);
    }

    public publishRoadmap(): void {
        this.eventBus.publish(ResearchEvents.ROADMAP_PUBLISHED, { roadmap: this.getAllItems() });
    }

    public getAllItems(): RoadmapItem[] {
        return Array.from(this.items.values());
    }
}
