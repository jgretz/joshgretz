import {cleanupOldFiles} from '../api-client';

export interface FilesCleanupPayload {
  days?: number;
}

export const handleFilesCleanup = async (payload: FilesCleanupPayload) => {
  const days = payload?.days ?? 30;

  console.log(`Deleting uploaded files older than ${days} days`);

  const {deleted} = await cleanupOldFiles(days);

  console.log(`Files cleanup complete: ${deleted} deleted`);

  return {deleted};
};
