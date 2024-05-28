import type {Task, TaskContainer} from './Types';
import {InjectIn} from 'injectx';

function gru({amqp}: TaskContainer) {
  return async function (tasks: Task[]) {
    console.log('[✅] Gru is starting to orchestrate minions ...');

    const stopMinions = await Promise.all(
      tasks.map((task) => {
        console.log(
          `[✅] Gru has instructed the minion to watch ${task.queue}:${task.message} ...`,
        );
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
  };
}

export default InjectIn(gru);
