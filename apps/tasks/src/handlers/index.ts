import {match} from 'ts-pattern';
import {handleMassImport, type MassImportPayload} from './mass-import';
import {handleActivityImport, type ActivityImportPayload} from './activity-import';

export const processJob = async (type: string, payload: unknown): Promise<unknown> =>
  match(type)
    .with('mass-import', () => handleMassImport(payload as MassImportPayload))
    .with('activity-import', () => handleActivityImport(payload as ActivityImportPayload))
    .otherwise(() => {
      throw new Error(`Unknown job type: ${type}`);
    });
