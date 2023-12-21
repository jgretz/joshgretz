const API_ROOT = process.env.API_URL;

export const API_URLS = {
  FindUserByEmail: `${API_ROOT}/users?`,
  UpdateStravaAccessDetails: `${API_ROOT}/strava/access`,
};
