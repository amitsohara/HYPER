export class AttentionManager {
    private focus: string = "Initialize Mission";
    private ignore: string[] = [];

    setFocus(focus: string) {
        this.focus = focus;
    }

    addIgnore(ignore: string) {
        if (!this.ignore.includes(ignore)) {
            this.ignore.push(ignore);
        }
    }

    clearIgnore() {
        this.ignore = [];
    }

    getState() {
        return {
            focus: this.focus,
            ignore: this.ignore
        };
    }
}
