import type {Gru} from './Types';
import {startGru} from './gru';

export async function startMinions(gru: Gru) {
  const stopMinions = await startGru(gru);

  return () => {
    stopMinions();
  };
}

export * from './Types';
