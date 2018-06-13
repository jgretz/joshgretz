import {get} from 'truefit-react-utils';

export const ARTICLE_LOADING = 'ARTICLE_LOADING';
export const ARTICLE_LOADED = 'ARTICLE_LOADED';

const load = async (id, file) => {
  const results = await get(`blog/content?name=${file}`);

  return {
    type: ARTICLE_LOADED,
    payload: {
      id,
      content: results.data,
    },
  };
};

export const loadArticleContent = (id, file) => dispatch => {
  dispatch({
    type: ARTICLE_LOADING,
  });

  dispatch(load(id, file));
};
