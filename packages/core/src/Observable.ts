interface IEvents {
  [key: string]: any[];
}

export default class Observable {
  private events: IEvents;

  constructor() {
    this.events = {};
  }

  public on(e: string, f: any): void {
    if (!this.events[e]) {
      this.events[e] = [];
    }

    this.events[e].push(f);
  }

  public async emit(e: string, data?: any): Promise<void> {
    if (!this.events[e]) {
      this.events[e] = [];
    }

    for (const observer of this.events[e]) {
      await observer(data);
    }
  }
}
