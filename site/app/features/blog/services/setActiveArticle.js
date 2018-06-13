import _ from 'lodash';

export default (setActiveArticleId, articleMap) => {
  const set = article => {
    setActiveArticleId(article.id);
  };

  // try to match on location specified
  if (location.pathname.length > 1) {
    const match = _.find(
      articleMap,
      a => location.pathname.toLowerCase() === a.link.toLowerCase(),
    );
    if (match) {
      set(match);
      return;
    }
  }

  // load newest entry
  set(articleMap[0]);
};
