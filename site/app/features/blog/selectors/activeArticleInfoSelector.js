import _ from 'lodash';
import {createSelector} from 'reselect';
import articleMapSelector from './articleMapSelector';
import activeArticleIdSelector from './activeArticleIdSelector';

export default createSelector(
  articleMapSelector,
  activeArticleIdSelector,
  (articleMap, articleId) => _.find(articleMap, x => x.id === articleId),
);
