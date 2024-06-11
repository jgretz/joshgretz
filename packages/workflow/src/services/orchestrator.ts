import type {Workflow} from './workflow';
import {consume} from './consume';

export class Orchestrator {
  private workflows: Workflow[];
  private stopWorkflows?: (() => void)[];

  constructor() {
    this.workflows = [];
  }

  use(workflow: Workflow | Workflow[] | Orchestrator | Orchestrator[]) {
    if (Array.isArray(workflow)) {
      workflow.forEach((w) => this.use(w));
    } else if (workflow instanceof Orchestrator) {
      this.use(workflow.workflows);
    } else {
      this.workflows.push(workflow);
    }

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
