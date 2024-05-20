import Elysia from 'elysia';
import Activities from './activities';

export const Api = new Elysia({prefix: '/running'}).use(Activities);
