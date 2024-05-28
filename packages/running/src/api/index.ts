import Elysia from 'elysia';
import activities from './activities';

export const Api = new Elysia({prefix: '/running'}).use(activities);
