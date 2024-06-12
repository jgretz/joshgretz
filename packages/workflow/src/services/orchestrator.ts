import type {Workflow} from './workflow';
import {consume} from './consume';
import {match} from 'ts-pattern';

export class Orchestrator {
  private workflows: Workflow[];
  private stopWorkflows?: (() => void)[];

  constructor() {
    this.workflows = [];
  }

  use(workflow: Workflow | Workflow[] | Orchestrator | Orchestrator[]) {
    match(workflow)
      .when(
        (w) => Array.isArray(w),
        (w) => (w as Array<Workflow | Orchestrator>).forEach((x) => this.use(x)),
      )
      .when(
        (w) => w instanceof Orchestrator,
        (w) => this.use((w as Orchestrator).workflows),
      )
      .otherwise((w) => this.workflows.push(w as Workflow));

    return this;
  }

  start() {
    this.stopWorkflows = this.workflows.map((workflow) => {
      return consume(workflow.key, async (payload) => await workflow.execute(payload));
    });

    return this;
  }

  async stop() {
    if (!this.stopWorkflows) {
      return;
    }

    await Promise.all(this.stopWorkflows.map((stop) => stop()));

    return this;
  }
}
