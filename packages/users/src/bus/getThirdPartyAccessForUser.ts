import type {BusService} from 'workflow';
import {UsersMessages, type ThirdPartyAccess, type User} from '../Types';
import {thirdPartyAccessForUser} from '../query/thirdPartyAccessForUser';

interface ThirdPartyAccessForUserArgs {
  user_id: number;
}

export interface ThirdPartyAccessForUserResponse {
  access?: ThirdPartyAccess;
}

async function execute({user_id}: ThirdPartyAccessForUserArgs) {
  const access = await thirdPartyAccessForUser({id: user_id} as User);

  return {
    access,
  };
}

export const GetThirdPartyAccessForUser: BusService<
  ThirdPartyAccessForUserArgs,
  ThirdPartyAccessForUserResponse
> = {
  key: UsersMessages.ThirdPartyAccessForUser,

  execute,
};
