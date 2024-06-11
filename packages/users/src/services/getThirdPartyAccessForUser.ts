import type {Service} from 'workflow';
import {
  UsersCommands,
  UsersEvents,
  type ThirdPartyAccessForUserRequest,
  type ThirdPartyAccessForUserResponse,
  type User,
} from '../Types';
import type {Event} from 'workflow';
import {thirdPartyAccessForUser} from '../query/thirdPartyAccessForUser';

async function executeCommand({
  user_id,
}: ThirdPartyAccessForUserRequest): Promise<Event<ThirdPartyAccessForUserResponse>> {
  const access = await thirdPartyAccessForUser({id: user_id} as User);

  return {
    key: UsersEvents.ThirdPartyAccessForUserResponse,

    payload: {
      access,
    },
  };
}

export const GetThirdPartyAccessForUser: Service = {
  key: UsersCommands.ThirdPartyAccessForUser,

  executeCommand,
};
