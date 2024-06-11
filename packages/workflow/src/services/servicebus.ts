import {consume} from './consume';
import {type Service} from '../Types';
import {publish} from './publish';

export class ServiceBus {
  private services: Service[];
  private stopConsumers?: (() => Promise<void> | void)[];

  constructor() {
    this.services = [];
  }

  use(service: Service | ServiceBus) {
    const services = service instanceof ServiceBus ? service.services : [service];
    this.services.push(...services);

    return this;
  }

  start() {
    this.stopConsumers = this.services.map((service) => {
      return consume(service.key, async (payload) => {
        const events = await service.executeCommand(payload);

        for await (const event of Array.isArray(events) ? events : [events]) {
          await publish(event.key, event.payload);
        }

        return events;
      });
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
