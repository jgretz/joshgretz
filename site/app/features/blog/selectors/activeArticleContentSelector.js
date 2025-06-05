import {createSelector} from 'reselect';
import articlesSelector from './articlesSelector';
import activeArticleIdSelector from './activeArticleIdSelector';

export default createSelector(
  articlesSelector,
  activeArticleIdSelector,
  (articles, articleId) => articles.articles.get(articleId),
);
