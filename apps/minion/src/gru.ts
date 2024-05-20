import type {Amqp, Task} from 'utility';

export default async function (amqp: Amqp, tasks: Task[]) {
  console.log('[✅] Gru is starting to orchestrate minions ...');

  const stopMinions = await Promise.all(
    tasks.map((task) => {
      console.log(`[✅] Gru has instructed the minion to watch ${task.queue}:${task.message} ...`);
      return amqp.subscribe(task.queue, task.message, task.consume);
    }),
  );

  return () => {
    console.log('[❎] Gru is stopping the minions ...');
    stopMinions.forEach((stop) => {
      stop();
    });

    console.log('[❎] Gru has stopped ...');
  };
}
