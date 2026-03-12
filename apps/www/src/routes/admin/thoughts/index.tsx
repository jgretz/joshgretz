import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {ThoughtForm} from '../../../components/admin/thought-form';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';
import {
  createThought,
  deleteThought,
  getThoughts,
  updateThought,
} from '../../../services/thoughts/thoughts-server';

type Thought = {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const Route = createFileRoute('/admin/thoughts/')({
  component: ThoughtsList,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Thoughts')}],
  }),
  loader: async () => {
    const thoughts = await getThoughts();
    return {thoughts};
  },
});

function formatPublishedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
}

function toEditInitialData(thought: Thought) {
  return {
    title: thought.title,
    slug: thought.slug,
    content: thought.content,
    description: thought.description ?? '',
    tags: thought.tags?.join(', ') ?? '',
    published_at: thought.published_at
      ? new Date(thought.published_at).toISOString().slice(0, 16)
      : '',
  };
}

function ThoughtsList() {
  const {thoughts: loaderThoughts} = Route.useLoaderData();
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);

  const thoughts = loaderThoughts.filter((t) => !deletedIds.has(t.id));

  const handleCreate = useCallback(
    async (data: {
      title: string;
      slug: string;
      content: string;
      description: string | null;
      tags: string[] | null;
      published_at: string | null;
    }) => {
      try {
        await createThought({data});
        setCreateOpen(false);
        router.invalidate();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to create thought');
      }
    },
    [router],
  );

  const handleEdit = useCallback(
    async (data: {
      title: string;
      slug: string;
      content: string;
      description: string | null;
      tags: string[] | null;
      published_at: string | null;
    }) => {
      if (!editingThought) return;
      try {
        await updateThought({data: {id: editingThought.id, ...data}});
        setEditingThought(null);
        router.invalidate();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to update thought');
      }
    },
    [editingThought, router],
  );

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this thought?')) return;
    setDeleting(id);
    try {
      await deleteThought({data: {id}});
      setDeletedIds((prev) => new Set(prev).add(id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  }, []);

  return (
    <AdminLayout title="Thoughts">
      <div className="mb-6">
        <Button onClick={() => setCreateOpen(true)}>New Thought</Button>
      </div>

      {thoughts.length === 0 ? (
        <p className="text-warm-600">No thoughts yet.</p>
      ) : (
        <div className="space-y-4">
          {thoughts.map((thought) => (
            <div
              key={thought.id}
              className="flex items-center justify-between rounded-lg border border-warm-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-warm-800">{thought.title}</h3>
                  {thought.published_at ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Published {formatPublishedDate(thought.published_at)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-warm-100 px-2 py-0.5 text-xs font-medium text-warm-600">
                      Draft
                    </span>
                  )}
                </div>
                {thought.tags && thought.tags.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {thought.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded bg-warm-100 px-1.5 py-0.5 text-xs text-warm-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingThought(thought)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(thought.id)}
                  disabled={deleting === thought.id}
                >
                  {deleting === thought.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Thought</DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-warm-400 hover:text-warm-600">
              ✕
            </DialogClose>
          </DialogHeader>
          <ThoughtForm onSubmit={handleCreate} submitLabel="Create" />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingThought} onOpenChange={(open) => !open && setEditingThought(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Thought</DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-warm-400 hover:text-warm-600">
              ✕
            </DialogClose>
          </DialogHeader>
          {editingThought && (
            <ThoughtForm
              key={editingThought.id}
              initialData={toEditInitialData(editingThought)}
              onSubmit={handleEdit}
              submitLabel="Save"
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
