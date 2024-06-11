import type {Service} from 'workflow';
import {PingCommands, PingEvents, type PingResponse} from '../Types';
import type {Event} from 'workflow';

function executeCommand(): Event<PingResponse> {
  return {
    key: PingEvents.PingResponse,

    payload: {
      alive: true,
      timestamp: Date.now(),
    },
  };
}

export const Ping: Service = {
  key: PingCommands.Ping,

  executeCommand,
};
