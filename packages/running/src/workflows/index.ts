import {Orchestrator} from 'workflow';
import {importStravaActivitiesForDateRange} from './importStravaActivitiesForDateRange';

export const Orch = new Orchestrator().use(importStravaActivitiesForDateRange);
