export class ClockManager {
    private real_time_start: number = Date.now();
    private mission_time: number = 0;
    private paused: boolean = false;
    private acceleration_factor: number = 1.0;
    private last_tick: number = Date.now();

    tick() {
        if (this.paused) return;
        const now = Date.now();
        const delta = now - this.last_tick;
        this.mission_time += delta * this.acceleration_factor;
        this.last_tick = now;
    }

    getMissionTime(): number {
        this.tick();
        return this.mission_time;
    }
    
    getRealTime(): number {
        return Date.now();
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.last_tick = Date.now();
        this.paused = false;
    }

    setAcceleration(factor: number) {
        this.acceleration_factor = factor;
    }
}
