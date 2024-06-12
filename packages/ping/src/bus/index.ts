import {ServiceBus} from 'workflow';
import {Ping} from './ping';

export const Bus = new ServiceBus().use(Ping);
