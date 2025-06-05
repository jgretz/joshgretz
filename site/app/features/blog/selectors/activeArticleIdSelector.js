import {createSelector} from 'reselect';
import navigationSelector from './navigationSelector';

export default createSelector(
  navigationSelector,
  navigation => navigation.activeArticleId,
);
