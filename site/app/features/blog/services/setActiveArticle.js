import _ from 'lodash';

export default (setActiveArticleId, articleMap) => {
  const set = article => {
    setActiveArticleId(article);
  };

  // load newest entry
  const newest = _.first(_.sortBy(articleMap, x => x.order));
  set(newest.id);
};
