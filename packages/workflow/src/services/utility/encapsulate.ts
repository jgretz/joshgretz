import {FRAME_MAX} from '../../constants';

export function encapsulate<T>(obj: T): string {
  const json = JSON.stringify(obj || {});

  if (json.length > FRAME_MAX) {
    throw new Error('Object too large to send as rabbit message body');
  }

  return json;
}
