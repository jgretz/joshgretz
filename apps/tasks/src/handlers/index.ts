import {match} from 'ts-pattern';
import {handleMassImport, type MassImportPayload} from './mass-import';
import {handleActivityImport, type ActivityImportPayload} from './activity-import';
import {handleStreakUpdate, type StreakUpdatePayload} from './streak-update';
import {handleStateStatsUpdate, type StateStatsUpdatePayload} from './state-stats-update';
import {handleDailyStatsUpdate, type DailyStatsUpdatePayload} from './daily-stats-update';

export const processJob = async (type: string, payload: unknown): Promise<unknown> =>
  match(type)
    .with('mass-import', () => handleMassImport(payload as MassImportPayload))
    .with('activity-import', () => handleActivityImport(payload as ActivityImportPayload))
    .with('streak-update', () => handleStreakUpdate(payload as StreakUpdatePayload))
    .with('state-stats-update', () => handleStateStatsUpdate(payload as StateStatsUpdatePayload))
    .with('daily-stats-update', () => handleDailyStatsUpdate(payload as DailyStatsUpdatePayload))
    .otherwise(() => {
      throw new Error(`Unknown job type: ${type}`);
    });
