import {createSelector} from 'reselect';
import mapSelector from './mapSelector';

export default createSelector(mapSelector, map => map.loading);
