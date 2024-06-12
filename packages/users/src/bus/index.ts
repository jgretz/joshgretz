import {ServiceBus} from 'workflow';
import {GetThirdPartyAccessForUser} from './getThirdPartyAccessForUser';

export const Bus = new ServiceBus().use(GetThirdPartyAccessForUser);
