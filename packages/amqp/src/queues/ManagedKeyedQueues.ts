import {ManagedQueue, type ManagedQueueArgs} from './ManagedQueue';

export class ManagedKeyedQueues<T> {
  private map: {[key: string]: ManagedQueue<T>} = {};

  constructor() {}

  async push(args: ManagedQueueArgs, key: string, fn: () => T) {
    if (!this.map[key]) {
      this.map[key] = new ManagedQueue(args);
    }

    await this.map[key].push(fn);
  }

  async pop(key: string) {
    if (!this.map[key]) {
      return undefined;
    }

    return await this.map[key].pop();
  }
}
