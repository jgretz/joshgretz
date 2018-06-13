/* eslint-disable sort-imports */
/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import header from './features/header/reducers';
import blog from './features/blog/reducers';

const rootReducer = combineReducers({
  features: combineReducers({
    header: header,
    blog: blog,
  }),
  router: routerReducer,
});

export default rootReducer;
