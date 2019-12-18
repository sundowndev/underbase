interface IEvents {
  [key: string]: Array<(...args: unknown[]) => Promise<unknown>>;
}

/**
 * @class Observable
 * @description This is a event listener class which uses a synchronous
 * emit method. It allows us to run actions in sequence.
 */
export default class Observable {
  private events: IEvents;

  /**
   * @memberof Observable
   * @constructor
   */
  constructor() {
    this.events = {};
  }

  /**
   * @memberof Observable
   *
   * @function on
   * @description Register an action on an event.
   * 
   * @param {string} e Event
   * @param {function} f Action callback
   * @returns {void}
   */
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
