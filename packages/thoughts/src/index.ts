import {GetContainer} from 'injectx';
import type {ThoughtsConfig} from './Types';
import {createDatabase} from 'database';

export * from './Types';
export {findAllThoughts} from './query/findAllThoughts';
export {findPublishedThoughts} from './query/findPublishedThoughts';
export {findThoughtBySlug} from './query/findThoughtBySlug';
export {findThoughtById} from './query/findThoughtById';
export {createThought} from './command/createThought';
export {updateThought} from './command/updateThought';
export {deleteThought} from './command/deleteThought';

export const setupThoughtsContainer = ({databaseUrl}: ThoughtsConfig) => {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
};
