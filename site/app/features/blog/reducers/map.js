import {stateReducer} from 'truefit-react-utils';
import {Record} from 'immutable';

import {BLOG_MAP_LOADING, BLOG_MAP_LOADED} from '../actions';

const BlogMap = Record({
  loading: true,
  articles: [],
});

export default stateReducer(BlogMap(), {
  [BLOG_MAP_LOADING]: state => state.set('loading', true),

  [BLOG_MAP_LOADED]: (state, payload) =>
    state.withMutations(map => {
      map.set('loading', false);
      map.set('articles', payload);
    }),
});
