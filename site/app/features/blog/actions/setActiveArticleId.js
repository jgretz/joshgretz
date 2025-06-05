export const ACTIVE_ARTICLE_ID_SET = 'ACTIVE_ARTICLE_ID_SET';

export const setActiveArticleId = activeArticleId => ({
  type: ACTIVE_ARTICLE_ID_SET,
  payload: activeArticleId,
});
