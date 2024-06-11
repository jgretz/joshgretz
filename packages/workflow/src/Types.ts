export interface WorkflowConfig {
  amqpUrl: string;
  exchange: string;
}

export interface WorkflowContainer {
  amqpUrl: string;
  exchange: string;
}

export interface Event<T = any> {
  key: string;
  payload?: T;
}

export interface Service {
  key: string;

  executeCommand: (payload: any) => Event | Event[] | Promise<Event> | Promise<Event[]>;
}

export interface Response<R> {
  success: boolean;
  result?: R;
  error?: unknown;
}
