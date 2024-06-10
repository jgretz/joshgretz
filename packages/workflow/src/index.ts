import {GetContainer} from 'injectx';
import type {WorkflowConfig} from './Types';

export * from './Types';

export * from './services/publish';
export * from './services/consume';
export * from './services/servicebus';
export * from './services/orchestrator';

export function setupWorkflowContainer({amqpUrl, exchange}: WorkflowConfig) {
  GetContainer().Bind(amqpUrl, {name: 'amqpUrl'});
  GetContainer().Bind(exchange, {name: 'exchange'});
}
