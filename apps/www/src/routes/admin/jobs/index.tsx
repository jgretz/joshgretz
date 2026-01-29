import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {cn} from '../../../lib/styles';
import {requireAuth} from '../../../services/auth/requireAuth';
import {type Job, getJobs, retryJob} from '../../../services/jobs/jobs-server';

const PAGE_SIZE = 30;

export const Route = createFileRoute('/admin/jobs/')({
  component: JobsPage,
  beforeLoad: requireAuth,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
  }),
  loaderDeps: ({search}) => ({page: search.page}),
  loader: async ({deps: {page}}) => {
    const result = await getJobs({data: {page}});
    return result as {jobs: Job[]; total: number};
  },
  head: () => ({
    meta: [{title: title('Jobs')}],
  }),
});

const formatDate = (date: string | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const statusColor = (status: string) =>
  ({
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  })[status] ?? 'bg-warm-100 text-warm-800';

function JobsPage() {
  const {jobs, total} = Route.useLoaderData();
  const router = useRouter();
  const {page} = Route.useSearch();
  const [retrying, setRetrying] = useState<number | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleRetry = useCallback(
    async (id: number) => {
      setRetrying(id);
      try {
        await retryJob({data: {id}});
        router.invalidate();
      } finally {
        setRetrying(null);
      }
    },
    [router],
  );

  return (
    <AdminLayout title="Jobs">
      <div className="mb-4 text-sm text-warm-600">
        {total} total jobs — Page {page} of {totalPages || 1}
      </div>

      <div className="overflow-x-auto rounded-lg border border-warm-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-warm-200 bg-warm-50">
            <tr>
              <th className="px-4 py-3 font-medium text-warm-700">Type</th>
              <th className="px-4 py-3 font-medium text-warm-700">Created</th>
              <th className="px-4 py-3 font-medium text-warm-700">Status</th>
              <th className="px-4 py-3 font-medium text-warm-700">Error</th>
              <th className="px-4 py-3 font-medium text-warm-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-100">
            {jobs.map((job) => (
              <tr key={job.id} className="bg-white">
                <td className="px-4 py-3 text-warm-800">{job.type}</td>
                <td className="px-4 py-3 text-warm-600">{formatDate(job.created_at)}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                      statusColor(job.status),
                    )}
                  >
                    {job.status}
                  </span>
                </td>
                <td
                  className="max-w-xs truncate px-4 py-3 text-warm-600"
                  title={job.error_message ?? undefined}
                >
                  {job.error_message ?? '-'}
                </td>
                <td className="px-4 py-3">
                  {job.status === 'failed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={retrying === job.id}
                      onClick={() => handleRetry(job.id)}
                    >
                      {retrying === job.id ? 'Retrying...' : 'Retry'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-warm-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => router.navigate({to: '/admin/jobs', search: {page: page - 1}})}
          >
            Prev
          </Button>
          <span className="text-sm text-warm-600">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => router.navigate({to: '/admin/jobs', search: {page: page + 1}})}
          >
            Next
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}
