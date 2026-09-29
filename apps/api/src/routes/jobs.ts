import {Elysia, t} from 'elysia';
import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import {databasePlugin} from '../plugins/database';
import {pendingJobsPlugin} from '../plugins/pending-jobs';
import {enqueueJob} from '../jobs/enqueue-job';
import {listJobs, retryJob} from 'jobs';

const createJobSchema = {
  body: t.Object({
    type: t.String(),
    payload: t.Any(),
  }),
};

const jobIdSchema = {
  params: t.Object({
    id: t.Numeric(),
  }),
};

const completeJobSchema = {
  params: t.Object({
    id: t.Numeric(),
  }),
  body: t.Object({
    result: t.Optional(t.Any()),
  }),
};

const failJobSchema = {
  params: t.Object({
    id: t.Numeric(),
  }),
  body: t.Object({
    error_message: t.String(),
  }),
};

export default new Elysia({prefix: '/jobs'})
  .use(databasePlugin)
  .use(pendingJobsPlugin)
  .get(
    '/',
    async ({query: {page, page_size}}) => {
      return await listJobs({page: page ?? 1, pageSize: page_size ?? 30});
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        page_size: t.Optional(t.Numeric()),
      }),
    },
  )
  .post(
    '/:id/retry',
    async ({pendingJobs, params: {id}}) => {
      await retryJob(id);
      pendingJobs.markMaybePending();
      return {success: true};
    },
    jobIdSchema,
  )
  .post(
    '/',
    async ({database, pendingJobs, body: {type, payload}}) => {
      const job = await enqueueJob(database, pendingJobs, {type, payload});
      return {id: job.id};
    },
    createJobSchema,
  )
  .get('/pending', async ({database, pendingJobs}) => {
    return await pendingJobs.fetchPending(() =>
      database
        .select()
        .from(Schema.jobs)
        .where(eq(Schema.jobs.status, 'pending'))
        .orderBy(Schema.jobs.created_at),
    );
  })
  .post(
    '/:id/start',
    async ({database, params: {id}}) => {
      await database
        .update(Schema.jobs)
        .set({status: 'processing', started_at: new Date()})
        .where(eq(Schema.jobs.id, id));
      return {success: true};
    },
    jobIdSchema,
  )
  .post(
    '/:id/complete',
    async ({database, params: {id}, body: {result}}) => {
      await database
        .update(Schema.jobs)
        .set({status: 'completed', result, completed_at: new Date()})
        .where(eq(Schema.jobs.id, id));
      return {success: true};
    },
    completeJobSchema,
  )
  .post(
    '/:id/fail',
    async ({database, params: {id}, body: {error_message}}) => {
      await database
        .update(Schema.jobs)
        .set({status: 'failed', error_message, completed_at: new Date()})
        .where(eq(Schema.jobs.id, id));
      return {success: true};
    },
    failJobSchema,
  );
