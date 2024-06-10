import {Elysia} from 'elysia';
import {publishExpectResponse, type Event} from 'workflow';
import {type PingResponse} from '../Types';

export const Api = new Elysia().get('/ping', async () => {
  return await publishExpectResponse<undefined, Event<PingResponse>>('ping');
});
