function getEnv() {
  if (typeof process === 'undefined') {
    return window.ENV;
  }

  return process.env;
}

const API_ROOT = getEnv().API_URL;

export const API_URLS = {
  FindUserByEmail: `${API_ROOT}/users?`,
  UpdateStravaAccessDetails: `${API_ROOT}/running/strava/access`,
  ImportStravaActivities: `${API_ROOT}/running/strava/import_activities`,
};
