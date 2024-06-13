import {match} from 'ts-pattern';
import {ServiceBus} from './servicebus';
import type {BusService, OrchestratorHook} from '../Types';

export class Orchestrator extends ServiceBus {
  protected hooks: {[key: string]: OrchestratorHook[]};

  constructor() {
    super();

    this.hooks = {};
  }

  useHook(hook: OrchestratorHook | OrchestratorHook[]) {
    match(hook)
      .when(
        (hook) => hook instanceof Array,
        (x) => (x as Array<OrchestratorHook>).forEach((y) => this.useHook(y)),
      )
      .otherwise((hook) => {
        const key = (hook as OrchestratorHook).key;
        if (!this.hooks[key]) {
          this.hooks[key] = [];
        }

        this.hooks[key].push(hook as OrchestratorHook);
      });

    return this;
  }

  override use<T, R extends void | {}>(
    item: BusService<T, R> | BusService<T, R>[] | ServiceBus | ServiceBus[],
  ): this {
    match(item)
      .when(
        (item) => item instanceof Array,
        (x) => super.use(x),
      )
      .when(
        (item) => item instanceof ServiceBus,
        (x) => super.use(x),
      )
      .otherwise((item) => {
        const wrappedService = {
          key: (item as BusService<T, R>).key,
          execute: this.wrapServiceExecute(item as BusService<T, R>),
        };

        super.use(wrappedService);
      });

    return this;
  }

  private wrapServiceExecute<T, R extends void | {}>(service: BusService<T, R>) {
    return async (payload: T) => {
      const beforeHookResult = await this.executeBeforeHooks(service.key, payload);
      if (beforeHookResult.eject) {
        return;
      }

      const result = await service.execute(beforeHookResult.payload);
      const finalResult = await this.executeAfterHooks(service.key, result);

      return finalResult;
    };
  }

  private async executeBeforeHooks(key: string, payload: any) {
    const hooks = this.hooks[key] || [];

    // before hooks
    let payloadToUse = payload;
    for await (const hook of hooks) {
      const beforeHookResult = await hook.beforeExecute(payloadToUse);
      if (beforeHookResult?.eject) {
        return {
          eject: true,
        };
      }

      payloadToUse = beforeHookResult?.payload || payloadToUse;
    }

    return {
      payload: payloadToUse,
    };
  }

  private async executeAfterHooks(key: string, result: any) {
    const hooks = this.hooks[key] || [];

    for await (const hook of hooks) {
      const afterHookResult = await hook.afterExecute(result);
      result = afterHookResult?.result || result;
    }

    return result;
  }
}
