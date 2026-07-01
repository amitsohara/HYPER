import { AttentionFocusMode } from "./types.js";

export class FocusController {
    private currentMode: AttentionFocusMode = AttentionFocusMode.EXPLORATORY;

    public setMode(mode: AttentionFocusMode): void {
        this.currentMode = mode;
    }

    public getMode(): AttentionFocusMode {
        return this.currentMode;
    }

    public interrupt(priority: number): boolean {
        if (this.currentMode === AttentionFocusMode.FOCUSED && priority < 80) {
            return false; // Cannot interrupt highly focused tasks unless high priority
        }
        this.setMode(AttentionFocusMode.RECOVERY);
        return true;
    }

    public resume(): void {
        if (this.currentMode === AttentionFocusMode.RECOVERY) {
            this.setMode(AttentionFocusMode.SUSTAINED);
        }
    }
}
