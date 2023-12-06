const cleanUpAuthToken = (token: string) => {
  return token.split('&')[1].slice(5);
};

export const testAuthGetter = async (authTok) => {
  try {
    const response = await axios.post(
      `https://www.strava.com/api/v3/oauth/token?client_id=${REACT_APP_CLIENT_ID}&client_secret=${REACT_APP_CLIENT_SECRET}&code=${authTok}&grant_type=authorization_code`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
