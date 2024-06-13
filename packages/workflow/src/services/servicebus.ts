import {consume} from './consume';
import {type BusService} from '../Types';
import {match} from 'ts-pattern';

export class ServiceBus {
  protected services: BusService<any, any>[];
  protected stopConsumers?: (() => void | Promise<void>)[];

  constructor() {
    this.services = [];
  }

  use<T, R extends {} | void>(
    item: BusService<T, R> | BusService<T, R>[] | ServiceBus | ServiceBus[],
  ) {
    match(item)
      .when(
        (item) => item instanceof Array,
        (x) => (x as Array<BusService<T, R> | ServiceBus>).forEach((y) => this.use(y)),
      )
      .when(
        (item) => item instanceof ServiceBus,
        (x) => this.use((x as ServiceBus).services),
      )
      .otherwise((item) => this.services.push(item as BusService<any, any>));

    return this;
  }

  start() {
    this.stopConsumers = this.services.map((service) => {
      return consume(service.key, service.execute);
    });

    return this;
  }

  async stop() {
    if (!this.stopConsumers) {
      return;
    }

    await Promise.all(this.stopConsumers.map((stop) => stop()));
  }
}
