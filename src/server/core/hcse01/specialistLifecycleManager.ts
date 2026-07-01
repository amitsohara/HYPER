import { ISpecialist } from "./types.js";

export class SpecialistLifecycleManager {
    public async initialize(specialist: ISpecialist): Promise<void> {
        await specialist.initialize();
    }

    public async activate(specialist: ISpecialist): Promise<void> {
        await specialist.activate();
    }

    public async suspend(specialist: ISpecialist): Promise<void> {
        await specialist.suspend();
    }

    public async resume(specialist: ISpecialist): Promise<void> {
        await specialist.resume();
    }

    public async retire(specialist: ISpecialist): Promise<void> {
        await specialist.retire();
    }

    public async recover(specialist: ISpecialist): Promise<void> {
        await specialist.recover();
    }
}
