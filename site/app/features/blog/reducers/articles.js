import {stateReducer} from 'truefit-react-utils';
import {Record, Map} from 'immutable';

import {ARTICLE_LOADING, ARTICLE_LOADED} from '../actions';

const Articles = Record({
  loading: true,
  articles: Map(),
});

export default stateReducer(Articles(), {
  [ARTICLE_LOADING]: state => state.set('loading', true),
  [ARTICLE_LOADED]: (state, payload) =>
    state.withMutations(map => {
      map.set('loading', false);
      map.setIn(['articles', payload.id], payload.content);
    }),
});
