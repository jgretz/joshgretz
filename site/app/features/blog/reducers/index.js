/* eslint-disable sort-imports */
import {combineReducers} from 'redux';
import articles from './articles.js';
import map from './map.js';
import navigation from './navigation.js';

export default combineReducers({
  articles,
  map,
  navigation,
});
