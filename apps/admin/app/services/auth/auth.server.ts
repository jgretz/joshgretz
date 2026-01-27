import {Authenticator, AuthorizationError} from 'remix-auth';
import {GoogleStrategy} from 'remix-auth-google';
import type {User} from 'users';
import findUserByEmail from '../joshgretz-api/users/findUserByEmail';
import {sessionStorage} from '../session/session.server';

const googleAuth = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: `${process.env.GOOGLE_CLIENT_CALLBACK_ROOT}/auth/callback`,
};

const googleStrategy = new GoogleStrategy(googleAuth, async ({profile}) => {
  const email = profile.emails[0].value;
  const user = await findUserByEmail(email);

  if (user?.admin) {
    return user;
  }

  throw new AuthorizationError(`Email ${email} is not an admin`);
});

export const authenticator = new Authenticator<User>(sessionStorage);
authenticator.use(googleStrategy);
