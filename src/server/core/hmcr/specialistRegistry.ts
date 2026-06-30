import { SpecialistType } from "./cognitiveTypes.js";

export interface ISpecialist {
    type: SpecialistType;
    process(input: any, blackboard: any): Promise<any>;
}

export class SpecialistRegistry {
    private specialists: Map<SpecialistType, ISpecialist> = new Map();

    public register(specialist: ISpecialist) {
        this.specialists.set(specialist.type, specialist);
    }

    public get(type: SpecialistType): ISpecialist | undefined {
        return this.specialists.get(type);
    }

    public getAll(): ISpecialist[] {
        return Array.from(this.specialists.values());
    }
}
