import {get} from 'truefit-react-utils';
import {urlForTitle} from '../services';

export const BLOG_MAP_LOADING = 'BLOG_MAP_LOADING';
export const BLOG_MAP_LOADED = 'BLOG_MAP_LOADED';

const load = async () => {
  const results = await get('blog/map');
  return {
    type: BLOG_MAP_LOADED,
    payload: results.data.map(x => ({
      ...x,
      link: urlForTitle(x.title, true),
    })),
  };
};

export const loadMap = () => dispatch => {
  dispatch({
    type: BLOG_MAP_LOADING,
  });

  dispatch(load());
};
