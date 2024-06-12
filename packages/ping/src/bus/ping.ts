import type {BusService} from 'workflow';
import {PingMessages, type PingResponse} from '../Types';

function execute() {
  return {
    alive: true,
    timestamp: Date.now(),
  };
}

export const Ping: BusService<void, PingResponse> = {
  key: PingMessages.Ping,

  execute,
};
