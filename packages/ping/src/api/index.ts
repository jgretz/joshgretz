import {Elysia} from 'elysia';
import {publishExpectResponse, type Event} from 'workflow';
import {PingCommands, type PingResponse} from '../Types';

export const Api = new Elysia().get('/ping', async ({error}) => {
  const response = await publishExpectResponse<undefined, Event<PingResponse>>(PingCommands.Ping);

  if (response.success) {
    return response.result?.payload;
  }

  return error(500, response.error);
});
