import {match} from 'ts-pattern';
import {handleMassImport, type MassImportPayload} from './mass-import';
import {handleActivityImport, type ActivityImportPayload} from './activity-import';
import {handleStreakUpdate, type StreakUpdatePayload} from './streak-update';

export const processJob = async (type: string, payload: unknown): Promise<unknown> =>
  match(type)
    .with('mass-import', () => handleMassImport(payload as MassImportPayload))
    .with('activity-import', () => handleActivityImport(payload as ActivityImportPayload))
    .with('streak-update', () => handleStreakUpdate(payload as StreakUpdatePayload))
    .otherwise(() => {
      throw new Error(`Unknown job type: ${type}`);
    });
