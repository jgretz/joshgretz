export interface WorkflowConfig {
  amqpUrl: string;
  exchange: string;
}

export interface WorkflowContainer {
  amqpUrl: string;
  exchange: string;
}

export interface BusService<T, R extends object | void> {
  key: string;

  execute: (payload: T) => R | Promise<R>;
}

export interface BusResponse<R extends object | void> {
  success: boolean;
  result?: R;
  error?: unknown;
}
