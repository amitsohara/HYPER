import { MechanismModel } from "./mechanism_model.js";
import { MechanismValidator } from "./mechanism_validator.js";

export class MechanismLibrary {
    private mechanisms: Map<string, MechanismModel> = new Map();

    register(model: MechanismModel): boolean {
        const val = MechanismValidator.validate(model);
        if (val.valid) {
            this.mechanisms.set(model.mechanism_id, model);
            return true;
        }
        return false;
    }

    get(id: string): MechanismModel | undefined {
        return this.mechanisms.get(id);
    }
    
    getAll(): MechanismModel[] {
        return Array.from(this.mechanisms.values());
    }
}
