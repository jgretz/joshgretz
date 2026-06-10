import {GetContainer} from 'injectx';
import type {FilesConfig} from './Types';
import {createDatabase} from 'database';

export * from './Types';
export {findAllFiles} from './query/findAllFiles';
export {findFileBySlug} from './query/findFileBySlug';
export {createFile} from './command/createFile';
export {updateFileSlug} from './command/updateFileSlug';
export {deleteFile} from './command/deleteFile';
export {deleteFilesOlderThan} from './command/deleteFilesOlderThan';

export const setupFilesContainer = ({databaseUrl}: FilesConfig) => {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
};
