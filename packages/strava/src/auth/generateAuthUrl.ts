export default function generateAuthUrl(redirect: string) {
  return `http://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirect}&approval_prompt=force&scope=read,activity:read`;
}
