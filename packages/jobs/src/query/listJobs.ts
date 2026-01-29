import {Schema} from 'database';
import {desc, count, sql} from 'drizzle-orm';
import type {JobsContainer} from '../Types';
import {InjectIn} from 'injectx';

type ListJobsInput = {
  page: number;
  pageSize: number;
};

const query = ({database}: JobsContainer) => {
  return async ({page, pageSize}: ListJobsInput) => {
    const offset = (page - 1) * pageSize;

    const [jobs, totalResult] = await Promise.all([
      database
        .select()
        .from(Schema.jobs)
        .orderBy(desc(Schema.jobs.created_at))
        .limit(pageSize)
        .offset(offset),
      database.select({total: count()}).from(Schema.jobs),
    ]);

    return {jobs, total: totalResult[0].total};
  };
};

export const listJobs = InjectIn(query);
