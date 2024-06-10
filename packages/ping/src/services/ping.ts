import type {Service} from 'workflow';
import type {PingResponse} from '../Types';
import type {Event} from 'workflow';

function executeCommand(): Event<PingResponse> {
  return {
    key: 'ping_response',

    payload: {
      alive: true,
      timestamp: Date.now(),
    },
  };
}

export const Ping: Service = {
  key: 'ping',

  executeCommand,
};
