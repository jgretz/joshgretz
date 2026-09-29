import {describe, it, expect} from 'bun:test';
import {join, relative} from 'node:path';

const repoRoot = join(import.meta.dir, '../../..');
const ENQUEUE_JOB_PATH = 'apps/api/src/jobs/enqueue-job.ts';
const JOBS_INSERT = /\.insert\(\s*Schema\.jobs\b/;

async function filesMatching(pattern: string) {
  const files: string[] = [];
  for await (const file of new Bun.Glob(pattern).scan({cwd: repoRoot, absolute: true})) {
    files.push(file);
  }
  return files;
}

// Every job must be created through enqueueJob, or /jobs/pending will not see it
// until the gate's next recheck.
describe('job insert sites', function () {
  it('should insert into jobs only from enqueue-job.ts', async function () {
    const files = [
      ...(await filesMatching('apps/api/src/**/*.ts')),
      ...(await filesMatching('packages/*/src/**/*.ts')),
    ];
    const insertSites: string[] = [];
    for (const file of files) {
      if (JOBS_INSERT.test(await Bun.file(file).text())) {
        insertSites.push(relative(repoRoot, file));
      }
    }

    expect(insertSites).toEqual([ENQUEUE_JOB_PATH]);
  });

  it('should mark the gate when a job is retried', async function () {
    const source = await Bun.file(join(repoRoot, 'apps/api/src/routes/jobs.ts')).text();

    expect(source).toContain('retryJob(');
    expect(source).toContain('markMaybePending(');
  });
});
