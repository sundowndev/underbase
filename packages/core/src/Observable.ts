export default class Observable {
    private events: any;

    constructor() {
        this.events = {};
    }

    public on(e: string, f: any): void {
        if (!this.events[e]) {
            this.events[e] = [];
        }

        this.events[e].push(f);
    }

    public async emit(e: string, data: any = null): Promise<void> {
        if (!this.events[e]) {
            this.events[e] = [];
        }

        for (const observer of this.events[e]) {
            await observer(data);
        }
    }
}
