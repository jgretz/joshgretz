/* eslint-disable sort-imports */
/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import header from './features/header/reducers';

const rootReducer = combineReducers({
  features: combineReducers({
    header: header,
  }),
  router: routerReducer,
});

export default rootReducer;
