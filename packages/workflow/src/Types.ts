export interface WorkflowConfig {
  amqpUrl: string;
  exchange: string;
}

export interface WorkflowContainer {
  amqpUrl: string;
  exchange: string;
}

export interface Command {
  key: string;
  payload: any;
}

export interface Event<T = any> {
  key: string;
  payload: T;
}

export interface Service {
  key: string;

  executeCommand: <T>(payload: T) => Event | Event[] | Promise<Event> | Promise<Event[]>;
}

export interface Workflow {
  name: string;
  commands: string[];
}
