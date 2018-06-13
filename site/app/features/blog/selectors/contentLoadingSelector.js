import {createSelector} from 'reselect';
import articlesSelector from './articlesSelector';

export default createSelector(articlesSelector, articles => articles.loading);
