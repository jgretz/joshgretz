import {consume} from './consume';
import {type Service} from '../Types';
import {publish} from './publish';

export async function startServiceBus(services: Service[]) {
  const stopConsumers = services.map((service) => {
    return consume(service.key, async (payload) => {
      const events = await service.executeCommand(payload);

      (Array.isArray(events) ? events : [events]).forEach((event) => {
        publish(event.key, event.payload);
      });

      return events;
    });
  });

  return async () => {
    await Promise.all(stopConsumers.map((consumer) => consumer()));
  };
}
