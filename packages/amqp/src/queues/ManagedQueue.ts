export interface ManagedQueueArgs {
  onStart: () => void | Promise<void>;
  onEmpty: () => void | Promise<void>;
}

export class ManagedQueue<T> {
  private queue: T[] = [];

  constructor(
    private args: ManagedQueueArgs = {
      onStart: () => {},
      onEmpty: () => {},
    },
  ) {}

  async push(fn: () => T | Promise<T>) {
    if (this.queue.length === 0) {
      await this.args.onStart();
    }

    const item = await fn();
    this.queue.push(item);
  }

  async pop() {
    if (this.queue.length === 0) {
      return undefined;
    }

    const item = this.queue.pop();

    if (this.queue.length === 0) {
      await this.args.onEmpty();
    }

    return item;
  }

  length() {
    return this.queue.length;
  }
}
