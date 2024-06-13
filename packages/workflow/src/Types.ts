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

export interface HookBeforeResult {
  eject?: boolean;
  payload?: any;
}

export interface HookAfterResult {
  result?: any;
}

export interface OrchestratorHook {
  key: string;

  beforeExecute: (
    payload: any,
  ) => HookBeforeResult | Promise<HookBeforeResult> | void | Promise<void>;
  afterExecute: (result: any) => HookAfterResult | Promise<HookAfterResult> | void | Promise<void>;
}
