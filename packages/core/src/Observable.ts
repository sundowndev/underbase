interface IEvents {
  [key: string]: Array<(...args: unknown[]) => Promise<unknown>>;
}

export default class Observable {
  private events: IEvents;

  constructor() {
    this.events = {};
  }

  public on(e: string, f: (...args: unknown[]) => Promise<unknown>): void {
    if (!this.events[e]) {
      this.events[e] = [];
    }

    this.events[e].push(f);
  }

  public async emit(e: string, data?: unknown): Promise<void> {
    if (!this.events[e]) {
      this.events[e] = [];
    }

    for (const observer of this.events[e]) {
      await observer(data);
    }
  }
}
