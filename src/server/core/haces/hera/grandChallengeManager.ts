import { GrandChallenge } from "./researchTypes.js";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.js";

export class GrandChallengeManager {
    private challenges: Map<string, GrandChallenge> = new Map();
    private eventBus = ResearchEventBus.getInstance();

    public addChallenge(challenge: GrandChallenge): void {
        this.challenges.set(challenge.challenge_id, challenge);
        this.eventBus.publish(ResearchEvents.GRAND_CHALLENGE_UPDATED, { challenge });
    }

    public updateProgress(id: string, progress: number): void {
        const challenge = this.challenges.get(id);
        if (challenge) {
            challenge.current_progress = progress;
            this.eventBus.publish(ResearchEvents.GRAND_CHALLENGE_UPDATED, { challenge });
        }
    }

    public getActiveChallenges(): GrandChallenge[] {
        return Array.from(this.challenges.values()).filter(c => c.active);
    }
}
