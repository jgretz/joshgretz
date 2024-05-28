import {encodeQueryStringFromJsonObject} from 'utility';
import type {Activity} from '../Types';
import stravaRequest from '../stravaRequest';

interface SearchParameters {
  count?: number;
  page?: number;
  before?: Date;
  after?: Date;
}

function parseSearchParameters(search: SearchParameters) {
  return {
    count: search.count || 100,
    page: search.page || 1,
    before: search.before ? search.before.getTime() / 1000 : undefined,
    after: search.after ? search.after.getTime() / 1000 : undefined,
  };
}

export default async function (search: SearchParameters = {}) {
  const initialParameters = parseSearchParameters(search);
  const retrieveAll = search.page === undefined && search.count === undefined;

  async function loadActivities(page: number): Promise<Activity[]> {
    const parameters = {
      ...initialParameters,
      page,
    };
    const queryString = encodeQueryStringFromJsonObject(parameters);
    const activities = await stravaRequest<Activity[]>(`/athlete/activities?${queryString}`);

    if (!retrieveAll) {
      return activities;
    }

    // the strava API returns an empty array when there are no more activities rather than meta data about the request
    return activities.length === 0 ? [] : activities.concat(await loadActivities(page + 1));
  }

  return loadActivities(initialParameters.page);
}
