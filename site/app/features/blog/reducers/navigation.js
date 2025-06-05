import {stateReducer} from 'truefit-react-utils';
import {Record} from 'immutable';

import {ACTIVE_ARTICLE_ID_SET} from '../actions';

const Navigation = Record({
  activeArticleId: null,
});

export default stateReducer(Navigation(), {
  [ACTIVE_ARTICLE_ID_SET]: (state, payload) =>
    state.set('activeArticleId', payload),
});
