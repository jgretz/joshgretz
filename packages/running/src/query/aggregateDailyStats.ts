import {sql} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

export type DailyAggregation = {
  date: string;
  total_miles: string;
  run_count: number;
};

// An activity is attributed to every calendar day its elapsed time covers, with the miles
// apportioned by the share of that elapsed time falling inside each day. Without this, an
// overnight ultra dumps its whole distance on the start date and the next day reads empty.
const query = ({database}: RunningContainer) => {
  return async (userId: number, dates?: string[]): Promise<DailyAggregation[]> => {
    const dateFilter = dates?.length
      ? sql`WHERE day IN (${sql.join(
          dates.map((date) => sql`${date}::date`),
          sql`, `,
        )})`
      : sql``;

    const rows = await database.execute(sql`
      WITH spans AS (
        SELECT
          start_date_local AS started_at,
          start_date_local
            + make_interval(secs => COALESCE(elapsed_time, moving_time, 0)::double precision)
            AS ended_at,
          COALESCE(distance::numeric, 0) / 1609.344 AS miles
        FROM activities
        WHERE user_id = ${userId}
          AND type = 'Run'
          AND start_date_local IS NOT NULL
      ),
      day_overlaps AS (
        SELECT
          series::date AS day,
          spans.miles,
          EXTRACT(
            EPOCH FROM (
              LEAST(spans.ended_at, series + interval '1 day') - GREATEST(spans.started_at, series)
            )
          )::numeric AS overlap_seconds,
          EXTRACT(EPOCH FROM (spans.ended_at - spans.started_at))::numeric AS span_seconds
        FROM spans
        CROSS JOIN LATERAL generate_series(
          date_trunc('day', spans.started_at),
          date_trunc('day', spans.ended_at),
          interval '1 day'
        ) AS series
      ),
      apportioned AS (
        SELECT
          day,
          CASE
            WHEN span_seconds > 0 THEN miles * (overlap_seconds / span_seconds)
            ELSE miles
          END AS miles
        FROM day_overlaps
        -- a run ending exactly at midnight yields a trailing zero-length day
        WHERE span_seconds <= 0 OR overlap_seconds > 0
      )
      SELECT
        day::text AS date,
        ROUND(COALESCE(SUM(miles), 0), 6)::text AS total_miles,
        COUNT(*)::int AS run_count
      FROM apportioned
      ${dateFilter}
      GROUP BY day
    `);

    return rows as unknown as DailyAggregation[];
  };
};

export const aggregateDailyStats = InjectIn(query);
