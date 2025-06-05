import _ from 'lodash';
import {setActiveArticleId} from './setActiveArticleId';

export const rotateArticle = (current, map, offset, history) => {
  const index = _.findIndex(map, x => x.id === current.id);

  let nextIndex = index + offset;
  if (nextIndex < 0) {
    nextIndex = map.length - 1;
  } else if (nextIndex >= map.length) {
    nextIndex = 0;
  }

  const next = map[nextIndex];

  history.push(next.link);
  return setActiveArticleId(next.id);
};
