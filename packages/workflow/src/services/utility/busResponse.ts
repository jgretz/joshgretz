import type {BusResponse} from '../../Types';

export function success<T extends {} | void>(result?: T) {
  return {
    success: true,
    result,
  } as BusResponse<T>;
}

export function error(error: unknown) {
  return {
    success: false,
    error,
  } as BusResponse<never>;
}
