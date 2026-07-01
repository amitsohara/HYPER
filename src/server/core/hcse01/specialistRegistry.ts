import { SpecialistRegistration, SpecialistStatus, ISpecialist } from "./types.js";

export class SpecialistRegistry {
    private specialists: Map<string, ISpecialist> = new Map();

    public register(specialist: ISpecialist): void {
        const identity = specialist.getIdentity();
        if (this.specialists.has(identity.id)) {
            throw new Error(`Specialist with ID ${identity.id} is already registered.`);
        }
        this.specialists.set(identity.id, specialist);
    }

    public remove(id: string): void {
        this.specialists.delete(id);
    }

    public get(id: string): ISpecialist | undefined {
        return this.specialists.get(id);
    }

    public getAll(): ISpecialist[] {
        return Array.from(this.specialists.values());
    }

    public getRegistrations(): SpecialistRegistration[] {
        return this.getAll().map(s => s.getIdentity());
    }

    public getActiveSpecialists(): ISpecialist[] {
        return this.getAll().filter(s => s.getIdentity().status === SpecialistStatus.ACTIVE);
    }
}
