import {ServiceBus} from 'workflow';
import {LoadActivitiesForDateRange} from './loadActivitiesForDateRange';

export const Bus = new ServiceBus().use(LoadActivitiesForDateRange);
