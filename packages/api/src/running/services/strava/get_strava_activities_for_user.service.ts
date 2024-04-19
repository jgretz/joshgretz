// https://www.strava.com/api/v3/athlete/activities?before=&after=&page=&per_page=" "Authorization: Bearer [[token]]"

import {Injectable} from '@nestjs/common';
import {StravaApiActivity} from '../../StravaApiTypes';
import {GetFromStravaService} from './get_from_strava.service';

interface SearchParameters {
  count: number;
  before?: Date;
  after?: Date;
}

function queryStringForSearchParameters(searchParameters: SearchParameters) {
  const {count, before, after} = searchParameters;
  const beforeString = before ? `&before=${before.getTime() / 1000}` : '';
  const afterString = after ? `&after=${after.getTime() / 1000}` : '';

  return `?per_page=${count}${beforeString}${afterString}`;
}

@Injectable()
export class GetStravaActivitiesForUserService {
  constructor(private getFromStrava: GetFromStravaService) {}

  async get(user_id: number, searchParameters: SearchParameters) {
    const queryString = queryStringForSearchParameters(searchParameters);
    const url = `https://www.strava.com/api/v3/athlete/activities${queryString}`;

    return await this.getFromStrava.get<StravaApiActivity[]>(url, user_id);
  }
}
