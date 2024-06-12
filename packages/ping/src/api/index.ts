import {Elysia} from 'elysia';
import {publishAndWaitForResponse} from 'workflow';
import {PingMessages, type PingResponse} from '../Types';

export const Api = new Elysia().get('/ping', async ({error}) => {
  const response = await publishAndWaitForResponse<undefined, PingResponse>(PingMessages.Ping);
  if (response.success) {
    return response.result;
  }

  return error(500, response.error);
});
