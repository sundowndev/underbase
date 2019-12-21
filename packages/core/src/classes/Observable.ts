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
   * @param {string} event Event
   * @param {function} callback Action callback
   * @returns {void}
   */
  public on(event: string, callback: (...args: unknown[]) => Promise<unknown>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  public async emit(event: string, data?: unknown): Promise<void> {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    for (const observer of this.events[event]) {
      await observer(data);
    }
  }
}
