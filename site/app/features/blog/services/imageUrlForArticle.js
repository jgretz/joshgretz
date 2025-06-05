const BASE_URL = process.env.API_BASE_URL;

export default info => `${BASE_URL}blog/images?name=${info.image}`;
