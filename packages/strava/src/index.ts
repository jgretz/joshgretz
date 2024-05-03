import type {StravaConfig} from './Types.ts';
import getActivities from './activities/getActivities.ts';
import getActivity from './activities/getActivity.ts';
import getAthlete from './athlete/getAthlete.ts';
import getGear from './gear/getGear.ts';

export * from './Types.ts';

export default function (config: StravaConfig) {
  return {
    getAthlete: getAthlete(config),
    getGear: getGear(config),

    getActivities: getActivities(config),
    getActivity: getActivity(config),
  };
}
