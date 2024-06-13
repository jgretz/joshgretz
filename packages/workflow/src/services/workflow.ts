import {publishAndWaitForResponse} from './publish';
import {match} from 'ts-pattern';
import {error, success} from './utility/busResponse';
import type {BusResponse, BusService} from '../Types';

type CodeStep = (payload?: any) => any | Promise<any>;
type BusStep = string;

type Step = BusStep | CodeStep;

async function executeBusStep(key: string, payload: any) {
  return await publishAndWaitForResponse(key, payload);
}

async function executeCodeStep(fn: CodeStep, payload: any) {
  const result = await fn(payload);
  return success(result);
}

async function execute(step: Step, payload: any) {
  try {
    return await match(step)
      .returnType<Promise<BusResponse<any>>>()
      .when(
        (step) => step instanceof Function,
        (fn) => executeCodeStep(fn as CodeStep, payload),
      )
      .otherwise((key) => executeBusStep(key as string, payload));
  } catch (err) {
    return error(err);
  }
}

export class Workflow<T, R extends {} | void> implements BusService<T, R> {
  private steps: Step[];

  public key: string;

  constructor(key: string) {
    this.key = key;
    this.steps = [];
  }

  use(step: Step | Step[] | Workflow<any, any> | Workflow<any, any>[]) {
    match(step)
      .when(
        (step) => step instanceof Array,
        (x) => (x as Array<Step | Workflow<any, any>>).forEach((step) => this.use(step)),
      )
      .when(
        (step) => step instanceof Workflow,
        (x) => this.use((x as Workflow<any, any>).steps),
      )
      .when(
        (step) => step instanceof Function,
        (x) => {
          this.steps.push(x as CodeStep);
        },
      )
      .otherwise((step) => {
        this.steps.push(step as BusStep);
      });

    return this;
  }

  async execute(payload?: T) {
    let payloadAcc = {...payload};
    for await (const step of this.steps) {
      const response = await execute(step, payloadAcc);
      if (!response.success) {
        break;
      }

      const {result} = response;
      if (result !== null && typeof result === 'object') {
        payloadAcc = {
          ...payloadAcc,
          ...(result as object),
        };
      }
    }

    return payloadAcc as R;
  }
}
