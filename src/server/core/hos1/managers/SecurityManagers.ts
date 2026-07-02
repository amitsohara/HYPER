import { AuditRecord } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class AuditManager {
    private logs: AuditRecord[] = [];

    record(action: string, actor: string, target: string, status: "SUCCESS" | "DENIED" | "FAILED") {
        this.logs.push({
            id: `aud-${uuidv4()}`,
            action,
            actor,
            target,
            status,
            timestamp: Date.now()
        });
    }

    getLogs() {
        return this.logs;
    }
}

export class PermissionManager {
    private roles: Map<string, string[]> = new Map(); // role -> permissions

    constructor(private audit: AuditManager) {
        this.roles.set("ADMIN", ["*"]);
        this.roles.set("PLUGIN", ["WORLD_MODEL_READ", "SIMULATION_RUN"]);
    }

    check(role: string, permission: string, actor: string, target: string): boolean {
        const perms = this.roles.get(role) || [];
        const allowed = perms.includes("*") || perms.includes(permission);
        
        this.audit.record(permission, actor, target, allowed ? "SUCCESS" : "DENIED");
        
        return allowed;
    }
}

export class SecurityManager {
    public audit = new AuditManager();
    public permissions = new PermissionManager(this.audit);
}
